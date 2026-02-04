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

    // Registra o calculo e verifica limite
    recordCalculation()
    const { remaining: rem } = checkLimit()
    setShowUpgradeBanner(rem <= 2)
  }

  const pdfInputs = {
    entradas: parseFloat(entradas) || 0,
    saidas: parseFloat(saidas) || 0,
    periodo: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
  }

  const canExport = pdfUserData !== undefined

  return (
    <Card className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-3">
        Calculadora de Fluxo de Caixa
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Calcule o saldo entre entradas e saidas do mes
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="entradas">Entradas do Mes (R$)</Label>
          <Input
            id="entradas"
            type="number"
            placeholder="0.00"
            value={entradas}
            onChange={(e) => setEntradas(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
        </div>

        <div>
          <Label htmlFor="saidas">Saidas do Mes (R$)</Label>
          <Input
            id="saidas"
            type="number"
            placeholder="0.00"
            value={saidas}
            onChange={(e) => setSaidas(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
        </div>
      </div>

      <Button
        onClick={calcular}
        className="w-full h-10 mb-4"
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

      <AnimatePresence mode="wait">
        {resultado && !isCalculating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-3">
              <Card className={`p-4 ${
                resultado.status === 'positivo' ? 'bg-primary/10 border-primary' :
                resultado.status === 'negativo' ? 'bg-destructive/10 border-destructive' :
                'bg-secondary border-border'
              }`}>
                <p className="text-sm text-muted-foreground mb-2">Saldo do Fluxo de Caixa</p>
                <motion.p
                  className={`text-2xl font-bold ${
                    resultado.status === 'positivo' ? 'text-primary' :
                    resultado.status === 'negativo' ? 'text-destructive' :
                    'text-foreground'
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                >
                  {resultado.status === 'negativo' ? '-' : ''}R$ {Math.abs(resultado.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </motion.p>
                <p className="text-xs text-muted-foreground mt-2">
                  {resultado.status === 'positivo' && 'Fluxo de caixa positivo - Negocios saudaveis'}
                  {resultado.status === 'negativo' && 'Fluxo de caixa negativo - Atencao necessaria'}
                  {resultado.status === 'zerado' && 'Fluxo de caixa zerado'}
                </p>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <p className="text-xs text-muted-foreground">Entradas</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    + R$ {(parseFloat(entradas) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </Card>
                <Card className="p-3 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                  <p className="text-xs text-muted-foreground">Saidas</p>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    - R$ {(parseFloat(saidas) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </Card>
              </div>
            </div>

            {canExport && (
              <div className="flex justify-end mt-4">
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
            )}

            {showUpgradeBanner && (
              <UpgradeBanner
                type={paywallType}
                remaining={remaining}
                limit={limit}
              />
            )}

            <ContextualSuggestions
              currentCalculator="fluxo-caixa"
              show={resultado !== null}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
