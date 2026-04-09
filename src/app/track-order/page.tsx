import Link from 'next/link'
import { getOrderByNumber } from '@/lib/queries'
import { formatCurrency, formatDate } from '@/lib/format'
import { getSearchParamValue } from '@/lib/utils'
import { orderStatusLabels, paymentMethodLabels } from '@/lib/constants'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const metadata = {
  title: 'Track Order'
}

export default async function TrackOrderPage({ searchParams }: Props) {
  const params = await searchParams
  const orderNumber = getSearchParamValue(params.order)
  const order = orderNumber ? await getOrderByNumber(orderNumber) : null

  return (
    <section className="section">
      <div className="container narrow-stack">
        <p className="eyebrow">Track Order</p>
        <h1 className="page-title">Find your order status</h1>
        <p className="section-description">
          Enter the order number after checkout, or use the auto-redirect that happens after a successful order.
        </p>

        {!orderNumber ? (
          <div className="panel">
            <p>No order number was provided yet.</p>
            <Link href="/shop" className="primary-button">
              Continue shopping
            </Link>
          </div>
        ) : null}

        {orderNumber && !order ? (
          <div className="panel">
            <h2>Order not found</h2>
            <p>We could not find <strong>{orderNumber}</strong>. Check the number and try again.</p>
          </div>
        ) : null}

        {order ? (
          <div className="order-detail-grid">
            <div className="panel">
              <h2>{order.orderNumber}</h2>
              <div className="info-stack">
                <div><span>Status</span><strong>{orderStatusLabels[order.status]}</strong></div>
                <div><span>Payment</span><strong>{paymentMethodLabels[order.paymentMethod as keyof typeof paymentMethodLabels] || order.paymentMethod}</strong></div>
                <div><span>Payment Status</span><strong>{order.paymentStatus}</strong></div>
                <div><span>Placed On</span><strong>{formatDate(order.createdAt)}</strong></div>
                <div><span>Total</span><strong>{formatCurrency(order.total)}</strong></div>
              </div>
            </div>

            <div className="panel">
              <h3>Customer</h3>
              <p><strong>{order.customerName}</strong></p>
              <p>{order.phone}</p>
              <p>{order.email}</p>
              <p>{order.city}</p>
              <p>{order.address}</p>
            </div>

            <div className="panel field-span-2">
              <h3>Order Items</h3>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Size</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.productName}</td>
                        <td>{item.size || 'Standard'}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
