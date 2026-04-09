import { notFound } from 'next/navigation'
import { AddToCartForm } from '@/components/add-to-cart-form'
import { ProductCard } from '@/components/product-card'
import { ProductGallery } from '@/components/product-gallery'
import { formatCurrency } from '@/lib/format'
import { getProductBySlug, getRelatedProducts } from '@/lib/queries'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const relatedProducts = await getRelatedProducts(product)

  return (
    <section className="section">
      <div className="container narrow-stack">
        <div className="product-details-grid">
          <ProductGallery product={product} />

          <div className="panel">
            <p className="eyebrow">{product.categoryName}</p>
            <h1 className="product-page-title">{product.name}</h1>
            <p className="section-description">{product.shortDescription}</p>

            <div className="price-row large-price-row">
              <strong>{formatCurrency(product.price)}</strong>
              {product.comparePrice ? <span>{formatCurrency(product.comparePrice)}</span> : null}
            </div>

            <div className="product-meta-grid">
              <div className="panel panel-soft"><span>Family</span><strong>{product.family}</strong></div>
              <div className="panel panel-soft"><span>Gender</span><strong>{product.gender}</strong></div>
              <div className="panel panel-soft"><span>Season</span><strong>{product.season}</strong></div>
              <div className="panel panel-soft"><span>Occasion</span><strong>{product.occasion}</strong></div>
            </div>

            <AddToCartForm product={product} />
          </div>
        </div>

        <div className="panel">
          <h2 style={{ marginBottom: '12px' }}>Description</h2>
          <p>{product.description}</p>
        </div>

        <div className="notes-grid">
          <div className="panel">
            <h3>Top Notes</h3>
            <p>{product.notes.top.join(' • ') || '—'}</p>
          </div>
          <div className="panel">
            <h3>Middle Notes</h3>
            <p>{product.notes.middle.join(' • ') || '—'}</p>
          </div>
          <div className="panel">
            <h3>Base Notes</h3>
            <p>{product.notes.base.join(' • ') || '—'}</p>
          </div>
        </div>

        {relatedProducts.length > 0 ? (
          <div>
            <h2 style={{ marginBottom: '18px' }}>Related Products</h2>
            <div className="product-grid-list">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
