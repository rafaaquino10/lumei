import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth/server'
import { getSubscriptionStatus } from '@/lib/billing/subscription-manager'

export async function GET() {
  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const subscription = await getSubscriptionStatus(user.id)

    if (!subscription) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
