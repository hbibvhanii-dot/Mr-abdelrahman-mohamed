# Payment Edge Functions

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
