import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type AllowedRole = 'owner' | 'admin' | 'editor' | 'support'

type AdminProfile = {
  role: AllowedRole
  is_active: boolean
}

export async function requireAdminAccess() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/admin/login')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single<AdminProfile>()

  if (
    profileError ||
    !profile ||
    !profile.is_active ||
    !['owner', 'admin', 'editor', 'support'].includes(profile.role)
  ) {
    redirect('/admin/login')
  }

  return { supabase, user, profile }
}
