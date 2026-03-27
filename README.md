# TonGemz Simple Clean

This is the simple clean version.

## Netlify env vars

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_STORAGE_TOKENS_BUCKET=token-logos

## Supabase

Use open insert policy on `public.tokens` for now:

```sql
alter table public.tokens enable row level security;

drop policy if exists "Anyone can submit tokens" on public.tokens;
create policy "Anyone can submit tokens"
on public.tokens
for insert
to anon, authenticated
with check (true);
```

Public read approved:

```sql
drop policy if exists "Public can view approved tokens" on public.tokens;
create policy "Public can view approved tokens"
on public.tokens
for select
to anon, authenticated
using (status = 'approved');
```

Set defaults:

```sql
alter table public.tokens alter column status set default 'pending';
alter table public.tokens alter column chain set default 'ton';
```
