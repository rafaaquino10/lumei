import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/auth/server'
import { z } from 'zod'

const alertsSchema = z.object({
  alertasEmail: z.boolean().optional(),
  alertasWhatsApp: z.boolean().optional(),
  whatsapp: z.string().max(20).optional().nullable(),
})

// GET - Retorna configurações de alertas
export async function GET() {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar alertas configurados
    const alertas = await prisma.alerta.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        tipo: true,
        ativo: true,
        diasAntecedencia: true,
      },
    })

    return NextResponse.json({
      alertasEmail: user.alertasEmail,
      alertasWhatsApp: user.alertasWhatsApp,
      whatsapp: user.whatsapp,
      plano: user.plano,
      alertas,
    })
  } catch (error) {
    console.error('Erro ao buscar alertas:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// PATCH - Atualiza configurações de alertas
export async function PATCH(request: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const data = alertsSchema.parse(body)

    // WhatsApp só disponível para Premium
    if (data.alertasWhatsApp && user.plano !== 'PREMIUM') {
      return NextResponse.json(
        { error: 'Alertas WhatsApp disponíveis apenas no plano Premium' },
        { status: 403 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(data.alertasEmail !== undefined && { alertasEmail: data.alertasEmail }),
        ...(data.alertasWhatsApp !== undefined && { alertasWhatsApp: data.alertasWhatsApp }),
        ...(data.whatsapp !== undefined && { whatsapp: data.whatsapp }),
      },
      select: {
        alertasEmail: true,
        alertasWhatsApp: true,
        whatsapp: true,
      },
    })

    // Criar alerta de DAS se não existir
    const dasAlert = await prisma.alerta.findFirst({
      where: {
        userId: user.id,
        tipo: 'DAS_VENCIMENTO',
      },
    })

    if (!dasAlert && (data.alertasEmail || data.alertasWhatsApp)) {
      await prisma.alerta.create({
        data: {
          userId: user.id,
          tipo: 'DAS_VENCIMENTO',
          ativo: true,
          diasAntecedencia: 5,
        },
      })
    }

    return NextResponse.json({ success: true, ...updatedUser })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.issues }, { status: 400 })
    }
    console.error('Erro ao atualizar alertas:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
