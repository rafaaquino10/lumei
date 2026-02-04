import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/auth/server'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  ocupacao: z.string().max(100).optional(),
  tipoMEI: z.enum(['COMERCIO', 'SERVICOS', 'MISTO', 'CAMINHONEIRO']).optional(),
  cnpj: z.string().max(18).optional(),
  faturamentoMedio: z.number().min(0).max(999999).optional(),
  temFuncionario: z.boolean().optional(),
})

// GET - Retorna perfil do usuário
export async function GET() {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      tipoMEI: user.tipoMEI,
      cnpj: user.cnpj,
      ocupacao: user.ocupacao,
      faturamentoMedio: user.faturamentoMedio,
      temFuncionario: user.temFuncionario,
      plano: user.plano,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// PATCH - Atualiza perfil do usuário
export async function PATCH(request: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const data = profileSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.ocupacao !== undefined && { ocupacao: data.ocupacao }),
        ...(data.tipoMEI !== undefined && { tipoMEI: data.tipoMEI }),
        ...(data.cnpj !== undefined && { cnpj: data.cnpj }),
        ...(data.faturamentoMedio !== undefined && { faturamentoMedio: data.faturamentoMedio }),
        ...(data.temFuncionario !== undefined && { temFuncionario: data.temFuncionario }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        tipoMEI: true,
        cnpj: true,
        ocupacao: true,
        faturamentoMedio: true,
        temFuncionario: true,
      },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.issues }, { status: 400 })
    }
    console.error('Erro ao atualizar perfil:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
