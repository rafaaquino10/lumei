/**
 * Usage Tracker para usuários anônimos
 * Rastreia cálculos via localStorage para limitar uso sem login
 */

const STORAGE_KEY = 'calculamei_usage'
const ANONYMOUS_DAILY_LIMIT = 3
const FREE_MONTHLY_LIMIT = 30

interface UsageData {
  date: string // YYYY-MM-DD
  count: number
}

/**
 * Obtém os dados de uso do localStorage
 */
function getUsageData(): UsageData {
  if (typeof window === 'undefined') {
    return { date: '', count: 0 }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Erro ao ler localStorage, retorna padrão
  }

  return { date: getTodayDate(), count: 0 }
}

/**
 * Salva os dados de uso no localStorage
 */
function saveUsageData(data: UsageData): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Erro ao salvar localStorage (ex: modo privado)
  }
}

/**
 * Retorna a data de hoje no formato YYYY-MM-DD
 */
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Verifica se o usuário anônimo pode fazer mais cálculos
 */
export function canCalculateAnonymous(): { allowed: boolean; remaining: number; limit: number } {
  const data = getUsageData()
  const today = getTodayDate()

  // Se é um novo dia, reseta o contador
  if (data.date !== today) {
    return { allowed: true, remaining: ANONYMOUS_DAILY_LIMIT, limit: ANONYMOUS_DAILY_LIMIT }
  }

  const remaining = ANONYMOUS_DAILY_LIMIT - data.count
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    limit: ANONYMOUS_DAILY_LIMIT
  }
}

/**
 * Registra um cálculo para usuário anônimo
 */
export function recordAnonymousCalculation(): void {
  const data = getUsageData()
  const today = getTodayDate()

  // Se é um novo dia, reseta o contador
  if (data.date !== today) {
    saveUsageData({ date: today, count: 1 })
    return
  }

  // Incrementa o contador
  saveUsageData({ date: today, count: data.count + 1 })
}

/**
 * Verifica se o usuário FREE pode fazer mais cálculos
 * @param monthlyUsage - Número de cálculos já realizados no mês atual
 */
export function canCalculateFree(monthlyUsage: number): { allowed: boolean; remaining: number; limit: number } {
  const remaining = FREE_MONTHLY_LIMIT - monthlyUsage
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    limit: FREE_MONTHLY_LIMIT
  }
}

/**
 * Retorna os limites por tipo de usuário
 */
export function getUsageLimits() {
  return {
    anonymous: {
      limit: ANONYMOUS_DAILY_LIMIT,
      period: 'dia'
    },
    free: {
      limit: FREE_MONTHLY_LIMIT,
      period: 'mês'
    },
    premium: {
      limit: Infinity,
      period: 'ilimitado'
    }
  }
}

/**
 * Limpa os dados de uso (útil para testes)
 */
export function clearUsageData(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Erro ao limpar
  }
}
