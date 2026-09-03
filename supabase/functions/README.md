# Payment Edge Functions

These functions are the only server-side payment integration. They must be
deployed with the Supabase CLI; they are not bundled into the Vercel frontend.

Set these Supabase Edge Function secrets (never put them in the frontend):

* `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
* `PAYMOB_API_KEY`, `PAYMOB_INTEGRATION_ID`, `PAYMOB_IFRAME_ID`
* `PAYMOB_HMAC_SECRET`

For separate Paymob integrations, set `PAYMOB_CARD_INTEGRATION_ID`,
`PAYMOB_WALLET_INTEGRATION_ID`, and `PAYMOB_FAWRY_INTEGRATION_ID`; otherwise
`PAYMOB_INTEGRATION_ID` is used. Optional: `PAYMOB_API_URL` (defaults to `https://accept.paymob.com/api`),
`PAYMOB_CURRENCY`, and `PAYMOB_CHECKOUT_BASE_URL`. The create function isolates
the Paymob Accept auth/order/payment-key sequence in `paymob()`. Paymob account
versions can differ; adjust that adapter (and the checkout URL) without changing
database or application code. Configure the gateway webhook URL to
`/functions/v1/payment-webhook`.

Deploy with:

```bash
supabase functions deploy create-payment
supabase functions deploy payment-webhook
supabase secrets set SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
  PAYMOB_API_KEY=... PAYMOB_INTEGRATION_ID=... PAYMOB_IFRAME_ID=... \
  PAYMOB_HMAC_SECRET=...
```

InstaPay transfers to a personal number do not expose a signed webhook or
transaction verification API. The frontend therefore shows the supplied
number as a manual option but refuses automatic activation for it. Use a
Paymob business account (or another gateway with webhooks) for automatic
activation.
