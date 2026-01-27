import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  tipoMEI: z.enum(['COMERCIO', 'SERVICOS', 'MISTO', 'CAMINHONEIRO']),
  cnpj: z.string().optional(),
  ocupacao: z.string().min(1, 'Ocupação é obrigatória'),
  temFuncionario: z.boolean(),
  faturamentoMedio: z.number().min(0),
})

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = schema.parse(body)

    // Find user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user with onboarding data
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        tipoMEI: data.tipoMEI,
        cnpj: data.cnpj || null,
        ocupacao: data.ocupacao,
        temFuncionario: data.temFuncionario,
        faturamentoMedio: data.faturamentoMedio,
      },
    })

    return NextResponse.json({ 
      success: true, 
      user: {
        id: updatedUser.id,
        tipoMEI: updatedUser.tipoMEI,
        ocupacao: updatedUser.ocupacao,
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
