import { AdminShell } from '@/components/admin/admin-shell'
import { requireAdminAccess } from '@/lib/admin-auth'

type OrderRow = {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  total_amount: number
  payment_method: string
  payment_status: string
  status: string
  created_at: string
}

export const metadata = {
  title: 'Orders Management'
}

export default async function AdminOrdersPage() {
  const { supabase } = await requireAdminAccess()

  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, customer_name, customer_phone, total_amount, payment_method, payment_status, status, created_at')
    .order('created_at', { ascending: false })

  const orders: OrderRow[] = error ? [] : data ?? []

  return (
    <AdminShell
      title="Orders Management"
      description="Review customer orders, payment status, and fulfillment progress."
    >
      <div className="panel">
        <h2 style={{ marginBottom: '16px' }}>Orders List</h2>

        {orders.length === 0 ? (
          <p className="muted-text">No orders available yet.</p>
        ) : (
          <div className="admin-products-list">
            {orders.map((order) => (
              <div key={order.id} className="admin-product-row">
                <div>
                  <h3 style={{ marginBottom: '4px' }}>{order.order_number}</h3>
                  <p className="muted-text">
                    {order.customer_name} • {order.customer_phone}
                  </p>
                </div>

                <div>
                  <p style={{ marginBottom: '4px' }}>EGP {Number(order.total_amount).toFixed(2)}</p>
                  <p className="muted-text">{order.payment_method}</p>
                </div>

                <div>
                  <p style={{ marginBottom: '4px', textTransform: 'capitalize' }}>{order.status}</p>
                  <p className="muted-text" style={{ textTransform: 'capitalize' }}>
                    {order.payment_status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
