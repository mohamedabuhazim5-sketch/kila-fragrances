import type { Metadata } from 'next'
import './globals.css'
import { AnnouncementBar } from '@/components/announcement-bar'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFloat } from '@/components/whatsapp-float'
import { CartProvider } from '@/store/cart-store'
import { siteConfig } from '@/lib/constants'

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Luxury Perfume Store`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <AnnouncementBar />
          <SiteHeader />
          <main className="page-shell">{children}</main>
          <SiteFooter />
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  )
}
