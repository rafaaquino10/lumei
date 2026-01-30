import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { LIMITS } from '@/lib/config/constants'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const used = await prisma.calculo.count({
      where: { userId: user.id },
    })

    const limit = user.plano === 'PREMIUM'
      ? LIMITS.PREMIUM.MAX_CALCULATIONS
      : LIMITS.FREE.MAX_CALCULATIONS

    const percentage = limit === -1 ? 0 : (used / limit) * 100

    return NextResponse.json({
      used,
      limit: limit === -1 ? null : limit,
      percentage,
    })
  } catch (error) {
    console.error('Error fetching usage:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
