import Link from 'next/link'
import { CollectionCard } from '@/components/collection-card'
import { ProductCard } from '@/components/product-card'
import { SectionHeading } from '@/components/section-heading'
import { getCategories, getFeaturedProducts, getHeroSlides, getSiteSettings } from '@/lib/queries'
import { paymentMethodLabels } from '@/lib/constants'

export default async function HomePage() {
  const [settings, slides, categories, featuredProducts] = await Promise.all([
    getSiteSettings(),
    getHeroSlides(),
    getCategories(),
    getFeaturedProducts()
  ])

  const hero = slides[0]

  return (
    <>
      <section className="hero-section">
        <div className="container hero-layout">
          <div className="hero-copy panel panel-soft">
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1>{hero.title}</h1>
            <p className="hero-description">{hero.subtitle}</p>
            <div className="hero-actions">
              <Link href={hero.ctaHref} className="primary-button">
                {hero.ctaLabel}
              </Link>
              <Link href="/collections/unisex" className="secondary-button">
                Discover Signatures
              </Link>
            </div>

            <div className="hero-inline-stats">
              <div className="mini-stat">
                <span>Payments</span>
                <strong>Vodafone Cash / InstaPay</strong>
              </div>
              <div className="mini-stat">
                <span>Order Support</span>
                <strong>{settings.whatsapp}</strong>
              </div>
            </div>
          </div>

          <div className="hero-visual panel">
            <div
              className="hero-image"
              style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.55)), url(${hero.image})` }}
            />
            <div className="hero-overlay-card">
              <span>Premium presentation</span>
              <strong>{settings.name}</strong>
              <p>{settings.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Collections"
            title="Shop by collection"
            description="A premium English storefront for men, women, and unisex signatures."
            action={
              <Link href="/shop" className="text-link">
                View all products
              </Link>
            }
          />
          <div className="collection-grid">
            {categories.map((category) => (
              <CollectionCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Featured"
            title="Top picks from Kila Fragrances"
            description="Showcase your strongest products on the homepage with hero photography, polished pricing, and a clean luxury layout."
          />
          <div className="product-grid-list">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container value-grid">
          <div className="panel">
            <p className="eyebrow">Why customers choose us</p>
            <h2>Luxury-first design with practical local checkout.</h2>
            <p className="section-description">
              The storefront is designed to feel premium while keeping ordering simple with WhatsApp support,
              manual payment options, and a structured product catalog.
            </p>
          </div>

          <div className="feature-list">
            <div className="panel">
              <h3>Elegant product pages</h3>
              <p>Notes, gallery, variant sizes, reviews, and strong call-to-action blocks.</p>
            </div>
            <div className="panel">
              <h3>Manual local payments</h3>
              <p>
                {Object.values(paymentMethodLabels).join(' • ')} with a single payment number:
                {' '}
                {settings.paymentPhone}
              </p>
            </div>
            <div className="panel">
              <h3>Admin dashboard</h3>
              <p>Products, orders, hero content, and settings can all be managed from the admin side.</p>
            </div>
            <div className="panel">
              <h3>Supabase ready</h3>
              <p>Works with mock data now and switches to live Supabase content once your keys are added.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
