'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      // Registra o Service Worker após o carregamento da página
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[SW] Registrado com sucesso:', registration.scope)

            // Verifica atualizações periodicamente
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Nova versão disponível
                    console.log('[SW] Nova versão disponível')
                  }
                })
              }
            })
          })
          .catch((error) => {
            console.error('[SW] Falha no registro:', error)
          })
      })
    }
  }, [])

  return null
}
