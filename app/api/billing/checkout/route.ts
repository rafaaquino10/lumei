import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth/server'
import { createCheckoutSession, getOrCreateCustomer } from '@/lib/billing/subscription-manager'
import { log } from '@/lib/logger'

export async function POST(request: Request) {
  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { stripePriceId } = await request.json()

    if (!stripePriceId) {
      return NextResponse.json(
        { error: 'Missing stripePriceId' },
        { status: 400 }
      )
    }

    await getOrCreateCustomer(user.id, user.email)

    const session = await createCheckoutSession(
      user.id,
      user.email,
      stripePriceId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    )

    log({
      level: 'info',
      event: 'checkout_session_created',
      userId: user.id,
      meta: { sessionId: session.id },
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
    })
  } catch (error) {
    log({
      level: 'error',
      event: 'checkout_error',
      meta: { error: error instanceof Error ? error.message : String(error) },
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
