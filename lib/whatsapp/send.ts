/**
 * Serviço de envio de mensagens WhatsApp
 * Suporta Twilio como provedor principal
 *
 * Variáveis de ambiente necessárias:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_WHATSAPP_NUMBER (formato: whatsapp:+14155238886)
 */

interface WhatsAppMessageOptions {
  to: string // Número do destinatário (formato: +5511999999999)
  message: string
}

interface WhatsAppResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Formata número de telefone para formato WhatsApp
 * Aceita: 11999999999, (11) 99999-9999, +5511999999999
 * Retorna: whatsapp:+5511999999999
 */
export function formatWhatsAppNumber(phone: string): string {
  // Remove tudo exceto números
  const numbers = phone.replace(/\D/g, '')

  // Se já tem código do país (55), usa direto
  if (numbers.startsWith('55') && numbers.length >= 12) {
    return `whatsapp:+${numbers}`
  }

  // Adiciona código do Brasil
  return `whatsapp:+55${numbers}`
}

/**
 * Envia mensagem WhatsApp usando Twilio
 */
export async function sendWhatsApp(options: WhatsAppMessageOptions): Promise<WhatsAppResult> {
  const { to, message } = options

  // Em desenvolvimento sem credenciais, apenas loga
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log('📱 [DEV] WhatsApp que seria enviado:')
    console.log(`  Para: ${to}`)
    console.log(`  Mensagem: ${message.substring(0, 100)}...`)
    return { success: true, messageId: 'dev-mock-id' }
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'

  try {
    const toFormatted = formatWhatsAppNumber(to)

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: toFormatted,
          Body: message,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Erro ao enviar WhatsApp:', error)
      return { success: false, error }
    }

    const data = await response.json()
    return { success: true, messageId: data.sid }
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

/**
 * Template de mensagem para alerta DAS
 */
export function getDasWhatsAppMessage(params: {
  userName: string
  diasRestantes: number
  dataVencimento: string
  valorDas: string
}): string {
  const { userName, diasRestantes, dataVencimento, valorDas } = params

  const urgencyEmoji = diasRestantes <= 1 ? '🚨' : diasRestantes <= 3 ? '⚠️' : '📅'
  const urgencyText =
    diasRestantes === 0
      ? 'VENCE HOJE!'
      : diasRestantes === 1
        ? 'Vence AMANHÃ!'
        : `Faltam ${diasRestantes} dias`

  return `${urgencyEmoji} *Lembrete DAS - Calcula MEI*

Olá, ${userName || 'MEI'}!

${urgencyText}

📆 *Vencimento:* ${dataVencimento}
💰 *Valor:* ${valorDas}

Acesse o portal para gerar sua guia:
https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao

✅ Pagar em dia evita multas e garante seus benefícios do INSS.

---
_Calcula MEI_
calculamei.com.br`
}
