'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth/context'
import {
  canCalculateAnonymous,
  recordAnonymousCalculation,
  canCalculateFree,
  getUsageLimits
} from '@/lib/calculos/usage-tracker'

interface PaywallState {
  isBlocked: boolean
  type: 'anonymous' | 'free' | null
  remaining: number
  limit: number
}

interface UsePaywallReturn {
  checkLimit: () => PaywallState
  recordCalculation: () => void
  showPaywall: boolean
  setShowPaywall: (show: boolean) => void
  paywallType: 'anonymous' | 'free'
  remaining: number
  limit: number
}

/**
 * Hook para gerenciar o paywall contextual
 * Verifica limites de uso e controla exibição do modal
 */
export function usePaywall(monthlyUsage: number = 0): UsePaywallReturn {
  const { user, isSignedIn, isLoading } = useAuth()
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallState, setPaywallState] = useState<PaywallState>({
    isBlocked: false,
    type: null,
    remaining: 0,
    limit: 0
  })

  const limits = getUsageLimits()

  const checkLimit = useCallback((): PaywallState => {
    // Ainda carregando auth, permite
    if (isLoading) {
      return { isBlocked: false, type: null, remaining: 0, limit: 0 }
    }

    // Usuário Premium: sem limites
    if (isSignedIn && user?.plano === 'PREMIUM') {
      return { isBlocked: false, type: null, remaining: Infinity, limit: Infinity }
    }

    // Usuário FREE: limite mensal
    if (isSignedIn && user?.plano === 'FREE') {
      const { allowed, remaining, limit } = canCalculateFree(monthlyUsage)
      const state = { isBlocked: !allowed, type: 'free' as const, remaining, limit }
      setPaywallState(state)
      return state
    }

    // Usuário anônimo: limite diário
    const { allowed, remaining, limit } = canCalculateAnonymous()
    const state = { isBlocked: !allowed, type: 'anonymous' as const, remaining, limit }
    setPaywallState(state)
    return state
  }, [isLoading, isSignedIn, user?.plano, monthlyUsage])

  const recordCalculation = useCallback(() => {
    // Só registra para anônimos (FREE é registrado via API)
    if (!isSignedIn && !isLoading) {
      recordAnonymousCalculation()
    }
  }, [isSignedIn, isLoading])

  return {
    checkLimit,
    recordCalculation,
    showPaywall,
    setShowPaywall,
    paywallType: paywallState.type || 'anonymous',
    remaining: paywallState.remaining,
    limit: paywallState.limit
  }
}
