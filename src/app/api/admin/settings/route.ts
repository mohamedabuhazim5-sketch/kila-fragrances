import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasServiceRole } from '@/lib/env'

export async function PATCH(request: Request) {
  try {
    const body = await request.json()

    if (!hasServiceRole()) {
      return NextResponse.json({ success: true, persisted: false })
    }

    const admin = createAdminClient()
    const payload = {
      brand_name: body.brandName,
      tagline: body.tagline,
      description: body.description,
      whatsapp_number: body.whatsapp,
      payment_phone: body.paymentPhone,
      instagram_url: body.instagram,
      tiktok_url: body.tiktok,
      support_email: body.email
    }

    const { data: existing } = await admin.from('site_settings').select('id').limit(1).maybeSingle()

    if (existing?.id) {
      const { error } = await admin.from('site_settings').update(payload).eq('id', existing.id)
      if (error) throw new Error(error.message)
    } else {
      const { error } = await admin.from('site_settings').insert(payload)
      if (error) throw new Error(error.message)
    }

    return NextResponse.json({ success: true, persisted: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not update settings.' },
      { status: 500 }
    )
  }
}
