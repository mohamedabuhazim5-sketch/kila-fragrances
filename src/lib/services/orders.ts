import { createAdminClient } from '@/lib/supabase/admin'
import { hasServiceRole } from '@/lib/env'
import type { CheckoutPayload } from '@/lib/types'

export async function createOrder(payload: CheckoutPayload) {
  const orderNumber = generateOrderNumber()

  if (!hasServiceRole()) {
    return { success: true, orderNumber, persisted: false }
  }

  const admin = createAdminClient()

  const { data: order, error } = await admin
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_name: payload.customerName,
      customer_phone: payload.phone,
      customer_email: payload.email,
      city: payload.city,
      address_line: payload.address,
      notes: payload.notes || null,
      payment_method: payload.paymentMethod,
      payment_status: 'pending',
      status: 'pending',
      subtotal: payload.subtotal,
      shipping_fee: payload.shippingFee,
      discount_amount: 0,
      total_amount: payload.total
    })
    .select('id')
    .single()

  if (error || !order) {
    throw new Error(error?.message || 'Failed to create order.')
  }

  const orderItems = payload.items.map((item) => ({
    order_id: order.id,
    product_name: item.name,
    size_label: item.size || null,
    quantity: item.quantity,
    unit_price: item.price,
    line_total: item.price * item.quantity
  }))

  const { error: itemsError } = await admin.from('order_items').insert(orderItems)
  if (itemsError) throw new Error(itemsError.message)

  return { success: true, orderNumber, persisted: true }
}

export async function updateOrderStatus(orderId: string, status: string) {
  if (!hasServiceRole()) {
    return { success: true, persisted: false }
  }

  const admin = createAdminClient()
  const { error } = await admin.from('orders').update({ status }).eq('id', orderId)
  if (error) throw new Error(error.message)

  return { success: true, persisted: true }
}

function generateOrderNumber() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const suffix = Math.floor(Math.random() * 900 + 100)
  return `KF-${yyyy}${mm}${dd}-${suffix}`
}
