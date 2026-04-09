import { CartPageContent } from '@/components/cart-page-content'

export const metadata = {
  title: 'Cart'
}

export default function CartPage() {
  return (
    <section className="section">
      <div className="container narrow-stack">
        <p className="eyebrow">Cart</p>
        <h1 className="page-title">Review your order</h1>
        <p className="section-description">Update quantities, remove products, then continue to checkout.</p>
        <CartPageContent />
      </div>
    </section>
  )
}
