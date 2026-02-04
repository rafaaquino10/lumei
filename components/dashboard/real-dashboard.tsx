'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Plus,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'
import { InfoTooltip, METRIC_TOOLTIPS } from '@/components/ui/info-tooltip'

interface RegistroFaturamento {
  id: string
  mes: number
  ano: number
  valor: number
}

interface Metricas {
  totalAcumulado: number
  mesesComRegistro: number
  mediaMovel: number
  projecaoAnual: number
  percentualLimite: number
  valorRestante: number
  mesesAteEstourar: number
  limiteMEI: number
  ano: number
}

interface DasInfo {
  data: string
  valor: number
  diasRestantes: number
}

interface RealDashboardProps {
  registros: RegistroFaturamento[]
  metricas: Metricas | null
  dasInfo: DasInfo
  onboardingCompleto: boolean
  ocupacao: string | null
}

const MESES_CURTOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function RealDashboard({
  registros,
  metricas,
  dasInfo,
  onboardingCompleto,
  ocupacao,
}: RealDashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const mesAtual = new Date().getMonth() + 1
  const temRegistroMesAtual = registros.some(r => r.mes === mesAtual)
  const temDados = registros.length > 0

  // Preparar dados do gráfico
  const evolucaoMensal = Array(12).fill(0)
  registros.forEach(r => {
    evolucaoMensal[r.mes - 1] = r.valor
  })
  const maxValor = Math.max(...evolucaoMensal, 1)

  // Status do limite
  const percentualLimite = metricas?.percentualLimite || 0
  const statusLimite = percentualLimite >= 100 ? 'danger' : percentualLimite >= 80 ? 'warning' : 'ok'

  // Se não completou onboarding
  if (!onboardingCompleto) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Complete seu perfil para começar
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Informe seu tipo de MEI para calcularmos o DAS correto e personalizarmos
              seu dashboard.
            </p>
          </div>
          <Link href="/onboarding">
            <Button className="mt-2">
              Completar Perfil
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Card>
    )
  }

  // Se não tem registros ainda
  if (!temDados) {
    return (
      <Card className="p-6 border-dashed border-2">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Registre seu primeiro faturamento
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Para ver suas métricas financeiras, registre quanto você faturou este mês.
              Leva menos de 1 minuto.
            </p>
          </div>
          <Link href="/registrar">
            <Button className="mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Registrar Faturamento
            </Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Alerta para registrar mês atual */}
      {!temRegistroMesAtual && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-3 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-800 dark:text-amber-200">
                  Você ainda não registrou o faturamento de {MESES_CURTOS[mesAtual - 1]}
                </span>
              </div>
              <Link href="/registrar">
                <Button size="sm" variant="outline" className="text-amber-700 border-amber-300">
                  Registrar
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 rounded-t-xl border border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-muted-foreground font-medium">
            Controle Financeiro • {ocupacao || 'MEI'} • {metricas?.ano}
          </span>
        </div>
      </div>

      {/* Main Dashboard */}
      <Card className="p-5 space-y-4 rounded-t-none -mt-4 border-t-0">
        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            label={
              <InfoTooltip {...METRIC_TOOLTIPS.faturamentoAcumulado}>
                <span>Faturamento</span>
              </InfoTooltip>
            }
            value={formatCurrency(metricas?.totalAcumulado || 0)}
            subtext={`${metricas?.mesesComRegistro || 0} meses registrados`}
          />
          <MetricCard
            label={
              <InfoTooltip {...METRIC_TOOLTIPS.percentualLimite}>
                <span>Limite MEI</span>
              </InfoTooltip>
            }
            value={`${percentualLimite.toFixed(1)}%`}
            subtext={`Resta ${formatCurrency(metricas?.valorRestante || 81000)}`}
            status={statusLimite}
          />
          <MetricCard
            label={
              <InfoTooltip {...METRIC_TOOLTIPS.mediaMovel}>
                <span>Média/Mês</span>
              </InfoTooltip>
            }
            value={formatCurrency(metricas?.mediaMovel || 0)}
            subtext="baseado nos registros"
          />
          <MetricCard
            label={
              <InfoTooltip {...METRIC_TOOLTIPS.projecaoAnual}>
                <span>Projeção Anual</span>
              </InfoTooltip>
            }
            value={formatCurrency(metricas?.projecaoAnual || 0)}
            subtext={metricas && metricas.projecaoAnual > 81000 ? 'Acima do limite!' : 'se manter média'}
            status={metricas && metricas.projecaoAnual > 81000 ? 'danger' : undefined}
          />
        </div>

        {/* Gráfico de Evolução */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary/50 rounded-xl p-4 border border-border/50"
        >
          <div className="flex items-center justify-between mb-3">
            <InfoTooltip {...METRIC_TOOLTIPS.evolucaoMensal}>
              <span className="text-sm font-medium text-foreground">Evolução Mensal</span>
            </InfoTooltip>
            <Link href="/registrar" className="text-xs text-primary hover:underline">
              Ver detalhes
            </Link>
          </div>

          <div className="flex items-end justify-between gap-1 h-24">
            {evolucaoMensal.map((valor, i) => {
              const height = (valor / maxValor) * 100
              const isCurrentMonth = i === mesAtual - 1
              const hasData = valor > 0

              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <motion.div
                    className={`w-full rounded-t-sm ${
                      isCurrentMonth
                        ? 'bg-gradient-to-t from-primary to-primary/70'
                        : hasData
                          ? 'bg-primary/40'
                          : 'bg-muted-foreground/10'
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, hasData ? 10 : 3)}%` }}
                    transition={{ delay: 0.3 + i * 0.03, duration: 0.4 }}
                  />
                </div>
              )
            })}
          </div>

          <div className="flex justify-between mt-2">
            {MESES_CURTOS.map((mes, i) => (
              <span
                key={mes}
                className={`text-[8px] flex-1 text-center ${
                  i === mesAtual - 1 ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                {mes}
              </span>
            ))}
          </div>
        </motion.div>

        {/* DAS e Status */}
        <div className="flex items-center gap-3">
          {/* DAS Card */}
          <div className="flex-1 bg-primary/10 border border-primary/30 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <InfoTooltip {...METRIC_TOOLTIPS.proximoDAS}>
                  <p className="text-xs font-semibold text-foreground">Próximo DAS</p>
                </InfoTooltip>
                <p className="text-[10px] text-muted-foreground">
                  {dasInfo.data} • {formatCurrency(dasInfo.valor)}
                </p>
              </div>
            </div>
          </div>

          {/* Meses até estourar */}
          <div className="flex-1 bg-secondary/80 border border-border rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                statusLimite === 'ok'
                  ? 'bg-green-500'
                  : statusLimite === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}>
                {statusLimite === 'ok' ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-white" />
                )}
              </div>
              <div>
                <InfoTooltip {...METRIC_TOOLTIPS.mesesAteEstourar}>
                  <p className="text-xs font-semibold text-foreground">Meses até limite</p>
                </InfoTooltip>
                <p className="text-[10px] text-muted-foreground">
                  {metricas?.mesesAteEstourar && metricas.mesesAteEstourar < 999
                    ? `~${metricas.mesesAteEstourar} meses`
                    : 'Tranquilo'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.4 }}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              statusLimite === 'ok'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : statusLimite === 'warning'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {statusLimite === 'ok' ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <AlertCircle className="w-3 h-3" />
            )}
            {statusLimite === 'ok'
              ? 'Dentro do limite MEI'
              : statusLimite === 'warning'
                ? 'Atenção: Próximo do limite'
                : 'Alerta: Risco de desenquadramento'}
          </motion.div>
        </div>
      </Card>
    </div>
  )
}

function MetricCard({
  label,
  value,
  subtext,
  status,
}: {
  label: React.ReactNode
  value: string
  subtext?: string
  status?: 'ok' | 'warning' | 'danger'
}) {
  const getStatusColor = () => {
    if (!status) return 'text-foreground'
    return status === 'ok' ? 'text-green-600' : status === 'warning' ? 'text-yellow-600' : 'text-red-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-secondary/50 rounded-lg p-3 border border-border/50"
    >
      <div className="text-[10px] text-muted-foreground mb-1">{label}</div>
      <p className={`text-sm font-bold truncate ${getStatusColor()}`}>{value}</p>
      {subtext && (
        <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{subtext}</p>
      )}
    </motion.div>
  )
}
