# Kila Fragrances

A complete English luxury perfume storefront built with Next.js App Router and Supabase.

## Included
- Premium homepage
- Shop page with filters
- Dynamic product pages
- Collection pages
- Cart and checkout
- Order tracking page
- Contact and about pages
- Admin dashboard
- Supabase SQL schema
- Mock data fallback when Supabase is not configured

## Stack
- Next.js
- React
- TypeScript
- Supabase
- App Router

## Run locally
```bash
npm install
npm run dev
```

Open the project in VS Code, then visit `http://localhost:3000`.

## Environment setup
Create a `.env.local` file based on `.env.example`.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Supabase setup
1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Add your environment variables to `.env.local`.
5. Create your first admin user in Supabase Auth.
6. Update the matching row in `profiles` to `role = 'owner'`.

## Brand defaults
- Brand: Kila Fragrances
- WhatsApp: 01061376851
- Payment number: 01061376851
- Instagram and TikTok links are already wired into the storefront.

## Notes
- The storefront works before Supabase is configured by using mock product and order data.
- Checkout creates real orders once `SUPABASE_SERVICE_ROLE_KEY` is set.
- Admin settings and product creation are live when Supabase is configured.
