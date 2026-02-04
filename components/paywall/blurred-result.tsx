'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Lock, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface BlurredResultProps {
  type: 'anonymous' | 'free'
  children: React.ReactNode
}

/**
 * Componente que mostra o resultado borrado com overlay de upgrade
 * Usado quando o usuario atinge o limite de cálculos
 */
export function BlurredResult({ type, children }: BlurredResultProps) {
  const isAnonymous = type === 'anonymous'

  return (
    <div className="relative">
      {/* Resultado borrado */}
      <div className="blur-md select-none pointer-events-none opacity-70">
        {children}
      </div>

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Card className="p-6 shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur-sm max-w-sm mx-4">
          {/* Icone */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
              {isAnonymous ? (
                <Lock className="w-7 h-7 text-primary" />
              ) : (
                <Sparkles className="w-7 h-7 text-primary" />
              )}
            </div>
          </div>

          {/* Titulo */}
          <h3 className="text-lg font-bold text-center mb-2 text-foreground">
            {isAnonymous
              ? 'Seu resultado está pronto!'
              : 'Resultado calculado!'}
          </h3>

          {/* Descricao */}
          <p className="text-center text-muted-foreground text-sm mb-4">
            {isAnonymous ? (
              <>
                Crie uma conta gratuita para ver o resultado completo e salvar seus cálculos.
              </>
            ) : (
              <>
                Faça upgrade para Premium e tenha cálculos ilimitados por apenas R$ 14,90/mes.
              </>
            )}
          </p>

          {/* CTA */}
          <div className="space-y-2">
            {isAnonymous ? (
              <>
                <Link href="/sign-up" className="block">
                  <Button className="w-full" size="lg">
                    Ver resultado grátis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/sign-in" className="block">
                  <Button variant="ghost" className="w-full text-sm">
                    Já tenho conta
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/premium" className="block">
                  <Button className="w-full" size="lg">
                    Desbloquear resultado
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <p className="text-xs text-center text-muted-foreground">
                  Seu limite mensal foi atingido. Renova no próximo mês.
                </p>
              </>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
