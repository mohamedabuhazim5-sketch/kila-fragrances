'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { paymentMethodLabels, siteConfig } from '@/lib/constants'
import { formatCurrency } from '@/lib/format'
import { useCart } from '@/store/cart-store'

export function CheckoutForm() {
  const router = useRouter()
  const { items, subtotal, shippingFee, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    if (!items.length) {
      setError('Your cart is empty.')
      return
    }

    setLoading(true)
    setError('')

    const payload = {
      customerName: String(formData.get('customerName') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      city: String(formData.get('city') || ''),
      address: String(formData.get('address') || ''),
      notes: String(formData.get('notes') || ''),
      paymentMethod: String(formData.get('paymentMethod') || 'vodafone_cash'),
      items,
      subtotal,
      shippingFee,
      total
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Checkout failed.')

      clearCart()
      router.push(`/track-order?order=${encodeURIComponent(data.orderNumber)}`)
      alert(`Order ${data.orderNumber} created successfully. Complete payment using ${paymentMethodLabels[payload.paymentMethod as keyof typeof paymentMethodLabels]} on ${siteConfig.paymentPhone}.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="checkout-grid" action={async (formData) => { await handleSubmit(formData) }}>
      <div className="panel">
        <h2>Customer Details</h2>
        <div className="form-grid">
          <div className="field-group"><label htmlFor="customerName">Full Name</label><input id="customerName" name="customerName" className="input" required /></div>
          <div className="field-group"><label htmlFor="phone">Phone</label><input id="phone" name="phone" className="input" required /></div>
          <div className="field-group"><label htmlFor="email">Email</label><input id="email" name="email" type="email" className="input" required /></div>
          <div className="field-group"><label htmlFor="city">City</label><input id="city" name="city" className="input" required /></div>
          <div className="field-group field-span-2"><label htmlFor="address">Address</label><input id="address" name="address" className="input" required /></div>
          <div className="field-group field-span-2"><label htmlFor="notes">Notes</label><textarea id="notes" name="notes" className="textarea" rows={4} /></div>
        </div>
      </div>

      <div className="panel">
        <h2>Payment Method</h2>
        <div className="radio-list">
          {Object.entries(paymentMethodLabels).map(([value, label]) => (
            <label key={value} className="radio-card">
              <input type="radio" name="paymentMethod" value={value} defaultChecked={value === 'vodafone_cash'} />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div className="payment-box">
          <p>Send payment to:</p>
          <strong>{siteConfig.paymentPhone}</strong>
          <p>After payment, keep your transfer reference and send it on WhatsApp if requested.</p>
        </div>

        <div className="summary-box">
          <div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
          <div><span>Shipping</span><strong>{formatCurrency(shippingFee)}</strong></div>
          <div className="summary-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        <button className="primary-button full-width" type="submit" disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </form>
  )
}
