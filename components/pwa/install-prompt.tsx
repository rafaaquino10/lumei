'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// Chave para localStorage
const DISMISSED_KEY = 'pwa-prompt-dismissed'
const DAYS_TO_HIDE = 30 // Esconde por 30 dias após dispensar

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dismissedRef = useRef(false)

  // Verifica se foi dispensado recentemente
  const wasDismissedRecently = useCallback(() => {
    try {
      const dismissed = localStorage.getItem(DISMISSED_KEY)
      if (!dismissed) return false

      const dismissedDate = new Date(dismissed)
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceDismissed < DAYS_TO_HIDE
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    // Verifica se já foi dispensado (também marca ref para evitar race conditions)
    if (wasDismissedRecently()) {
      dismissedRef.current = true
      return
    }

    // Detecta iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window)
    setIsIOS(isIOSDevice)

    // Verifica se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isStandalone) return

    // Listener para o evento beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault()

      // Não configura timeout se já foi dispensado
      if (dismissedRef.current || wasDismissedRecently()) return

      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Limpa timeout anterior se existir
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Aguarda 30 segundos antes de mostrar o prompt
      timeoutRef.current = setTimeout(() => {
        // Verifica novamente antes de mostrar
        if (!dismissedRef.current && !wasDismissedRecently()) {
          setShowPrompt(true)
        }
      }, 30000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Para iOS, mostra instruções após 30 segundos
    if (isIOSDevice && !dismissedRef.current) {
      timeoutRef.current = setTimeout(() => {
        if (!dismissedRef.current && !wasDismissedRecently()) {
          setShowPrompt(true)
        }
      }, 30000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [wasDismissedRecently])

  const handleDismiss = useCallback(() => {
    // Marca como dispensado imediatamente
    dismissedRef.current = true
    setShowPrompt(false)
    setDeferredPrompt(null)

    // Limpa qualquer timeout pendente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Salva no localStorage
    try {
      localStorage.setItem(DISMISSED_KEY, new Date().toISOString())
    } catch {
      // Ignora erros de localStorage
    }
  }, [])

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      // Independente do resultado, marca como tratado para não mostrar novamente
      dismissedRef.current = true
      setShowPrompt(false)
      setDeferredPrompt(null)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      // Se recusou, salva no localStorage para não perguntar tão cedo
      if (outcome === 'dismissed') {
        try {
          localStorage.setItem(DISMISSED_KEY, new Date().toISOString())
        } catch {
          // Ignora erros
        }
      }
    } catch {
      // Em caso de erro, apenas fecha o prompt
      handleDismiss()
    }
  }, [deferredPrompt, handleDismiss])

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="p-4 shadow-lg border-primary/20 bg-card">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm">
              Instalar Calcula MEI
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {isIOS
                ? 'Toque em "Compartilhar" e depois "Adicionar à Tela de Início"'
                : 'Acesse rapidamente direto da sua tela inicial'}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground p-1"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isIOS && deferredPrompt && (
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDismiss}
              className="flex-1"
            >
              Agora não
            </Button>
            <Button
              size="sm"
              onClick={handleInstall}
              className="flex-1"
            >
              Instalar
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
