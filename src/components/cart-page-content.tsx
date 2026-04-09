'use client'

import Link from 'next/link'
import { CartItemRow } from '@/components/cart-item-row'
import { formatCurrency } from '@/lib/format'
import { useCart } from '@/store/cart-store'

export function CartPageContent() {
  const { items, subtotal, shippingFee, total } = useCart()

  if (!items.length) {
    return (
      <div className="panel empty-state">
        <h3>Your cart is empty.</h3>
        <p>Browse the shop and add products to start your order.</p>
        <Link href="/shop" className="primary-button">Go to Shop</Link>
      </div>
    )
  }

  return (
    <div className="cart-grid">
      <div className="cart-list">
        {items.map((item) => (
          <CartItemRow key={`${item.productId}:${item.size || 'default'}`} item={item} />
        ))}
      </div>

      <aside className="panel sticky-summary">
        <h2>Order Summary</h2>
        <div className="summary-box">
          <div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
          <div><span>Shipping</span><strong>{formatCurrency(shippingFee)}</strong></div>
          <div className="summary-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
        </div>
        <Link href="/checkout" className="primary-button full-width">Proceed to Checkout</Link>
      </aside>
    </div>
  )
}
