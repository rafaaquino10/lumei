import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Verifica API key e retorna userId se valida
async function verifyApiKey(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const apiKey = authHeader.slice(7)
  const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex')

  const keyRecord = await prisma.apiKey.findUnique({
    where: { hashedKey },
  })

  if (!keyRecord || keyRecord.revokedAt || (keyRecord.expiresAt && keyRecord.expiresAt < new Date())) {
    return null
  }

  // Atualiza contador de uso
  await prisma.apiKey.update({
    where: { id: keyRecord.id },
    data: {
      lastUsedAt: new Date(),
      requestCount: { increment: 1 },
    },
  })

  return keyRecord.userId
}

/**
 * @api {post} /api/v1/calculadoras/margem-lucro Calcular Margem de Lucro
 * @apiName CalcularMargemLucro
 * @apiGroup Calculadoras
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} Authorization Bearer token (API Key)
 *
 * @apiBody {Number} custoTotal Custo total do produto/servico
 * @apiBody {Number} precoVenda Preco de venda
 *
 * @apiSuccess {Number} margemLucro Margem de lucro em percentual
 * @apiSuccess {Number} lucroAbsoluto Lucro em reais
 * @apiSuccess {Number} markup Markup aplicado
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyApiKey(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'API key invalida ou expirada' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { custoTotal, precoVenda } = body

    if (typeof custoTotal !== 'number' || typeof precoVenda !== 'number') {
      return NextResponse.json(
        { error: 'custoTotal e precoVenda devem ser numeros' },
        { status: 400 }
      )
    }

    if (custoTotal <= 0 || precoVenda <= 0) {
      return NextResponse.json(
        { error: 'Valores devem ser positivos' },
        { status: 400 }
      )
    }

    // Calculos
    const lucroAbsoluto = precoVenda - custoTotal
    const margemLucro = (lucroAbsoluto / precoVenda) * 100
    const markup = ((precoVenda - custoTotal) / custoTotal) * 100

    return NextResponse.json({
      success: true,
      resultado: {
        custoTotal,
        precoVenda,
        lucroAbsoluto: Math.round(lucroAbsoluto * 100) / 100,
        margemLucro: Math.round(margemLucro * 100) / 100,
        markup: Math.round(markup * 100) / 100,
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Documentacao do endpoint
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/v1/calculadoras/margem-lucro',
    method: 'POST',
    description: 'Calcula a margem de lucro de um produto ou servico',
    authentication: 'Bearer token (API Key)',
    body: {
      custoTotal: { type: 'number', required: true, description: 'Custo total do produto/servico' },
      precoVenda: { type: 'number', required: true, description: 'Preco de venda' },
    },
    response: {
      lucroAbsoluto: 'number - Lucro em reais',
      margemLucro: 'number - Margem de lucro em percentual',
      markup: 'number - Markup aplicado em percentual',
    },
    example: {
      request: { custoTotal: 50, precoVenda: 100 },
      response: { lucroAbsoluto: 50, margemLucro: 50, markup: 100 },
    },
  })
}
