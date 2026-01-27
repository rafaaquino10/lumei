export type LogLevel = 'info' | 'warn' | 'error'

type LogEntry = {
  level: LogLevel
  event: string
  message?: string
  requestId?: string
  userId?: string | null
  route?: string
  method?: string
  meta?: Record<string, unknown>
}

export function log(entry: LogEntry) {
  const payload = {
    ts: new Date().toISOString(),
    ...entry,
  }
  const line = JSON.stringify(payload)

  switch (entry.level) {
    case 'error':
      console.error(line)
      break
    case 'warn':
      console.warn(line)
      break
    default:
      console.log(line)
  }
}
