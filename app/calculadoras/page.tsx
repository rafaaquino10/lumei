'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { TrendingUp, Clock, Tag, BarChart3, ArrowLeftRight, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { MargemLucroCalc } from '@/components/calculadoras/margem-lucro-calc'
import { PrecoHoraCalc } from '@/components/calculadoras/preco-hora-calc'
import { PrecificacaoCalc } from '@/components/calculadoras/precificacao-calc'
import { FaturamentoCalc } from '@/components/calculadoras/faturamento-calc'
import { FluxoCaixaCalc } from '@/components/calculadoras/fluxo-caixa-calc'
import { DasCalc } from '@/components/calculadoras/das-calc'

type CalculadoraId = 'margem-lucro' | 'preco-hora' | 'precificacao' | 'faturamento' | 'fluxo-caixa' | 'das'

const calculadoras = [
  {
    id: 'margem-lucro' as CalculadoraId,
    icon: TrendingUp,
    titulo: 'Margem de Lucro',
    descricao: 'Descubra quanto você lucra',
  },
  {
    id: 'preco-hora' as CalculadoraId,
    icon: Clock,
    titulo: 'Preço por Hora',
    descricao: 'Calcule seu valor/hora',
  },
  {
    id: 'precificacao' as CalculadoraId,
    icon: Tag,
    titulo: 'Precificação',
    descricao: 'Defina preços ideais',
  },
  {
    id: 'faturamento' as CalculadoraId,
    icon: BarChart3,
    titulo: 'Faturamento',
    descricao: 'Simule seu faturamento',
  },
  {
    id: 'fluxo-caixa' as CalculadoraId,
    icon: ArrowLeftRight,
    titulo: 'Fluxo de Caixa',
    descricao: 'Controle entradas e saídas',
  },
  {
    id: 'das' as CalculadoraId,
    icon: Calendar,
    titulo: 'DAS',
    descricao: 'Calendário e valores',
  },
]

function CalculadorasContent() {
  const searchParams = useSearchParams()
  const [ativa, setAtiva] = useState<CalculadoraId>('margem-lucro')

  useEffect(() => {
    const calc = searchParams.get('calc') as CalculadoraId | null
    if (calc && calculadoras.some(c => c.id === calc)) {
      setAtiva(calc)
    }
  }, [searchParams])

  const renderCalculadora = () => {
    switch (ativa) {
      case 'margem-lucro':
        return <MargemLucroCalc />
      case 'preco-hora':
        return <PrecoHoraCalc />
      case 'precificacao':
        return <PrecificacaoCalc />
      case 'faturamento':
        return <FaturamentoCalc />
      case 'fluxo-caixa':
        return <FluxoCaixaCalc />
      case 'das':
        return <DasCalc />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Calculadoras MEI
        </h1>
        <p className="text-muted-foreground">
          Escolha uma calculadora abaixo para começar
        </p>
      </div>

      {/* Cards horizontais com scroll */}
      <div className="mb-8 overflow-x-auto pb-4 pt-2">
        <div className="flex gap-3 justify-center flex-wrap">
          {calculadoras.map((calc) => (
            <button
              key={calc.id}
              onClick={() => setAtiva(calc.id)}
              className="flex-shrink-0"
            >
              <Card
                className={cn(
                  'p-3 transition-all duration-200 flex items-center gap-3 min-w-[200px]',
                  ativa === calc.id
                    ? 'border-primary shadow-lg scale-105 bg-primary/5'
                    : 'hover:shadow-md hover:scale-[1.02]'
                )}
              >
                <calc.icon
                  className={cn(
                    'w-8 h-8 flex-shrink-0',
                    ativa === calc.id ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      'text-sm font-semibold mb-0.5 truncate',
                      ativa === calc.id ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {calc.titulo}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {calc.descricao}
                  </p>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>

      {/* Calculadora ativa */}
      <div className="mt-8">
        {renderCalculadora()}
      </div>
    </div>
  )
}

export default function CalculadorasPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">Carregando...</div>}>
      <CalculadorasContent />
    </Suspense>
  )
}
