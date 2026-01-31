import { redirect } from 'next/navigation'
import { getServerUserWithAllCalcs } from '@/lib/auth/server'
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
import type { LucideIcon } from 'lucide-react'

type TipoCalculo = 'MARGEM_LUCRO' | 'PRECO_HORA' | 'PRECIFICACAO' | 'FATURAMENTO' | 'FLUXO_CAIXA' | 'CALENDARIO_DAS'

const CALCULATOR_CONFIG: Record<
  TipoCalculo,
  { icon: LucideIcon; label: string; href: string }
> = {
  MARGEM_LUCRO: {
    icon: TrendingUp,
    label: 'Margem de Lucro',
    href: '/calculadoras',
  },
  PRECO_HORA: {
    icon: Clock,
    label: 'Preço por Hora',
    href: '/calculadoras',
  },
  PRECIFICACAO: {
    icon: Tag,
    label: 'Precificação',
    href: '/calculadoras',
  },
  FATURAMENTO: {
    icon: BarChart3,
    label: 'Simulador Faturamento',
    href: '/calculadoras',
  },
  FLUXO_CAIXA: {
    icon: ArrowLeftRight,
    label: 'Fluxo de Caixa',
    href: '/calculadoras',
  },
  CALENDARIO_DAS: {
    icon: Calendar,
    label: 'Calendário DAS',
    href: '/calculadoras',
  },
}

type ResultadoJson = Record<string, unknown> | null

const getNumber = (value: unknown): number | null =>
  typeof value === 'number' && !Number.isNaN(value) ? value : null

const formatCurrency = (value: number) =>
  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

export default async function HistoricoPage() {
  const user = await getServerUserWithAllCalcs()

  if (!user) {
    redirect('/sign-in')
  }

  // Group by type
  const calculosPorTipo = user.calculos.reduce(
    (acc: Record<TipoCalculo, typeof user.calculos>, calculo: (typeof user.calculos)[number]) => {
      if (!acc[calculo.tipo as TipoCalculo]) {
        acc[calculo.tipo as TipoCalculo] = []
      }
      acc[calculo.tipo as TipoCalculo].push(calculo)
      return acc
    },
    {} as Record<TipoCalculo, typeof user.calculos>
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Histórico de Cálculos</h1>
        <p className="text-lg text-muted-foreground">
          Todos os seus cálculos salvos em um só lugar
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Total de Cálculos</p>
          <p className="text-3xl font-bold text-foreground">{user.calculos.length}</p>
        </Card>

        {user.plano === 'FREE' && (
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Limite (Free)</p>
            <p className="text-3xl font-bold text-foreground">
              {user.calculos.length}/50
            </p>
          </Card>
        )}

        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Mais Usado</p>
          <p className="text-xl font-bold text-foreground">
            {
              Object.entries(calculosPorTipo).sort(
                ([, a], [, b]) => (b as unknown[]).length - (a as unknown[]).length
              )[0]?.[0]
                ? CALCULATOR_CONFIG[
                    Object.entries(calculosPorTipo).sort(
                      ([, a], [, b]) => (b as unknown[]).length - (a as unknown[]).length
                    )[0][0] as TipoCalculo
                  ].label
                : '-'
            }
          </p>
        </Card>
      </div>

      {/* Calculations by type */}
      {Object.entries(calculosPorTipo).length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Você ainda não salvou nenhum cálculo
          </p>
          <Link href="/calculadoras">
            <Button>Fazer um Cálculo</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(calculosPorTipo).map(([tipo, calculos]: [string, typeof user.calculos]) => {
            const config = CALCULATOR_CONFIG[tipo as TipoCalculo]
            const Icon = config.icon
            const typedCalculos = calculos as typeof user.calculos

            return (
              <div key={tipo}>
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">{config.label}</h2>
                  <span className="text-muted-foreground">({typedCalculos.length})</span>
                </div>

                <div className="grid gap-3">
                  {typedCalculos.map((calculo: (typeof user.calculos)[number]) => (
                    <Card
                      key={calculo.id}
                      className="p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold mb-1 text-foreground">
                            {calculo.titulo ||
                              `${config.label} - ${new Date(
                                calculo.createdAt
                              ).toLocaleDateString('pt-BR')}`}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
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
                          <div className="bg-secondary/50 rounded p-3 mb-4">
                            <p className="text-sm text-muted-foreground mb-1">
                              Resultado Principal:
                            </p>
                            <p className="font-mono font-bold text-lg text-foreground">
                              {(() => {
                                const resultado = calculo.resultado as ResultadoJson

                                if (tipo === 'MARGEM_LUCRO') {
                                  const margemBruta = getNumber(resultado?.margemBruta)
                                  return margemBruta !== null
                                    ? `${margemBruta}% de margem`
                                    : '-'
                                }

                                if (tipo === 'PRECO_HORA') {
                                  const precoHoraFinal = getNumber(resultado?.precoHoraFinal)
                                  return precoHoraFinal !== null
                                    ? `${formatCurrency(precoHoraFinal)}/hora`
                                    : '-'
                                }

                                if (tipo === 'PRECIFICACAO') {
                                  const precoVenda = getNumber(resultado?.precoVenda)
                                  return precoVenda !== null
                                    ? formatCurrency(precoVenda)
                                    : '-'
                                }

                                if (tipo === 'FATURAMENTO') {
                                  const percentualUsado = getNumber(resultado?.percentualUsado)
                                  return percentualUsado !== null
                                    ? `${percentualUsado}% do teto`
                                    : '-'
                                }

                                if (tipo === 'FLUXO_CAIXA') {
                                  const saldo = getNumber(resultado?.saldo)
                                  return saldo !== null
                                    ? `Saldo: ${formatCurrency(saldo)}`
                                    : '-'
                                }

                                if (tipo === 'CALENDARIO_DAS') {
                                  const valorMensal = getNumber(resultado?.valorMensal)
                                  return valorMensal !== null
                                    ? `DAS: ${formatCurrency(valorMensal)}`
                                    : '-'
                                }

                                return '-'
                              })()}
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
