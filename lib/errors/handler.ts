import { NextResponse } from 'next/server'
import { AppError } from './AppError'
import { logError } from './logger'

export function handleApiError(error: Error | AppError, defaultStatusCode = 500) {
  if (error instanceof AppError) {
    logError(error)
    return NextResponse.json(
      {
        error: error.code,
        message: error.message,
        ...(error.meta && { meta: error.meta }),
      },
      { status: error.statusCode }
    )
  }

  logError(error)
  return NextResponse.json(
    { error: 'internal_server_error', message: 'Erro interno do servidor' },
    { status: defaultStatusCode }
  )
}
