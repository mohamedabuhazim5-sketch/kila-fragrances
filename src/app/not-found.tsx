import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container narrow-stack">
        <div className="panel empty-state">
          <p className="eyebrow">404</p>
          <h1 className="page-title">Page not found</h1>
          <p className="section-description">The page you requested does not exist.</p>
          <Link href="/" className="primary-button">Return home</Link>
        </div>
      </div>
    </section>
  )
}
