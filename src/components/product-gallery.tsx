'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

export function ProductGallery({ product }: { product: Product }) {
  const [activeId, setActiveId] = useState(product.images[0]?.id)
  const activeImage = useMemo(
    () => product.images.find((image) => image.id === activeId) || product.images[0],
    [activeId, product.images]
  )

  if (!activeImage) {
    return null
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <Image src={activeImage.url} alt={activeImage.alt} fill className="cover-image" />
      </div>
      <div className="product-gallery-strip">
        {product.images.map((image) => (
          <button
            key={image.id}
            type="button"
            className={cn('thumb-button', image.id === activeImage.id && 'active')}
            onClick={() => setActiveId(image.id)}
          >
            <Image src={image.url} alt={image.alt} fill className="cover-image" />
          </button>
        ))}
      </div>
    </div>
  )
}
