'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'

interface UsageIndicatorProps {
  variant?: 'compact' | 'full'
}

export function UsageIndicator({ variant = 'compact' }: UsageIndicatorProps) {
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

  // Cores semânticas
  let barColor = 'bg-primary'
  let textColor = 'text-primary'
  let status = 'normal'

  if (percentage >= 90) {
    barColor = 'bg-red-500'
    textColor = 'text-red-500'
    status = 'critical'
  } else if (percentage >= 75) {
    barColor = 'bg-yellow-500'
    textColor = 'text-yellow-600'
    status = 'warning'
  } else if (percentage >= 50) {
    barColor = 'bg-blue-500'
    textColor = 'text-blue-500'
    status = 'moderate'
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-[80px]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Cálculos</span>
            <span className={`font-medium ${textColor}`}>
              {usage.used}/{usage.limit}
            </span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full ${barColor} transition-all duration-500 rounded-full`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
        {percentage >= 80 && (
          <Link href="/premium">
            <Button size="sm" variant="outline" className="h-7 text-xs px-2">
              <Zap className="w-3 h-3 mr-1" />
              Upgrade
            </Button>
          </Link>
        )}
      </div>
    )
  }

  // Variant: full
  return (
    <Card className={`p-4 ${status === 'critical' ? 'border-red-500 bg-red-500/5' : status === 'warning' ? 'border-yellow-500 bg-yellow-500/5' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Uso do Plano</h3>
          <p className="text-xs text-muted-foreground">
            {usage.limit === 9999 ? 'Ilimitado' : `${usage.limit} cálculos/mês`}
          </p>
        </div>
        <div className={`text-2xl font-bold ${textColor}`}>
          {percentage.toFixed(0)}%
        </div>
      </div>

      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
        <div
          className={`h-full ${barColor} transition-all duration-500 rounded-full`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{usage.used}</span> de {usage.limit} cálculos usados
        </p>

        {percentage >= 80 && usage.limit !== 9999 && (
          <Link href="/premium">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Zap className="w-4 h-4 mr-1" />
              Seja Premium
            </Button>
          </Link>
        )}
      </div>

      {status === 'critical' && (
        <p className="text-xs text-red-600 mt-2">
          ⚠️ Você está quase no limite. Faça upgrade para cálculos ilimitados!
        </p>
      )}
    </Card>
  )
}
