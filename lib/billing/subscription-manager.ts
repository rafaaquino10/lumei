import { prisma } from '@/lib/prisma'
import { stripe } from './stripe'

export async function createCheckoutSession(
  userId: string,
  email: string,
  stripePriceId: string,
  returnUrl: string
) {
  if (!stripe) {
    throw new Error('Stripe is not initialized')
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    client_reference_id: userId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${returnUrl}?success=true`,
    cancel_url: returnUrl,
  })

  return session
}

export async function getOrCreateCustomer(userId: string, email: string) {
  if (!stripe) {
    throw new Error('Stripe is not initialized')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  })

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  })

  return customer.id
}

export async function handleSubscriptionCreated(
  customerId: string,
  subscriptionData: {
    id: string
    status: string
    current_period_end: number
    current_period_start: number
  }
) {
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  })

  if (!user) return

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      stripeSubscriptionId: subscriptionData.id,
      stripeCustomerId: customerId,
      status: subscriptionData.status,
      currentPeriodStart: new Date(subscriptionData.current_period_start * 1000),
      currentPeriodEnd: new Date(subscriptionData.current_period_end * 1000),
    },
    update: {
      stripeSubscriptionId: subscriptionData.id,
      status: subscriptionData.status,
      currentPeriodStart: new Date(subscriptionData.current_period_start * 1000),
      currentPeriodEnd: new Date(subscriptionData.current_period_end * 1000),
    },
  })

  await prisma.user.update({
    where: { id: user.id },
    data: { plano: 'PREMIUM' },
  })
}

export async function handleSubscriptionDeleted(customerId: string) {
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  })

  if (!user) return

  await prisma.subscription.delete({
    where: { userId: user.id },
  })

  await prisma.user.update({
    where: { id: user.id },
    data: { plano: 'FREE' },
  })
}

export async function getSubscriptionStatus(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  return subscription
}
