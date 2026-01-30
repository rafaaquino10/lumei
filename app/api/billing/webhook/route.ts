import { NextResponse } from 'next/server'
import { stripe } from '@/lib/billing/stripe'
import {
  handleSubscriptionCreated,
  handleSubscriptionDeleted,
} from '@/lib/billing/subscription-manager'
import { log } from '@/lib/logger'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    log({
      level: 'info',
      event: 'webhook_received',
      meta: { type: event.type },
    })

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Record<string, unknown>
        if (session.subscription) {
          log({
            level: 'info',
            event: 'checkout_completed',
            meta: { customerId: session.customer },
          })
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Record<string, unknown>
        await handleSubscriptionCreated(subscription.customer as string, {
          id: subscription.id as string,
          status: subscription.status as string,
          current_period_end: subscription.current_period_end as number,
          current_period_start: subscription.current_period_start as number,
        })

        log({
          level: 'info',
          event: 'subscription_updated',
          meta: { customerId: subscription.customer, status: subscription.status },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Record<string, unknown>
        await handleSubscriptionDeleted(subscription.customer as string)

        log({
          level: 'info',
          event: 'subscription_deleted',
          meta: { customerId: subscription.customer },
        })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Record<string, unknown>
        log({
          level: 'info',
          event: 'payment_succeeded',
          meta: { customerId: invoice.customer, amount: invoice.amount_paid },
        })
        break
      }

      default:
        log({
          level: 'info',
          event: 'webhook_ignored',
          meta: { type: event.type },
        })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    log({
      level: 'error',
      event: 'webhook_error',
      meta: { error: error instanceof Error ? error.message : String(error) },
    })

    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    )
  }
}
