import { CheckoutForm } from '@/components/checkout-form'

export const metadata = {
  title: 'Checkout'
}

export default function CheckoutPage() {
  return (
    <section className="section">
      <div className="container narrow-stack">
        <p className="eyebrow">Checkout</p>
        <h1 className="page-title">Complete your order</h1>
        <p className="section-description">
          Submit your customer details and choose your payment method. Orders are saved to Supabase when your keys are configured.
        </p>
        <CheckoutForm />
      </div>
    </section>
  )
}
