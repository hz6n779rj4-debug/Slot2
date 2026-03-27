# TonGemz

TonGemz is a Vercel-ready Next.js app for listing TON projects in the same general product style as Solhunters, but rebranded for TON with neon-blue visuals.

## Features
- Homepage with hero, promoted section, sponsored banners, and searchable token cards
- Public submit form for new TON token listings
- Admin login protected with `ADMIN_SECRET`
- Admin dashboard to approve, promote, trend, reject, and manage banners
- Supabase-ready schema for tokens and banners
- Optional public storage uploads for token and banner images

## Deploy on Vercel
1. Create a new Supabase project.
2. Run `supabase-schema.sql` in the SQL editor.
3. In Storage, create two **public** buckets:
   - `token-images`
   - `banner-images`
4. Add the environment variables from `.env.example` to Vercel.
5. Deploy the project.

## Local development
```bash
npm install
npm run dev
```

## Environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_STORAGE_TOKENS_BUCKET`
- `NEXT_PUBLIC_STORAGE_BANNERS_BUCKET`

## Notes
- Public listing submissions go into `pending` status.
- Admin actions use the service role key.
- If Supabase is not connected yet, the homepage falls back to demo content so the UI still loads.
