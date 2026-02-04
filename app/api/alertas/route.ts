import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/auth/server'
import { z } from 'zod'

const createAlertSchema = z.object({
  tipo: z.enum(['DAS_VENCIMENTO', 'FATURAMENTO_LIMITE', 'ANUAL_DECLARACAO']),
  diasAntecedencia: z.number().min(1).max(30).default(7),
})

// GET - Lista alertas do usuario
export async function GET() {
  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'not_authenticated' },
        { status: 401 }
      )
    }

    const alertas = await prisma.alerta.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      alertas,
      config: {
        alertasEmail: user.alertasEmail,
        alertasWhatsApp: user.alertasWhatsApp,
        whatsapp: user.whatsapp,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar alertas:', error)
    return NextResponse.json(
      { success: false, error: 'server_error' },
      { status: 500 }
    )
  }
}

// POST - Cria novo alerta
export async function POST(request: Request) {
  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'not_authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = createAlertSchema.parse(body)

    // Verifica limite de alertas para FREE
    if (user.plano === 'FREE') {
      const existingAlerts = await prisma.alerta.count({
        where: { userId: user.id, tipo: 'DAS_VENCIMENTO' },
      })

      if (existingAlerts >= 1 && data.tipo === 'DAS_VENCIMENTO') {
        return NextResponse.json(
          {
            success: false,
            error: 'limit_reached',
            message: 'Plano FREE permite apenas 1 alerta de DAS. Faça upgrade para Premium!',
          },
          { status: 403 }
        )
      }
    }

    // Verifica se ja existe alerta do mesmo tipo
    const existingAlert = await prisma.alerta.findFirst({
      where: {
        userId: user.id,
        tipo: data.tipo,
        ativo: true,
      },
    })

    if (existingAlert) {
      // Atualiza o existente
      const updated = await prisma.alerta.update({
        where: { id: existingAlert.id },
        data: { diasAntecedencia: data.diasAntecedencia },
      })

      return NextResponse.json({
        success: true,
        alerta: updated,
        message: 'Alerta atualizado com sucesso!',
      })
    }

    // Cria novo alerta
    const alerta = await prisma.alerta.create({
      data: {
        userId: user.id,
        tipo: data.tipo,
        diasAntecedencia: data.diasAntecedencia,
        ativo: true,
      },
    })

    return NextResponse.json({
      success: true,
      alerta,
      message: 'Alerta criado com sucesso!',
    })
  } catch (error) {
    console.error('Erro ao criar alerta:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'validation_error', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'server_error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove alerta
export async function DELETE(request: Request) {
  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'not_authenticated' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const alertaId = searchParams.get('id')

    if (!alertaId) {
      return NextResponse.json(
        { success: false, error: 'missing_id' },
        { status: 400 }
      )
    }

    // Verifica se o alerta pertence ao usuario
    const alerta = await prisma.alerta.findFirst({
      where: { id: alertaId, userId: user.id },
    })

    if (!alerta) {
      return NextResponse.json(
        { success: false, error: 'not_found' },
        { status: 404 }
      )
    }

    await prisma.alerta.delete({
      where: { id: alertaId },
    })

    return NextResponse.json({
      success: true,
      message: 'Alerta removido com sucesso!',
    })
  } catch (error) {
    console.error('Erro ao remover alerta:', error)
    return NextResponse.json(
      { success: false, error: 'server_error' },
      { status: 500 }
    )
  }
}
