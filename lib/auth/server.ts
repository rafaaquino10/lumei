import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyToken } from './jwt'

export async function getServerUser() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  if (!accessToken) {
    return null
  }

  const payload = await verifyToken(accessToken)

  if (!payload || payload.type !== 'access') {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  })

  return user
}

export async function getServerUserWithCalcs() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  if (!accessToken) {
    return null
  }

  const payload = await verifyToken(accessToken)

  if (!payload || payload.type !== 'access') {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      calculos: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  return user
}

export async function getServerUserWithAllCalcs() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  if (!accessToken) {
    return null
  }

  const payload = await verifyToken(accessToken)

  if (!payload || payload.type !== 'access') {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      calculos: {
        orderBy: { createdAt: 'desc' },
        take: 100,
      },
    },
  })

  return user
}

export async function requireAuth() {
  const user = await getServerUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}
