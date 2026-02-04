import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { reengagementEmail } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Calcula MEI <noreply@calculamei.com.br>'

export async function GET(request: NextRequest) {
  // Verifica autorizacao
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

    // Busca usuarios inativos por 7+ dias que:
    // - Tem alertas de email ativos
    // - Nao receberam email de reengajamento recentemente (14 dias)
    // - Nao sao Premium (evita incomodar assinantes pagos)
    const inactiveUsers = await prisma.user.findMany({
      where: {
        alertasEmail: true,
        plano: 'FREE',
        lastActiveAt: {
          lt: sevenDaysAgo,
        },
        OR: [
          { reengagementSentAt: null },
          { reengagementSentAt: { lt: fourteenDaysAgo } },
        ],
      },
      take: 50, // Limita para nao sobrecarregar
    })

    const results = []

    for (const user of inactiveUsers) {
      try {
        const emailData = reengagementEmail(user.name || '')

        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
        })

        // Atualiza data de envio
        await prisma.user.update({
          where: { id: user.id },
          data: { reengagementSentAt: new Date() },
        })

        results.push({ email: user.email, success: true })
      } catch (error) {
        console.error(`Error sending to ${user.email}:`, error)
        results.push({ email: user.email, success: false })
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    })
  } catch (error) {
    console.error('Error in reengagement cron:', error)
    return NextResponse.json(
      { error: 'Failed to process reengagement emails' },
      { status: 500 }
    )
  }
}
