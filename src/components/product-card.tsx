import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatCurrency } from '@/lib/format'

export function ProductCard({ product }: { product: Product }) {
  const cover = product.images.find((image) => image.isCover) || product.images[0]
  const imageSrc = cover?.url?.trim() ? cover.url : '/placeholder-product.svg'

  return (
    <article className="product-card">
      <Link href={`/shop/${product.slug}`} className="product-card-image">
        <Image src={imageSrc} alt={cover?.alt || product.name} fill className="cover-image" />
      </Link>
      <div className="product-card-body">
        <div className="product-card-top">
          <span className="badge">{product.badge || product.categoryName}</span>
          <Link href={`/shop/${product.slug}`} className="icon-link" aria-label={`View ${product.name}`}>
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <Link href={`/shop/${product.slug}`} className="product-title-link">
          <h3>{product.name}</h3>
        </Link>
        <p className="product-short">{product.shortDescription}</p>
        <div className="price-row">
          <strong>{formatCurrency(product.price)}</strong>
          {product.comparePrice ? <span>{formatCurrency(product.comparePrice)}</span> : null}
        </div>

        <div className="product-meta">
          <span>{product.family}</span>
          <span>{product.gender}</span>
        </div>
      </div>
    </article>
  )
}
