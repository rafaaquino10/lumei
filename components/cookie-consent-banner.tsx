'use client'

import CookieConsent from 'react-cookie-consent'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function CookieConsentBanner() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Evita flash durante hidratação
  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  return (
    <CookieConsent
      location="bottom"
      buttonText="Aceitar"
      declineButtonText="Recusar"
      cookieName="calculamei_cookie_consent"
      style={{
        background: isDark ? '#1f2937' : '#f3f4f6',
        color: isDark ? '#f9fafb' : '#1f2937',
        borderTop: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
      }}
      buttonStyle={{
        background: '#6366f1',
        color: '#fff',
        borderRadius: '6px',
        padding: '8px 16px',
        fontWeight: 500,
      }}
      declineButtonStyle={{
        background: isDark ? '#374151' : '#e5e7eb',
        color: isDark ? '#f9fafb' : '#1f2937',
        borderRadius: '6px',
        padding: '8px 16px',
        fontWeight: 500,
      }}
      expires={365}
      enableDeclineButton={true}
    >
      Usamos cookies para melhorar sua experiência e analisar o uso do site.
    </CookieConsent>
  )
}
