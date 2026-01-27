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

const buckets = new Map<string, number[]>()

export function rateLimit(config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const windowStart = now - config.windowMs
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
