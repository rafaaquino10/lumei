import { AppError } from './AppError'

export function logError(error: Error | AppError, context?: Record<string, unknown>) {
  const errorData = {
    name: error.name,
    message: error.message,
    ...(error instanceof AppError && { code: error.code, statusCode: error.statusCode, meta: error.meta }),
    timestamp: new Date().toISOString(),
    context,
  }

  console.error(JSON.stringify(errorData))
}

export function logInfo(message: string, data?: Record<string, unknown>) {
  const logData = {
    level: 'info',
    message,
    timestamp: new Date().toISOString(),
    ...data,
  }

  console.log(JSON.stringify(logData))
}
