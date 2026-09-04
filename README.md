# Mr-abdelrahman-mohamed
منصه تعليميه لمستر عبدالرحمن محمد لتعليم اللغه الانجليزيه

## Supabase setup

1. Create a Supabase project.
2. Run the SQL from `supabase/schema.sql`, then `supabase/subscriptions.sql`, then
   `supabase/persistence.sql`. The last script migrates legacy students/codes
   safely and exposes the shared-data RPCs used by the frontend.
3. Copy `.env.example` to `.env` and fill in your project URL and anon key.
4. Start the app with `npm run dev`.

Example:

```bash
cp .env.example .env
```

Then set:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

When the env vars are present, the app saves the platform state in Supabase instead of only in browser localStorage.

## Real payments

The payment flow uses Paymob Accept for cards, wallets, and Fawry. Deploy both
Edge Functions in `supabase/functions/`, configure the Paymob callback URL as
`https://<project-ref>.supabase.co/functions/v1/payment-webhook`, and set the
secrets listed in [`supabase/functions/README.md`](supabase/functions/README.md)
with `supabase secrets set`. The Paymob HMAC secret is required; the webhook
is the only path that marks a payment paid and activates a subscription.

Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` belong in Vercel
environment variables. Never add the service-role key, Paymob API key, or HMAC
secret to Vercel frontend variables or Git.

InstaPay personal transfers to `01014812293` cannot provide a signed webhook or
server-side transaction lookup. Therefore this app displays the number as a
manual option but deliberately does not auto-activate it. Automatic activation
requires a business payment gateway/account that supports webhooks (the
configured Paymob methods).
