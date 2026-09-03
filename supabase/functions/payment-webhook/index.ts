// Configure Paymob to POST here and set PAYMOB_HMAC_SECRET. Paymob's HMAC
// canonical field order is documented in the adapter below; never trust body fields without it.
import { createClient } from "npm:@supabase/supabase-js@2";
const env = Deno.env.toObject();
const db = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);
const fields = ["amount_cents","created_at","currency","error_occured","has_parent_transaction","id","integration_id","is_3d_secure","is_auth","is_capture","is_refunded","is_standalone_payment","is_void","order.id","owner","pending","source_data.pan","source_data.sub_type","source_data.type","success"];
const value = (o: any, path: string) => path.split(".").reduce((v, k) => v?.[k], o) ?? "";
function hex(bytes: ArrayBuffer) { return [...new Uint8Array(bytes)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
async function validHmac(obj: any, signature: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.PAYMOB_HMAC_SECRET!), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
  const digest = hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(fields.map((f) => String(value(obj, f))).join("")));
  const expected = signature.toLowerCase();
  if (digest.length !== expected.length) return false;
  let different = 0;
  for (let i = 0; i < digest.length; i += 1) different |= digest.charCodeAt(i) ^ expected.charCodeAt(i);
  return different === 0;
}
Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response("method_not_allowed", { status: 405 });
  try {
    const body = await request.json(); const obj = body.obj ?? body;
    const signature = request.headers.get("x-paymob-signature") ?? body.hmac ?? body.signature ?? new URL(request.url).searchParams.get("hmac");
    if (!env.PAYMOB_HMAC_SECRET || !signature || !(await validHmac(obj, signature))) return new Response("invalid signature", { status: 401 });
    const gatewayId = String(obj.id);
    const orderId = obj.order?.id == null ? "" : String(obj.order.id);
    let { data: payment } = await db.from("payments").select("id,status,plan_id,student_id,amount_cents,currency").eq("gateway_transaction_id", gatewayId).maybeSingle();
    if (!payment && orderId) {
      ({ data: payment } = await db.from("payments").select("id,status,plan_id,student_id,amount_cents,currency").eq("gateway_order_id", orderId).maybeSingle());
    }
    if (!payment) return new Response("ignored", { status: 200 });
    if (obj.pending === true) return new Response("ok", { status: 200 });
    if (Number(obj.amount_cents) !== payment.amount_cents || String(obj.currency) !== payment.currency) {
      return new Response("amount_mismatch", { status: 400 });
    }
    const success = obj.success === true && obj.pending !== true && obj.error_occured !== true;
    if (payment.status === "paid" || payment.status === "failed") return new Response("ok", { status: 200 });
    if (success) {
      const { error: activationError } = await db.rpc("confirm_payment", {
        payment_uuid: payment.id,
        transaction_id: gatewayId,
        provider_payload: body,
      });
      if (activationError) throw activationError;
    } else {
      const { error } = await db.from("payments").update({
        status: "failed", gateway_transaction_id: gatewayId, gateway_payload: body,
      }).eq("id", payment.id).eq("status", "pending");
      if (error) throw error;
    }
    return new Response("ok", { status: 200 });
  } catch (error) {
    console.error("Payment webhook processing failed", error);
    return new Response("webhook_error", { status: 500 });
  }
});
