'use client'

import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api/client'

export interface Subscription {
  status: string
  currentPeriodStart: string
  currentPeriodEnd: string
  stripeSubscriptionId: string
}

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: () => apiFetch<Subscription | null>('/api/user/subscription'),
    enabled: typeof window !== 'undefined',
  })
}
