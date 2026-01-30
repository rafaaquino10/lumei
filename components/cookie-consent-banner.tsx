'use client'

import CookieConsent from 'react-cookie-consent'

export function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Aceitar"
      declineButtonText="Recusar"
      cookieName="calculamei_cookie_consent"
      style={{ background: '#f3f4f6', color: '#1f2937' }}
      buttonStyle={{ background: '#6366f1', color: '#fff' }}
      declineButtonStyle={{ background: '#e5e7eb', color: '#1f2937' }}
      expires={365}
      enableDeclineButton={true}
    >
      Usamos cookies para melhorar sua experiência e analisar o uso do site.
    </CookieConsent>
  )
}
