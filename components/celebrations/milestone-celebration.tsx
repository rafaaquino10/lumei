'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Trophy,
  Star,
  Target,
  Flame,
  Award,
  TrendingUp,
  Calendar,
  X,
} from 'lucide-react'

export type MilestoneType =
  | 'FIRST_REGISTRATION'
  | 'FIRST_MONTH_COMPLETE'
  | 'THREE_MONTHS_STREAK'
  | 'SIX_MONTHS_STREAK'
  | 'ONE_YEAR_STREAK'
  | 'HALF_LIMIT_REACHED'
  | 'SEVENTY_PERCENT_LIMIT'
  | 'LIMIT_WARNING'
  | 'FIRST_CALCULATION'
  | 'TEN_CALCULATIONS'
  | 'PREMIUM_UPGRADE'

interface Milestone {
  type: MilestoneType
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  confettiColors: string[]
}

const MILESTONES: Record<MilestoneType, Milestone> = {
  FIRST_REGISTRATION: {
    type: 'FIRST_REGISTRATION',
    title: 'Primeiro Passo!',
    description: 'Voce registrou seu primeiro faturamento. O controle financeiro comeca aqui!',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    confettiColors: ['#FCD34D', '#FBBF24', '#F59E0B'],
  },
  FIRST_MONTH_COMPLETE: {
    type: 'FIRST_MONTH_COMPLETE',
    title: 'Mes Completo!',
    description: 'Voce completou seu primeiro mes de registros. Continue assim!',
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    confettiColors: ['#60A5FA', '#3B82F6', '#2563EB'],
  },
  THREE_MONTHS_STREAK: {
    type: 'THREE_MONTHS_STREAK',
    title: '3 Meses de Consistencia!',
    description: 'Voce manteve seus registros em dia por 3 meses seguidos!',
    icon: Flame,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    confettiColors: ['#FB923C', '#F97316', '#EA580C'],
  },
  SIX_MONTHS_STREAK: {
    type: 'SIX_MONTHS_STREAK',
    title: 'Meio Ano de Dedicacao!',
    description: '6 meses mantendo o controle financeiro em dia. Incrivel!',
    icon: Trophy,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    confettiColors: ['#A78BFA', '#8B5CF6', '#7C3AED'],
  },
  ONE_YEAR_STREAK: {
    type: 'ONE_YEAR_STREAK',
    title: 'Um Ano de Sucesso!',
    description: 'Parabens! Voce completou 1 ano de controle financeiro impecavel!',
    icon: Award,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    confettiColors: ['#FCD34D', '#F59E0B', '#D97706', '#00D084'],
  },
  HALF_LIMIT_REACHED: {
    type: 'HALF_LIMIT_REACHED',
    title: 'Metade do Caminho!',
    description: 'Voce atingiu 50% do limite MEI. Continue monitorando!',
    icon: Target,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    confettiColors: ['#22D3EE', '#06B6D4', '#0891B2'],
  },
  SEVENTY_PERCENT_LIMIT: {
    type: 'SEVENTY_PERCENT_LIMIT',
    title: 'Crescimento Forte!',
    description: '70% do limite MEI atingido. Hora de pensar no futuro!',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    confettiColors: ['#4ADE80', '#22C55E', '#16A34A'],
  },
  LIMIT_WARNING: {
    type: 'LIMIT_WARNING',
    title: 'Atencao ao Limite!',
    description: '80% do limite MEI. Considere a transicao para ME!',
    icon: Target,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    confettiColors: ['#FCD34D', '#F59E0B'],
  },
  FIRST_CALCULATION: {
    type: 'FIRST_CALCULATION',
    title: 'Primeiro Calculo!',
    description: 'Voce usou sua primeira calculadora. Explore as outras!',
    icon: Star,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    confettiColors: ['#818CF8', '#6366F1', '#4F46E5'],
  },
  TEN_CALCULATIONS: {
    type: 'TEN_CALCULATIONS',
    title: 'Calculista!',
    description: 'Voce ja fez 10 calculos. As ferramentas estao te ajudando!',
    icon: Trophy,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    confettiColors: ['#34D399', '#10B981', '#059669'],
  },
  PREMIUM_UPGRADE: {
    type: 'PREMIUM_UPGRADE',
    title: 'Bem-vindo ao Premium!',
    description: 'Agora voce tem acesso a todos os recursos exclusivos!',
    icon: Award,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    confettiColors: ['#A78BFA', '#8B5CF6', '#7C3AED', '#00D084'],
  },
}

interface MilestoneCelebrationProps {
  milestone: MilestoneType | null
  onDismiss: () => void
}

export function MilestoneCelebration({ milestone, onDismiss }: MilestoneCelebrationProps) {
  const [show, setShow] = useState(false)

  const fireConfetti = useCallback((colors: string[]) => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      colors,
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, { spread: 26, startVelocity: 55 })
    fire(0.2, { spread: 60 })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1, { spread: 120, startVelocity: 45 })
  }, [])

  useEffect(() => {
    if (milestone) {
      setShow(true)
      const milestoneData = MILESTONES[milestone]
      if (milestoneData) {
        // Delay confetti slightly for better effect
        setTimeout(() => {
          fireConfetti(milestoneData.confettiColors)
        }, 300)
      }
    }
  }, [milestone, fireConfetti])

  const handleDismiss = () => {
    setShow(false)
    setTimeout(onDismiss, 300)
  }

  if (!milestone) return null

  const milestoneData = MILESTONES[milestone]
  if (!milestoneData) return null

  const Icon = milestoneData.icon

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-6 max-w-sm mx-auto text-center relative overflow-hidden">
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                className={`w-20 h-20 rounded-full ${milestoneData.bgColor} flex items-center justify-center mx-auto mb-4`}
              >
                <Icon className={`w-10 h-10 ${milestoneData.color}`} />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-foreground mb-2"
              >
                {milestoneData.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-6"
              >
                {milestoneData.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button onClick={handleDismiss} className="w-full">
                  Continuar
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook para verificar e disparar celebracoes
export function useMilestones() {
  const [pendingMilestone, setPendingMilestone] = useState<MilestoneType | null>(null)

  const checkMilestone = useCallback(async (type: MilestoneType) => {
    // Verifica se ja foi celebrado no localStorage
    const celebrated = localStorage.getItem(`milestone-${type}`)
    if (celebrated) return

    // Marca como celebrado
    localStorage.setItem(`milestone-${type}`, 'true')

    // Notifica o backend
    try {
      await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
    } catch (error) {
      console.error('Error recording milestone:', error)
    }

    // Dispara a celebracao
    setPendingMilestone(type)
  }, [])

  const dismissMilestone = useCallback(() => {
    setPendingMilestone(null)
  }, [])

  return {
    pendingMilestone,
    checkMilestone,
    dismissMilestone,
  }
}
