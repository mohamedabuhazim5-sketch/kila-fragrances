import { siteConfig } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>{siteConfig.name}</h3>
          <p>{siteConfig.tagline}</p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>WhatsApp: {siteConfig.whatsapp}</p>
          <p>Vodafone Cash / InstaPay: {siteConfig.paymentPhone}</p>
        </div>

        <div>
          <h4>Follow Us</h4>
          <a href={siteConfig.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <br />
          <a href={siteConfig.tiktok} target="_blank" rel="noreferrer">
            TikTok
          </a>
        </div>
      </div>
    </footer>
  )
}
