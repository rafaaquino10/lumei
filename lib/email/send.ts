/**
 * Serviço de envio de emails
 * Suporta Resend como provedor principal
 */

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Envia um email usando Resend ou fallback para console em dev
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const { to, subject, html, text } = options

  // Em desenvolvimento sem RESEND_API_KEY, apenas loga
  if (!process.env.RESEND_API_KEY) {
    console.log('📧 [DEV] Email que seria enviado:')
    console.log(`  Para: ${to}`)
    console.log(`  Assunto: ${subject}`)
    console.log(`  Conteúdo: ${text || html.substring(0, 200)}...`)
    return { success: true, messageId: 'dev-mock-id' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'Calcula MEI <noreply@calculamei.com.br>',
        to: [to],
        subject,
        html,
        text,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Erro ao enviar email:', error)
      return { success: false, error }
    }

    const data = await response.json()
    return { success: true, messageId: data.id }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}
