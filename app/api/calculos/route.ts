import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

const schema = z.object({
  tipo: z.enum([
    'MARGEM_LUCRO',
    'PRECO_HORA',
    'PRECIFICACAO',
    'FATURAMENTO',
    'FLUXO_CAIXA',
    'CALENDARIO_DAS',
  ]),
  inputs: z.any(),
  resultado: z.any(),
  titulo: z.string().optional(),
  descricao: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'not_authenticated',
          message: 'Faça login para salvar seus cálculos',
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = schema.parse(body)

    // Find user in database
    let user
    try {
      user = await prisma.user.findUnique({
        where: { clerkId: userId },
      })
    } catch (error) {
      console.error('Database connection error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'database_error',
          message: 'Erro de conexão com o banco de dados. Tente novamente.',
        },
        { status: 503 }
      )
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'user_not_found',
          message: 'Complete seu cadastro primeiro',
        },
        { status: 404 }
      )
    }

    // Check plan limits
    if (user.plano === 'FREE') {
      const calculosCount = await prisma.calculo.count({
        where: { userId: user.id },
      })

      if (calculosCount >= 50) {
        return NextResponse.json(
          {
            success: false,
            error: 'limit_reached',
            message: 'Você atingiu o limite de 50 cálculos do plano gratuito. Faça upgrade para Premium!',
          },
          { status: 403 }
        )
      }
    }

    // Save calculation
    const calculo = await prisma.calculo.create({
      data: {
        userId: user.id,
        tipo: data.tipo,
        inputs: data.inputs,
        resultado: data.resultado,
        titulo: data.titulo,
        descricao: data.descricao,
      },
    })

    return NextResponse.json({
      success: true,
      calculo,
      message: 'Cálculo salvo com sucesso!',
    })
  } catch (error) {
    console.error('Error saving calculation:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'validation_error', message: 'Dados inválidos' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'server_error', message: 'Erro ao salvar cálculo' },
      { status: 500 }
    )
  }
}
