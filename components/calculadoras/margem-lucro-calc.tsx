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
import { MargemLucroPDF } from '@/components/pdf'
import { usePDFUserData } from '@/hooks/use-pdf-user-data'

export function MargemLucroCalc() {
  const [custoTotal, setCustoTotal] = useState('')
  const [precoVenda, setPrecoVenda] = useState('')
  const [resultado, setResultado] = useState<{
    margemBruta: number
    lucroBruto: number
    markup: number
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
    const custo = parseFloat(custoTotal)
    const preco = parseFloat(precoVenda)
    if (custo && preco && preco > 0) {
      setIsCalculating(true)
      await new Promise(resolve => setTimeout(resolve, 300))

      const lucroBruto = preco - custo
      const margemBruta = ((preco - custo) / preco) * 100
      const markup = custo > 0 ? preco / custo : 0

      setResultado({ margemBruta, lucroBruto, markup })
      setIsCalculating(false)

      // Registra o calculo e verifica limite
      recordCalculation()
      const { remaining: rem } = checkLimit()

      // Mostra banner de upgrade se restam poucos calculos
      setShowUpgradeBanner(rem <= 2)
    }
  }

  const pdfInputs = {
    precoVenda: parseFloat(precoVenda) || 0,
    custoTotal: parseFloat(custoTotal) || 0,
  }

  // Verifica se pode exportar (usuario logado)
  const canExport = pdfUserData !== undefined

  return (
    <Card className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-3">
        Calculadora de Margem de Lucro
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="custo">Custo Total (R$)</Label>
          <Input
            id="custo"
            type="number"
            placeholder="0.00"
            value={custoTotal}
            onChange={(e) => setCustoTotal(e.target.value)}
            className="h-10"
          />
        </div>

        <div>
          <Label htmlFor="preco">Preco de Venda (R$)</Label>
          <Input
            id="preco"
            type="number"
            placeholder="0.00"
            value={precoVenda}
            onChange={(e) => setPrecoVenda(e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      <Button
        onClick={calcular}
        className="w-full h-10 mb-4"
        disabled={isCalculating || !custoTotal || !precoVenda}
      >
        {isCalculating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calculando...
          </>
        ) : (
          'Calcular Margem'
        )}
      </Button>

      <AnimatePresence mode="wait">
        {resultado !== null && !isCalculating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-3">
              <Card className="p-4 bg-primary/10 border-primary">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Margem de Lucro</p>
                    <motion.p
                      className="text-2xl font-bold text-foreground"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    >
                      {resultado.margemBruta.toFixed(2)}%
                    </motion.p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {resultado.margemBruta > 0 ? 'Lucro positivo' : 'Prejuizo'}
                    </p>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 bg-card">
                  <p className="text-xs text-muted-foreground">Lucro por Venda</p>
                  <p className={`text-lg font-bold ${resultado.lucroBruto >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    R$ {resultado.lucroBruto.toFixed(2)}
                  </p>
                </Card>
                <Card className="p-3 bg-card">
                  <p className="text-xs text-muted-foreground">Markup</p>
                  <p className="text-lg font-bold text-foreground">
                    {resultado.markup.toFixed(2)}x
                  </p>
                </Card>
              </div>
            </div>

            {canExport && (
              <div className="flex justify-end mt-4">
                <ExportActions
                  pdfDocument={
                    <MargemLucroPDF
                      inputs={pdfInputs}
                      resultado={resultado}
                      userData={pdfUserData}
                    />
                  }
                  calculatorName="margem-lucro"
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
              currentCalculator="margem-lucro"
              show={resultado !== null}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
