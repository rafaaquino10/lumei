import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/auth/server'

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type } = body

    if (!type) {
      return NextResponse.json(
        { error: 'Milestone type required' },
        { status: 400 }
      )
    }

    // Verifica se ja existe esse milestone para o usuario
    const existing = await prisma.userMilestone.findFirst({
      where: {
        userId: user.id,
        type,
      },
    })

    if (existing) {
      return NextResponse.json({ success: true, existing: true })
    }

    // Cria o milestone
    await prisma.userMilestone.create({
      data: {
        userId: user.id,
        type,
        celebratedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error recording milestone:', error)
    return NextResponse.json(
      { error: 'Failed to record milestone' },
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

    const milestones = await prisma.userMilestone.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ milestones })
  } catch (error) {
    console.error('Error fetching milestones:', error)
    return NextResponse.json(
      { error: 'Failed to fetch milestones' },
      { status: 500 }
    )
  }
}
