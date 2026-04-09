-- Kila Fragrances - Supabase starter schema
-- Run this file in the Supabase SQL Editor.

create extension if not exists pgcrypto;

-- =========================
-- ENUMS
-- =========================
create type public.user_role as enum ('owner', 'admin', 'editor', 'support');
create type public.discount_type as enum ('percentage', 'fixed');
create type public.product_status as enum ('draft', 'active', 'archived');
create type public.gender_type as enum ('men', 'women', 'unisex');
create type public.order_status as enum (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned'
);
create type public.payment_method as enum ('vodafone_cash', 'instapay', 'cash_on_delivery');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type public.performance_level as enum ('low', 'medium', 'high', 'very_high');

-- =========================
-- HELPERS
-- =========================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and is_active = true
      and role in ('owner', 'admin', 'editor', 'support')
  );
$$;

create or replace function public.can_manage_catalog()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and is_active = true
      and role in ('owner', 'admin', 'editor')
  );
$$;

create or replace function public.generate_order_number()
returns text
language plpgsql
as $$
declare
  next_number bigint;
begin
  select coalesce(max(right(order_number, 6)::bigint), 0) + 1
  into next_number
  from public.orders
  where order_number ~ '^KILA-[0-9]{6}$';

  return 'KILA-' || lpad(next_number::text, 6, '0');
end;
$$;

-- =========================
-- TABLES
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  phone text,
  role public.user_role not null default 'support',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null,
  tagline text,
  description text,
  support_email text,
  whatsapp_number text not null,
  payment_phone text not null,
  instagram_url text,
  tiktok_url text,
  currency_code text not null default 'EGP',
  currency_symbol text not null default 'EGP',
  announcement_bar text,
  address_text text,
  logo_url text,
  favicon_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hero_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  button_text text,
  button_link text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sku text unique,
  short_description text,
  full_description text,
  brand_name text not null default 'Kila Fragrances',
  category_id uuid references public.categories(id) on delete set null,
  fragrance_family text,
  gender public.gender_type,
  season_type text,
  occasion_type text,
  status public.product_status not null default 'draft',
  base_price numeric(10,2) not null default 0,
  compare_at_price numeric(10,2),
  stock_quantity integer not null default 0,
  is_featured boolean not null default false,
  is_best_seller boolean not null default false,
  is_new boolean not null default false,
  is_on_sale boolean not null default false,
  average_rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_base_price_check check (base_price >= 0),
  constraint products_compare_at_price_check check (compare_at_price is null or compare_at_price >= base_price),
  constraint products_stock_quantity_check check (stock_quantity >= 0)
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size_label text not null,
  sku text unique,
  price numeric(10,2) not null default 0,
  compare_at_price numeric(10,2),
  stock_quantity integer not null default 0,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_variants_price_check check (price >= 0),
  constraint product_variants_compare_at_price_check check (compare_at_price is null or compare_at_price >= price),
  constraint product_variants_stock_quantity_check check (stock_quantity >= 0),
  constraint product_variants_product_size_unique unique (product_id, size_label)
);

create table if not exists public.product_notes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products(id) on delete cascade,
  top_notes text[] not null default '{}',
  middle_notes text[] not null default '{}',
  base_notes text[] not null default '{}',
  longevity public.performance_level,
  sillage public.performance_level,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_collections (
  product_id uuid not null references public.products(id) on delete cascade,
  collection_id uuid not null references public.collections(id) on delete cascade,
  primary key (product_id, collection_id)
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type public.discount_type not null,
  discount_value numeric(10,2) not null,
  min_order_amount numeric(10,2) not null default 0,
  usage_limit integer,
  used_count integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint coupons_discount_value_check check (discount_value >= 0),
  constraint coupons_min_order_amount_check check (min_order_amount >= 0),
  constraint coupons_usage_limit_check check (usage_limit is null or usage_limit >= 0),
  constraint coupons_used_count_check check (used_count >= 0)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default public.generate_order_number(),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  city text,
  address_line text,
  notes text,
  payment_method public.payment_method not null,
  payment_status public.payment_status not null default 'pending',
  status public.order_status not null default 'pending',
  subtotal numeric(10,2) not null default 0,
  shipping_fee numeric(10,2) not null default 0,
  discount_amount numeric(10,2) not null default 0,
  total_amount numeric(10,2) not null default 0,
  coupon_code text,
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_subtotal_check check (subtotal >= 0),
  constraint orders_shipping_fee_check check (shipping_fee >= 0),
  constraint orders_discount_amount_check check (discount_amount >= 0),
  constraint orders_total_amount_check check (total_amount >= 0)
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  product_sku text,
  size_label text,
  unit_price numeric(10,2) not null default 0,
  quantity integer not null default 1,
  line_total numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  constraint order_items_unit_price_check check (unit_price >= 0),
  constraint order_items_quantity_check check (quantity > 0),
  constraint order_items_line_total_check check (line_total >= 0)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  customer_name text not null,
  rating integer not null,
  comment text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_rating_check check (rating between 1 and 5)
);

