import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/auth/server'

export async function POST() {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const lastStreak = user.lastStreakDate ? new Date(user.lastStreakDate) : null
    if (lastStreak) {
      lastStreak.setHours(0, 0, 0, 0)
    }

    let newStreak = user.currentStreak || 0
    let longestStreak = user.longestStreak || 0

    if (!lastStreak) {
      // Primeiro acesso
      newStreak = 1
    } else {
      const diffDays = Math.floor((today.getTime() - lastStreak.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        // Mesmo dia, nao muda
        return NextResponse.json({
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
          updated: false,
        })
      } else if (diffDays === 1) {
        // Dia consecutivo
        newStreak += 1
      } else {
        // Quebrou a sequencia
        newStreak = 1
      }
    }

    // Atualiza maior sequencia
    if (newStreak > longestStreak) {
      longestStreak = newStreak
    }

    // Salva no banco
    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentStreak: newStreak,
        longestStreak,
        lastStreakDate: today,
        lastActiveAt: new Date(),
      },
    })

    return NextResponse.json({
      currentStreak: newStreak,
      longestStreak,
      updated: true,
    })
  } catch (error) {
    console.error('Error updating streak:', error)
    return NextResponse.json(
      { error: 'Failed to update streak' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      currentStreak: user.currentStreak || 0,
      longestStreak: user.longestStreak || 0,
      lastStreakDate: user.lastStreakDate,
    })
  } catch (error) {
    console.error('Error fetching streak:', error)
    return NextResponse.json(
      { error: 'Failed to fetch streak' },
      { status: 500 }
    )
  }
}
