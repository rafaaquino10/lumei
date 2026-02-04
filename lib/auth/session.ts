import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyToken, generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from './jwt'

const ACCESS_TOKEN_COOKIE = 'access_token'
const REFRESH_TOKEN_COOKIE = 'refresh_token'

export async function createSession(
  userId: string,
  email: string,
  userAgent?: string,
  ipAddress?: string
) {
  const accessToken = await generateAccessToken(userId, email)
  const refreshToken = await generateRefreshToken(userId, email)

  // Store refresh token in database
  await prisma.session.create({
    data: {
      userId,
      refreshToken,
      userAgent,
      ipAddress,
      expiresAt: getRefreshTokenExpiry(),
    },
  })

  return { accessToken, refreshToken }
}

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies()

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // 'lax' necessário para OAuth redirects funcionar
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  })

  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // 'lax' necessário para OAuth redirects funcionar
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  })
}

export async function getAuthFromCookies() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value

  return { accessToken, refreshToken }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_TOKEN_COOKIE)
  cookieStore.delete(REFRESH_TOKEN_COOKIE)
}

export async function getCurrentUser() {
  const { accessToken, refreshToken } = await getAuthFromCookies()

  if (!accessToken) {
    return null
  }

  const payload = await verifyToken(accessToken)

  if (payload && payload.type === 'access') {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })
    return user
  }

  // Try to refresh if access token is invalid
  if (refreshToken) {
    const refreshPayload = await verifyToken(refreshToken)

    if (refreshPayload && refreshPayload.type === 'refresh') {
      // Verify session exists in database
      const session = await prisma.session.findUnique({
        where: { refreshToken },
        include: { user: true },
      })

      if (session && session.expiresAt > new Date()) {
        // Generate new tokens
        const newAccessToken = await generateAccessToken(session.userId, session.user.email)
        const newRefreshToken = await generateRefreshToken(session.userId, session.user.email)

        // Update session
        await prisma.session.update({
          where: { id: session.id },
          data: {
            refreshToken: newRefreshToken,
            expiresAt: getRefreshTokenExpiry(),
          },
        })

        // Set new cookies
        await setAuthCookies(newAccessToken, newRefreshToken)

        return session.user
      }
    }
  }

  return null
}

export async function invalidateSession(refreshToken: string) {
  await prisma.session.deleteMany({
    where: { refreshToken },
  })
}

export async function invalidateAllUserSessions(userId: string) {
  await prisma.session.deleteMany({
    where: { userId },
  })
}

// Clean up expired sessions (call periodically)
export async function cleanupExpiredSessions() {
  await prisma.session.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  })
}
