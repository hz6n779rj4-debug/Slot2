# TonGemz

TonGemz is a TON-themed token discovery site inspired by the layout style of Solhunters, but rebuilt for TON and ready for Vercel.

## What is finished

- Next.js app router project
- TonGemz homepage and submit flow
- admin login and dashboard
- banner manager
- Supabase schema for tokens and banners
- **live token market data enrichment** using DexScreener for TON pairs

## Live token data

Approved and promoted tokens are enriched on the server using the token contract address. The project currently pulls:

- price
- 24h price change
- market cap / FDV
- 24h volume
- liquidity
- buys and sells
- chart URL

The code fetches the best TON trading pair and sorts listings with promoted tokens first, then by live 24h volume.

## Deploy on Vercel

1. Upload the project to GitHub
2. Import into Vercel
3. Add environment variables from `.env.example`
4. Create the Supabase tables with `supabase-schema.sql`
5. Add your first token in admin or via submit form and approve it

## Environment variables

See `.env.example`.

## Notes

- Live data depends on the token having a detectable TON trading pair.
- If a token has no pair yet, the card still shows normally but without live stats.
- Home data is revalidated every 60 seconds.


## Storage buckets

Use these exact bucket names in Supabase:
- token-logos
- banners

For Netlify, this repo includes `.nvmrc` and `netlify.toml` to pin Node 20.
