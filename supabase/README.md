# Supabase setup for Kila Fragrances

1. Open your Supabase project.
2. Go to **SQL Editor**.
3. Paste and run `supabase/schema.sql`.
4. Create your first admin user.
5. Promote that user with the SQL at the bottom of `schema.sql`.

## What this schema includes
- Auth-backed admin profiles
- Site settings
- Hero banners
- Categories and collections
- Products, images, variants, and fragrance notes
- Orders and order items
- Reviews
- Coupons
- Storage bucket for product images
- Row Level Security policies

## Bucket name
`product-media`

## Important
The storefront can read active products publicly.
Admin actions require an authenticated user with a role in `profiles`.
