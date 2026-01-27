import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  TrendingUp,
  Clock,
  Tag,
  BarChart3,
  ArrowLeftRight,
  Calendar,
  Download,
  ArrowRight,
} from 'lucide-react'
import { DeleteCalculationButton } from '@/components/delete-calculation-button'

type TipoCalculo = 'MARGEM_LUCRO' | 'PRECO_HORA' | 'PRECIFICACAO' | 'FATURAMENTO' | 'FLUXO_CAIXA' | 'CALENDARIO_DAS'

const CALCULATOR_CONFIG: Record<
  TipoCalculo,
  { icon: any; label: string; href: string }
> = {
  MARGEM_LUCRO: {
    icon: TrendingUp,
    label: 'Margem de Lucro',
    href: '/calcular/margem-lucro',
  },
  PRECO_HORA: {
    icon: Clock,
    label: 'Preço por Hora',
    href: '/calcular/preco-hora',
  },
  PRECIFICACAO: {
    icon: Tag,
    label: 'Precificação',
    href: '/calcular/precificacao',
  },
  FATURAMENTO: {
    icon: BarChart3,
    label: 'Simulador Faturamento',
    href: '/calcular/faturamento',
  },
  FLUXO_CAIXA: {
    icon: ArrowLeftRight,
    label: 'Fluxo de Caixa',
    href: '/calcular/fluxo-caixa',
  },
  CALENDARIO_DAS: {
    icon: Calendar,
    label: 'Calendário DAS',
    href: '/calcular/das',
  },
}

export default async function HistoricoPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      calculos: {
        orderBy: { createdAt: 'desc' },
        take: 100, // Limit to last 100
      },
    },
  })

  if (!user) {
    redirect('/onboarding')
  }

  // Group by type
  const calculosPorTipo = user.calculos.reduce(
    (acc, calculo) => {
      if (!acc[calculo.tipo]) {
        acc[calculo.tipo] = []
      }
      acc[calculo.tipo].push(calculo)
      return acc
    },
    {} as Record<TipoCalculo, typeof user.calculos>
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Histórico de Cálculos</h1>
        <p className="text-xl text-gray-600">
          Todos os seus cálculos salvos em um só lugar
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Total de Cálculos</p>
          <p className="text-3xl font-bold">{user.calculos.length}</p>
        </Card>

        {user.plano === 'FREE' && (
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Limite (Free)</p>
            <p className="text-3xl font-bold">
              {user.calculos.length}/50
            </p>
          </Card>
        )}

        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Mais Usado</p>
          <p className="text-xl font-bold">
            {
              Object.entries(calculosPorTipo).sort(
                ([, a], [, b]) => b.length - a.length
              )[0]?.[0]
                ? CALCULATOR_CONFIG[
                    Object.entries(calculosPorTipo).sort(
                      ([, a], [, b]) => b.length - a.length
                    )[0][0] as TipoCalculo
                  ].label
                : '-'
            }
          </p>
        </Card>
      </div>

      {/* Calculations by type */}
      {Object.entries(calculosPorTipo).length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">
            Você ainda não salvou nenhum cálculo
          </p>
          <Link href="/">
            <Button>Fazer um Cálculo</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-12">
          {Object.entries(calculosPorTipo).map(([tipo, calculos]) => {
            const config = CALCULATOR_CONFIG[tipo as TipoCalculo]
            const Icon = config.icon

            return (
              <div key={tipo}>
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="w-6 h-6 text-lumei-500" />
                  <h2 className="text-2xl font-bold">{config.label}</h2>
                  <span className="text-gray-500">({calculos.length})</span>
                </div>

                <div className="grid gap-4">
                  {calculos.map((calculo) => (
                    <Card
                      key={calculo.id}
                      className="p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">
                            {calculo.titulo ||
                              `${config.label} - ${new Date(
                                calculo.createdAt
                              ).toLocaleDateString('pt-BR')}`}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {new Date(calculo.createdAt).toLocaleString(
                              'pt-BR',
                              {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </p>

                          {/* Show key result */}
                          <div className="bg-gray-50 rounded p-3 mb-4">
                            <p className="text-sm text-gray-600 mb-1">
                              Resultado Principal:
                            </p>
                            <p className="font-mono font-bold text-lg">
                              {tipo === 'MARGEM_LUCRO' &&
                                `${calculo.resultado.margemBruta}% de margem`}
                              {tipo === 'PRECO_HORA' &&
                                `R$ ${calculo.resultado.precoHoraFinal}/hora`}
                              {tipo === 'PRECIFICACAO' &&
                                `R$ ${calculo.resultado.precoVenda}`}
                              {tipo === 'FATURAMENTO' &&
                                `${calculo.resultado.percentualUsado}% do teto`}
                              {tipo === 'FLUXO_CAIXA' &&
                                `Saldo: R$ ${calculo.resultado.saldo}`}
                              {tipo === 'CALENDARIO_DAS' &&
                                `DAS de ${calculo.resultado.tipo}: R$ ${calculo.resultado.meses[0]?.valor}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full lg:w-auto lg:ml-4">
                          <Link href={`${config.href}?load=${calculo.id}`}>
                            <Button size="sm" variant="outline" className="w-full">
                              Ver Detalhes
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>

                          <Button size="sm" variant="ghost" className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            PDF
                          </Button>

                          <DeleteCalculationButton id={calculo.id} />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const metadata = {
  title: 'Histórico de Cálculos',
  description: 'Veja todos os seus cálculos salvos',
}
