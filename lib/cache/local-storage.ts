/**
 * Utilitários para cache no localStorage
 * Usado para persistir cálculos e preferências offline
 */

const CACHE_PREFIX = 'calculamei_'
const CACHE_VERSION = 'v1'

interface CacheItem<T> {
  data: T
  timestamp: number
  expiresAt?: number
}

/**
 * Salva dados no localStorage com controle de expiração
 */
export function setCache<T>(key: string, data: T, ttlMinutes?: number): void {
  try {
    const cacheKey = `${CACHE_PREFIX}${CACHE_VERSION}_${key}`
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: ttlMinutes ? Date.now() + ttlMinutes * 60 * 1000 : undefined,
    }
    localStorage.setItem(cacheKey, JSON.stringify(item))
  } catch (error) {
    console.warn('Erro ao salvar cache:', error)
  }
}

/**
 * Recupera dados do localStorage, verificando expiração
 */
export function getCache<T>(key: string): T | null {
  try {
    const cacheKey = `${CACHE_PREFIX}${CACHE_VERSION}_${key}`
    const cached = localStorage.getItem(cacheKey)

    if (!cached) return null

    const item: CacheItem<T> = JSON.parse(cached)

    // Verifica se expirou
    if (item.expiresAt && Date.now() > item.expiresAt) {
      localStorage.removeItem(cacheKey)
      return null
    }

    return item.data
  } catch (error) {
    console.warn('Erro ao recuperar cache:', error)
    return null
  }
}

/**
 * Remove um item do cache
 */
export function removeCache(key: string): void {
  try {
    const cacheKey = `${CACHE_PREFIX}${CACHE_VERSION}_${key}`
    localStorage.removeItem(cacheKey)
  } catch (error) {
    console.warn('Erro ao remover cache:', error)
  }
}

/**
 * Limpa todo o cache do app
 */
export function clearAllCache(): void {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.warn('Erro ao limpar cache:', error)
  }
}

/**
 * Limpa itens expirados do cache
 */
export function cleanExpiredCache(): void {
  try {
    const keys = Object.keys(localStorage)
    const now = Date.now()

    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}')
          if (item.expiresAt && now > item.expiresAt) {
            localStorage.removeItem(key)
          }
        } catch {
          // Item inválido, remove
          localStorage.removeItem(key)
        }
      }
    })
  } catch (error) {
    console.warn('Erro ao limpar cache expirado:', error)
  }
}

// Tipos para cálculos salvos localmente
export interface SavedCalculation {
  id: string
  tipo: string
  inputs: Record<string, unknown>
  resultado: Record<string, unknown>
  createdAt: string
  synced: boolean
}

/**
 * Salva um cálculo localmente (para uso offline)
 */
export function saveCalculationLocally(calc: Omit<SavedCalculation, 'id' | 'createdAt' | 'synced'>): void {
  const calculations = getCache<SavedCalculation[]>('offline_calculations') || []

  const newCalc: SavedCalculation = {
    ...calc,
    id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    synced: false,
  }

  // Mantém apenas os últimos 50 cálculos offline
  const updated = [newCalc, ...calculations].slice(0, 50)
  setCache('offline_calculations', updated)
}

/**
 * Recupera cálculos salvos localmente
 */
export function getLocalCalculations(): SavedCalculation[] {
  return getCache<SavedCalculation[]>('offline_calculations') || []
}

/**
 * Marca cálculos como sincronizados
 */
export function markCalculationsSynced(ids: string[]): void {
  const calculations = getLocalCalculations()
  const updated = calculations.map(calc =>
    ids.includes(calc.id) ? { ...calc, synced: true } : calc
  )
  setCache('offline_calculations', updated)
}

/**
 * Remove cálculos já sincronizados
 */
export function removesynceCalculations(): void {
  const calculations = getLocalCalculations()
  const unsynced = calculations.filter(calc => !calc.synced)
  setCache('offline_calculations', unsynced)
}
