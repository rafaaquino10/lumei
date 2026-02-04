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
  ArrowRight,
  BarChart3,
  ArrowLeftRight,
  Calendar,
  Plus,
} from 'lucide-react'
import { RealDashboard } from '@/components/dashboard/real-dashboard'
import { UsageIndicatorWrapper } from '@/components/dashboard/usage-indicator-wrapper'
import { TutorialWrapper } from '@/components/dashboard/tutorial-wrapper'
import { MonthlyReminder } from '@/components/dashboard/monthly-reminder'

// Valores do DAS por tipo de MEI (2026)
const DAS_VALUES: Record<string, number> = {
  COMERCIO: 76.90,
  SERVICOS: 80.90,
  MISTO: 81.90,
  CAMINHONEIRO: 183.16,
}

const LIMITE_MEI = 81000

interface DashboardPageProps {
  searchParams: Promise<{ ano?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await getServerUserWithCalcs()

  if (!user) {
    redirect('/sign-in')
  }

  const params = await searchParams
  const anoAtual = new Date().getFullYear()
  const anoSelecionado = params.ano ? parseInt(params.ano, 10) : anoAtual

  // Validar ano (não pode ser maior que o atual nem muito antigo)
  const anoValido = Math.min(Math.max(anoSelecionado, 2020), anoAtual)

  // Buscar registros de faturamento do ano selecionado
  const registros = await prisma.registroFaturamento.findMany({
    where: {
      userId: user.id,
      ano: anoValido,
    },
    orderBy: { mes: 'asc' },
  })

  // Buscar registros do ano anterior para comparativo
  const registrosAnoAnterior = await prisma.registroFaturamento.findMany({
    where: {
      userId: user.id,
      ano: anoValido - 1,
    },
    orderBy: { mes: 'asc' },
  })

  // Calcular métricas reais
  const totalAcumulado = registros.reduce((sum, r) => sum + r.valor, 0)
  const mesesComRegistro = registros.length
  const mediaMovel = mesesComRegistro > 0 ? totalAcumulado / mesesComRegistro : 0
  const projecaoAnual = mediaMovel * 12
  const percentualLimite = (totalAcumulado / LIMITE_MEI) * 100
  const valorRestante = LIMITE_MEI - totalAcumulado
  const mesesAteEstourar = mediaMovel > 0 ? Math.floor(valorRestante / mediaMovel) : 999

  const metricas = {
    totalAcumulado,
    mesesComRegistro,
    mediaMovel,
    projecaoAnual,
    percentualLimite,
    valorRestante,
    mesesAteEstourar,
    limiteMEI: LIMITE_MEI,
    ano: anoValido,
  }

  // Métricas do ano anterior para comparativo
  const totalAnoAnterior = registrosAnoAnterior.reduce((sum, r) => sum + r.valor, 0)
  const mesesAnoAnterior = registrosAnoAnterior.length

  const dadosComparativo = {
    anoAtual: anoValido,
    totalAnoAtual: totalAcumulado,
    totalAnoAnterior,
    mesesAnoAtual: mesesComRegistro,
    mesesAnoAnterior,
  }

  // Próximo DAS
  const today = new Date()
  const nextDASDate = new Date(today.getFullYear(), today.getMonth() + 1, 20)
  const diasAteVencimento = Math.ceil((nextDASDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const dasValue = user.tipoMEI ? DAS_VALUES[user.tipoMEI] || 80.90 : 80.90

  const dasInfo = {
    data: nextDASDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    valor: dasValue,
    diasRestantes: diasAteVencimento,
  }

  // Verificar se onboarding está completo
  const onboardingCompleto = !!(user.tipoMEI && user.ocupacao)

  // Primeiro login: onboarding completo mas sem registros (novo usuário)
  const isFirstLogin = onboardingCompleto && registros.length === 0

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Tutorial para primeiro login */}
      <TutorialWrapper isFirstLogin={isFirstLogin} />
      {/* Welcome section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold mb-1 text-foreground">
              Olá, {user.name?.split(' ')[0] || 'empreendedor'}! 👋
            </h1>
            <p className="text-base text-muted-foreground">
              {onboardingCompleto
                ? registros.length > 0
                  ? 'Acompanhe seu controle financeiro'
                  : 'Registre seu faturamento para ver suas métricas'
                : 'Complete seu perfil para começar'}
            </p>
          </div>
          {user.plano === 'FREE' && (
            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <UsageIndicatorWrapper variant="compact" />
            </div>
          )}
        </div>
      </div>

      {/* Lembrete mensal de registro - só mostra no ano atual */}
      {onboardingCompleto && anoValido === anoAtual && (
        <MonthlyReminder
          registeredMonths={registros.map(r => r.mes)}
          ano={anoValido}
        />
      )}

      {/* Dashboard Financeiro Real */}
      <div className="mb-6">
        <RealDashboard
          registros={registros.map(r => ({
            id: r.id,
            mes: r.mes,
            ano: r.ano,
            valor: r.valor,
          }))}
          metricas={metricas}
          dasInfo={dasInfo}
          onboardingCompleto={onboardingCompleto}
          ocupacao={user.ocupacao}
          anoAtual={anoAtual}
          dadosComparativo={dadosComparativo}
          isPremium={user.plano === 'PREMIUM'}
          userData={{
            nome: user.name || undefined,
            cnpj: user.cnpj || undefined,
            tipoMEI: user.tipoMEI || undefined,
          }}
        />
      </div>

      {/* Ação Principal */}
      {onboardingCompleto && (
        <div className="mb-6">
          <Link href="/registrar">
            <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Registrar Faturamento</p>
                    <p className="text-xs text-muted-foreground">
                      Mantenha seu controle financeiro atualizado
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            </Card>
          </Link>
        </div>
      )}

      {/* Ferramentas de Apoio */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 text-foreground">Ferramentas de Apoio</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { icon: TrendingUp, label: 'Margem', href: '/calculadoras?calc=margem-lucro', desc: 'Calcular lucro' },
            { icon: Clock, label: 'Hora', href: '/calculadoras?calc=preco-hora', desc: 'Valor/hora' },
            { icon: Tag, label: 'Preço', href: '/calculadoras?calc=precificacao', desc: 'Preço ideal' },
            { icon: BarChart3, label: 'Simular', href: '/calculadoras?calc=faturamento', desc: 'Projeção' },
            { icon: ArrowLeftRight, label: 'Fluxo', href: '/calculadoras?calc=fluxo-caixa', desc: 'Entradas/saídas' },
            { icon: Calendar, label: 'DAS', href: '/calculadoras?calc=das', desc: 'Calendário' },
          ].map((tool) => (
            <Link key={tool.label} href={tool.href}>
              <Card className="p-3 hover:shadow-lg hover:border-primary transition-all cursor-pointer text-center h-full group">
                <tool.icon className="w-6 h-6 text-primary mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-foreground block">{tool.label}</span>
                <span className="text-xs text-muted-foreground hidden sm:block">{tool.desc}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Cálculos Recentes */}
      {user.calculos.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-foreground">Cálculos Recentes</h2>
            <Link href="/dashboard/historico">
              <Button variant="ghost" size="sm">
                Ver Todos
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            {user.calculos.slice(0, 3).map((calculo: {
              id: string
              tipo: 'MARGEM_LUCRO' | 'PRECO_HORA' | 'PRECIFICACAO' | 'FATURAMENTO' | 'FLUXO_CAIXA' | 'CALENDARIO_DAS'
              createdAt: string | Date
              titulo?: string | null
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
                <Card key={calculo.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-foreground">
                        {calculo.titulo || tipoLabel}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(calculo.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                        {' • '}
                        {tipoLabel}
                      </p>
                    </div>
                    <Link href={`/dashboard/historico?id=${calculo.id}`}>
                      <Button variant="ghost" size="sm">
                        Ver
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* CTA Premium */}
      {user.plano === 'FREE' && (
        <Card className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold mb-1 text-foreground">
                Quer alertas de DAS no WhatsApp?
              </h3>
              <p className="text-sm text-muted-foreground">
                Premium: alertas WhatsApp, histórico 5 anos, sem anúncios por R$ 14,90/mês
              </p>
            </div>
            <Link href="/premium">
              <Button size="sm" className="whitespace-nowrap">
                Ver Premium →
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dashboard | Calcula MEI',
  description: 'Controle financeiro do seu MEI - Acompanhe faturamento, limite e DAS',
}
