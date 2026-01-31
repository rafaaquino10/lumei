'use client'

import { UsageIndicator } from './usage-indicator'

interface UsageIndicatorWrapperProps {
  variant?: 'compact' | 'full'
}

export function UsageIndicatorWrapper({ variant = 'compact' }: UsageIndicatorWrapperProps) {
  return <UsageIndicator variant={variant} />
}
