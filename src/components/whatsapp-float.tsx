import { MessageCircleMore } from 'lucide-react'
import { siteConfig } from '@/lib/constants'

export function WhatsAppFloat() {
  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/2${siteConfig.whatsapp}?text=Hello%20Kila%20Fragrances,%20I%20need%20help%20with%20my%20order.`}
      target="_blank"
      rel="noreferrer"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircleMore size={20} />
      <span>WhatsApp</span>
    </a>
  )
}
