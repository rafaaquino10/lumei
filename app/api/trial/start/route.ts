import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/auth/server'

export async function POST() {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verifica se ja usou trial
    if (user.trialUsed) {
      return NextResponse.json(
        { error: 'Voce ja utilizou seu periodo de teste' },
        { status: 400 }
      )
    }

    // Verifica se ja e Premium
    if (user.plano === 'PREMIUM') {
      return NextResponse.json(
        { error: 'Voce ja e um usuario Premium' },
        { status: 400 }
      )
    }

    // Verifica se ja tem trial ativo
    if (user.trialEndsAt && new Date(user.trialEndsAt) > new Date()) {
      return NextResponse.json(
        { error: 'Voce ja tem um periodo de teste ativo' },
        { status: 400 }
      )
    }

    // Inicia o trial de 7 dias
    const now = new Date()
    const trialEnd = new Date(now)
    trialEnd.setDate(trialEnd.getDate() + 7)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        trialStartedAt: now,
        trialEndsAt: trialEnd,
        trialUsed: true,
        plano: 'PREMIUM', // Durante o trial, usuario tem acesso Premium
      },
    })

    return NextResponse.json({
      success: true,
      trialEndsAt: trialEnd.toISOString(),
      message: 'Trial de 7 dias ativado com sucesso!',
    })
  } catch (error) {
    console.error('Error starting trial:', error)
    return NextResponse.json(
      { error: 'Erro ao iniciar o periodo de teste' },
      { status: 500 }
    )
  }
}
