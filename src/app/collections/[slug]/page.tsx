import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/product-card'
import { getCategories, getProducts } from '@/lib/queries'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params
  const [categories, products] = await Promise.all([getCategories(), getProducts({ category: slug })])
  const category = categories.find((item) => item.slug === slug)
  if (!category) notFound()

  return (
    <section className="section">
      <div className="container narrow-stack">
        <p className="eyebrow">Collection</p>
        <h1 className="page-title">{category.name}</h1>
        <p className="section-description">{category.description}</p>

        {products.length === 0 ? (
          <div className="panel empty-state">
            <h3>No products available in this collection yet.</h3>
          </div>
        ) : (
          <div className="product-grid-list">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
