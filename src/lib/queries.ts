import { categories as mockCategories, dashboardMetrics, heroSlides, orders as mockOrders, products as mockProducts } from '@/lib/mock-data'
import { siteConfig } from '@/lib/constants'
import { hasServiceRole, hasSupabaseEnv } from '@/lib/env'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient as createServerClient } from '@/lib/supabase/server'
import type { Category, DashboardMetrics, HeroSlide, OrderSummary, Product, SiteSettings } from '@/lib/types'

function normalizeProduct(record: any): Product {
  const images = Array.isArray(record.product_images)
    ? record.product_images.map((item: any) => ({
        id: String(item.id),
        url: item.image_url || '/placeholder-product.svg',
        alt: item.alt_text || record.name,
        isCover: Boolean(item.is_cover)
      }))
    : []

  const variants = Array.isArray(record.product_variants)
    ? record.product_variants.map((item: any) => ({
        id: String(item.id),
        size: item.size_label,
        price: Number(item.price),
        comparePrice: item.compare_at_price != null ? Number(item.compare_at_price) : null,
        stock: Number(item.stock_quantity),
        sku: item.sku
      }))
    : []

  const notesRecord = Array.isArray(record.product_notes) ? record.product_notes[0] : record.product_notes

  const reviews = Array.isArray(record.reviews)
    ? record.reviews.map((item: any) => ({
        id: String(item.id),
        customerName: item.customer_name,
        rating: Number(item.rating),
        comment: item.comment,
        createdAt: item.created_at
      }))
    : []

  return {
    id: String(record.id),
    slug: record.slug,
    name: record.name,
    shortDescription: record.short_description || '',
    description: record.full_description || '',
    family: record.fragrance_family || 'Signature',
    gender:
      record.gender === 'men' ? 'Men' : record.gender === 'women' ? 'Women' : 'Unisex',
    season: record.season_type || 'All Season',
    occasion: record.occasion_type || 'Daily Wear',
    categorySlug: record.categories?.slug || 'collection',
    categoryName: record.categories?.name || 'Collection',
    price: Number(record.base_price),
    comparePrice: record.compare_at_price != null ? Number(record.compare_at_price) : null,
    featured: Boolean(record.is_featured),
    bestSeller: Boolean(record.is_best_seller),
    isNew: Boolean(record.is_new),
    onSale: Boolean(record.is_on_sale),
    badge: record.is_best_seller ? 'Best Seller' : record.is_new ? 'New' : record.is_on_sale ? 'Sale' : null,
    stock: Number(record.stock_quantity || 0),
    images: images.length ? images : [{ id: `${record.id}-fallback`, url: '/placeholder-product.svg', alt: record.name }],
    variants,
    notes: {
      top: Array.isArray(notesRecord?.top_notes) ? notesRecord.top_notes : [],
      middle: Array.isArray(notesRecord?.middle_notes) ? notesRecord.middle_notes : [],
      base: Array.isArray(notesRecord?.base_notes) ? notesRecord.base_notes : [],
      longevity: notesRecord?.longevity || 'Moderate',
      sillage: notesRecord?.sillage || 'Moderate'
    },
    reviews
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!hasSupabaseEnv()) return siteConfig

  try {
    const supabase = await createServerClient()
    const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()
    if (!data) return siteConfig

    return {
      name: data.brand_name || siteConfig.name,
      tagline: data.tagline || siteConfig.tagline,
      description: data.description || siteConfig.description,
      whatsapp: data.whatsapp_number || siteConfig.whatsapp,
      paymentPhone: data.payment_phone || siteConfig.paymentPhone,
      instagram: data.instagram_url || siteConfig.instagram,
      tiktok: data.tiktok_url || siteConfig.tiktok,
      email: data.support_email || siteConfig.email,
      currency: data.currency_code || siteConfig.currency,
      announcement: data.announcement_bar || siteConfig.announcement,
      address: data.address_text || siteConfig.address
    }
  } catch {
    return siteConfig
  }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  if (!hasSupabaseEnv()) return heroSlides

  try {
    const supabase = await createServerClient()
    const { data } = await supabase
      .from('hero_banners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (!data?.length) return heroSlides

    return data.map((slide: any) => ({
      id: String(slide.id),
      eyebrow: 'Kila Fragrances',
      title: slide.title,
      subtitle: slide.subtitle || '',
      ctaLabel: slide.button_text || 'Shop Now',
      ctaHref: slide.button_link || '/shop',
      image: slide.image_url || '/placeholder-collection.svg'
    }))
  } catch {
    return heroSlides
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!hasSupabaseEnv()) return mockCategories

  try {
    const supabase = await createServerClient()
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (!data?.length) return mockCategories

    return data.map((category: any) => ({
      id: String(category.id),
      slug: category.slug,
      name: category.name,
      description: category.description || '',
      image: category.image_url || '/placeholder-collection.svg'
    }))
  } catch {
    return mockCategories
  }
}

type ProductFilters = {
  search?: string
  category?: string
  sort?: string
  featuredOnly?: boolean
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  if (!hasSupabaseEnv()) return filterMockProducts(filters)

  try {
    const supabase = await createServerClient()
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (slug, name),
        product_images (id, image_url, alt_text, is_cover),
        product_variants (id, size_label, price, compare_at_price, stock_quantity, sku),
        product_notes (top_notes, middle_notes, base_notes, longevity, sillage),
        reviews (id, customer_name, rating, comment, created_at)
      `)
      .eq('status', 'active')

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,fragrance_family.ilike.%${filters.search}%`)
    }

    const { data, error } = await query
    if (error || !data) return filterMockProducts(filters)

    let result = data.map(normalizeProduct)
    if (filters.category) result = result.filter((product) => product.categorySlug === filters.category)
    return sortProducts(result, filters.sort)
  } catch {
    return filterMockProducts(filters)
  }
}

