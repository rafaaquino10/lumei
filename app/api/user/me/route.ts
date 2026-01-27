import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientIp, getRequestId } from '@/lib/request'
import { rateLimit } from '@/lib/rate-limit'
import { log } from '@/lib/logger'

export async function GET() {
  const requestId = await getRequestId()
  const ip = await getClientIp()
  const rate = rateLimit({
    key: `GET:/api/user/me:${ip}`,
    limit: 60,
    windowMs: 60_000,
  })

  if (!rate.ok) {
    log({
      level: 'warn',
      event: 'rate_limit_exceeded',
      requestId,
      route: '/api/user/me',
      method: 'GET',
      meta: { ip },
    })
    return NextResponse.json(
      { error: 'rate_limit', message: 'Muitas requisições. Tente novamente.' },
      { status: 429, headers: { 'x-request-id': requestId } }
    )
  }

  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'x-request-id': requestId } }
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        tipoMEI: true,
        cnpj: true,
        ocupacao: true,
        plano: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: { 'x-request-id': requestId } }
      )
    }

    return NextResponse.json(user, { headers: { 'x-request-id': requestId } })
  } catch (error) {
    log({
      level: 'error',
      event: 'user_fetch_error',
      requestId,
      route: '/api/user/me',
      method: 'GET',
      meta: { error: error instanceof Error ? error.message : String(error) },
    })
    
    // Check if it's a database connection error
    if (
      error instanceof Error &&
      (error.message.includes('connect') ||
        error.message.includes('Tenant or user not found'))
    ) {
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 503, headers: { 'x-request-id': requestId } }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { 'x-request-id': requestId } }
    )
  }
}
