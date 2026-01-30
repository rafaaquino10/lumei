import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth/server'
import { stripe } from '@/lib/billing/stripe'
import { log } from '@/lib/logger'

export async function GET() {
  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!user.stripeCustomerId || !stripe) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    log({
      level: 'info',
      event: 'billing_portal_accessed',
      userId: user.id,
      meta: { sessionId: portalSession.id },
    })

    return NextResponse.redirect(portalSession.url)
  } catch (error) {
    log({
      level: 'error',
      event: 'billing_portal_error',
      meta: { error: error instanceof Error ? error.message : String(error) },
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
