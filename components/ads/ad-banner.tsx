'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface AdBannerProps {
  slot?: string
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export function AdBanner({
  slot,
  format = 'horizontal',
  className
}: AdBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
  const adSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER

  useEffect(() => {
    if (!publisherId || !adSlot) return

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      setIsLoaded(true)
    } catch {
      console.error('AdSense failed to load')
    }
  }, [publisherId, adSlot])

  // Não renderiza se AdSense não está configurado
  if (!publisherId || !adSlot) {
    return null
  }

  return (
    <div
      className={cn(
        'ad-container overflow-hidden',
        format === 'horizontal' && 'min-h-[90px]',
        format === 'rectangle' && 'min-h-[250px]',
        format === 'vertical' && 'min-h-[600px]',
        className
      )}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={format === 'horizontal' ? 'horizontal' : 'auto'}
        data-full-width-responsive="true"
      />
      {!isLoaded && (
        <div className="w-full h-full bg-muted/50 animate-pulse rounded flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Carregando anúncio...</span>
        </div>
      )}
    </div>
  )
}
