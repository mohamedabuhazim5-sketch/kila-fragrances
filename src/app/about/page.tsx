import { siteConfig } from '@/lib/constants'

export const metadata = {
  title: 'About'
}

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container narrow-stack">
        <p className="eyebrow">About {siteConfig.name}</p>
        <h1 className="page-title">A premium fragrance brand built around presentation, quality, and identity.</h1>
        <p className="section-description">
          {siteConfig.name} is designed as a luxury perfume brand with a modern English storefront, elegant catalog
          pages, and a smooth ordering flow tailored for local payments and direct support.
        </p>

        <div className="two-column-text">
          <div className="panel">
            <h2>Brand vision</h2>
            <p>
              Fragrance is more than a product. It is memory, image, mood, and personal presence. That is why the
              store uses refined visuals, clean layout structure, and carefully written copy across every page.
            </p>
          </div>
          <div className="panel">
            <h2>Customer experience</h2>
            <p>
              The shopping flow focuses on clarity: sharp product visuals, note breakdowns, variant sizes, direct
              support through WhatsApp, and an admin area that keeps operations organized.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
