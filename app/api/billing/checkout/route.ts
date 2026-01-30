import { auth } from '@clerk/nextjs/server'
import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createCheckoutSession, getOrCreateCustomer } from '@/lib/billing/subscription-manager'
import { log } from '@/lib/logger'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    const clerkUser = await currentUser()

    if (!userId || !clerkUser?.primaryEmailAddress?.emailAddress) {
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

    await getOrCreateCustomer(
      userId,
      clerkUser.primaryEmailAddress.emailAddress
    )

    const session = await createCheckoutSession(
      userId,
      clerkUser.primaryEmailAddress.emailAddress,
      stripePriceId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    )

    log({
      level: 'info',
      event: 'checkout_session_created',
      userId,
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
