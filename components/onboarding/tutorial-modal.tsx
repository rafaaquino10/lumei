'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  BarChart3,
  Bell,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  X,
} from 'lucide-react'
import {
  trackTutorialStarted,
  trackTutorialStepCompleted,
  trackTutorialCompleted,
  trackTutorialSkipped,
} from '@/lib/analytics'

interface TutorialModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const TUTORIAL_STEPS = [
  {
    title: 'Bem-vindo ao Calcula MEI!',
    description: 'Vou te mostrar como controlar seu MEI de forma simples. São só 30 segundos!',
    icon: CheckCircle,
    color: 'bg-primary',
    visual: 'welcome',
  },
  {
    title: 'Registre seu faturamento',
    description: 'Todo mês, você me conta quanto faturou. Só isso! Eu calculo o resto.',
    icon: BarChart3,
    color: 'bg-blue-500',
    visual: 'registro',
  },
  {
    title: 'Acompanhe seu limite',
    description: 'Vou te mostrar quanto do limite de R$ 81.000 você já usou e quanto ainda pode faturar.',
    icon: AlertTriangle,
    color: 'bg-amber-500',
    visual: 'limite',
  },
  {
    title: 'Nunca esqueça do DAS',
    description: 'Te aviso antes do DAS vencer. Por email ou WhatsApp (Premium).',
    icon: Bell,
    color: 'bg-green-500',
    visual: 'alerta',
  },
  {
    title: 'Pronto para começar!',
    description: 'Vamos registrar seu primeiro faturamento?',
    icon: Calendar,
    color: 'bg-primary',
    visual: 'final',
  },
]

export function TutorialModal({ isOpen, onClose, onComplete }: TutorialModalProps) {
  const [step, setStep] = useState(0)
  const currentStep = TUTORIAL_STEPS[step]

  const handleNext = () => {
    // Track step completion
    trackTutorialStepCompleted(step + 1, TUTORIAL_STEPS[step].title)

    if (step < TUTORIAL_STEPS.length - 1) {
      setStep(step + 1)
    } else {
      // Track tutorial completion
      trackTutorialCompleted()
      onComplete()
    }
  }

  const handleSkip = () => {
    // Track tutorial skip
    trackTutorialSkipped(step + 1)
    localStorage.setItem('tutorial_completed', 'true')
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      setStep(0)
      // Track tutorial started
      trackTutorialStarted()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-secondary">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / TUTORIAL_STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="p-6 pt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              {/* Icon */}
              <div className={`w-16 h-16 ${currentStep.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <currentStep.icon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-foreground mb-2">
                {currentStep.title}
              </h2>

              {/* Description */}
              <p className="text-muted-foreground mb-6">
                {currentStep.description}
              </p>

              {/* Visual */}
              <div className="mb-6">
                <TutorialVisual type={currentStep.visual} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Pular tutorial
            </button>

            <div className="flex items-center gap-2">
              {/* Step indicators */}
              <div className="flex gap-1 mr-4">
                {TUTORIAL_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === step ? 'bg-primary' : i < step ? 'bg-primary/50' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <Button onClick={handleNext}>
                {step === TUTORIAL_STEPS.length - 1 ? (
                  <>
                    Começar
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function TutorialVisual({ type }: { type: string }) {
  switch (type) {
    case 'welcome':
      return (
        <div className="bg-secondary/50 rounded-xl p-4">
          <div className="flex items-center justify-center gap-4">
            <motion.div
              className="text-4xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              👋
            </motion.div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Controle simples</p>
              <p className="text-xs text-muted-foreground">para você focar no seu negócio</p>
            </div>
          </div>
        </div>
      )

    case 'registro':
      return (
        <div className="bg-secondary/50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium">Janeiro 2026</span>
          </div>
          <div className="bg-card rounded-lg p-3 border border-dashed border-primary">
            <p className="text-xs text-muted-foreground mb-1">Quanto você faturou?</p>
            <motion.p
              className="text-lg font-bold text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              R$ 4.500,00
            </motion.p>
          </div>
        </div>
      )

    case 'limite':
      return (
        <div className="bg-secondary/50 rounded-xl p-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>R$ 0</span>
            <span>R$ 81.000</span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: '55%' }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </div>
          <motion.p
            className="text-center text-sm font-medium mt-2 text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            55% usado • R$ 36.450 restante
          </motion.p>
        </div>
      )

    case 'alerta':
      return (
        <div className="bg-secondary/50 rounded-xl p-4">
          <motion.div
            className="bg-card rounded-lg p-3 border border-amber-200 dark:border-amber-800"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-foreground">Lembrete DAS</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Seu DAS vence em 5 dias (20/02). Valor: R$ 80,90
            </p>
          </motion.div>
        </div>
      )

    case 'final':
      return (
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4">
          <div className="flex items-center justify-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              🎉
            </motion.div>
            <span className="text-sm font-medium text-foreground">
              Tudo pronto!
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
            >
              🚀
            </motion.div>
          </div>
        </div>
      )

    default:
      return null
  }
}

// Hook para controlar exibição do tutorial
export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    const completed = localStorage.getItem('tutorial_completed')
    if (!completed) {
      // Mostra tutorial após 1 segundo
      const timer = setTimeout(() => setShowTutorial(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const completeTutorial = () => {
    localStorage.setItem('tutorial_completed', 'true')
    setShowTutorial(false)
  }

  const resetTutorial = () => {
    localStorage.removeItem('tutorial_completed')
    setShowTutorial(true)
  }

  return {
    showTutorial,
    setShowTutorial,
    completeTutorial,
    resetTutorial,
  }
}
