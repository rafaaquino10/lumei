'use client'

import { useEffect, useState } from 'react'

export function UsageIndicator() {
  const [usage, setUsage] = useState<{ used: number; limit: number; percentage: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch('/api/user/usage')
        if (response.ok) {
          const data = await response.json()
          setUsage(data)
        }
      } catch (error) {
        console.error('Failed to fetch usage:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsage()
  }, [])

  if (loading || !usage) return null

  const percentage = usage.percentage
  let color = 'bg-green-500'
  if (percentage >= 90) {
    color = 'bg-red-500'
  } else if (percentage >= 75) {
    color = 'bg-yellow-500'
  } else if (percentage >= 50) {
    color = 'bg-blue-500'
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-foreground text-sm">
      <div className="flex items-center gap-1">
        <span className="font-medium">{usage.used}/{usage.limit}</span>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      </div>
    </div>
  )
}
