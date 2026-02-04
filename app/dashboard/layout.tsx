'use client'

import { ReactNode, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { UsageIndicator } from '@/components/dashboard/usage-indicator'
import DashboardErrorBoundary from '@/components/dashboard/error-boundary'
import { toast } from 'sonner'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const { refreshUser, user } = useAuth()

  // Detecta retorno do Stripe e atualiza dados do usuário
  useEffect(() => {
    const success = searchParams.get('success')
    if (success === 'true') {
      // Atualiza dados do usuário após pagamento bem-sucedido
      refreshUser().then(() => {
        toast.success('Pagamento confirmado! Bem-vindo ao Premium!')
      })

      // Remove o parâmetro da URL sem recarregar a página
      const url = new URL(window.location.href)
      url.searchParams.delete('success')
      url.searchParams.delete('refresh')
      window.history.replaceState({}, '', url.pathname)
    }
  }, [searchParams, refreshUser])

  return (
    <DashboardErrorBoundary>
      <div className="min-h-screen">
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
