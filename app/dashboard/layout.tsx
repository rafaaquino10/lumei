'use client'

import { ReactNode, Suspense } from 'react'
import { useAuth } from '@/lib/auth/context'
import { UsageIndicator } from '@/components/dashboard/usage-indicator'
import { StripeSuccessHandler } from '@/components/dashboard/stripe-success-handler'
import DashboardErrorBoundary from '@/components/dashboard/error-boundary'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  return (
    <DashboardErrorBoundary>
      <div className="min-h-screen">
        {/* Handler para detectar retorno do Stripe */}
        <Suspense fallback={null}>
          <StripeSuccessHandler />
        </Suspense>

        {/* UsageIndicator só aparece para usuários FREE */}
        {user?.plano !== 'PREMIUM' && (
          <div className="container mx-auto px-4 py-4 flex justify-end">
            <UsageIndicator />
          </div>
        )}
        {children}
      </div>
    </DashboardErrorBoundary>
  )
}
