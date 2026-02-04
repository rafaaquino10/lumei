'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Clock, Check, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface TrialBannerProps {
  trialUsed: boolean
  trialEndsAt?: string | null
  isPremium: boolean
}

export function TrialBanner({ trialUsed, trialEndsAt, isPremium }: TrialBannerProps) {
  const [isActivating, setIsActivating] = useState(false)
  const [activated, setActivated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calcula dias restantes do trial
  const trialEndDate = trialEndsAt ? new Date(trialEndsAt) : null
  const now = new Date()
  const trialActive = trialEndDate && trialEndDate > now
  const daysRemaining = trialEndDate
    ? Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0

  // Se e Premium sem trial (assinante pagante), nao mostra nada
  if (isPremium && !trialActive) {
    return null
  }

  // Se o trial esta ativo, mostra contador
  if (trialActive) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Trial Premium: {daysRemaining} {daysRemaining === 1 ? 'dia restante' : 'dias restantes'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Aproveite todos os recursos Premium!
                </p>
              </div>
            </div>
            <Link href="/premium">
              <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                Assinar agora
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    )
  }

  // Se ja usou trial, nao mostra o banner de ativacao
  if (trialUsed) {
    return null
  }

  // Se ativou agora, mostra sucesso
  if (activated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800 dark:text-green-200">
                Trial Premium ativado!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Voce tem 7 dias para experimentar todos os recursos Premium.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  const handleActivateTrial = async () => {
    setIsActivating(true)
    setError(null)

    try {
      const response = await fetch('/api/trial/start', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao ativar trial')
      }

      setActivated(true)
      // Recarrega a pagina apos 2 segundos para atualizar o estado
      setTimeout(() => window.location.reload(), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao ativar trial')
    } finally {
      setIsActivating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Experimente o Premium gratis por 7 dias!
              </p>
              <p className="text-sm text-muted-foreground">
                Relatorios PDF, sem anuncios, alertas WhatsApp e mais.
              </p>
            </div>
          </div>
          <Button
            onClick={handleActivateTrial}
            disabled={isActivating}
            className="whitespace-nowrap"
          >
            {isActivating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Ativando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Ativar Trial Gratis
              </>
            )}
          </Button>
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-2">{error}</p>
        )}
      </Card>
    </motion.div>
  )
}
