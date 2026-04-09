import Link from 'next/link'

export function AdminShell({
  title,
  description,
  children
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="admin-page">
      <div className="admin-shell-grid">
        <aside className="panel admin-sidebar-panel">
          <p className="section-kicker">Kila Admin</p>
          <h2 style={{ marginBottom: '16px' }}>Management</h2>

          <nav className="admin-nav">
            <Link href="/admin" className="admin-nav-link">
              Dashboard
            </Link>
            <Link href="/admin/products" className="admin-nav-link">
              Products
            </Link>
            <Link href="/admin/orders" className="admin-nav-link">
              Orders
            </Link>
            <Link href="/admin/content" className="admin-nav-link">
              Content
            </Link>
            <Link href="/admin/settings" className="admin-nav-link">
              Settings
            </Link>
            <Link href="/" className="admin-nav-link">
              View Store
            </Link>
          </nav>
        </aside>

        <div className="admin-main-stack">
          <div className="panel">
            <p className="section-kicker">Back Office</p>
            <h1>{title}</h1>
            {description ? <p className="section-description">{description}</p> : null}
          </div>

          {children}
        </div>
      </div>
    </section>
  )
}
