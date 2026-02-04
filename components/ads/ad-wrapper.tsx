'use client'

import { useAuth } from '@/lib/auth/context'
import { AdBanner } from './ad-banner'
import { cn } from '@/lib/utils'

interface AdWrapperProps {
  slot?: string
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle'
  className?: string
}

/**
 * Wrapper para AdBanner que oculta anúncios para usuários Premium
 */
export function AdWrapper({ slot, format = 'horizontal', className }: AdWrapperProps) {
  const { user, isLoading } = useAuth()

  // Não mostra anúncio enquanto carrega (evita flash)
  if (isLoading) return null

  // Não mostra anúncio para usuários Premium
  if (user?.plano === 'PREMIUM') return null

  return (
    <div className={cn('ad-wrapper', className)}>
      <AdBanner slot={slot} format={format} />
      <p className="text-[10px] text-center text-muted-foreground mt-1">
        <a href="/premium" className="hover:underline">
          Assine Premium para remover anúncios
        </a>
      </p>
    </div>
  )
}
