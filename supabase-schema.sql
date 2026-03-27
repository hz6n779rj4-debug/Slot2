create extension if not exists pgcrypto;

create table if not exists public.tokens (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  ticker text not null,
  contract_address text not null unique,
  description text,
  telegram_url text,
  x_url text,
  website_url text,
  image_url text,
  status text not null default 'pending' check (status in ('pending','approved','promoted','rejected')),
  is_promoted boolean not null default false,
  is_trending boolean not null default false
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  image_url text not null,
  link_url text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true
);

alter table public.tokens enable row level security;
alter table public.banners enable row level security;

drop policy if exists "public can read approved or promoted tokens" on public.tokens;
create policy "public can read approved or promoted tokens"
on public.tokens for select
using (status in ('approved','promoted'));

drop policy if exists "public can submit tokens" on public.tokens;
create policy "public can submit tokens"
on public.tokens for insert
with check (true);

drop policy if exists "public can read active banners" on public.banners;
create policy "public can read active banners"
on public.banners for select
using (is_active = true);

insert into public.tokens (name, ticker, contract_address, description, telegram_url, x_url, website_url, image_url, status, is_promoted, is_trending)
values
('Ton Pepe', 'TPEPE', 'EQDemoTonPepe11111111111111111111111111111111111', 'A community meme token on TON with high engagement.', 'https://t.me/ton', 'https://x.com/ton_blockchain', 'https://ton.org', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80', 'promoted', true, true),
('Gem Doge TON', 'GDOGE', 'EQDemoGemDoge22222222222222222222222222222222222', 'Fresh TON meme gem with active Telegram community.', 'https://t.me/ton', 'https://x.com/ton_blockchain', 'https://ton.org', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80', 'approved', false, true)
on conflict (contract_address) do nothing;

insert into public.banners (title, image_url, link_url, is_active)
values ('Promote your TON project here', 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1200&q=80', '/submit', true)
on conflict do nothing;

-- Create storage buckets manually in Supabase dashboard:
-- 1) token-images
-- 2) banner-images
-- Make both public buckets.
