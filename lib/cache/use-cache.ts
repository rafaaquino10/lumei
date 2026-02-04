'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCache, setCache, removeCache } from './local-storage'

/**
 * Hook para usar cache com estado reativo
 */
export function useCache<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [isLoading, setIsLoading] = useState(true)

  // Carrega valor do cache na montagem
  useEffect(() => {
    const cached = getCache<T>(key)
    if (cached !== null) {
      setValue(cached)
    }
    setIsLoading(false)
  }, [key])

  // Função para atualizar valor e cache
  const updateValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const updated = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(prev)
        : newValue
      setCache(key, updated)
      return updated
    })
  }, [key])

  // Função para limpar cache
  const clearValue = useCallback(() => {
    removeCache(key)
    setValue(initialValue)
  }, [key, initialValue])

  return {
    value,
    setValue: updateValue,
    clearValue,
    isLoading,
  }
}

/**
 * Hook para cache com TTL (time-to-live)
 */
export function useCacheWithTTL<T>(key: string, initialValue: T, ttlMinutes: number) {
  const [value, setValue] = useState<T>(initialValue)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const cached = getCache<T>(key)
    if (cached !== null) {
      setValue(cached)
    }
    setIsLoading(false)
  }, [key])

  const updateValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const updated = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(prev)
        : newValue
      setCache(key, updated, ttlMinutes)
      return updated
    })
  }, [key, ttlMinutes])

  const clearValue = useCallback(() => {
    removeCache(key)
    setValue(initialValue)
  }, [key, initialValue])

  return {
    value,
    setValue: updateValue,
    clearValue,
    isLoading,
  }
}

/**
 * Hook para detectar se está online/offline
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Define o estado inicial
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

/**
 * Hook para persistir preferências do usuário
 */
export function usePreferences<T extends Record<string, unknown>>(defaultPrefs: T) {
  const { value, setValue, isLoading } = useCache<T>('user_preferences', defaultPrefs)

  const updatePreference = useCallback(<K extends keyof T>(key: K, newValue: T[K]) => {
    setValue(prev => ({ ...prev, [key]: newValue }))
  }, [setValue])

  return {
    preferences: value,
    updatePreference,
    setPreferences: setValue,
    isLoading,
  }
}
