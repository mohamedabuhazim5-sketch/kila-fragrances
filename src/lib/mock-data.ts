import type {
  Category,
  DashboardMetrics,
  HeroSlide,
  OrderSummary,
  Product
} from '@/lib/types'

export const heroSlides: HeroSlide[] = [
  {
    id: 'hero-1',
    eyebrow: 'Kila Fragrances',
    title: 'Luxury perfumes designed to define your presence.',
    subtitle:
      'A premium fragrance destination with rich compositions, elegant packaging, and a modern English storefront.',
    ctaLabel: 'Shop the Collection',
    ctaHref: '/shop',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=80'
  }
]

export const categories: Category[] = [
  {
    id: 'cat-1',
    slug: 'men',
    name: 'Men',
    description: 'Powerful blends, warm woods, spices, and confident signatures.',
    image:
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'cat-2',
    slug: 'women',
    name: 'Women',
    description: 'Elegant florals, amber sweetness, soft musk, and luminous character.',
    image:
      'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'cat-3',
    slug: 'unisex',
    name: 'Unisex',
    description: 'Balanced scents that feel timeless, modern, and versatile.',
    image:
      'https://images.unsplash.com/photo-1615634262417-8dcf5961af99?auto=format&fit=crop&w=1200&q=80'
  }
]

export const products: Product[] = [
  {
    id: 'prod-1',
    slug: 'royal-oud',
    name: 'Royal Oud',
    shortDescription: 'A confident oud blend wrapped in warm amber and cedar.',
    description:
      'Royal Oud opens with an elegant bright accord before moving into a woody heart and a rich oriental base. It is built for evening wear, premium gifting, and a memorable signature trail.',
    family: 'Oriental Woody',
    gender: 'Men',
    season: 'Autumn / Winter',
    occasion: 'Evening',
    categorySlug: 'men',
    categoryName: 'Men',
    price: 1490,
    comparePrice: 1690,
    featured: true,
    bestSeller: true,
    isNew: false,
    onSale: true,
    badge: 'Best Seller',
    stock: 18,
    images: [
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80',
        alt: 'Royal Oud bottle',
        isCover: true
      },
      {
        id: 'img-2',
        url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Royal Oud detail'
      }
    ],
    variants: [
      { id: 'var-1', size: '50ml', price: 990, comparePrice: 1090, stock: 12, sku: 'RO-50' },
      { id: 'var-2', size: '100ml', price: 1490, comparePrice: 1690, stock: 18, sku: 'RO-100' }
    ],
    notes: {
      top: ['Bergamot', 'Saffron'],
      middle: ['Rose', 'Cedarwood'],
      base: ['Oud', 'Amber', 'Musk'],
      longevity: 'Long Lasting',
      sillage: 'Strong'
    },
    reviews: [
      {
        id: 'rev-1',
        customerName: 'Omar',
        rating: 5,
        comment: 'Elegant, deep, and very refined. Perfect for evenings.',
        createdAt: '2026-03-19T10:00:00.000Z'
      }
    ]
  },
  {
    id: 'prod-2',
    slug: 'velvet-bloom',
    name: 'Velvet Bloom',
    shortDescription: 'A floral amber fragrance with smooth vanilla sweetness.',
    description:
      'Velvet Bloom is soft, luminous, and feminine without losing depth. It balances petals, creamy warmth, and modern projection for daily elegance.',
    family: 'Floral Amber',
    gender: 'Women',
    season: 'Spring / All Season',
    occasion: 'Daily Wear',
    categorySlug: 'women',
    categoryName: 'Women',
    price: 1320,
    comparePrice: 1490,
    featured: true,
    bestSeller: false,
    isNew: true,
    onSale: true,
    badge: 'New',
    stock: 22,
    images: [
      {
        id: 'img-3',
        url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Velvet Bloom perfume',
        isCover: true
      },
      {
        id: 'img-4',
        url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Velvet Bloom lifestyle'
      }
    ],
    variants: [
      { id: 'var-3', size: '50ml', price: 920, comparePrice: 1020, stock: 10, sku: 'VB-50' },
      { id: 'var-4', size: '100ml', price: 1320, comparePrice: 1490, stock: 22, sku: 'VB-100' }
    ],
    notes: {
      top: ['Pear', 'Pink Pepper'],
      middle: ['Jasmine', 'Rose'],
      base: ['Vanilla', 'Amber', 'White Musk'],
      longevity: 'Moderate to Long',
      sillage: 'Moderate'
    },
    reviews: [
      {
        id: 'rev-2',
        customerName: 'Yara',
        rating: 5,
        comment: 'Beautifully balanced and very easy to wear.',
        createdAt: '2026-03-22T16:30:00.000Z'
      }
    ]
  },
  {
    id: 'prod-3',
    slug: 'midnight-amber',
    name: 'Midnight Amber',
    shortDescription: 'Warm resinous amber with smoky woods and modern spice.',
    description:
      'Midnight Amber delivers richness and projection with an upscale profile that feels smooth, dark, and polished.',
    family: 'Amber Woody',
    gender: 'Unisex',
    season: 'Autumn / Winter',
    occasion: 'Night Out',
    categorySlug: 'unisex',
    categoryName: 'Unisex',
    price: 1580,
    comparePrice: 1790,
    featured: true,
    bestSeller: true,
    isNew: false,
    onSale: true,
    badge: 'Signature',
    stock: 15,
    images: [
      {
        id: 'img-5',
        url: 'https://images.unsplash.com/photo-1615634262417-8dcf5961af99?auto=format&fit=crop&w=1200&q=80',
        alt: 'Midnight Amber bottle',
        isCover: true
      },
      {
        id: 'img-6',
        url: 'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1200&q=80',
        alt: 'Midnight Amber campaign'
      }
    ],
    variants: [
      { id: 'var-5', size: '50ml', price: 1040, comparePrice: 1140, stock: 8, sku: 'MA-50' },
      { id: 'var-6', size: '100ml', price: 1580, comparePrice: 1790, stock: 15, sku: 'MA-100' }
    ],
    notes: {
      top: ['Cardamom', 'Grapefruit'],
      middle: ['Labdanum', 'Patchouli'],
      base: ['Amber', 'Guaiac Wood', 'Musk'],
      longevity: 'Long Lasting',
      sillage: 'Strong'
    },
    reviews: [
      {
        id: 'rev-3',
        customerName: 'Hassan',
        rating: 4,
        comment: 'Strong and premium. Very good longevity.',
        createdAt: '2026-04-01T12:00:00.000Z'
      }
    ]
  },
  {
    id: 'prod-4',
    slug: 'citrus-veil',
    name: 'Citrus Veil',
    shortDescription: 'A crisp modern citrus fragrance for fresh daytime confidence.',
    description:
      'Citrus Veil is clean, vibrant, and versatile. It is ideal for daily wear, office settings, and hot-weather rotation.',
    family: 'Fresh Citrus',
    gender: 'Unisex',
    season: 'Spring / Summer',
    occasion: 'Daily Wear',
    categorySlug: 'unisex',
    categoryName: 'Unisex',
    price: 1180,
    comparePrice: null,
    featured: false,
    bestSeller: false,
    isNew: true,
    onSale: false,
    badge: null,
    stock: 28,
    images: [
      {
        id: 'img-7',
        url: 'https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?auto=format&fit=crop&w=1200&q=80',
        alt: 'Citrus Veil bottle',
        isCover: true
      }
    ],
    variants: [
      { id: 'var-7', size: '100ml', price: 1180, comparePrice: null, stock: 28, sku: 'CV-100' }
    ],
    notes: {
      top: ['Lemon', 'Mandarin', 'Neroli'],
      middle: ['Lavender', 'Petitgrain'],
      base: ['Vetiver', 'Clean Musk'],
      longevity: 'Moderate',
      sillage: 'Fresh Moderate'
    },
    reviews: []
  }
]

