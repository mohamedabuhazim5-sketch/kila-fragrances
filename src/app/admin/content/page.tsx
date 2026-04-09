import { AdminShell } from '@/components/admin/admin-shell'
import { requireAdminAccess } from '@/lib/admin-auth'

type HeroBanner = {
  id: string
  title: string
  subtitle: string | null
  button_text: string | null
  button_link: string | null
  is_active: boolean
  sort_order: number
}

export const metadata = {
  title: 'Content Management'
}

export default async function AdminContentPage() {
  const { supabase } = await requireAdminAccess()

  const { data, error } = await supabase
    .from('hero_banners')
    .select('id, title, subtitle, button_text, button_link, is_active, sort_order')
    .order('sort_order', { ascending: true })

  const banners: HeroBanner[] = error ? [] : data ?? []

  return (
    <AdminShell
      title="Content Management"
      description="Manage hero banners and key storefront content blocks."
    >
      <div className="panel">
        <h2 style={{ marginBottom: '16px' }}>Hero Banners</h2>

        {banners.length === 0 ? (
          <p className="muted-text">No hero banners found.</p>
        ) : (
          <div className="admin-products-list">
            {banners.map((banner) => (
              <div key={banner.id} className="admin-product-row">
                <div>
                  <h3 style={{ marginBottom: '4px' }}>{banner.title}</h3>
                  <p className="muted-text">{banner.subtitle ?? 'No subtitle'}</p>
                </div>

                <div>
                  <p style={{ marginBottom: '4px' }}>{banner.button_text ?? 'No button text'}</p>
                  <p className="muted-text">{banner.button_link ?? 'No link'}</p>
                </div>

                <div>
                  <p style={{ marginBottom: '4px' }}>{banner.is_active ? 'Active' : 'Inactive'}</p>
                  <p className="muted-text">Sort: {banner.sort_order}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
