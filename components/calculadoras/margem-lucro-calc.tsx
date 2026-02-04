'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, TrendingUp } from 'lucide-react'
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

      recordCalculation()
      const { remaining: rem } = checkLimit()
      setShowUpgradeBanner(rem <= 2)
    }
  }

  const pdfInputs = {
    precoVenda: parseFloat(precoVenda) || 0,
    custoTotal: parseFloat(custoTotal) || 0,
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card className="p-4">
        {/* Header compacto */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Margem de Lucro</h2>
            <p className="text-xs text-muted-foreground">Descubra quanto você lucra por venda</p>
          </div>
        </div>

        {/* Formulário */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <Label htmlFor="custo" className="text-xs">Custo Total (R$)</Label>
            <Input
              id="custo"
              type="number"
              placeholder="0,00"
              value={custoTotal}
              onChange={(e) => setCustoTotal(e.target.value)}
              className="h-9 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="preco" className="text-xs">Preço de Venda (R$)</Label>
            <Input
              id="preco"
              type="number"
              placeholder="0,00"
              value={precoVenda}
              onChange={(e) => setPrecoVenda(e.target.value)}
              className="h-9 mt-1"
            />
          </div>
        </div>

        <Button
          onClick={calcular}
          className="w-full h-9"
          disabled={isCalculating || !custoTotal || !precoVenda}
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculando...
            </>
          ) : (
            'Calcular'
          )}
        </Button>

        {/* Resultado */}
        <AnimatePresence mode="wait">
          {resultado !== null && !isCalculating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              {/* Resultado Principal */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 mb-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Sua Margem de Lucro</p>
                  <motion.p
                    className={`text-3xl font-bold ${resultado.margemBruta >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {resultado.margemBruta.toFixed(1)}%
                  </motion.p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {resultado.margemBruta >= 30 ? 'Margem saudável' : resultado.margemBruta >= 15 ? 'Margem moderada' : resultado.margemBruta >= 0 ? 'Margem baixa' : 'Prejuízo'}
                  </p>
                </div>
              </div>

              {/* Métricas secundárias */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Lucro/Venda</p>
                  <p className={`text-base font-bold ${resultado.lucroBruto >= 0 ? 'text-foreground' : 'text-red-600'}`}>
                    R$ {resultado.lucroBruto.toFixed(2)}
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Markup</p>
                  <p className="text-base font-bold text-foreground">
                    {resultado.markup.toFixed(2)}x
                  </p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Custo R${parseFloat(custoTotal).toFixed(2)} → Venda R${parseFloat(precoVenda).toFixed(2)}
                </p>
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
            currentCalculator="margem-lucro"
            show={true}
          />
        </div>
      )}
    </div>
  )
}
