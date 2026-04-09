import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, Megaphone, Settings } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/content', label: 'Content', icon: Megaphone },
  { href: '/admin/settings', label: 'Settings', icon: Settings }
]

export function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <p className="eyebrow">Kila Admin</p>
      <h2>Management</h2>
      <nav className="admin-nav">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link key={link.href} href={link.href} className="admin-nav-link">
              <Icon size={16} />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