-- =========================
-- INDEXES
-- =========================
create index if not exists idx_categories_active_sort on public.categories (is_active, sort_order);
create index if not exists idx_collections_active_sort on public.collections (is_active, sort_order);
create index if not exists idx_products_status on public.products (status);
create index if not exists idx_products_category_id on public.products (category_id);
create index if not exists idx_products_featured on public.products (is_featured);
create index if not exists idx_products_best_seller on public.products (is_best_seller);
create index if not exists idx_product_images_product_id on public.product_images (product_id, sort_order);
create index if not exists idx_product_variants_product_id on public.product_variants (product_id);
create index if not exists idx_orders_status on public.orders (status, created_at desc);
create index if not exists idx_orders_payment_status on public.orders (payment_status, created_at desc);
create index if not exists idx_reviews_product_id on public.reviews (product_id, is_approved, created_at desc);

-- =========================
-- TRIGGERS
-- =========================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email)
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

create trigger set_hero_banners_updated_at
  before update on public.hero_banners
  for each row execute function public.set_updated_at();

create trigger set_categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create trigger set_collections_updated_at
  before update on public.collections
  for each row execute function public.set_updated_at();

create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create trigger set_product_images_updated_at
  before update on public.product_images
  for each row execute function public.set_updated_at();

create trigger set_product_variants_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

create trigger set_product_notes_updated_at
  before update on public.product_notes
  for each row execute function public.set_updated_at();

create trigger set_coupons_updated_at
  before update on public.coupons
  for each row execute function public.set_updated_at();

create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create trigger set_reviews_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

-- =========================
-- RLS
-- =========================
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.hero_banners enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_notes enable row level security;
alter table public.product_collections enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;

-- Profiles
create policy "profiles_select_own_or_admin"
on public.profiles
for select
using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own_or_admin"
on public.profiles
for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

create policy "profiles_admin_insert"
on public.profiles
for insert
to authenticated
with check (public.is_admin());

-- Public storefront read access
create policy "site_settings_public_read"
on public.site_settings
for select
using (true);

create policy "hero_banners_public_read"
on public.hero_banners
for select
using (is_active = true);

create policy "categories_public_read"
on public.categories
for select
using (is_active = true);

create policy "collections_public_read"
on public.collections
for select
using (is_active = true);

create policy "products_public_read"
on public.products
for select
using (status = 'active');

create policy "product_images_public_read"
on public.product_images
for select
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'active'
  )
);

create policy "product_variants_public_read"
on public.product_variants
for select
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'active'
  )
);

create policy "product_notes_public_read"
on public.product_notes
for select
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'active'
  )
);

create policy "product_collections_public_read"
on public.product_collections
for select
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'active'
  )
);

create policy "reviews_public_read"
on public.reviews
for select
using (is_approved = true);

create policy "reviews_public_insert"
on public.reviews
for insert
with check (rating between 1 and 5);

-- Admin catalog/content access
create policy "site_settings_admin_manage"
on public.site_settings
for all
to authenticated
using (public.can_manage_catalog())
with check (public.can_manage_catalog());

create policy "hero_banners_admin_manage"
on public.hero_banners
for all
to authenticated
using (public.can_manage_catalog())
with check (public.can_manage_catalog());

create policy "categories_admin_manage"
on public.categories
for all
to authenticated
using (public.can_manage_catalog())
with check (public.can_manage_catalog());

create policy "collections_admin_manage"
on public.collections
for all
to authenticated
using (public.can_manage_catalog())
with check (public.can_manage_catalog());

