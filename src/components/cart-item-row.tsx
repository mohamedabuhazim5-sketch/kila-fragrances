'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import type { CartLine } from '@/lib/types'
import { QuantitySelector } from '@/components/quantity-selector'
import { formatCurrency } from '@/lib/format'
import { useCart } from '@/store/cart-store'

export function CartItemRow({ item }: { item: CartLine }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <article className="cart-item-row">
      <div className="cart-item-media">
        <div className="cart-item-image">
          <Image src={item.image} alt={item.name} fill className="cover-image" />
        </div>
        <div>
          <Link href={`/shop/${item.slug}`} className="product-title-link"><h3>{item.name}</h3></Link>
          <p className="cart-item-meta">{item.size || 'Standard Size'}</p>
          <p className="cart-item-meta">{formatCurrency(item.price)}</p>
        </div>
      </div>

      <div className="cart-item-actions">
        <QuantitySelector value={item.quantity} onChange={(value) => updateQuantity(item.productId, item.size, value)} />
        <button type="button" className="icon-button" onClick={() => removeItem(item.productId, item.size)} aria-label={`Remove ${item.name}`}>
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  )
}
