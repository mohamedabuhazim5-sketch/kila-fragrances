import type { SiteSettings } from '@/lib/types'

export const siteConfig: SiteSettings = {
  name: 'Kila Fragrances',
  tagline: 'Luxury scents crafted to leave a lasting impression.',
  description:
    'Discover premium perfumes with polished presentation, elegant scent profiles, and a premium shopping experience built for modern fragrance lovers.',
  whatsapp: '01061376851',
  paymentPhone: '01061376851',
  instagram:
    'https://www.instagram.com/kila_fragrances?igsh=MXVham5ldGYzZzQ2ZA%3D%3D&utm_source=qr',
  tiktok: 'https://www.tiktok.com/@kila_ragrances?_r=1&_t=ZS-95LD2D92DCP',
  email: 'hello@kilafragrances.com',
  currency: 'EGP',
  announcement: 'Free local consultation on WhatsApp • Fast order confirmation • Premium gift-ready presentation',
  address: 'Egypt'
}

export const paymentMethodLabels = {
  vodafone_cash: 'Vodafone Cash',
  instapay: 'InstaPay',
  cash_on_delivery: 'Cash on Delivery'
} as const

export const orderStatusLabels = {
  pending: 'Pending',
  paid: 'Paid',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
} as const

export const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' }
]
