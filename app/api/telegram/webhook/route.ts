import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📨 Webhook received:', JSON.stringify(body, null, 2))

    // You can add minimal webhook handling here if needed for other features
    // For now, just acknowledge receipt

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ Telegram webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}