export interface AnalyticsEvent {
  name: string
  params?: Record<string, unknown>
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return

  try {
    // Google Analytics
    if (typeof (window as Record<string, unknown>).gtag !== 'undefined') {
      const gtag = (window as Record<string, unknown>).gtag as (event: string, name: string, params?: Record<string, unknown>) => void
      gtag('event', event.name, event.params)
    }

    // Custom event logging
    console.debug('Analytics event:', event)
  } catch (error) {
    console.error('Failed to track event:', error)
  }
}

export function trackCalculatorUsed(tipo: string) {
  trackEvent({
    name: 'calculator_used',
    params: { calculator_type: tipo },
  })
}

export function trackCalculatorCompleted(tipo: string, result: unknown) {
  trackEvent({
    name: 'calculator_completed',
    params: {
      calculator_type: tipo,
      has_result: !!result,
    },
  })
}

export function trackCalculationSaved(tipo: string, success: boolean) {
  trackEvent({
    name: 'calculation_saved',
    params: {
      calculator_type: tipo,
      success,
    },
  })
}

export function trackPremiumCheckout() {
  trackEvent({
    name: 'premium_checkout_initiated',
  })
}

export function trackSubscriptionCreated(plan: string) {
  trackEvent({
    name: 'subscription_created',
    params: { plan },
  })
}
