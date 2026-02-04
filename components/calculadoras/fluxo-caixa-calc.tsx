'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Wallet } from 'lucide-react'
import { usePaywall, UpgradeBanner } from '@/components/paywall'
import { ContextualSuggestions } from './contextual-suggestions'
import { ExportActions } from './export-actions'
import { FluxoCaixaPDF } from '@/components/pdf'
import { usePDFUserData } from '@/hooks/use-pdf-user-data'

export function FluxoCaixaCalc() {
  const [entradas, setEntradas] = useState('')
  const [saidas, setSaidas] = useState('')
  const [resultado, setResultado] = useState<{
    saldo: number
    status: 'positivo' | 'negativo' | 'zerado'
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

  const calcular = async () => {
    const ent = parseFloat(entradas) || 0
    const sai = parseFloat(saidas) || 0

    setIsCalculating(true)
    await new Promise(resolve => setTimeout(resolve, 300))

    const saldo = ent - sai
    let status: 'positivo' | 'negativo' | 'zerado' = 'zerado'
    if (saldo > 0) status = 'positivo'
    else if (saldo < 0) status = 'negativo'

    setResultado({ saldo, status })
    setIsCalculating(false)

    recordCalculation()
    const { remaining: rem } = checkLimit()
    setShowUpgradeBanner(rem <= 2)
  }

  const pdfInputs = {
    entradas: parseFloat(entradas) || 0,
    saidas: parseFloat(saidas) || 0,
    periodo: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card className="p-4">
        {/* Header compacto */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Fluxo de Caixa</h2>
            <p className="text-xs text-muted-foreground">Calcule o saldo entre entradas e saídas</p>
          </div>
        </div>

        {/* Formulário compacto */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <Label htmlFor="entradas" className="text-xs">Entradas (R$)</Label>
            <Input
              id="entradas"
              type="number"
              placeholder="0.00"
              value={entradas}
              onChange={(e) => setEntradas(e.target.value)}
              className="h-9 mt-1"
              disabled={isCalculating}
            />
          </div>
          <div>
            <Label htmlFor="saidas" className="text-xs">Saídas (R$)</Label>
            <Input
              id="saidas"
              type="number"
              placeholder="0.00"
              value={saidas}
              onChange={(e) => setSaidas(e.target.value)}
              className="h-9 mt-1"
              disabled={isCalculating}
            />
          </div>
        </div>

        <Button
          onClick={calcular}
          className="w-full h-9"
          disabled={isCalculating}
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculando...
            </>
          ) : (
            'Calcular Saldo'
          )}
        </Button>

        {/* Resultado */}
        <AnimatePresence mode="wait">
          {resultado && !isCalculating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              {/* Resultado Principal */}
              <div className={`rounded-lg p-4 mb-3 ${
                resultado.status === 'positivo' ? 'bg-gradient-to-br from-green-500/10 to-green-500/5' :
                resultado.status === 'negativo' ? 'bg-gradient-to-br from-red-500/10 to-red-500/5' :
                'bg-gradient-to-br from-gray-500/10 to-gray-500/5'
              }`}>
                <div className="text-center mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Saldo do Fluxo de Caixa</p>
                  <motion.p
                    className={`text-3xl font-bold ${
                      resultado.status === 'positivo' ? 'text-green-600' :
                      resultado.status === 'negativo' ? 'text-red-600' :
                      'text-foreground'
                    }`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {resultado.status === 'negativo' ? '-' : ''}R$ {Math.abs(resultado.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </motion.p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {resultado.status === 'positivo' && 'Fluxo positivo - Negócios saudáveis'}
                    {resultado.status === 'negativo' && 'Fluxo negativo - Atenção necessária'}
                    {resultado.status === 'zerado' && 'Fluxo zerado'}
                  </p>
                </div>

                {/* Métricas compactas */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-2">
                    <p className="text-[10px] text-muted-foreground">Entradas</p>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">
                      + R$ {(parseFloat(entradas) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-2">
                    <p className="text-[10px] text-muted-foreground">Saídas</p>
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">
                      - R$ {(parseFloat(saidas) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-end pt-3 border-t">
                <ExportActions
                  pdfDocument={
                    <FluxoCaixaPDF
                      inputs={pdfInputs}
                      resultado={resultado}
                      userData={pdfUserData}
                    />
                  }
                  calculatorName="fluxo-caixa"
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
            currentCalculator="fluxo-caixa"
            show={true}
          />
        </div>
      )}
    </div>
  )
}
