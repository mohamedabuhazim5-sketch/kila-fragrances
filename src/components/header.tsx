import Link from 'next/link'
import { siteConfig } from '@/lib/constants'

export function Header() {
  return (
    <header className="header">
      <div className="container nav">
        <Link href="/" className="brand">
          {siteConfig.name}
        </Link>

        <nav className="menu">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/product">Product</Link>
          <a href={siteConfig.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={siteConfig.tiktok} target="_blank" rel="noreferrer">
            TikTok
          </a>
        </nav>
      </div>
    </header>
  )
}
