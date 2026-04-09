'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { OrderSummary } from '@/lib/types'
import { orderStatusLabels } from '@/lib/constants'

export function OrderStatusForm({ order }: { order: OrderSummary }) {
  const router = useRouter()
  const [status, setStatus] = useState(order.status)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleUpdate(nextStatus: string) {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not update order.')

      setMessage(data.persisted ? 'Updated successfully.' : 'Demo mode: update simulated.')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unexpected error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="order-status-form">
      <select
        value={status}
        className="input"
        onChange={(event) => {
          const nextStatus = event.target.value as OrderSummary['status']
          setStatus(nextStatus)
          void handleUpdate(nextStatus)
        }}
        disabled={loading}
      >
        {Object.entries(orderStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      {message ? <span className="inline-feedback">{message}</span> : null}
    </div>
  )
}
