'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, TrendingUp, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface DashboardData {
  faturamentoAcumulado: number
  faturamentoMedio: number
  margemMedia: number
  limiteMEI: number
  proximoDAS: {
    data: string
    valor: number
    diasRestantes: number
  }
  lucroMes: number
  evolucaoMensal: number[]
  tipoMEI: string | null
  ocupacao: string | null
  totalCalculos: number
  onboardingCompleto: boolean
}

interface FinancialDashboardProps {
  data: DashboardData
  isBlurred?: boolean
  onUpgrade?: () => void
}

export function FinancialDashboard({ data, isBlurred = false, onUpgrade }: FinancialDashboardProps) {
  const percentualLimite = (data.faturamentoAcumulado / data.limiteMEI) * 100
  const statusLimite = percentualLimite >= 100 ? 'danger' : percentualLimite >= 80 ? 'warning' : 'ok'

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Se não completou onboarding, mostrar CTA para completar
  if (!data.onboardingCompleto) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Complete seu perfil para desbloquear o Dashboard
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Preencha suas informações de MEI para ver métricas personalizadas como faturamento,
              margem de lucro, limite MEI e muito mais.
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

  return (
    <div className="relative">
      {/* Blur overlay for paywall */}
      {isBlurred && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl">
          <Card className="p-6 text-center max-w-sm mx-4 shadow-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Visualizações esgotadas este mês
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Assine o Premium para acesso ilimitado ao seu Dashboard financeiro.
            </p>
            <Button onClick={onUpgrade} className="w-full">
              Desbloquear por R$ 14,90/mês
            </Button>
          </Card>
        </div>
      )}

      {/* Dashboard Content */}
      <div className={`space-y-4 ${isBlurred ? 'filter blur-md pointer-events-none' : ''}`}>
        {/* Header bar mockup */}
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 rounded-t-xl border border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-muted-foreground font-medium">
              Dashboard Financeiro • {data.ocupacao || 'MEI'}
            </span>
          </div>
        </div>

        {/* Main Dashboard Card */}
        <Card className="p-5 space-y-4 rounded-t-none -mt-4 border-t-0">
          {/* Metric Cards Row */}
          <div className="grid grid-cols-3 gap-3">
            <MetricCard
              label="Faturamento"
              value={formatCurrency(data.faturamentoAcumulado)}
              trend={data.faturamentoMedio > 0 ? `+${formatCurrency(data.faturamentoMedio)}/mês` : undefined}
              positive
            />
            <MetricCard
              label="Margem Média"
              value={`${data.margemMedia.toFixed(1)}%`}
              trend={data.margemMedia > 30 ? '+saudável' : 'baixa'}
              positive={data.margemMedia > 30}
            />
            <MetricCard
              label="Limite MEI"
              value={`${percentualLimite.toFixed(1)}%`}
              trend={statusLimite === 'ok' ? 'OK' : statusLimite === 'warning' ? 'Atenção' : 'Risco'}
              status={statusLimite}
            />
          </div>

          {/* Chart Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-secondary/50 rounded-xl p-4 border border-border/50"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Evolução Mensal</span>
              <span className="text-xs text-primary font-semibold">2026</span>
            </div>

            {/* Animated Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-24">
              {data.evolucaoMensal.map((value, i) => {
                const maxValue = Math.max(...data.evolucaoMensal, 1)
                const height = (value / maxValue) * 100
                const isCurrentMonth = i === new Date().getMonth()

                return (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      background: isCurrentMonth
                        ? 'linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary) / 0.7))'
                        : value > 0
                          ? 'hsl(var(--primary) / 0.4)'
                          : 'hsl(var(--muted-foreground) / 0.15)',
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 5)}%` }}
                    transition={{
                      delay: 0.3 + i * 0.05,
                      duration: 0.4,
                      ease: 'easeOut'
                    }}
                  />
                )
              })}
            </div>

            {/* Month labels */}
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-muted-foreground">Jan</span>
              <span className="text-[10px] text-muted-foreground">Jun</span>
              <span className="text-[10px] text-muted-foreground">Dez</span>
            </div>
          </motion.div>

          {/* Action Row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3"
          >
            {/* DAS Card */}
            <div className="flex-1 bg-primary/10 border border-primary/30 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Próximo DAS</p>
                  <p className="text-[10px] text-muted-foreground">
                    {data.proximoDAS.data} • {formatCurrency(data.proximoDAS.valor)}
                  </p>
                </div>
              </div>
            </div>

            {/* Lucro Card */}
            <div className="flex-1 bg-secondary/80 border border-border rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Lucro Estimado</p>
                  <p className="text-[10px] text-primary font-medium">
                    {data.lucroMes > 0 ? `+${formatCurrency(data.lucroMes)}` : 'Calcule para ver'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.6 }}
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
                  : 'Alerta: Acima do limite MEI'}
            </motion.div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  trend,
  positive = false,
  status,
}: {
  label: string
  value: string
  trend?: string
  positive?: boolean
  status?: 'ok' | 'warning' | 'danger'
}) {
  const getTrendColor = () => {
    if (status) {
      return status === 'ok' ? 'text-green-500' : status === 'warning' ? 'text-yellow-500' : 'text-red-500'
    }
    return positive ? 'text-green-500' : 'text-muted-foreground'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-secondary/50 rounded-lg p-3 border border-border/50"
    >
      <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-bold text-foreground truncate">{value}</p>
      {trend && (
        <p className={`text-[10px] font-medium mt-0.5 ${getTrendColor()}`}>
          {trend}
        </p>
      )}
    </motion.div>
  )
}
