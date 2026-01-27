import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientIp, getRequestId } from '@/lib/request'
import { rateLimit } from '@/lib/rate-limit'
import { log } from '@/lib/logger'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = await getRequestId()
  const ip = await getClientIp()
  const rate = rateLimit({
    key: `GET:/api/calculos:${ip}`,
    limit: 60,
    windowMs: 60_000,
  })

  if (!rate.ok) {
    log({
      level: 'warn',
      event: 'rate_limit_exceeded',
      requestId,
      route: '/api/calculos/[id]',
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
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: { 'x-request-id': requestId } }
      )
    }

    const { id } = await params

    const calculo = await prisma.calculo.findUnique({
      where: { id },
    })

    if (!calculo || calculo.userId !== user.id) {
      return NextResponse.json(
        { error: 'Calculation not found' },
        { status: 404, headers: { 'x-request-id': requestId } }
      )
    }

    return NextResponse.json(
      { success: true, calculo },
      { headers: { 'x-request-id': requestId } }
    )
  } catch (error) {
    log({
      level: 'error',
      event: 'calculo_fetch_error',
      requestId,
      route: '/api/calculos/[id]',
      method: 'GET',
      meta: { error: error instanceof Error ? error.message : String(error) },
    })
    return NextResponse.json(
      { error: 'Failed to fetch calculation' },
      { status: 500, headers: { 'x-request-id': requestId } }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = await getRequestId()
  const ip = await getClientIp()
  const rate = rateLimit({
    key: `DELETE:/api/calculos:${ip}`,
    limit: 20,
    windowMs: 60_000,
  })

  if (!rate.ok) {
    log({
      level: 'warn',
      event: 'rate_limit_exceeded',
      requestId,
      route: '/api/calculos/[id]',
      method: 'DELETE',
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
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: { 'x-request-id': requestId } }
      )
    }

    const { id } = await params

    // Verify calculation belongs to user
    const calculo = await prisma.calculo.findUnique({
      where: { id },
    })

    if (!calculo || calculo.userId !== user.id) {
      return NextResponse.json(
        { error: 'Calculation not found' },
        { status: 404, headers: { 'x-request-id': requestId } }
      )
    }

    // Delete
    await prisma.calculo.delete({
      where: { id },
    })

    log({
      level: 'info',
      event: 'calculo_deleted',
      requestId,
      userId,
      route: '/api/calculos/[id]',
      method: 'DELETE',
    })

    return NextResponse.json(
      { success: true },
      { headers: { 'x-request-id': requestId } }
    )
  } catch (error) {
    log({
      level: 'error',
      event: 'calculo_delete_error',
      requestId,
      route: '/api/calculos/[id]',
      method: 'DELETE',
      meta: { error: error instanceof Error ? error.message : String(error) },
    })
    return NextResponse.json(
      { error: 'Failed to delete calculation' },
      { status: 500, headers: { 'x-request-id': requestId } }
    )
  }
}
