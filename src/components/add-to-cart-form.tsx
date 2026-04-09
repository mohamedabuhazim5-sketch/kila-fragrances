'use client'

import { useMemo, useState } from 'react'
import type { Product } from '@/lib/types'
import { useCart } from '@/store/cart-store'
import { QuantitySelector } from '@/components/quantity-selector'

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState(product.variants[0]?.size)
  const [quantity, setQuantity] = useState(1)

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.size === selectedSize) || product.variants[0],
    [product.variants, selectedSize]
  )

  return (
    <div className="purchase-panel">
      {product.variants.length ? (
        <div className="field-group">
          <label htmlFor="size">Size</label>
          <select id="size" className="input" value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)}>
            {product.variants.map((variant) => (
              <option key={variant.id} value={variant.size}>{variant.size}</option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="field-group">
        <label>Quantity</label>
        <QuantitySelector value={quantity} onChange={setQuantity} />
      </div>

      <div className="purchase-actions">
        <button type="button" className="primary-button" onClick={() => addItem(product, selectedVariant?.size, quantity)}>
          Add to Cart
        </button>
        <a
          className="secondary-button"
          href={`https://wa.me/201061376851?text=Hello%20Kila%20Fragrances,%20I%20want%20to%20order%20${encodeURIComponent(product.name)}${selectedVariant?.size ? `%20${selectedVariant.size}` : ''}.`}
          target="_blank"
          rel="noreferrer"
        >
          Order on WhatsApp
        </a>
      </div>
    </div>
  )
}
