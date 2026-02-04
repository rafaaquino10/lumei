'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react'

interface ComparativoAnualWidgetProps {
  anoAtual: number
  totalAnoAtual: number
  totalAnoAnterior: number
  mesesAnoAtual: number
  mesesAnoAnterior: number
}

export function ComparativoAnualWidget({
  anoAtual,
  totalAnoAtual,
  totalAnoAnterior,
  mesesAnoAtual,
  mesesAnoAnterior,
}: ComparativoAnualWidgetProps) {
  // Se não tem dados do ano anterior, não mostra
  if (totalAnoAnterior <= 0 || mesesAnoAnterior <= 0) return null

  // Calcular médias para comparação justa
  const mediaAnoAtual = mesesAnoAtual > 0 ? totalAnoAtual / mesesAnoAtual : 0
  const mediaAnoAnterior = totalAnoAnterior / mesesAnoAnterior

  // Variação percentual
  const variacao = mediaAnoAnterior > 0
    ? ((mediaAnoAtual - mediaAnoAnterior) / mediaAnoAnterior) * 100
    : 0

  // Status
  const status: 'up' | 'down' | 'neutral' =
    variacao > 5 ? 'up' : variacao < -5 ? 'down' : 'neutral'

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    })

  // Dados para o mini gráfico de barras comparativo
  const maxMedia = Math.max(mediaAnoAtual, mediaAnoAnterior)
  const alturaAtual = maxMedia > 0 ? (mediaAnoAtual / maxMedia) * 100 : 0
  const alturaAnterior = maxMedia > 0 ? (mediaAnoAnterior / maxMedia) * 100 : 0

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Comparativo Anual
          </h3>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          status === 'up'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : status === 'down'
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-secondary text-muted-foreground'
        }`}>
          {status === 'up' && <TrendingUp className="w-3 h-3" />}
          {status === 'down' && <TrendingDown className="w-3 h-3" />}
          {status === 'neutral' && <Minus className="w-3 h-3" />}
          {variacao > 0 ? '+' : ''}{variacao.toFixed(1)}%
        </div>
      </div>

      {/* Mini gráfico de barras */}
      <div className="flex items-end gap-4 h-16 mb-3">
        {/* Ano Anterior */}
        <div className="flex-1 flex flex-col items-center">
          <motion.div
            className="w-full bg-muted-foreground/30 rounded-t"
            initial={{ height: 0 }}
            animate={{ height: `${alturaAnterior}%` }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ minHeight: '4px' }}
          />
          <span className="text-[10px] text-muted-foreground mt-1">{anoAtual - 1}</span>
        </div>

        {/* Ano Atual */}
        <div className="flex-1 flex flex-col items-center">
          <motion.div
            className={`w-full rounded-t ${
              status === 'up' ? 'bg-green-500' :
              status === 'down' ? 'bg-red-500' :
              'bg-primary'
            }`}
            initial={{ height: 0 }}
            animate={{ height: `${alturaAtual}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ minHeight: '4px' }}
          />
          <span className="text-[10px] text-foreground font-medium mt-1">{anoAtual}</span>
        </div>
      </div>

      {/* Valores */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="bg-secondary/50 rounded p-2">
          <p className="text-[10px] text-muted-foreground">Média {anoAtual - 1}</p>
          <p className="text-sm font-semibold text-muted-foreground">
            {formatCurrency(mediaAnoAnterior)}
          </p>
        </div>
        <div className={`rounded p-2 ${
          status === 'up' ? 'bg-green-500/10' :
          status === 'down' ? 'bg-red-500/10' :
          'bg-primary/10'
        }`}>
          <p className="text-[10px] text-muted-foreground">Média {anoAtual}</p>
          <p className={`text-sm font-semibold ${
            status === 'up' ? 'text-green-600 dark:text-green-400' :
            status === 'down' ? 'text-red-600 dark:text-red-400' :
            'text-foreground'
          }`}>
            {formatCurrency(mediaAnoAtual)}
          </p>
        </div>
      </div>

      {/* Legenda */}
      <p className="text-[10px] text-muted-foreground text-center mt-2">
        {mesesAnoAtual} {mesesAnoAtual === 1 ? 'mês' : 'meses'} em {anoAtual} vs{' '}
        {mesesAnoAnterior} {mesesAnoAnterior === 1 ? 'mês' : 'meses'} em {anoAtual - 1}
      </p>
    </Card>
  )
}
