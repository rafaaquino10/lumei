'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  trackMonthlyReminderShown,
  trackMonthlyReminderClicked,
  trackMonthlyReminderDismissed,
} from '@/lib/analytics'

interface MonthlyReminderProps {
  registeredMonths: number[] // Array de meses já registrados (1-12)
  ano: number
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

/**
 * Banner de lembrete para registrar faturamento do mês
 * Aparece se o mês atual (ou anterior) não foi registrado
 */
export function MonthlyReminder({ registeredMonths, ano }: MonthlyReminderProps) {
  const [dismissed, setDismissed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const currentMonth = new Date().getMonth() + 1 // 1-12
  const currentYear = new Date().getFullYear()
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1

  // Verificar quais meses precisam ser registrados
  const missingMonths: number[] = []

  // Se estamos no mesmo ano, verificar mês anterior
  if (ano === currentYear && !registeredMonths.includes(previousMonth)) {
    missingMonths.push(previousMonth)
  }

  // Se estamos no início do ano e o ano anterior não foi completado
  // (isso seria tratado de forma diferente na prática)

  useEffect(() => {
    // Verificar se já foi dispensado hoje
    const dismissedKey = `reminder_dismissed_${ano}_${previousMonth}`
    const wasDismissed = localStorage.getItem(dismissedKey)

    if (!wasDismissed && missingMonths.length > 0) {
      // Mostra após um delay para não ser intrusivo
      const timer = setTimeout(() => {
        setIsVisible(true)
        trackMonthlyReminderShown()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [ano, previousMonth, missingMonths.length])

  const handleDismiss = () => {
    trackMonthlyReminderDismissed()
    const dismissedKey = `reminder_dismissed_${ano}_${previousMonth}`
    localStorage.setItem(dismissedKey, 'true')
    setDismissed(true)
  }

  const handleClick = () => {
    trackMonthlyReminderClicked()
  }

  if (dismissed || !isVisible || missingMonths.length === 0) {
    return null
  }

  const monthName = MONTH_NAMES[previousMonth - 1]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-4"
      >
        <div className="relative bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
            aria-label="Fechar lembrete"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                Você já registrou {monthName}?
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                Mantenha seu controle financeiro atualizado registrando o faturamento do mês passado.
              </p>

              {/* CTA */}
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-amber-700 border-amber-300 hover:bg-amber-200 dark:text-amber-200 dark:border-amber-700 dark:hover:bg-amber-900/50"
                  asChild
                >
                  <Link href="/registrar" onClick={handleClick}>
                    Registrar agora
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
