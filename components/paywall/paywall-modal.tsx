'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Lock, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'anonymous' | 'free'
  remaining?: number
  limit?: number
}

export function PaywallModal({
  isOpen,
  onClose,
  type,
  remaining = 0,
  limit = 0
}: PaywallModalProps) {
  if (!isOpen) return null

  const isAnonymous = type === 'anonymous'

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-md"
          >
            <Card className="p-6 shadow-xl border-2">
              {/* Botão fechar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Ícone */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  {isAnonymous ? (
                    <Lock className="w-8 h-8 text-primary" />
                  ) : (
                    <Zap className="w-8 h-8 text-primary" />
                  )}
                </div>
              </div>

              {/* Título */}
              <h2 className="text-xl font-bold text-center mb-2 text-foreground">
                {isAnonymous
                  ? 'Limite de cálculos atingido'
                  : 'Você atingiu seu limite mensal'}
              </h2>

              {/* Descrição */}
              <p className="text-center text-muted-foreground mb-4 text-sm">
                {isAnonymous ? (
                  <>
                    Você usou <strong>{limit - remaining}</strong> de{' '}
                    <strong>{limit}</strong> cálculos grátis hoje.
                    <br />
                    Faça login para ter mais cálculos!
                  </>
                ) : (
                  <>
                    Você usou <strong>{limit - remaining}</strong> de{' '}
                    <strong>{limit}</strong> cálculos este mês.
                    <br />
                    Faça upgrade para cálculos ilimitados!
                  </>
                )}
              </p>

              {/* Benefícios */}
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-sm mb-2 text-foreground">
                  {isAnonymous ? 'Com uma conta gratuita:' : 'Com o Premium:'}
                </h3>
                <ul className="space-y-1.5 text-sm">
                  {isAnonymous ? (
                    <>
                      <li className="flex items-center gap-2 text-foreground">
                        <span className="text-primary">✓</span>
                        10 cálculos por mês
                      </li>
                      <li className="flex items-center gap-2 text-foreground">
                        <span className="text-primary">✓</span>
                        Salvar histórico de cálculos
                      </li>
                      <li className="flex items-center gap-2 text-foreground">
                        <span className="text-primary">✓</span>
                        Alertas de vencimento do DAS
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2 text-foreground">
                        <span className="text-primary">✓</span>
                        Cálculos ilimitados
                      </li>
                      <li className="flex items-center gap-2 text-foreground">
                        <span className="text-primary">✓</span>
                        3 alertas DAS por WhatsApp
                      </li>
                      <li className="flex items-center gap-2 text-foreground">
                        <span className="text-primary">✓</span>
                        Exportação PDF e Excel
                      </li>
                      <li className="flex items-center gap-2 text-foreground">
                        <span className="text-primary">✓</span>
                        PDFs verificados com seus dados
                      </li>
                      <li className="flex items-center gap-2 text-foreground">
                        <span className="text-primary">✓</span>
                        Sem anúncios
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* CTAs */}
              <div className="space-y-2">
                {isAnonymous ? (
                  <>
                    <Link href="/sign-up" className="block">
                      <Button className="w-full" size="lg">
                        Criar conta grátis
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/sign-in" className="block">
                      <Button variant="outline" className="w-full">
                        Já tenho conta
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/premium" className="block">
                      <Button className="w-full" size="lg">
                        Assinar Premium - R$ 14,90/mês
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full" onClick={onClose}>
                      Continuar com limite
                    </Button>
                  </>
                )}
              </div>

              {/* Footer */}
              {isAnonymous && (
                <p className="text-xs text-center text-muted-foreground mt-3">
                  Volte amanhã para mais 3 cálculos grátis
                </p>
              )}
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
