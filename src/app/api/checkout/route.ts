import { NextResponse } from 'next/server'
import type { CheckoutPayload } from '@/lib/types'
import { createOrder } from '@/lib/services/orders'

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CheckoutPayload

    if (!payload.customerName || !payload.phone || !payload.address || !payload.items?.length) {
      return NextResponse.json({ error: 'Missing required checkout fields.' }, { status: 400 })
    }

    const result = await createOrder(payload)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Checkout failed.' },
      { status: 500 }
    )
  }
}
