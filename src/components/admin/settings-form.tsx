'use client'

import { useState } from 'react'
import type { SiteSettings } from '@/lib/types'

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [message, setMessage] = useState('')

  return (
    <form
      className="panel"
      action={async (formData) => {
        setMessage('')
        const body = {
          brandName: String(formData.get('brandName') || ''),
          tagline: String(formData.get('tagline') || ''),
          description: String(formData.get('description') || ''),
          whatsapp: String(formData.get('whatsapp') || ''),
          paymentPhone: String(formData.get('paymentPhone') || ''),
          instagram: String(formData.get('instagram') || ''),
          tiktok: String(formData.get('tiktok') || ''),
          email: String(formData.get('email') || '')
        }

        const response = await fetch('/api/admin/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })

        const data = await response.json()
        setMessage(response.ok ? (data.persisted ? 'Settings saved.' : 'Demo mode: update simulated.') : data.error)
      }}
    >
      <h2>Brand Settings</h2>
      <div className="form-grid">
        <div className="field-group"><label>Brand Name</label><input name="brandName" className="input" defaultValue={settings.name} /></div>
        <div className="field-group"><label>Tagline</label><input name="tagline" className="input" defaultValue={settings.tagline} /></div>
        <div className="field-group field-span-2"><label>Description</label><textarea name="description" className="textarea" rows={4} defaultValue={settings.description} /></div>
        <div className="field-group"><label>WhatsApp</label><input name="whatsapp" className="input" defaultValue={settings.whatsapp} /></div>
        <div className="field-group"><label>Payment Phone</label><input name="paymentPhone" className="input" defaultValue={settings.paymentPhone} /></div>
        <div className="field-group"><label>Instagram</label><input name="instagram" className="input" defaultValue={settings.instagram} /></div>
        <div className="field-group"><label>TikTok</label><input name="tiktok" className="input" defaultValue={settings.tiktok} /></div>
        <div className="field-group field-span-2"><label>Email</label><input name="email" className="input" defaultValue={settings.email} /></div>
      </div>
      {message ? <p className="success-text">{message}</p> : null}
      <button className="primary-button" type="submit">Save Settings</button>
    </form>
  )
}
