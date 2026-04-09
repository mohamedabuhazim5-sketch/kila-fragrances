'use client'

import { FormEvent, useState } from 'react'

export function ContactForm() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        phone: String(formData.get('phone') || ''),
        inquiry: String(formData.get('inquiry') || '')
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    setLoading(false)
    setMessage(data.message || 'Your inquiry has been submitted.')
    if (response.ok) {
      event.currentTarget.reset()
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>Send an inquiry</h2>
      <div className="form-grid">
        <div className="field-group">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" className="input" required />
        </div>
        <div className="field-group">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" className="input" required />
        </div>
        <div className="field-group field-span-2">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" required />
        </div>
        <div className="field-group field-span-2">
          <label htmlFor="inquiry">Message</label>
          <textarea id="inquiry" name="inquiry" className="textarea" rows={5} required />
        </div>
      </div>

      {message ? <p className="success-text">{message}</p> : null}
      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
