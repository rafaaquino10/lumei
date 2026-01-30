'use client'

import { ReactNode } from 'react'
import { UsageIndicator } from '@/components/dashboard/usage-indicator'
import DashboardErrorBoundary from '@/components/dashboard/error-boundary'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardErrorBoundary>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-4 flex justify-end">
          <UsageIndicator />
        </div>
        {children}
      </div>
    </DashboardErrorBoundary>
  )
}
