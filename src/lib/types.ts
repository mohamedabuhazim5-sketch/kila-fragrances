export type ProductVariant = {
  id: string
  size: string
  price: number
  comparePrice?: number | null
  stock: number
  sku?: string | null
}

export type ProductImage = {
  id: string
  url: string
  alt: string
  isCover?: boolean
}

export type ProductNotes = {
  top: string[]
  middle: string[]
  base: string[]
  longevity: string
  sillage: string
}

export type Review = {
  id: string
  customerName: string
  rating: number
  comment: string
  createdAt: string
}

export type Product = {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  family: string
  gender: 'Men' | 'Women' | 'Unisex'
  season: string
  occasion: string
  categorySlug: string
  categoryName: string
  price: number
  comparePrice?: number | null
  featured?: boolean
  bestSeller?: boolean
  isNew?: boolean
  onSale?: boolean
  badge?: string | null
  stock: number
  images: ProductImage[]
  variants: ProductVariant[]
  notes: ProductNotes
  reviews: Review[]
}

export type Category = {
  id: string
  slug: string
  name: string
  description: string
  image: string
}

export type HeroSlide = {
  id: string
  eyebrow: string
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
  image: string
}

export type SiteSettings = {
  name: string
  tagline: string
  description: string
  whatsapp: string
  paymentPhone: string
  instagram: string
  tiktok: string
  email: string
  currency: string
  announcement: string
  address: string
}

export type CartLine = {
  productId: string
  slug: string
  name: string
  image: string
  price: number
  size?: string
  quantity: number
}

export type CheckoutPayload = {
  customerName: string
  email: string
  phone: string
  city: string
  address: string
  notes?: string
  paymentMethod: 'vodafone_cash' | 'instapay' | 'cash_on_delivery'
  items: CartLine[]
  subtotal: number
  shippingFee: number
  total: number
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export type OrderSummary = {
  id: string
  orderNumber: string
  customerName: string
  phone: string
  email: string
  city: string
  address: string
  paymentMethod: string
  paymentStatus: 'pending' | 'paid'
  status: OrderStatus
  total: number
  createdAt: string
  items: Array<{
    id: string
    productName: string
    size?: string
    quantity: number
    unitPrice: number
  }>
}

export type DashboardMetrics = {
  revenue: number
  totalOrders: number
  totalProducts: number
  pendingOrders: number
}
