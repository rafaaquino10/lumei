import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/auth/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Busca todas as sessoes do usuario
    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
        expiresAt: { gt: new Date() }, // Apenas sessoes validas
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        createdAt: true,
        expiresAt: true,
        refreshToken: true,
      },
    })

    // Identifica a sessao atual
    const cookieStore = await cookies()
    const currentRefreshToken = cookieStore.get('refresh_token')?.value

    const sessionsWithCurrent = sessions.map(session => ({
      id: session.id,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      isCurrent: session.refreshToken === currentRefreshToken,
      device: parseUserAgent(session.userAgent || ''),
    }))

    return NextResponse.json({ sessions: sessionsWithCurrent })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId, all } = body

    if (all) {
      // Encerra todas as sessoes exceto a atual
      const cookieStore = await cookies()
      const currentRefreshToken = cookieStore.get('refresh_token')?.value

      await prisma.session.deleteMany({
        where: {
          userId: user.id,
          refreshToken: { not: currentRefreshToken },
        },
      })

      return NextResponse.json({ success: true, message: 'Todas as outras sessoes foram encerradas' })
    }

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Verifica se a sessao pertence ao usuario
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Nao permite encerrar a sessao atual
    const cookieStore = await cookies()
    const currentRefreshToken = cookieStore.get('refresh_token')?.value

    if (session.refreshToken === currentRefreshToken) {
      return NextResponse.json(
        { error: 'Nao e possivel encerrar a sessao atual' },
        { status: 400 }
      )
    }

    await prisma.session.delete({
      where: { id: sessionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    )
  }
}

// Helper para parsear user agent
function parseUserAgent(ua: string): { browser: string; os: string; device: string } {
  let browser = 'Navegador desconhecido'
  let os = 'Sistema desconhecido'
  let device = 'desktop'

  // Browser detection
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
  else if (ua.includes('Edg')) browser = 'Edge'
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera'

  // OS detection
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac OS')) os = 'macOS'
  else if (ua.includes('Linux') && !ua.includes('Android')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

  // Device detection
  if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) {
    device = 'mobile'
  } else if (ua.includes('iPad') || ua.includes('Tablet')) {
    device = 'tablet'
  }

  return { browser, os, device }
}
