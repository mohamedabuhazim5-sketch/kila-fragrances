import { ProductCard } from '@/components/product-card'
import { ProductFilters } from '@/components/product-filters'
import { getProducts } from '@/lib/queries'
import { getSearchParamValue } from '@/lib/utils'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const metadata = {
  title: 'Shop'
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams
  const search = getSearchParamValue(params.search)
  const category = getSearchParamValue(params.category)
  const sort = getSearchParamValue(params.sort) || 'featured'

  const items = await getProducts({
    search,
    category,
    sort
  })

  return (
    <section className="section">
      <div className="container narrow-stack">
        <p className="eyebrow">Shop</p>
        <h1 className="page-title">Explore the Kila Fragrances collection</h1>
        <p className="section-description">
          Filter by collection, search by family, and browse a premium product layout in English.
        </p>

        <ProductFilters currentSearch={search} currentCategory={category} currentSort={sort} />

        {items.length ? (
          <div className="product-grid-list top-gap">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="panel empty-state">
            <h3>No products matched your filters.</h3>
            <p>Try another search term or clear the selected category.</p>
          </div>
        )}
      </div>
    </section>
  )
}
