import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerUser } from '@/lib/auth/server'
import crypto from 'crypto'

// Gera uma API key segura
function generateApiKey(): string {
  return `cmei_${crypto.randomBytes(32).toString('hex')}`
}

export async function GET() {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        permissions: true,
        lastUsedAt: true,
        expiresAt: true,
        revokedAt: true,
        requestCount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ apiKeys })
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Apenas Premium pode criar API keys
    if (user.plano !== 'PREMIUM') {
      return NextResponse.json(
        { error: 'API keys sao exclusivas para usuarios Premium' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, permissions = ['read:calculadoras'] } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Nome da API key e obrigatorio' },
        { status: 400 }
      )
    }

    // Limite de API keys por usuario
    const existingKeys = await prisma.apiKey.count({
      where: { userId: user.id, revokedAt: null },
    })

    if (existingKeys >= 5) {
      return NextResponse.json(
        { error: 'Limite de 5 API keys ativas por usuario' },
        { status: 400 }
      )
    }

    const key = generateApiKey()
    const hashedKey = crypto.createHash('sha256').update(key).digest('hex')

    await prisma.apiKey.create({
      data: {
        userId: user.id,
        name,
        key: key.slice(0, 12) + '...', // Armazena apenas prefixo para referencia
        hashedKey,
        permissions,
      },
    })

    // Retorna a key completa apenas na criacao (unica vez que sera visivel)
    return NextResponse.json({
      success: true,
      apiKey: key,
      message: 'Guarde esta chave em local seguro. Ela nao sera exibida novamente.',
    })
  } catch (error) {
    console.error('Error creating API key:', error)
    return NextResponse.json(
      { error: 'Failed to create API key' },
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

    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get('id')

    if (!keyId) {
      return NextResponse.json({ error: 'ID da API key e obrigatorio' }, { status: 400 })
    }

    const apiKey = await prisma.apiKey.findFirst({
      where: { id: keyId, userId: user.id },
    })

    if (!apiKey) {
      return NextResponse.json({ error: 'API key nao encontrada' }, { status: 404 })
    }

    // Revoga a key (soft delete)
    await prisma.apiKey.update({
      where: { id: keyId },
      data: { revokedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error revoking API key:', error)
    return NextResponse.json(
      { error: 'Failed to revoke API key' },
      { status: 500 }
    )
  }
}
