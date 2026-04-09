import { ContactForm } from '@/components/contact-form'
import { siteConfig } from '@/lib/constants'

export const metadata = {
  title: 'Contact'
}

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container two-panel-layout">
        <div className="panel">
          <p className="eyebrow">Contact</p>
          <h1 className="page-title">Talk to Kila Fragrances</h1>
          <p className="section-description">
            Use the form or contact the store directly on WhatsApp for product help, order support, or payment
            confirmation.
          </p>

          <div className="stack-list">
            <div>
              <strong>WhatsApp</strong>
              <p>{siteConfig.whatsapp}</p>
            </div>
            <div>
              <strong>Payment Number</strong>
              <p>{siteConfig.paymentPhone}</p>
            </div>
            <div>
              <strong>Instagram</strong>
              <a href={siteConfig.instagram} target="_blank" rel="noreferrer">
                Open Instagram
              </a>
            </div>
            <div>
              <strong>TikTok</strong>
              <a href={siteConfig.tiktok} target="_blank" rel="noreferrer">
                Open TikTok
              </a>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  )
}
