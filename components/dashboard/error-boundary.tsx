'use client'

import { ReactNode } from 'react'
import { useEffect } from 'react'

export default function DashboardErrorBoundary({ children }: { children: ReactNode }) {
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error('Error boundary caught:', event.error)
    }
    window.addEventListener('error', errorHandler)
    return () => window.removeEventListener('error', errorHandler)
  }, [])

  return <>{children}</>
}
