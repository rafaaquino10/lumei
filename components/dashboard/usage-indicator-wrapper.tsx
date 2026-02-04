'use client'

import { useAuth } from '@/lib/auth/context'
import { UsageIndicator } from './usage-indicator'

interface UsageIndicatorWrapperProps {
  variant?: 'compact' | 'full'
}

export function UsageIndicatorWrapper({ variant = 'compact' }: UsageIndicatorWrapperProps) {
  const { user, isLoading } = useAuth()

  // Não mostra para usuários Premium
  if (isLoading) return null
  if (user?.plano === 'PREMIUM') return null

  return <UsageIndicator variant={variant} />
}
