import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  getAuthFromCookies,
  setAuthCookies,
  clearAuthCookies,
} from '@/lib/auth/session'
import {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} from '@/lib/auth/jwt'

export async function POST() {
  try {
    const { refreshToken } = await getAuthFromCookies()

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token não encontrado' },
        { status: 401 }
      )
    }

    // Verify refresh token
    const payload = await verifyToken(refreshToken)

    if (!payload || payload.type !== 'refresh') {
      await clearAuthCookies()
      return NextResponse.json(
        { error: 'Refresh token inválido' },
        { status: 401 }
      )
    }

    // Check if session exists in database
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) {
      await clearAuthCookies()
      return NextResponse.json(
        { error: 'Sessão expirada' },
        { status: 401 }
      )
    }

    // Generate new tokens
    const newAccessToken = await generateAccessToken(session.userId, session.user.email)
    const newRefreshToken = await generateRefreshToken(session.userId, session.user.email)

    // Update session in database
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: getRefreshTokenExpiry(),
      },
    })

    // Set new cookies
    await setAuthCookies(newAccessToken, newRefreshToken)

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    })
  } catch (error) {
    console.error('Refresh error:', error)
    await clearAuthCookies()
    return NextResponse.json(
      { error: 'Erro ao renovar sessão' },
      { status: 500 }
    )
  }
}
