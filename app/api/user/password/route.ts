import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/auth/server'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import { z } from 'zod'

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
})

// POST - Alterar senha
export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Usuários OAuth não podem alterar senha
    if (user.provider !== 'email') {
      return NextResponse.json(
        { error: 'Você fez login via Google. Não é possível alterar a senha.' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword } = passwordSchema.parse(body)

    // Buscar usuário com hash da senha
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    })

    if (!userWithPassword?.passwordHash) {
      return NextResponse.json({ error: 'Senha não configurada' }, { status: 400 })
    }

    // Verificar senha atual
    const isValid = await verifyPassword(currentPassword, userWithPassword.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 })
    }

    // Atualizar senha
    const newPasswordHash = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    })

    return NextResponse.json({ success: true, message: 'Senha alterada com sucesso' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.issues }, { status: 400 })
    }
    console.error('Erro ao alterar senha:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
