import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = await params

    // Verify calculation belongs to user
    const calculo = await prisma.calculo.findUnique({
      where: { id },
    })

    if (!calculo || calculo.userId !== user.id) {
      return NextResponse.json(
        { error: 'Calculation not found' },
        { status: 404 }
      )
    }

    // Delete
    await prisma.calculo.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting calculation:', error)
    return NextResponse.json(
      { error: 'Failed to delete calculation' },
      { status: 500 }
    )
  }
}
