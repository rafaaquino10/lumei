import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/auth/server'
import { BADGES } from '@/lib/badges'

export async function GET() {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Busca badges do usuario
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: user.id },
      include: { badge: true },
    })

    // Mapeia badges desbloqueados
    const unlockedSlugs = new Set(userBadges.map(ub => ub.badge.slug))

    // Retorna todos os badges com status de desbloqueio
    const badges = BADGES.map(badge => ({
      ...badge,
      unlocked: unlockedSlugs.has(badge.slug),
      unlockedAt: userBadges.find(ub => ub.badge.slug === badge.slug)?.unlockedAt,
    }))

    // Calcula pontos totais
    const totalPoints = userBadges.reduce((sum, ub) => {
      const badge = BADGES.find(b => b.slug === ub.badge.slug)
      return sum + (badge?.points || 0)
    }, 0)

    return NextResponse.json({
      badges,
      totalPoints,
      unlockedCount: userBadges.length,
      totalCount: BADGES.length,
    })
  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch badges' },
      { status: 500 }
    )
  }
}
