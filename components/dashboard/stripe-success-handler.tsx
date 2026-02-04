'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { toast } from 'sonner'

export function StripeSuccessHandler() {
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()

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

  return null
}
