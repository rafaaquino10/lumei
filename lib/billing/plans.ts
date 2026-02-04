export type Plan = 'FREE' | 'PREMIUM'

export interface PlanConfig {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  stripeProductId?: string
  stripePriceId?: string
}

export const PLANS: Record<Plan, PlanConfig> = {
  FREE: {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    currency: 'BRL',
    interval: 'month',
    features: [
      '10 cálculos por mês',
      'Acesso a todas as calculadoras',
      'Histórico básico',
    ],
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 1490,
    currency: 'BRL',
    interval: 'month',
    features: [
      'Cálculos ilimitados',
      'Acesso a todas as calculadoras',
      'Histórico completo',
      '3 alertas de DAS (email + WhatsApp)',
      'Suporte prioritário',
    ],
    stripeProductId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_PREMIUM,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM,
  },
}

export function getPlan(plan: Plan): PlanConfig {
  return PLANS[plan]
}

export function getPriceInCents(plan: Plan): number {
  return PLANS[plan].price
}
