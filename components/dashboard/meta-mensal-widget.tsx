'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Target, TrendingUp, Edit2, Check, X } from 'lucide-react'

interface MetaMensalWidgetProps {
  mediaMensal: number
  faturamentoMesAtual: number
  mesAtual: string
}

const STORAGE_KEY = 'calculamei-meta-mensal'

export function MetaMensalWidget({
  mediaMensal,
  faturamentoMesAtual,
  mesAtual,
}: MetaMensalWidgetProps) {
  const [metaPersonalizada, setMetaPersonalizada] = useState<number | null>(null)
  const [editando, setEditando] = useState(false)
  const [inputValue, setInputValue] = useState('')

  // Carregar meta salva do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = parseFloat(saved)
      if (!isNaN(parsed) && parsed > 0) {
        setMetaPersonalizada(parsed)
      }
    }
  }, [])

  // Meta sugerida: média + 10%
  const metaSugerida = Math.round(mediaMensal * 1.1)
  const metaAtual = metaPersonalizada || metaSugerida

  // Progresso
  const progresso = metaAtual > 0 ? (faturamentoMesAtual / metaAtual) * 100 : 0
  const progressoLimitado = Math.min(progresso, 100)

  // Status
  const atingiuMeta = faturamentoMesAtual >= metaAtual
  const percentualFaltando = Math.max(0, 100 - progresso)

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

  const handleSalvar = () => {
    const valor = parseFloat(inputValue.replace(/\D/g, ''))
    if (!isNaN(valor) && valor > 0) {
      setMetaPersonalizada(valor)
      localStorage.setItem(STORAGE_KEY, valor.toString())
    }
    setEditando(false)
    setInputValue('')
  }

  const handleCancelar = () => {
    setEditando(false)
    setInputValue('')
  }

  const handleResetarMeta = () => {
    setMetaPersonalizada(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  // Não mostrar se não tem média (sem dados suficientes)
  if (mediaMensal <= 0) return null

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Meta de {mesAtual}</h3>
        </div>
        {!editando && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => {
              setInputValue(metaAtual.toString())
              setEditando(true)
            }}
          >
            <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>
        )}
      </div>

      {editando ? (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Defina sua meta mensal (R$)
            </label>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={metaSugerida.toString()}
              className="h-9"
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSalvar} className="flex-1">
              <Check className="w-3.5 h-3.5 mr-1" />
              Salvar
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelar}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
          {metaPersonalizada && (
            <button
              onClick={handleResetarMeta}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Usar meta sugerida ({formatCurrency(metaSugerida)})
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Meta e Progresso */}
          <div className="mb-3">
            <div className="flex items-end justify-between mb-1">
              <span className="text-2xl font-bold text-foreground">
                {formatCurrency(faturamentoMesAtual)}
              </span>
              <span className="text-sm text-muted-foreground">
                de {formatCurrency(metaAtual)}
              </span>
            </div>

            {/* Barra de Progresso */}
            <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  atingiuMeta ? 'bg-green-500' : 'bg-primary'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${progressoLimitado}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Status */}
          <div className={`flex items-center gap-2 text-xs ${
            atingiuMeta ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
          }`}>
            {atingiuMeta ? (
              <>
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Meta atingida! +{formatCurrency(faturamentoMesAtual - metaAtual)} acima</span>
              </>
            ) : (
              <>
                <Target className="w-3.5 h-3.5" />
                <span>
                  Faltam {formatCurrency(metaAtual - faturamentoMesAtual)} ({percentualFaltando.toFixed(0)}%)
                </span>
              </>
            )}
          </div>

          {/* Dica sobre a meta */}
          {!metaPersonalizada && (
            <p className="text-[10px] text-muted-foreground mt-2">
              Meta sugerida: sua média + 10% de crescimento
            </p>
          )}
        </>
      )}
    </Card>
  )
}
