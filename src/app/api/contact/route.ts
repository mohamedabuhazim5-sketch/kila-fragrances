import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const payload = await request.json()

  if (!payload.name || !payload.email || !payload.phone || !payload.inquiry) {
    return NextResponse.json({ message: 'Please complete all contact fields.' }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    message: 'Your inquiry was received. Follow up on WhatsApp for immediate support.'
  })
}
