'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AdInterstitialProps {
  isOpen: boolean
  onClose: () => void
  delayClose?: number // Tempo em segundos antes de permitir fechar
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export function AdInterstitial({
  isOpen,
  onClose,
  delayClose = 5
}: AdInterstitialProps) {
  const [countdown, setCountdown] = useState(delayClose)
  const [canClose, setCanClose] = useState(false)
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
  const adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_INTERSTITIAL

  useEffect(() => {
    if (!isOpen) {
      setCountdown(delayClose)
      setCanClose(false)
      return
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanClose(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, delayClose])

  useEffect(() => {
    if (!isOpen || !publisherId || !adSlot) return

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      console.error('AdSense interstitial failed to load')
    }
  }, [isOpen, publisherId, adSlot])

  if (!isOpen) return null

  // Se AdSense não está configurado, fecha automaticamente
  if (!publisherId || !adSlot) {
    onClose()
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 bg-card rounded-lg shadow-xl overflow-hidden">
        {/* Header com contador/botão fechar */}
        <div className="flex items-center justify-between p-3 border-b bg-muted/50">
          <span className="text-xs text-muted-foreground">
            Patrocinado
          </span>
          {canClose ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 px-3"
            >
              <X className="w-4 h-4 mr-1" />
              Fechar
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">
              Fechar em {countdown}s
            </span>
          )}
        </div>

        {/* Área do anúncio */}
        <div className="p-4">
          <div className={cn(
            'ad-container-interstitial min-h-[250px] flex items-center justify-center'
          )}>
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '250px' }}
              data-ad-client={publisherId}
              data-ad-slot={adSlot}
              data-ad-format="rectangle"
            />
          </div>
        </div>

        {/* Footer com CTA Premium */}
        <div className="p-3 border-t bg-primary/5 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Cansado de anúncios?
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href="/premium">
              Assine Premium - Sem anúncios
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
