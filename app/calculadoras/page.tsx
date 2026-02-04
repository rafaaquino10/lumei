'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { TrendingUp, Clock, Tag, BarChart3, ArrowLeftRight, Calendar, ArrowUpCircle, Target, Scale } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { MargemLucroCalc } from '@/components/calculadoras/margem-lucro-calc'
import { PrecoHoraCalc } from '@/components/calculadoras/preco-hora-calc'
import { PrecificacaoCalc } from '@/components/calculadoras/precificacao-calc'
import { FaturamentoCalc } from '@/components/calculadoras/faturamento-calc'
import { FluxoCaixaCalc } from '@/components/calculadoras/fluxo-caixa-calc'
import { DasCalc } from '@/components/calculadoras/das-calc'
import { TransicaoMeiMeCalc } from '@/components/calculadoras/transicao-mei-me-calc'
import { PontoEquilibrioCalc } from '@/components/calculadoras/ponto-equilibrio-calc'
import { ComparadorTributarioCalc } from '@/components/calculadoras/comparador-tributario-calc'
import { ROICalc } from '@/components/calculadoras/roi-calc'
import { CalculadorasPageSchema } from '@/components/calculator-schema'
import { AdWrapper } from '@/components/ads/ad-wrapper'
import { CalculatorSkeleton, CalculatorNavSkeleton } from '@/components/calculadoras/calculator-skeleton'

type CalculadoraId = 'margem-lucro' | 'preco-hora' | 'precificacao' | 'faturamento' | 'fluxo-caixa' | 'das' | 'transicao-mei-me' | 'ponto-equilibrio' | 'comparador-tributario' | 'roi'

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
  {
    id: 'transicao-mei-me' as CalculadoraId,
    icon: ArrowUpCircle,
    titulo: 'MEI → ME',
    descricao: 'Quando migrar?',
  },
  {
    id: 'ponto-equilibrio' as CalculadoraId,
    icon: Target,
    titulo: 'Ponto de Equilíbrio',
    descricao: 'Vendas mínimas',
  },
  {
    id: 'comparador-tributario' as CalculadoraId,
    icon: Scale,
    titulo: 'Comparador',
    descricao: 'MEI vs Simples vs LP',
  },
  {
    id: 'roi' as CalculadoraId,
    icon: TrendingUp,
    titulo: 'ROI',
    descricao: 'Retorno investimento',
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
      case 'transicao-mei-me':
        return <TransicaoMeiMeCalc />
      case 'ponto-equilibrio':
        return <PontoEquilibrioCalc />
      case 'comparador-tributario':
        return <ComparadorTributarioCalc />
      case 'roi':
        return <ROICalc />
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

      {/* Grid responsivo de calculadoras - 2 linhas de 5 no desktop, 2 colunas no mobile */}
      <div className="mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {calculadoras.map((calc) => (
            <button
              key={calc.id}
              onClick={() => setAtiva(calc.id)}
              className="w-full"
            >
              <Card
                className={cn(
                  'p-3 sm:p-4 transition-all duration-200 h-full',
                  'flex flex-col items-center text-center gap-1.5 sm:gap-2',
                  ativa === calc.id
                    ? 'border-primary shadow-lg bg-primary/5'
                    : 'hover:shadow-md hover:border-primary/50'
                )}
              >
                <calc.icon
                  className={cn(
                    'w-5 h-5 sm:w-6 sm:h-6',
                    ativa === calc.id ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <div>
                  <h3
                    className={cn(
                      'text-xs font-semibold leading-tight',
                      ativa === calc.id ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {calc.titulo}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block leading-tight">
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

      {/* Banner de anúncio para usuários não-premium */}
      <div className="mt-8">
        <AdWrapper format="horizontal" className="max-w-3xl mx-auto" />
      </div>
    </div>
  )
}

function CalculadorasLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="h-9 w-48 bg-accent animate-pulse rounded mx-auto mb-2" />
        <div className="h-5 w-72 bg-accent animate-pulse rounded mx-auto" />
      </div>
      <CalculatorNavSkeleton />
      <div className="mt-8">
        <CalculatorSkeleton />
      </div>
    </div>
  )
}

export default function CalculadorasPage() {
  return (
    <>
      <CalculadorasPageSchema />
      <Suspense fallback={<CalculadorasLoading />}>
        <CalculadorasContent />
      </Suspense>
    </>
  )
}
