// Paymob adapter. Required secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// PAYMOB_API_KEY, PAYMOB_INTEGRATION_ID, PAYMOB_IFRAME_ID. Optional:
// PAYMOB_API_URL (defaults to Accept), PAYMOB_CURRENCY, PAYMOB_CHECKOUT_BASE_URL.
import { createClient } from "npm:@supabase/supabase-js@2";

const env = Deno.env.toObject();
const supabase = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);
const cors = { "content-type": "application/json", "access-control-allow-origin": "*" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: cors });

async function paymob(path: string, body: unknown) {
  const response = await fetch(`${env.PAYMOB_API_URL ?? "https://accept.paymob.com/api"}${path}`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`Paymob ${path} failed (${response.status})`);
  return data;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: { ...cors, "access-control-allow-headers": "content-type" } });
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  let paymentId = "";
  try {
    const { student_code, plan_id, idempotency_key, payment_method, customer } = await request.json();
    if (typeof student_code !== "string" || typeof plan_id !== "string" || typeof idempotency_key !== "string" ||
        !/^[\w:.\/-]{8,128}$/.test(idempotency_key) ||
        !["card", "wallet", "fawry"].includes(payment_method)) return json({ error: "invalid_request" }, 400);
    const { data: student, error: codeError } = await supabase.rpc("validate_student_code", { input_code: student_code });
    if (codeError || !student?.[0]) return json({ error: "invalid_or_expired_code" }, 403);
    const { data: plan, error: planError } = await supabase.from("plans").select("*").eq("id", plan_id).eq("active", true).maybeSingle();
    if (planError || !plan) return json({ error: "plan_unavailable" }, 404);
    const studentId = student[0].student_id;
    const codeId = student[0].code_id;
    const { data: existing } = await supabase.from("payments").select("id,status,checkout_token,checkout_url").match({ student_id: studentId, plan_id: plan.id, idempotency_key }).maybeSingle();
    if (existing?.status === "paid" || existing?.checkout_url) return json({ payment_id: existing.id, status: existing.status, checkout_url: existing.checkout_url, checkout_token: existing.checkout_token });
    const { data: payment, error: insertError } = await supabase.from("payments").insert({
      student_id: studentId, code_id: codeId, plan_id: plan.id, idempotency_key,
      amount_cents: plan.amount_cents, currency: plan.currency, gateway: "paymob",
    }).select("id").single();
    if (insertError) return json({ error: "payment_already_in_progress" }, 409);
    paymentId = payment.id;

    // This adapter follows Paymob Accept's auth -> order -> payment-key flow.
    const auth = await paymob("/auth/tokens", { api_key: env.PAYMOB_API_KEY });
    const order = await paymob("/ecommerce/orders", { auth_token: auth.token, delivery_needed: false, amount_cents: plan.amount_cents, currency: plan.currency, items: [] });
    const billing = { first_name: customer?.first_name ?? "Student", last_name: customer?.last_name ?? "User", email: customer?.email ?? "student@example.invalid", phone_number: customer?.phone ?? "NA", apartment: "NA", floor: "NA", street: "NA", building: "NA", shipping_method: "NA", postal_code: "NA", city: "NA", country: "EG", state: "NA" };
    const integrationSecret = payment_method === "wallet"
      ? env.PAYMOB_WALLET_INTEGRATION_ID
      : payment_method === "fawry"
        ? env.PAYMOB_FAWRY_INTEGRATION_ID
        : env.PAYMOB_CARD_INTEGRATION_ID;
    const integrationId = Number(integrationSecret ?? env.PAYMOB_INTEGRATION_ID);
    if (!Number.isInteger(integrationId) || integrationId <= 0) throw new Error("Missing Paymob integration ID");
    const key = await paymob("/acceptance/payment_keys", { auth_token: auth.token, amount_cents: plan.amount_cents, expiration: 3600, order_id: order.id, billing_data: billing, currency: plan.currency, integration_id: integrationId });
    const base = env.PAYMOB_CHECKOUT_BASE_URL ?? "https://accept.paymob.com/api/acceptance/iframes";
    const checkoutUrl = `${base}/${env.PAYMOB_IFRAME_ID}?payment_token=${encodeURIComponent(key.token)}`;
    await supabase.from("payments").update({ gateway_order_id: String(order.id), checkout_token: key.token, checkout_url: checkoutUrl, gateway_payload: { order_id: order.id } }).eq("id", payment.id);
    return json({ payment_id: payment.id, status: "pending", checkout_url: checkoutUrl, checkout_token: key.token });
  } catch (error) {
    if (paymentId) {
      await supabase.from("payments").update({
        status: "failed",
        gateway_payload: { error: error instanceof Error ? error.message : "unknown" },
      }).eq("id", paymentId).eq("status", "pending");
    }
    return json({ error: "payment_provider_unavailable", detail: error instanceof Error ? error.message : "unknown" }, 502);
  }
});
