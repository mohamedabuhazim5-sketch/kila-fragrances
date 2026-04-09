import { NextResponse } from 'next/server'
import { updateOrderStatus } from '@/lib/services/orders'

type Context = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, context: Context) {
  try {
    const { id } = await context.params
    const body = await request.json()

    if (!body.status) {
      return NextResponse.json({ error: 'Status is required.' }, { status: 400 })
    }

    const result = await updateOrderStatus(id, body.status)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not update order.' },
      { status: 500 }
    )
  }
}
