import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/auth/server'
import { verifyPassword } from '@/lib/auth/password'
import { z } from 'zod'
import { cookies } from 'next/headers'

const deleteSchema = z.object({
  password: z.string().optional(),
  confirmation: z.literal('EXCLUIR MINHA CONTA'),
})

// DELETE - Excluir conta do usuário
export async function DELETE(request: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { password, confirmation } = deleteSchema.parse(body)

    // Verificar confirmação
    if (confirmation !== 'EXCLUIR MINHA CONTA') {
      return NextResponse.json(
        { error: 'Confirmação inválida. Digite "EXCLUIR MINHA CONTA" para confirmar.' },
        { status: 400 }
      )
    }

    // Se usuário tem senha (não é OAuth), verificar senha
    if (user.provider === 'email' && password) {
      const userWithPassword = await prisma.user.findUnique({
        where: { id: user.id },
        select: { passwordHash: true },
      })

      if (userWithPassword?.passwordHash) {
        const isValid = await verifyPassword(password, userWithPassword.passwordHash)
        if (!isValid) {
          return NextResponse.json({ error: 'Senha incorreta' }, { status: 400 })
        }
      }
    }

    // Cancelar assinatura Stripe se existir
    if (user.stripeSubscriptionId) {
      try {
        const stripe = (await import('@/lib/billing/stripe')).stripe
        if (stripe) {
          await stripe.subscriptions.cancel(user.stripeSubscriptionId)
        }
      } catch (stripeError) {
        console.error('Erro ao cancelar assinatura:', stripeError)
        // Continua com a exclusão mesmo se falhar
      }
    }

    // Excluir usuário (cascade delete cuida do resto)
    await prisma.user.delete({
      where: { id: user.id },
    })

    // Limpar cookies de autenticação
    const cookieStore = await cookies()
    cookieStore.delete('auth_token')
    cookieStore.delete('refresh_token')

    return NextResponse.json({
      success: true,
      message: 'Conta excluída com sucesso. Sentiremos sua falta!',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.issues }, { status: 400 })
    }
    console.error('Erro ao excluir conta:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
