import { AdminShell } from '@/components/admin/admin-shell'
import { requireAdminAccess } from '@/lib/admin-auth'

export const metadata = {
  title: 'Admin Dashboard'
}

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdminAccess()

  const [
    { count: productsCount },
    { count: ordersCount },
    { count: activeProductsCount },
    { data: latestOrders }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase
      .from('orders')
      .select('id, order_number, customer_name, total_amount, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  return (
    <AdminShell
      title="Kila Fragrances Admin"
      description="Manage products, orders, store content, and brand settings from one place."
    >
      <div className="admin-stats-grid">
        <div className="panel">
          <p className="section-kicker">Catalog</p>
          <h2>{productsCount ?? 0}</h2>
          <p className="muted-text">Total products</p>
        </div>

        <div className="panel">
          <p className="section-kicker">Orders</p>
          <h2>{ordersCount ?? 0}</h2>
          <p className="muted-text">Total orders</p>
        </div>

        <div className="panel">
          <p className="section-kicker">Live Store</p>
          <h2>{activeProductsCount ?? 0}</h2>
          <p className="muted-text">Active products</p>
        </div>
      </div>

      <div className="panel">
        <h2 style={{ marginBottom: '16px' }}>Latest Orders</h2>

        {(latestOrders ?? []).length === 0 ? (
          <p className="muted-text">No orders yet.</p>
        ) : (
          <div className="admin-products-list">
            {latestOrders?.map((order) => (
              <div key={order.id} className="admin-product-row">
                <div>
                  <h3 style={{ marginBottom: '4px' }}>{order.order_number}</h3>
                  <p className="muted-text">{order.customer_name}</p>
                </div>

                <div>
                  <p style={{ marginBottom: '4px' }}>EGP {Number(order.total_amount).toFixed(2)}</p>
                  <p className="muted-text">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
