import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getServerUserWithCalcs } from '@/lib/auth/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  TrendingUp,
  Clock,
  Tag,
  Calendar,
  ArrowRight,
  Calculator,
} from 'lucide-react'

export default async function DashboardPage() {
  const user = await getServerUserWithCalcs()

  if (!user) {
    redirect('/sign-in')
  }

  // Calculate stats
  const totalCalculos = await prisma.calculo.count({
    where: { userId: user.id },
  })

  // Calculate days until next DAS (simplified)
  const today = new Date()
  const nextDAS = new Date(today.getFullYear(), today.getMonth() + 1, 20)
  const daysUntilDAS = Math.ceil(
    (nextDAS.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Olá, {user.name?.split(' ')[0] || 'empreendedor'}! 👋
        </h1>
        <p className="text-lg text-muted-foreground">
          Bem-vindo ao seu painel Calcula MEI
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Cálculos Feitos</h3>
            <Calculator className="w-6 h-6 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{totalCalculos}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Tipo de MEI</h3>
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <p className="text-xl font-bold text-foreground">
            {user.tipoMEI?.replace('_', ' ') || 'Não informado'}
          </p>
        </Card>

        <Card className="p-4 bg-primary/10 border-primary">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-foreground">Próximo DAS</h3>
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">
            {daysUntilDAS} dias
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Vencimento: {nextDAS.toLocaleDateString('pt-BR')}
          </p>
        </Card>
      </div>

      {/* Quick access calculators */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-foreground">Calculadoras Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/calculadoras">
            <Card className="p-4 hover:shadow-lg hover:border-primary transition-all cursor-pointer">
              <TrendingUp className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-bold mb-1 text-foreground">Margem de Lucro</h3>
              <p className="text-sm text-muted-foreground">
                Calcule quanto você lucra
              </p>
            </Card>
          </Link>

          <Link href="/calculadoras">
            <Card className="p-4 hover:shadow-lg hover:border-primary transition-all cursor-pointer">
              <Clock className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-bold mb-1 text-foreground">Preço por Hora</h3>
              <p className="text-sm text-muted-foreground">
                Defina seu valor/hora
              </p>
            </Card>
          </Link>

          <Link href="/calculadoras">
            <Card className="p-4 hover:shadow-lg hover:border-primary transition-all cursor-pointer">
              <Tag className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-bold mb-1 text-foreground">Precificação</h3>
              <p className="text-sm text-muted-foreground">
                Preço ideal de produtos/serviços
              </p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent calculations */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">Cálculos Recentes</h2>
          <Link href="/dashboard/historico">
            <Button variant="ghost">
              Ver Todos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {user.calculos.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Você ainda não fez nenhum cálculo
            </p>
            <Link href="/calculadoras">
              <Button>Começar Agora</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {user.calculos.map((calculo: {
              id: string
              tipo: 'MARGEM_LUCRO' | 'PRECO_HORA' | 'PRECIFICACAO' | 'FATURAMENTO' | 'FLUXO_CAIXA' | 'CALENDARIO_DAS'
              createdAt: string | Date
            } & Record<string, unknown>) => {
              const tipoLabelMap = {
                MARGEM_LUCRO: 'Margem de Lucro',
                PRECO_HORA: 'Preço por Hora',
                PRECIFICACAO: 'Precificação',
                FATURAMENTO: 'Faturamento',
                FLUXO_CAIXA: 'Fluxo de Caixa',
                CALENDARIO_DAS: 'Calendário DAS',
              } as const
              const tipoLabel = tipoLabelMap[calculo.tipo]

              return (
                <Card key={calculo.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-foreground">{tipoLabel}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(calculo.createdAt).toLocaleDateString(
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
                    </div>
                    <Button variant="ghost" size="sm">
                      Ver Detalhes
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* CTA to Premium (if free user) */}
      {user.plano === 'FREE' && (
        <Card className="mt-8 p-6 bg-primary/10 border-primary">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                Quer alertas automáticos de DAS?
              </h3>
              <p className="text-muted-foreground">
                Com Premium você recebe 3 alertas (email + WhatsApp) e muito
                mais por R$ 19/mês
              </p>
            </div>
            <Link href="/premium">
              <Button size="lg" className="whitespace-nowrap">
                Ver Premium →
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}

export const metadata = {
  title: 'Dashboard | Calcula MEI',
  description: 'Seu painel de controle Calcula MEI',
}
