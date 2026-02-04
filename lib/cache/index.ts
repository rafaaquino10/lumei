// Cache utilities
export {
  setCache,
  getCache,
  removeCache,
  clearAllCache,
  cleanExpiredCache,
  saveCalculationLocally,
  getLocalCalculations,
  markCalculationsSynced,
  removesynceCalculations,
  type SavedCalculation,
} from './local-storage'

// React hooks
export {
  useCache,
  useCacheWithTTL,
  useOnlineStatus,
  usePreferences,
} from './use-cache'
