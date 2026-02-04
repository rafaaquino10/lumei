'use client'

import { useState, useEffect } from 'react'

const DASHBOARD_VIEWS_KEY = 'calcula_mei_dashboard_views'
const FREE_VIEWS_LIMIT = 5 // Visualizações gratuitas por mês

interface DashboardViewsState {
  count: number
  month: number // 0-11
  year: number
}

export function useDashboardViews(isPremium: boolean) {
  const [viewsState, setViewsState] = useState<DashboardViewsState | null>(null)
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    // Premium users never blocked
    if (isPremium) {
      setIsBlocked(false)
      return
    }

    // Load state from localStorage
    const stored = localStorage.getItem(DASHBOARD_VIEWS_KEY)
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    let state: DashboardViewsState

    if (stored) {
      const parsed = JSON.parse(stored) as DashboardViewsState

      // Reset if new month
      if (parsed.month !== currentMonth || parsed.year !== currentYear) {
        state = { count: 1, month: currentMonth, year: currentYear }
      } else {
        state = { ...parsed, count: parsed.count + 1 }
      }
    } else {
      state = { count: 1, month: currentMonth, year: currentYear }
    }

    // Save and check if blocked
    localStorage.setItem(DASHBOARD_VIEWS_KEY, JSON.stringify(state))
    setViewsState(state)
    setIsBlocked(state.count > FREE_VIEWS_LIMIT)
  }, [isPremium])

  const remaining = viewsState ? Math.max(0, FREE_VIEWS_LIMIT - viewsState.count + 1) : FREE_VIEWS_LIMIT
  const total = FREE_VIEWS_LIMIT

  return {
    isBlocked,
    remaining,
    total,
    currentViews: viewsState?.count || 0,
  }
}
