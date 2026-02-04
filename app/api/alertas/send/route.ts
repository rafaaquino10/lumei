import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email/send'
import { getDasAlertEmailHtml, getDasAlertEmailText } from '@/lib/email/templates/das-alert'
import { getDasValueByType } from '@/lib/calculos/das'
import { sendWhatsApp, getDasWhatsAppMessage } from '@/lib/whatsapp/send'

/**
 * API Route para processar e enviar alertas de DAS
 * Deve ser chamada por um cron job (ex: Vercel Cron, GitHub Actions)
 *
 * Protegida por CRON_SECRET
 */
export async function POST(request: Request) {
  try {
    // Verifica autorizacao do cron
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'unauthorized' },
        { status: 401 }
      )
    }

    // Calcula a proxima data de vencimento do DAS (dia 20 do mes)
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()
    const currentDay = today.getDate()

    let nextDueDate: Date

    if (currentDay <= 20) {
      // Vencimento e neste mes
      nextDueDate = new Date(currentYear, currentMonth, 20)
    } else {
      // Vencimento e no proximo mes
      nextDueDate = new Date(currentYear, currentMonth + 1, 20)
    }

    // Calcula dias ate o vencimento
    const diasAteVencimento = Math.ceil(
      (nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    // Define os dias de alerta por plano
    const ALERT_DAYS_FREE = [5] // Free: apenas 5 dias antes
    const ALERT_DAYS_PREMIUM = [5, 3, 1] // Premium: 5, 3 e 1 dia antes

    // Busca usuarios com alertas ativos
    const alertas = await prisma.alerta.findMany({
      where: {
        tipo: 'DAS_VENCIMENTO',
        ativo: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            tipoMEI: true,
            alertasEmail: true,
            alertasWhatsApp: true,
            whatsapp: true,
            plano: true,
          },
        },
      },
    })

    // Filtra alertas que devem ser enviados hoje
    const alertasParaEnviar = alertas.filter(alerta => {
      const alertDays = alerta.user.plano === 'PREMIUM' ? ALERT_DAYS_PREMIUM : ALERT_DAYS_FREE

      // Verifica se hoje e um dos dias de alerta
      if (!alertDays.includes(diasAteVencimento)) {
        return false
      }

      // Verifica se ja enviou hoje
      if (alerta.ultimoEnvio) {
        const lastSendDate = new Date(alerta.ultimoEnvio)
        const isSameDay = lastSendDate.toDateString() === today.toDateString()
        if (isSameDay) {
          return false
        }
      }

      return true
    })

    const results = {
      total: alertasParaEnviar.length,
      sent: 0,
      skipped: 0,
      errors: 0,
      whatsappSent: 0,
      whatsappErrors: 0,
      details: [] as { userId: string; status: string; channels: string[]; error?: string }[],
    }

    for (const alerta of alertasParaEnviar) {
      const { user } = alerta
      const channels: string[] = []

      // Pula se todos os canais estao desativados
      if (!user.alertasEmail && !user.alertasWhatsApp) {
        results.skipped++
        results.details.push({ userId: user.id, status: 'skipped_disabled', channels: [] })
        continue
      }

      try {
        // Formata data de vencimento
        const dataVencimento = nextDueDate.toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })

        // Obtem valor do DAS baseado no tipo do MEI
        const tipoMeiMap: Record<string, string> = {
          COMERCIO: 'Comercio',
          SERVICOS: 'Servicos',
          MISTO: 'Comercio e Servicos',
          CAMINHONEIRO: 'Caminhoneiro',
        }

        const tipoMei = user.tipoMEI ? tipoMeiMap[user.tipoMEI] || 'MEI' : 'MEI'
        const dasValue = user.tipoMEI
          ? getDasValueByType(user.tipoMEI)
          : getDasValueByType('MISTO')

        const valorDas = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(dasValue.total)

        let emailSuccess = false
        let whatsappSuccess = false

        // Envia email se habilitado
        if (user.alertasEmail) {
          const emailResult = await sendEmail({
            to: user.email,
            subject: diasAteVencimento <= 1
              ? `URGENTE: Seu DAS vence ${diasAteVencimento === 0 ? 'HOJE' : 'AMANHA'}!`
              : `Lembrete: Seu DAS vence em ${diasAteVencimento} dias`,
            html: getDasAlertEmailHtml({
              userName: user.name || '',
              diasRestantes: diasAteVencimento,
              dataVencimento,
              valorDas,
              tipoMei,
            }),
            text: getDasAlertEmailText({
              userName: user.name || '',
              diasRestantes: diasAteVencimento,
              dataVencimento,
              valorDas,
              tipoMei,
            }),
          })

          if (emailResult.success) {
            emailSuccess = true
            channels.push('email')
            results.sent++
          } else {
            results.errors++
          }
        }

        // Envia WhatsApp se habilitado (somente Premium)
        if (user.alertasWhatsApp && user.whatsapp && user.plano === 'PREMIUM') {
          const whatsappResult = await sendWhatsApp({
            to: user.whatsapp,
            message: getDasWhatsAppMessage({
              userName: user.name || '',
              diasRestantes: diasAteVencimento,
              dataVencimento,
              valorDas,
            }),
          })

          if (whatsappResult.success) {
            whatsappSuccess = true
            channels.push('whatsapp')
            results.whatsappSent++
          } else {
            results.whatsappErrors++
          }
        }

        // Atualiza ultimo envio se algum canal foi bem sucedido
        if (emailSuccess || whatsappSuccess) {
          await prisma.alerta.update({
            where: { id: alerta.id },
            data: { ultimoEnvio: new Date() },
          })

          results.details.push({ userId: user.id, status: 'sent', channels })
        } else {
          results.details.push({
            userId: user.id,
            status: 'error',
            channels: [],
            error: 'Falha em todos os canais',
          })
        }
      } catch (error) {
        results.errors++
        results.details.push({
          userId: user.id,
          status: 'error',
          channels: [],
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    console.log(`[Alertas DAS] Processados: ${results.total}, Email: ${results.sent}, WhatsApp: ${results.whatsappSent}, Erros: ${results.errors + results.whatsappErrors}`)

    return NextResponse.json({
      success: true,
      results,
      nextDueDate: nextDueDate.toISOString(),
      diasAteVencimento,
    })
  } catch (error) {
    console.error('Erro ao processar alertas:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'server_error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// GET para verificar status (debug)
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, error: 'unauthorized' },
      { status: 401 }
    )
  }

  const today = new Date()
  const currentDay = today.getDate()

  let nextDueDate: Date
  if (currentDay <= 20) {
    nextDueDate = new Date(today.getFullYear(), today.getMonth(), 20)
  } else {
    nextDueDate = new Date(today.getFullYear(), today.getMonth() + 1, 20)
  }

  const diasAteVencimento = Math.ceil(
    (nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  const alertasAtivos = await prisma.alerta.count({
    where: { tipo: 'DAS_VENCIMENTO', ativo: true },
  })

  return NextResponse.json({
    success: true,
    status: 'ok',
    nextDueDate: nextDueDate.toISOString(),
    diasAteVencimento,
    alertasAtivos,
    timestamp: today.toISOString(),
  })
}
