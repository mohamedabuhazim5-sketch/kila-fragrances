import { NextResponse } from 'next/server'
import { createProduct } from '@/lib/services/products'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await createProduct(body)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not create product.' },
      { status: 500 }
    )
  }
}
