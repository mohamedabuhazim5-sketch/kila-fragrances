import { AdminShell } from '@/components/admin/admin-shell'
import { requireAdminAccess } from '@/lib/admin-auth'

type SiteSettings = {
  id: string
  brand_name: string
  tagline: string | null
  description: string | null
  whatsapp_number: string
  payment_phone: string
  instagram_url: string | null
  tiktok_url: string | null
  currency_code: string
  currency_symbol: string
  announcement_bar: string | null
}

export const metadata = {
  title: 'Store Settings'
}

export default async function AdminSettingsPage() {
  const { supabase } = await requireAdminAccess()

  const { data, error } = await supabase
    .from('site_settings')
    .select('id, brand_name, tagline, description, whatsapp_number, payment_phone, instagram_url, tiktok_url, currency_code, currency_symbol, announcement_bar')
    .limit(1)
    .maybeSingle()

  const settings: SiteSettings | null = error ? null : data ?? null

  return (
    <AdminShell
      title="Store Settings"
      description="Review and manage brand information, contact details, and storefront defaults."
    >
      <div className="panel">
        {!settings ? (
          <p className="muted-text">No site settings found.</p>
        ) : (
          <div className="settings-grid">
            <div className="settings-item">
              <span className="muted-text">Brand Name</span>
              <strong>{settings.brand_name}</strong>
            </div>

            <div className="settings-item">
              <span className="muted-text">Tagline</span>
              <strong>{settings.tagline ?? '—'}</strong>
            </div>

            <div className="settings-item">
              <span className="muted-text">WhatsApp</span>
              <strong>{settings.whatsapp_number}</strong>
            </div>

            <div className="settings-item">
              <span className="muted-text">Payment Phone</span>
              <strong>{settings.payment_phone}</strong>
            </div>

            <div className="settings-item">
              <span className="muted-text">Instagram</span>
              <strong>{settings.instagram_url ?? '—'}</strong>
            </div>

            <div className="settings-item">
              <span className="muted-text">TikTok</span>
              <strong>{settings.tiktok_url ?? '—'}</strong>
            </div>

            <div className="settings-item">
              <span className="muted-text">Currency</span>
              <strong>{settings.currency_code} ({settings.currency_symbol})</strong>
            </div>

            <div className="settings-item settings-item-full">
              <span className="muted-text">Announcement Bar</span>
              <strong>{settings.announcement_bar ?? '—'}</strong>
            </div>

            <div className="settings-item settings-item-full">
              <span className="muted-text">Description</span>
              <strong>{settings.description ?? '—'}</strong>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
