import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/auth/server'
import { z } from 'zod'

const registroSchema = z.object({
  mes: z.number().min(1).max(12),
  ano: z.number().min(2020).max(2100),
  valor: z.number().min(0),
  notas: z.string().optional(),
})

// GET - Lista registros de faturamento do usuário
export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const ano = searchParams.get('ano')
      ? parseInt(searchParams.get('ano')!)
      : new Date().getFullYear()

    const registros = await prisma.registroFaturamento.findMany({
      where: {
        userId: user.id,
        ano,
      },
      orderBy: { mes: 'asc' },
    })

    // Calcular métricas
    const totalAcumulado = registros.reduce((sum, r) => sum + r.valor, 0)
    const mesesComRegistro = registros.length
    const mediaMovel = mesesComRegistro > 0 ? totalAcumulado / mesesComRegistro : 0
    const projecaoAnual = mediaMovel * 12

    const LIMITE_MEI = 81000
    const percentualLimite = (totalAcumulado / LIMITE_MEI) * 100
    const valorRestante = LIMITE_MEI - totalAcumulado
    const mesesAteEstourar = mediaMovel > 0 ? Math.floor(valorRestante / mediaMovel) : 999

    return NextResponse.json({
      registros,
      metricas: {
        totalAcumulado,
        mesesComRegistro,
        mediaMovel,
        projecaoAnual,
        percentualLimite,
        valorRestante,
        mesesAteEstourar,
        limiteMEI: LIMITE_MEI,
        ano,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar faturamento:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST - Registra/atualiza faturamento de um mês
export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const data = registroSchema.parse(body)

    // Upsert - cria ou atualiza registro do mês
    const registro = await prisma.registroFaturamento.upsert({
      where: {
        userId_mes_ano: {
          userId: user.id,
          mes: data.mes,
          ano: data.ano,
        },
      },
      update: {
        valor: data.valor,
        notas: data.notas,
      },
      create: {
        userId: user.id,
        mes: data.mes,
        ano: data.ano,
        valor: data.valor,
        notas: data.notas,
      },
    })

    // Revalidar dashboard para mostrar dados atualizados
    revalidatePath('/dashboard')
    revalidatePath('/registrar')

    return NextResponse.json({ success: true, registro })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.issues }, { status: 400 })
    }
    console.error('Erro ao registrar faturamento:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// DELETE - Remove registro de um mês
export async function DELETE(request: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const mes = parseInt(searchParams.get('mes') || '0')
    const ano = parseInt(searchParams.get('ano') || '0')

    if (!mes || !ano) {
      return NextResponse.json({ error: 'Mês e ano são obrigatórios' }, { status: 400 })
    }

    await prisma.registroFaturamento.delete({
      where: {
        userId_mes_ano: {
          userId: user.id,
          mes,
          ano,
        },
      },
    })

    // Revalidar dashboard
    revalidatePath('/dashboard')
    revalidatePath('/registrar')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar registro:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
