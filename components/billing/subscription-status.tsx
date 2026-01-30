'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface SubscriptionStatusProps {
  userId: string
}

export function SubscriptionStatus({ userId }: SubscriptionStatusProps) {
  const [status, setStatus] = useState<{
    status: string
    currentPeriodStart: string
    currentPeriodEnd: string
    stripeSubscriptionId: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch('/api/user/subscription')
        if (response.ok) {
          const data = await response.json()
          setStatus(data)
        }
      } catch (error) {
        console.error('Failed to fetch subscription status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [userId])

  if (loading) return null

  if (!status) {
    return (
      <Card className="p-6">
        <h3 className="font-bold mb-2">Plano: Gratuito</h3>
        <p className="text-sm text-gray-600 mb-4">Você está usando o plano gratuito</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-lumei-50 border-lumei-500">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-green-500" />
            Plano: Premium
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Status: <span className="inline-block ml-2 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">{status.status}</span>
          </p>
          {status.currentPeriodEnd && (
            <p className="text-sm text-gray-600">
              Próxima renovação: {new Date(status.currentPeriodEnd).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
        <Button variant="outline" onClick={() => window.location.href = '/api/billing/portal'}>
          Gerenciar
        </Button>
      </div>
    </Card>
  )
}