export async function getFeaturedProducts() {
  const allProducts = await getProducts()
  return allProducts.filter((product) => product.featured).slice(0, 4)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!hasSupabaseEnv()) return mockProducts.find((product) => product.slug === slug) || null

  try {
    const supabase = await createServerClient()
    const { data } = await supabase
      .from('products')
      .select(`
        *,
        categories (slug, name),
        product_images (id, image_url, alt_text, is_cover),
        product_variants (id, size_label, price, compare_at_price, stock_quantity, sku),
        product_notes (top_notes, middle_notes, base_notes, longevity, sillage),
        reviews (id, customer_name, rating, comment, created_at)
      `)
      .eq('slug', slug)
      .maybeSingle()

    return data ? normalizeProduct(data) : null
  } catch {
    return mockProducts.find((product) => product.slug === slug) || null
  }
}

export async function getRelatedProducts(product: Product) {
  const allProducts = await getProducts()
  return allProducts.filter((item) => item.id !== product.id && item.categorySlug === product.categorySlug).slice(0, 3)
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  if (!hasServiceRole()) return dashboardMetrics

  try {
    const admin = createAdminClient()
    const [{ count: productCount }, { count: orderCount }, { data: pending }, { data: revenueRows }] =
      await Promise.all([
        admin.from('products').select('*', { count: 'exact', head: true }),
        admin.from('orders').select('*', { count: 'exact', head: true }),
        admin.from('orders').select('id').eq('status', 'pending'),
        admin.from('orders').select('total_amount')
      ])

    const revenue = revenueRows?.reduce((sum: number, row: any) => sum + Number(row.total_amount || 0), 0) || 0

    return {
      revenue,
      totalOrders: orderCount || 0,
      totalProducts: productCount || 0,
      pendingOrders: pending?.length || 0
    }
  } catch {
    return dashboardMetrics
  }
}

export async function getOrders(): Promise<OrderSummary[]> {
  if (!hasServiceRole()) return mockOrders

  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        customer_phone,
        customer_email,
        city,
        address_line,
        payment_method,
        payment_status,
        status,
        total_amount,
        created_at,
        order_items (id, product_name, size_label, quantity, unit_price)
      `)
      .order('created_at', { ascending: false })

    if (!data) return mockOrders

    return data.map((order: any) => ({
      id: String(order.id),
      orderNumber: order.order_number,
      customerName: order.customer_name,
      phone: order.customer_phone,
      email: order.customer_email || '',
      city: order.city || '',
      address: order.address_line || '',
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      status: order.status,
      total: Number(order.total_amount),
      createdAt: order.created_at,
      items: Array.isArray(order.order_items)
        ? order.order_items.map((item: any) => ({
            id: String(item.id),
            productName: item.product_name,
            size: item.size_label || undefined,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unit_price)
          }))
        : []
    }))
  } catch {
    return mockOrders
  }
}

export async function getOrderByNumber(orderNumber: string) {
  const result = await getOrders()
  return result.find((order) => order.orderNumber.toLowerCase() === orderNumber.toLowerCase()) || null
}

function filterMockProducts(filters: ProductFilters) {
  let result = [...mockProducts]

  if (filters.featuredOnly) result = result.filter((product) => product.featured)
  if (filters.category) result = result.filter((product) => product.categorySlug === filters.category)
  if (filters.search) {
    const needle = filters.search.toLowerCase()
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(needle) ||
        product.family.toLowerCase().includes(needle) ||
        product.categoryName.toLowerCase().includes(needle)
    )
  }

  return sortProducts(result, filters.sort)
}

function sortProducts(data: Product[], sort = 'featured') {
  switch (sort) {
    case 'price_asc':
      return [...data].sort((a, b) => a.price - b.price)
    case 'price_desc':
      return [...data].sort((a, b) => b.price - a.price)
    case 'newest':
      return [...data].sort((a, b) => Number(b.isNew) - Number(a.isNew))
    default:
      return [...data].sort((a, b) => Number(b.featured) - Number(a.featured))
  }
}
