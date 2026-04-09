import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminLoginForm } from '@/components/admin/admin-login-form'

export const metadata = {
  title: 'Admin Login'
}

export default async function AdminLoginPage() {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single()

    if (profile && profile.is_active && ['owner', 'admin', 'editor', 'support'].includes(profile.role)) {
      redirect('/admin')
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 580 }}>
        <div className="panel" style={{ marginBottom: 24 }}>
          <p className="section-kicker">Back Office</p>
          <h1 style={{ marginBottom: 10 }}>Kila Fragrances Admin</h1>
          <p className="section-description">
            Sign in with your admin account to access products, orders, content, and settings.
          </p>
        </div>

        <AdminLoginForm />
      </div>
    </section>
  )
}
