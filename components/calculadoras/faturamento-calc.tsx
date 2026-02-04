'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { usePaywall, UpgradeBanner } from '@/components/paywall'
import { ContextualSuggestions } from './contextual-suggestions'
import { ExportActions } from './export-actions'
import { FaturamentoPDF } from '@/components/pdf'
import { usePDFUserData } from '@/hooks/use-pdf-user-data'

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
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

    // Registra o calculo e verifica limite
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

  const canExport = pdfUserData !== undefined

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-4">
        <h2 className="text-xl font-bold text-foreground mb-3">
          Simulador de Faturamento MEI
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Preencha o faturamento de cada mes para simular seu total anual
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {meses.map((mes, index) => (
            <div key={mes}>
              <Label htmlFor={`mes-${index}`} className="text-xs">
                {mes}
              </Label>
              <Input
                id={`mes-${index}`}
                type="number"
                placeholder="0.00"
                value={valores[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                className="h-9 text-sm"
                disabled={isCalculating}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            onClick={calcular}
            className="flex-1 h-10"
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculando...
              </>
            ) : (
              'Calcular Total Anual'
            )}
          </Button>
          <Button onClick={limpar} variant="outline" className="h-10" disabled={isCalculating}>
            Limpar
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {resultado && !isCalculating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4 bg-primary/10 border-primary">
                  <p className="text-xs text-muted-foreground mb-1">Total Anual</p>
                  <motion.p
                    className="text-2xl font-bold text-foreground"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  >
                    R$ {resultado.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </motion.p>
                </Card>

                <Card className="p-4 bg-card">
                  <p className="text-xs text-muted-foreground mb-1">Media Mensal</p>
                  <p className="text-2xl font-bold text-foreground">
                    R$ {resultado.media.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </Card>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="md:col-span-2"
                >
                  <Card className={`p-4 ${
                    resultado.status === 'perigo' ? 'bg-destructive/10 border-destructive' :
                    resultado.status === 'atencao' ? 'bg-yellow-500/10 border-yellow-500' :
                    'bg-primary/10 border-primary'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Status do Limite MEI</p>
                        <p className="text-xl font-bold text-foreground">
                          {resultado.percentual.toFixed(1)}% do limite anual
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {resultado.status === 'perigo' && 'Você ultrapassou o limite do MEI de R$ 81.000!'}
                          {resultado.status === 'atencao' && 'Atenção! Você está próximo do limite.'}
                          {resultado.status === 'seguro' && 'Você está dentro do limite anual de R$ 81.000'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Falta</p>
                        <p className="text-lg font-semibold text-foreground">
                          R$ {(resultado.limite - resultado.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {canExport && (
                <div className="flex justify-end mt-4">
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
              )}

              {showUpgradeBanner && (
                <UpgradeBanner
                  type={paywallType}
                  remaining={remaining}
                  limit={limit}
                />
              )}

              <ContextualSuggestions
                currentCalculator="faturamento"
                show={resultado !== null}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
