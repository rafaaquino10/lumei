'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''

export function PushPermissionPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)

  useEffect(() => {
    // Verifica se ja foi mostrado ou se ja tem permissao
    const hasSeenPrompt = localStorage.getItem('push-prompt-seen')
    const hasPermission = Notification.permission === 'granted'
    const isDenied = Notification.permission === 'denied'

    // So mostra se: suporta notificacoes, nao viu ainda, nao tem permissao, nao negou
    if (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      !hasSeenPrompt &&
      !hasPermission &&
      !isDenied &&
      VAPID_PUBLIC_KEY
    ) {
      // Delay para nao ser intrusivo
      const timer = setTimeout(() => setShowPrompt(true), 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  const requestPermission = async () => {
    setIsSubscribing(true)

    try {
      const permission = await Notification.requestPermission()

      if (permission === 'granted') {
        // Registra no service worker
        const registration = await navigator.serviceWorker.ready

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
        })

        // Envia para o backend
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
            keys: {
              p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
              auth: arrayBufferToBase64(subscription.getKey('auth')),
            },
          }),
        })
      }
    } catch (error) {
      console.error('Error subscribing to push:', error)
    } finally {
      setIsSubscribing(false)
      localStorage.setItem('push-prompt-seen', 'true')
      setShowPrompt(false)
    }
  }

  const dismiss = () => {
    localStorage.setItem('push-prompt-seen', 'true')
    setShowPrompt(false)
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm"
        >
          <Card className="p-4 shadow-lg border-primary/20">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  Ativar notificacoes?
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Receba lembretes de DAS e alertas importantes diretamente no seu dispositivo.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={requestPermission}
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? 'Ativando...' : 'Ativar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={dismiss}
                  >
                    Agora nao
                  </Button>
                </div>
              </div>
              <button
                onClick={dismiss}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Helpers
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return ''
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}
