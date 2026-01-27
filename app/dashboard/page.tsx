import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
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
  const { userId } = await auth()
  const clerkUser = await currentUser()

  if (!userId) {
    redirect('/sign-in')
  }

  // Fetch user from database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      calculos: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  if (!user) {
    redirect('/onboarding')
  }

  // Calculate stats
  const totalCalculos = await prisma.calculo.count({
    where: { userId: user.id },
  })

  // const calculosPorTipo = await prisma.calculo.groupBy({
  //   by: ['tipo'],
  //   where: { userId: user.id },
  //   _count: true,
  // })

  // Calculate days until next DAS (simplified)
  const today = new Date()
  const nextDAS = new Date(today.getFullYear(), today.getMonth() + 1, 20)
  const daysUntilDAS = Math.ceil(
    (nextDAS.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Welcome section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">
          Olá, {clerkUser?.firstName || 'empreendedor'}! 👋
        </h1>
        <p className="text-xl text-gray-600">
          Bem-vindo ao seu painel Lumei
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-600">Cálculos Feitos</h3>
            <Calculator className="w-8 h-8 text-lumei-500" />
          </div>
          <p className="text-4xl font-bold">{totalCalculos}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-600">Tipo de MEI</h3>
            <TrendingUp className="w-8 h-8 text-lumei-500" />
          </div>
          <p className="text-2xl font-bold">
            {user.tipoMEI?.replace('_', ' ') || 'Não informado'}
          </p>
        </Card>

        <Card className="p-6 bg-lumei-50 border-lumei-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Próximo DAS</h3>
            <Calendar className="w-8 h-8 text-lumei-600" />
          </div>
          <p className="text-4xl font-bold text-lumei-600">
            {daysUntilDAS} dias
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Vencimento: {nextDAS.toLocaleDateString('pt-BR')}
          </p>
        </Card>
      </div>

      {/* Quick access calculators */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Calculadoras Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/calcular/margem-lucro">
            <Card className="p-6 hover:shadow-lumei-lg transition-all cursor-pointer">
              <TrendingUp className="w-10 h-10 text-lumei-500 mb-3" />
              <h3 className="font-bold mb-1">Margem de Lucro</h3>
              <p className="text-sm text-gray-600">
                Calcule quanto você lucra
              </p>
            </Card>
          </Link>

          <Link href="/calcular/preco-hora">
            <Card className="p-6 hover:shadow-lumei-lg transition-all cursor-pointer">
              <Clock className="w-10 h-10 text-lumei-500 mb-3" />
              <h3 className="font-bold mb-1">Preço por Hora</h3>
              <p className="text-sm text-gray-600">
                Defina seu valor/hora
              </p>
            </Card>
          </Link>

          <Link href="/calcular/precificacao">
            <Card className="p-6 hover:shadow-lumei-lg transition-all cursor-pointer">
              <Tag className="w-10 h-10 text-lumei-500 mb-3" />
              <h3 className="font-bold mb-1">Precificação</h3>
              <p className="text-sm text-gray-600">
                Preço ideal de produtos/serviços
              </p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent calculations */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cálculos Recentes</h2>
          <Link href="/dashboard/historico">
            <Button variant="ghost">
              Ver Todos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {user.calculos.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-4">
              Você ainda não fez nenhum cálculo
            </p>
            <Link href="/calcular/margem-lucro">
              <Button>Começar Agora</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
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
                <Card key={calculo.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{tipoLabel}</h3>
                      <p className="text-sm text-gray-600">
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
        <Card className="mt-12 p-8 bg-linear-to-r from-lumei-50 to-lumei-100 border-lumei-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Quer alertas automáticos de DAS?
              </h3>
              <p className="text-gray-700">
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
  title: 'Dashboard | Lumei',
  description: 'Seu painel de controle Lumei',
}
