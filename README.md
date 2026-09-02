# Mr-abdelrahman-mohamed
منصه تعليميه لمستر عبدالرحمن محمد لتعليم اللغه الانجليزيه

## Supabase setup

1. Create a Supabase project.
2. Run the SQL from `supabase/schema.sql`.
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

