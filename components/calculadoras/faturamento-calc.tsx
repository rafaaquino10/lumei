'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, BarChart3 } from 'lucide-react'
import { usePaywall, UpgradeBanner } from '@/components/paywall'
import { ContextualSuggestions } from './contextual-suggestions'
import { ExportActions } from './export-actions'
import { FaturamentoPDF } from '@/components/pdf'
import { usePDFUserData } from '@/hooks/use-pdf-user-data'

const meses = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
]

export function FaturamentoCalc() {
  const [valores, setValores] = useState<string[]>(Array(12).fill(''))
  const [resultado, setResultado] = useState<{
    total: number
    media: number
    limite: number
    percentual: number
    status: 'seguro' | 'atencao' | 'perigo'
  } | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false)

  const {
    checkLimit,
    recordCalculation,
    paywallType,
    remaining,
    limit
  } = usePaywall()

  const pdfUserData = usePDFUserData()

  const LIMITE_MEI = 81000

  const handleChange = (index: number, value: string) => {
    const novosValores = [...valores]
    novosValores[index] = value
    setValores(novosValores)
  }

  const calcular = async () => {
    setIsCalculating(true)
    await new Promise(resolve => setTimeout(resolve, 400))

    const total = valores.reduce((acc, val) => {
      const num = parseFloat(val) || 0
      return acc + num
    }, 0)

    const media = total / 12
    const percentual = (total / LIMITE_MEI) * 100

    let status: 'seguro' | 'atencao' | 'perigo' = 'seguro'
    if (percentual > 100) status = 'perigo'
    else if (percentual > 80) status = 'atencao'

    setResultado({ total, media, limite: LIMITE_MEI, percentual, status })
    setIsCalculating(false)

    recordCalculation()
    const { remaining: rem } = checkLimit()
    setShowUpgradeBanner(rem <= 2)
  }

  const limpar = () => {
    setValores(Array(12).fill(''))
    setResultado(null)
  }

  const pdfInputs = {
    valores: valores.map(v => parseFloat(v) || 0),
    ano: new Date().getFullYear(),
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card className="p-4">
        {/* Header compacto */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Simulador de Faturamento</h2>
            <p className="text-xs text-muted-foreground">Simule seu faturamento anual MEI</p>
          </div>
        </div>

        {/* Grid de meses compacto */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {meses.map((mes, index) => (
            <div key={mes}>
              <Label htmlFor={`mes-${index}`} className="text-[10px] text-muted-foreground">
                {mes}
              </Label>
              <Input
                id={`mes-${index}`}
                type="number"
                placeholder="0"
                value={valores[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                className="h-8 text-xs mt-0.5"
                disabled={isCalculating}
              />
            </div>
          ))}
        </div>

        {/* Botões */}
        <div className="flex gap-2 mb-3">
          <Button
            onClick={calcular}
            className="flex-1 h-9"
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculando...
              </>
            ) : (
              'Calcular Total'
            )}
          </Button>
          <Button onClick={limpar} variant="outline" className="h-9" disabled={isCalculating}>
            Limpar
          </Button>
        </div>

        {/* Resultado */}
        <AnimatePresence mode="wait">
          {resultado && !isCalculating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Resultado Principal */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 mb-3">
                <div className="grid grid-cols-2 gap-3 text-center mb-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Total Anual</p>
                    <motion.p
                      className="text-xl font-bold text-foreground"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      R$ {resultado.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </motion.p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Média Mensal</p>
                    <p className="text-xl font-bold text-foreground">
                      R$ {resultado.media.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Barra de progresso do limite */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Uso do limite MEI</span>
                    <span className={`font-medium ${
                      resultado.status === 'perigo' ? 'text-red-600' :
                      resultado.status === 'atencao' ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {resultado.percentual.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        resultado.status === 'perigo' ? 'bg-red-500' :
                        resultado.status === 'atencao' ? 'bg-amber-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(resultado.percentual, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className={`rounded-lg p-3 mb-3 ${
                resultado.status === 'perigo' ? 'bg-red-50 dark:bg-red-950/20' :
                resultado.status === 'atencao' ? 'bg-amber-50 dark:bg-amber-950/20' :
                'bg-green-50 dark:bg-green-950/20'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-xs font-medium ${
                      resultado.status === 'perigo' ? 'text-red-700 dark:text-red-400' :
                      resultado.status === 'atencao' ? 'text-amber-700 dark:text-amber-400' :
                      'text-green-700 dark:text-green-400'
                    }`}>
                      {resultado.status === 'perigo' && 'Limite ultrapassado!'}
                      {resultado.status === 'atencao' && 'Atenção ao limite'}
                      {resultado.status === 'seguro' && 'Dentro do limite'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Limite MEI: R$ 81.000/ano
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">Disponível</p>
                    <p className="text-sm font-bold text-foreground">
                      R$ {Math.max(0, resultado.limite - resultado.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-end pt-3 border-t">
                <ExportActions
                  pdfDocument={
                    <FaturamentoPDF
                      inputs={pdfInputs}
                      resultado={resultado}
                      userData={pdfUserData}
                    />
                  }
                  calculatorName="faturamento-mei"
                />
              </div>

              {showUpgradeBanner && (
                <div className="mt-3">
                  <UpgradeBanner
                    type={paywallType}
                    remaining={remaining}
                    limit={limit}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Sugestões */}
      {resultado !== null && (
        <div className="mt-3">
          <ContextualSuggestions
            currentCalculator="faturamento"
            show={true}
          />
        </div>
      )}
    </div>
  )
}