export const orders: OrderSummary[] = [
  {
    id: 'ord-1',
    orderNumber: 'KF-20260408-001',
    customerName: 'Mohamed Ali',
    phone: '01000000000',
    email: 'mohamed@example.com',
    city: 'Cairo',
    address: 'Nasr City',
    paymentMethod: 'vodafone_cash',
    paymentStatus: 'pending',
    status: 'pending',
    total: 1690,
    createdAt: '2026-04-07T14:00:00.000Z',
    items: [
      { id: 'it-1', productName: 'Royal Oud', size: '100ml', quantity: 1, unitPrice: 1490 }
    ]
  },
  {
    id: 'ord-2',
    orderNumber: 'KF-20260408-002',
    customerName: 'Sara Adel',
    phone: '01000000001',
    email: 'sara@example.com',
    city: 'Alexandria',
    address: 'Gleem',
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'pending',
    status: 'processing',
    total: 1520,
    createdAt: '2026-04-06T11:30:00.000Z',
    items: [
      { id: 'it-2', productName: 'Velvet Bloom', size: '100ml', quantity: 1, unitPrice: 1320 }
    ]
  }
]

export const dashboardMetrics: DashboardMetrics = {
  revenue: 3210,
  totalOrders: orders.length,
  totalProducts: products.length,
  pendingOrders: orders.filter((order) => order.status === 'pending').length
}
