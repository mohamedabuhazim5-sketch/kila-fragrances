'use client'

import Link from 'next/link'
import { ShoppingBag, Menu } from 'lucide-react'
import { siteConfig } from '@/lib/constants'
import { useCart } from '@/store/cart-store'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/track-order', label: 'Track Order' }
]

export function SiteHeader() {
  const { itemCount } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link href="/" className="brand-mark">
          <span className="brand-kicker">Premium Fragrance House</span>
          <strong>{siteConfig.name}</strong>
        </Link>

        <button className="mobile-menu-button" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          <Menu size={20} />
        </button>

        <nav className={`main-nav ${open ? 'open' : ''}`}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <a href={siteConfig.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={siteConfig.tiktok} target="_blank" rel="noreferrer">
            TikTok
          </a>
          <Link href="/admin">Admin</Link>
        </nav>

        <div className="header-actions">
          <a
            className="ghost-pill"
            href={`https://wa.me/2${siteConfig.whatsapp}?text=Hello%20Kila%20Fragrances,%20I%20want%20to%20place%20an%20order.`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <Link href="/cart" className="cart-pill">
            <ShoppingBag size={18} />
            <span>Cart</span>
            <strong>{itemCount}</strong>
          </Link>
        </div>
      </div>
    </header>
  )
}
