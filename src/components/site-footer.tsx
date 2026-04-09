import Link from 'next/link'
import { siteConfig } from '@/lib/constants'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="eyebrow">Kila Fragrances</p>
          <h3 className="footer-title">{siteConfig.tagline}</h3>
          <p className="footer-text">{siteConfig.description}</p>
        </div>

        <div>
          <h4>Store</h4>
          <div className="footer-links">
            <Link href="/shop">Shop All</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/track-order">Track Order</Link>
          </div>
        </div>

        <div>
          <h4>Payments</h4>
          <p>Vodafone Cash / InstaPay</p>
          <p>{siteConfig.paymentPhone}</p>
          <p>Email: {siteConfig.email}</p>
        </div>

        <div>
          <h4>Social</h4>
          <div className="footer-links">
            <a href={siteConfig.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a href={siteConfig.tiktok} target="_blank" rel="noreferrer">TikTok</a>
            <a href={`https://wa.me/2${siteConfig.whatsapp}?text=Hello%20Kila%20Fragrances`} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 {siteConfig.name}. All rights reserved.</span>
        <span>Built for premium fragrance commerce.</span>
      </div>
    </footer>
  )
}
