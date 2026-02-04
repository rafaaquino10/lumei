/**
 * Rate Limiter em memória
 *
 * IMPORTANTE: Este rate limiter funciona em memória e NÃO persiste entre:
 * - Restarts do servidor
 * - Múltiplas instâncias (serverless/edge)
 *
 * Para produção escalada, considere usar:
 * - Upstash Redis (@upstash/ratelimit)
 * - Vercel KV
 * - Redis externo
 */

type RateLimitResult = {
  ok: boolean
  remaining: number
  reset: number
}

type RateLimitConfig = {
  key: string
  limit: number
  windowMs: number
}

// Armazena timestamps de requisições por chave
const buckets = new Map<string, number[]>()

// Limpa buckets antigos a cada 5 minutos para evitar memory leak
const CLEANUP_INTERVAL = 5 * 60 * 1000 // 5 minutos
let lastCleanup = Date.now()

function cleanupOldBuckets(maxAge: number = 60 * 60 * 1000) {
  const now = Date.now()

  // Só faz cleanup a cada CLEANUP_INTERVAL
  if (now - lastCleanup < CLEANUP_INTERVAL) return

  lastCleanup = now
  const cutoff = now - maxAge

  for (const [key, timestamps] of buckets.entries()) {
    const recent = timestamps.filter(ts => ts > cutoff)
    if (recent.length === 0) {
      buckets.delete(key)
    } else {
      buckets.set(key, recent)
    }
  }
}

export function rateLimit(config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const windowStart = now - config.windowMs

  // Limpa buckets antigos periodicamente
  cleanupOldBuckets()

  const timestamps = buckets.get(config.key) || []
  const recent = timestamps.filter((ts) => ts > windowStart)

  if (recent.length >= config.limit) {
    const reset = recent[0] + config.windowMs
    buckets.set(config.key, recent)
    return { ok: false, remaining: 0, reset }
  }

  recent.push(now)
  buckets.set(config.key, recent)

  const remaining = Math.max(0, config.limit - recent.length)
  const reset = recent[0] + config.windowMs

  return { ok: true, remaining, reset }
}

/**
 * Rate limit por IP - útil para endpoints públicos
 */
export function rateLimitByIP(
  ip: string,
  endpoint: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const key = `${endpoint}:${ip}`
  return rateLimit({ key, limit, windowMs })
}

/**
 * Rate limit por usuário - útil para endpoints autenticados
 */
export function rateLimitByUser(
  userId: string,
  endpoint: string,
  limit: number = 30,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const key = `${endpoint}:user:${userId}`
  return rateLimit({ key, limit, windowMs })
}
