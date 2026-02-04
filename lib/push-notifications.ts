import webpush from 'web-push'

// Configurar VAPID keys (gere suas proprias em producao)
// Gerar: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ''
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:contato@calculamei.com.br'

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
}

export interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: {
    url?: string
    [key: string]: unknown
  }
  actions?: Array<{
    action: string
    title: string
  }>
  requireInteraction?: boolean
}

export interface PushSubscriptionData {
  endpoint: string
  p256dh: string
  auth: string
}

export async function sendPushNotification(
  subscription: PushSubscriptionData,
  payload: PushNotificationPayload
): Promise<boolean> {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warn('VAPID keys not configured, skipping push notification')
    return false
  }

  try {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    }

    await webpush.sendNotification(
      pushSubscription,
      JSON.stringify(payload),
      {
        TTL: 60 * 60 * 24, // 24 hours
        urgency: 'normal',
      }
    )

    return true
  } catch (error: unknown) {
    const webPushError = error as { statusCode?: number }
    // Se o subscription expirou (410 Gone), retorna false para remover
    if (webPushError.statusCode === 410) {
      console.log('Push subscription expired:', subscription.endpoint)
      return false
    }
    console.error('Error sending push notification:', error)
    throw error
  }
}

// Tipos de notificacoes pre-definidas
export const NotificationTemplates = {
  dasReminder: (diasRestantes: number, valor: number): PushNotificationPayload => ({
    title: 'Lembrete: DAS vence em breve!',
    body: `Seu DAS de R$ ${valor.toFixed(2)} vence em ${diasRestantes} dia${diasRestantes > 1 ? 's' : ''}. Nao esqueca de pagar!`,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'das-reminder',
    data: { url: '/dashboard' },
    actions: [
      { action: 'open', title: 'Ver DAS' },
      { action: 'close', title: 'Fechar' },
    ],
    requireInteraction: true,
  }),

  registrationReminder: (mes: string): PushNotificationPayload => ({
    title: 'Registre seu faturamento!',
    body: `Voce ainda nao registrou o faturamento de ${mes}. Mantenha seu controle em dia!`,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'registration-reminder',
    data: { url: '/registrar' },
    actions: [
      { action: 'open', title: 'Registrar' },
      { action: 'close', title: 'Depois' },
    ],
  }),

  limitWarning: (percentual: number): PushNotificationPayload => ({
    title: 'Atencao ao limite MEI!',
    body: `Voce ja utilizou ${percentual.toFixed(0)}% do limite anual de R$ 81.000. Fique atento!`,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'limit-warning',
    data: { url: '/dashboard' },
    actions: [
      { action: 'open', title: 'Ver Dashboard' },
    ],
    requireInteraction: true,
  }),

  badgeUnlocked: (badgeName: string): PushNotificationPayload => ({
    title: 'Nova conquista desbloqueada!',
    body: `Parabens! Voce conquistou "${badgeName}". Continue assim!`,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'badge-unlocked',
    data: { url: '/dashboard/conquistas' },
  }),

  streakReminder: (dias: number): PushNotificationPayload => ({
    title: 'Mantenha sua sequencia!',
    body: `Voce esta com ${dias} dias de sequencia. Nao perca o ritmo!`,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'streak-reminder',
    data: { url: '/dashboard' },
  }),

  trialEnding: (diasRestantes: number): PushNotificationPayload => ({
    title: 'Seu trial Premium termina em breve!',
    body: `Faltam ${diasRestantes} dia${diasRestantes > 1 ? 's' : ''} para o fim do seu periodo de teste. Assine agora e nao perca os beneficios!`,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'trial-ending',
    data: { url: '/premium' },
    actions: [
      { action: 'open', title: 'Ver Planos' },
    ],
    requireInteraction: true,
  }),
}
