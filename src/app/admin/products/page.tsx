import Link from 'next/link'
import { AdminShell } from '@/components/admin/admin-shell'
import { ProductCreateForm } from '@/components/admin/product-create-form'
import { requireAdminAccess } from '@/lib/admin-auth'

type ProductRow = {
  id: string
  name: string
  slug: string
  base_price: number
  stock_quantity: number
  status: string
}

type CategoryRow = {
  id: string
  name: string
}

export const metadata = {
  title: 'Products Management'
}

export default async function AdminProductsPage() {
  const { supabase } = await requireAdminAccess()

  const [{ data: productsData, error: productsError }, { data: categoriesData, error: categoriesError }] =
    await Promise.all([
      supabase
        .from('products')
        .select('id, name, slug, base_price, stock_quantity, status')
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('id, name').order('sort_order', { ascending: true })
    ])

  const products: ProductRow[] = productsError ? [] : productsData ?? []
  const categories: CategoryRow[] = categoriesError ? [] : categoriesData ?? []

  return (
    <AdminShell
      title="Products Management"
      description="Add new fragrances, edit current products, manage stock, and upload images."
    >
      <ProductCreateForm categories={categories} />

      <div className="panel">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <h2 style={{ marginBottom: '6px' }}>Current Products</h2>
            <p className="muted-text">Manage all products currently available in your store.</p>
          </div>
        </div>

        {products.length === 0 ? (
          <p className="muted-text">No products found yet.</p>
        ) : (
          <div className="admin-products-list">
            {products.map((product) => (
              <div key={product.id} className="admin-product-row">
                <div>
                  <h3 style={{ marginBottom: '4px' }}>{product.name}</h3>
                  <p className="muted-text">{product.slug}</p>
                </div>

                <div>
                  <p style={{ marginBottom: '4px' }}>EGP {Number(product.base_price).toFixed(2)}</p>
                  <p className="muted-text">Stock: {product.stock_quantity}</p>
                </div>

                <div>
                  <p style={{ textTransform: 'capitalize', marginBottom: '8px' }}>{product.status}</p>
                  <Link href={`/admin/products/${product.id}`} className="secondary-button">
                    Edit Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
