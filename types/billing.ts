export interface StripeWebhookEvent {
  type: string
  data: {
    object: Record<string, unknown>
  }
}

export interface SubscriptionStatus {
  status: 'active' | 'past_due' | 'canceled' | 'unpaid'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  stripeSubscriptionId: string
}

export interface CheckoutSessionData {
  success: boolean
  sessionId?: string
  error?: string
}
