import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getClientIp, getRequestId } from '@/lib/request'
import { rateLimit } from '@/lib/rate-limit'
import { log } from '@/lib/logger'

const schema = z.object({
  tipoMEI: z.enum(['COMERCIO', 'SERVICOS', 'MISTO', 'CAMINHONEIRO']),
  cnpj: z.string().optional(),
  ocupacao: z.string().min(1, 'Ocupação é obrigatória'),
  temFuncionario: z.boolean(),
  faturamentoMedio: z.number().min(0),
})

export async function POST(request: Request) {
  const requestId = await getRequestId()
  const ip = await getClientIp()
  const rate = rateLimit({
    key: `POST:/api/user/onboarding:${ip}`,
    limit: 10,
    windowMs: 60_000,
  })

  if (!rate.ok) {
    log({
      level: 'warn',
      event: 'rate_limit_exceeded',
      requestId,
      route: '/api/user/onboarding',
      method: 'POST',
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

    const body = await request.json()
    const data = schema.parse(body)

    // Find user by Clerk ID
    let user
    try {
      user = await prisma.user.findUnique({
        where: { clerkId: userId },
      })
    } catch (error) {
      console.error('Database connection error:', error)
      log({
        level: 'error',
        event: 'database_error',
        requestId,
        route: '/api/user/onboarding',
        method: 'POST',
        meta: { error: error instanceof Error ? error.message : String(error) },
      })
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 503, headers: { 'x-request-id': requestId } }
      )
    }

    if (!user) {
      const clerkUser = await currentUser()
      if (!clerkUser || clerkUser.emailAddresses.length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404, headers: { 'x-request-id': requestId } }
        )
      }

      user = await prisma.user.upsert({
        where: { clerkId: userId },
        update: {
          email: clerkUser.emailAddresses[0].emailAddress,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
          avatarUrl: clerkUser.imageUrl || null,
        },
        create: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
          avatarUrl: clerkUser.imageUrl || null,
        },
      })
    }

    // Update user with onboarding data
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        tipoMEI: data.tipoMEI,
        cnpj: data.cnpj || null,
        ocupacao: data.ocupacao,
        temFuncionario: data.temFuncionario,
        faturamentoMedio: data.faturamentoMedio,
      },
    })

    log({
      level: 'info',
      event: 'onboarding_completed',
      requestId,
      userId,
      route: '/api/user/onboarding',
      method: 'POST',
    })

    return NextResponse.json(
      { 
        success: true, 
        user: {
          id: updatedUser.id,
          tipoMEI: updatedUser.tipoMEI,
          ocupacao: updatedUser.ocupacao,
        }
      },
      { headers: { 'x-request-id': requestId } }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400, headers: { 'x-request-id': requestId } }
      )
    }

    log({
      level: 'error',
      event: 'onboarding_error',
      requestId,
      route: '/api/user/onboarding',
      method: 'POST',
      meta: { error: error instanceof Error ? error.message : String(error) },
    })
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500, headers: { 'x-request-id': requestId } }
    )
  }
}
