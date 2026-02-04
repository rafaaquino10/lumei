'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'

interface UpgradeBannerProps {
  type: 'anonymous' | 'free'
  remaining: number
  limit: number
}

export function UpgradeBanner({ type, remaining, limit }: UpgradeBannerProps) {
  const { isSignedIn } = useAuth()
  const isAnonymous = type === 'anonymous'
  const used = limit - remaining

  // Nao mostra se ainda tem bastante uso
  if (remaining > 2) return null

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 mt-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground mb-1">
            {remaining === 0
              ? isAnonymous
                ? 'Limite diário atingido'
                : 'Limite mensal atingido'
              : `Você usou ${used} de ${limit} cálculos ${isAnonymous ? 'hoje' : 'este mês'}`
            }
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            {isAnonymous
              ? 'Crie uma conta gratuita para mais cálculos e acesso ao histórico!'
              : 'Faça upgrade para cálculos ilimitados, PDFs verificados e mais!'
            }
          </p>
          <div className="flex flex-wrap gap-2">
            {isAnonymous ? (
              <>
                <Link href="/sign-up">
                  <Button size="sm" className="gap-1">
                    Criar conta grátis
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button size="sm" variant="ghost" className="whitespace-nowrap">
                    Já tenho conta
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/premium">
                <Button size="sm" className="gap-1">
                  Ver Premium - R$ 14,90/mês
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
