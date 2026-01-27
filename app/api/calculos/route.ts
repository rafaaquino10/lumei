import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { calculoSchemas, tipoCalculoEnum } from '@/lib/calculos/schemas'
import { CALCULO_FORMULA_VERSION } from '@/lib/calculos/version'
import { getClientIp, getRequestId } from '@/lib/request'
import { rateLimit } from '@/lib/rate-limit'
import { log } from '@/lib/logger'

const schema = z.object({
  tipo: tipoCalculoEnum,
  inputs: z.unknown(),
  resultado: z.unknown(),
  titulo: z.string().optional(),
  descricao: z.string().optional(),
  formulaVersion: z.string().optional(),
})

export async function POST(request: Request) {
  const requestId = await getRequestId()
  const ip = await getClientIp()
  const rate = rateLimit({
    key: `POST:/api/calculos:${ip}`,
    limit: 20,
    windowMs: 60_000,
  })

  if (!rate.ok) {
    log({
      level: 'warn',
      event: 'rate_limit_exceeded',
      requestId,
      route: '/api/calculos',
      method: 'POST',
      meta: { ip },
    })
    return NextResponse.json(
      { success: false, error: 'rate_limit', message: 'Muitas requisições. Tente novamente.' },
      { status: 429, headers: { 'x-request-id': requestId } }
    )
  }

  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'not_authenticated',
          message: 'Faça login para salvar seus cálculos',
        },
        { status: 401, headers: { 'x-request-id': requestId } }
      )
    }

    const body = await request.json()
    const data = schema.parse(body)
    const schemaByTipo = calculoSchemas[data.tipo]

    const parsedInputs = schemaByTipo.inputs.parse(data.inputs)
    const parsedResultado = schemaByTipo.resultado.parse(data.resultado)

    // Find user in database
    let user
    try {
      user = await prisma.user.findUnique({
        where: { clerkId: userId },
      })
    } catch (error) {
      console.error('Database connection error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'database_error',
          message: 'Erro de conexão com o banco de dados. Tente novamente.',
        },
        { status: 503, headers: { 'x-request-id': requestId } }
      )
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'user_not_found',
          message: 'Complete seu cadastro primeiro',
        },
        { status: 404, headers: { 'x-request-id': requestId } }
      )
    }

    // Check plan limits
    if (user.plano === 'FREE') {
      const calculosCount = await prisma.calculo.count({
        where: { userId: user.id },
      })

      if (calculosCount >= 50) {
        return NextResponse.json(
          {
            success: false,
            error: 'limit_reached',
            message: 'Você atingiu o limite de 50 cálculos do plano gratuito. Faça upgrade para Premium!',
          },
          { status: 403, headers: { 'x-request-id': requestId } }
        )
      }
    }

    // Save calculation
    const calculo = await prisma.calculo.create({
      data: {
        userId: user.id,
        tipo: data.tipo,
        inputs: parsedInputs,
        resultado: parsedResultado,
        titulo: data.titulo,
        descricao: data.descricao,
        formulaVersion: data.formulaVersion || CALCULO_FORMULA_VERSION,
      },
    })

    log({
      level: 'info',
      event: 'calculo_salvo',
      requestId,
      userId,
      route: '/api/calculos',
      method: 'POST',
      meta: { tipo: data.tipo },
    })

    return NextResponse.json(
      {
        success: true,
        calculo,
        message: 'Cálculo salvo com sucesso!',
      },
      { headers: { 'x-request-id': requestId } }
    )
  } catch (error) {
    log({
      level: 'error',
      event: 'calculo_save_error',
      requestId,
      route: '/api/calculos',
      method: 'POST',
      meta: { error: error instanceof Error ? error.message : String(error) },
    })

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'validation_error', message: 'Dados inválidos' },
        { status: 400, headers: { 'x-request-id': requestId } }
      )
    }

    return NextResponse.json(
      { success: false, error: 'server_error', message: 'Erro ao salvar cálculo' },
      { status: 500, headers: { 'x-request-id': requestId } }
    )
  }
}
