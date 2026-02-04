import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Este endpoint deve ser chamado por um cron job diariamente
// Vercel Cron ou servico externo

export async function GET(request: NextRequest) {
  // Verifica autorizacao
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()

    // Busca usuarios com trial expirado que ainda estao como PREMIUM
    // (nao tem stripeSubscriptionId = nao sao assinantes pagos)
    const expiredTrials = await prisma.user.findMany({
      where: {
        trialEndsAt: {
          lt: now,
        },
        plano: 'PREMIUM',
        stripeSubscriptionId: null, // Nao tem assinatura paga
      },
      select: {
        id: true,
        email: true,
        name: true,
        trialEndsAt: true,
      },
    })

    // Reverte para FREE
    if (expiredTrials.length > 0) {
      await prisma.user.updateMany({
        where: {
          id: {
            in: expiredTrials.map(u => u.id),
          },
        },
        data: {
          plano: 'FREE',
        },
      })

      console.log(`Reverted ${expiredTrials.length} users from trial to FREE`)

      // Aqui poderia enviar email notificando fim do trial
      // TODO: Implementar envio de email
    }

    return NextResponse.json({
      success: true,
      processed: expiredTrials.length,
      users: expiredTrials.map(u => ({
        id: u.id,
        email: u.email,
        trialEndedAt: u.trialEndsAt,
      })),
    })
  } catch (error) {
    console.error('Error checking trials:', error)
    return NextResponse.json(
      { error: 'Failed to check trials' },
      { status: 500 }
    )
  }
}