create policy "products_admin_manage"
on public.products
for all
to authenticated
using (public.can_manage_catalog())
with check (public.can_manage_catalog());

create policy "product_images_admin_manage"
on public.product_images
for all
to authenticated
using (public.can_manage_catalog())
with check (public.can_manage_catalog());

create policy "product_variants_admin_manage"
on public.product_variants
for all
to authenticated
using (public.can_manage_catalog())
with check (public.can_manage_catalog());

create policy "product_notes_admin_manage"
on public.product_notes
for all
to authenticated
using (public.can_manage_catalog())
with check (public.can_manage_catalog());

create policy "product_collections_admin_manage"
on public.product_collections
for all
to authenticated
using (public.can_manage_catalog())
with check (public.can_manage_catalog());

create policy "coupons_admin_manage"
on public.coupons
for all
to authenticated
using (public.can_manage_catalog())
with check (public.can_manage_catalog());

create policy "reviews_admin_manage"
on public.reviews
for all
to authenticated
using (public.can_manage_catalog())
with check (public.can_manage_catalog());

-- Orders
create policy "orders_public_insert"
on public.orders
for insert
with check (true);

create policy "order_items_public_insert"
on public.order_items
for insert
with check (true);

create policy "orders_admin_manage"
on public.orders
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "order_items_admin_manage"
on public.order_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================
-- STORAGE
-- =========================
insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do nothing;

create policy "product_media_public_read"
on storage.objects
for select
using (bucket_id = 'product-media');

create policy "product_media_admin_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-media' and public.can_manage_catalog());

create policy "product_media_admin_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-media' and public.can_manage_catalog())
with check (bucket_id = 'product-media' and public.can_manage_catalog());

create policy "product_media_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-media' and public.can_manage_catalog());

-- =========================
-- STARTER DATA
-- =========================
insert into public.site_settings (
  brand_name,
  tagline,
  description,
  whatsapp_number,
  payment_phone,
  instagram_url,
  tiktok_url,
  currency_code,
  currency_symbol,
  announcement_bar
)
select
  'Kila Fragrances',
  'Luxury scents crafted to leave a lasting impression.',
  'Discover premium perfumes with elegant presentation, refined notes, and a modern shopping experience.',
  '01061376851',
  '01061376851',
  'https://www.instagram.com/kila_fragrances?igsh=MXVham5ldGYzZzQ2ZA%3D%3D&utm_source=qr',
  'https://www.tiktok.com/@kila_ragrances?_r=1&_t=ZS-95LD2D92DCP',
  'EGP',
  'EGP',
  'Free shipping offers will be available soon.'
where not exists (select 1 from public.site_settings);

insert into public.hero_banners (title, subtitle, button_text, button_link, sort_order, is_active)
select
  'Discover the Signature of Elegance',
  'Premium fragrances designed for presence, confidence, and lasting impressions.',
  'Shop Now',
  '/shop',
  1,
  true
where not exists (select 1 from public.hero_banners);

insert into public.categories (name, slug, description, sort_order, is_active)
values
  ('Men''s Fragrances', 'mens-fragrances', 'Bold, refined, and memorable scents for men.', 1, true),
  ('Women''s Fragrances', 'womens-fragrances', 'Elegant and expressive fragrances for women.', 2, true),
  ('Unisex Fragrances', 'unisex-fragrances', 'Versatile fragrances that suit every mood.', 3, true),
  ('Gift Sets', 'gift-sets', 'Curated perfume gifts for every occasion.', 4, true)
on conflict (slug) do nothing;

insert into public.collections (name, slug, description, sort_order, is_active)
values
  ('Best Sellers', 'best-sellers', 'The most loved picks at Kila Fragrances.', 1, true),
  ('New Arrivals', 'new-arrivals', 'Fresh additions to the collection.', 2, true),
  ('Limited Offers', 'limited-offers', 'Selected fragrances with exclusive pricing.', 3, true)
on conflict (slug) do nothing;

-- =========================
-- FIRST ADMIN NOTE
-- =========================
-- 1) Create a user from Supabase Auth or from your app.
-- 2) Then promote that user manually with:
-- update public.profiles
-- set role = 'owner'
-- where email = 'your-admin@email.com';
