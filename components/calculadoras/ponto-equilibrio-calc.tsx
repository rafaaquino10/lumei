'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Target, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { usePaywall, UpgradeBanner } from '@/components/paywall'
import { ContextualSuggestions } from './contextual-suggestions'
import { ExportActions } from './export-actions'
import { PontoEquilibrioPDF } from '@/components/pdf'
import { usePDFUserData } from '@/hooks/use-pdf-user-data'

interface Resultado {
  pontoEquilibrioUnidades: number
  pontoEquilibrioValor: number
  margemContribuicao: number
  margemContribuicaoPercent: number
  lucroAtual: number
  unidadesParaLucro: number
}

export function PontoEquilibrioCalc() {
  const [custoFixo, setCustoFixo] = useState('')
  const [custoVariavel, setCustoVariavel] = useState('')
  const [precoVenda, setPrecoVenda] = useState('')
  const [vendasAtuais, setVendasAtuais] = useState('')
  const [resultado, setResultado] = useState<Resultado | null>(null)
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
    const cf = parseFloat(custoFixo) || 0
    const cv = parseFloat(custoVariavel) || 0
    const pv = parseFloat(precoVenda) || 0
    const va = parseFloat(vendasAtuais) || 0

    if (pv <= cv) return

    setIsCalculating(true)
    await new Promise(resolve => setTimeout(resolve, 400))

    const margemContribuicao = pv - cv
    const margemContribuicaoPercent = (margemContribuicao / pv) * 100
    const pontoEquilibrioUnidades = cf / margemContribuicao
    const pontoEquilibrioValor = pontoEquilibrioUnidades * pv
    const receitaAtual = va * pv
    const custoTotalAtual = cf + (cv * va)
    const lucroAtual = receitaAtual - custoTotalAtual
    const unidadesParaLucro = Math.max(0, pontoEquilibrioUnidades - va)

    setResultado({
      pontoEquilibrioUnidades,
      pontoEquilibrioValor,
      margemContribuicao,
      margemContribuicaoPercent,
      lucroAtual,
      unidadesParaLucro,
    })

    setIsCalculating(false)
    recordCalculation()
    const { remaining: rem } = checkLimit()
    setShowUpgradeBanner(rem <= 2)
  }

  const pdfInputs = {
    custoFixo: parseFloat(custoFixo) || 0,
    custoVariavel: parseFloat(custoVariavel) || 0,
    precoVenda: parseFloat(precoVenda) || 0,
    vendasAtuais: parseFloat(vendasAtuais) || 0,
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const formatNumber = (value: number) =>
    value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })

  const isAboveBreakeven = resultado && parseFloat(vendasAtuais) > resultado.pontoEquilibrioUnidades

  return (
    <div className="max-w-lg mx-auto">
      <Card className="p-4">
        {/* Header compacto */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Ponto de Equilíbrio</h2>
            <p className="text-xs text-muted-foreground">Quantas vendas para cobrir custos</p>
          </div>
        </div>

        {/* Formulário compacto */}
        <div className="space-y-3 mb-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="custoFixo" className="text-xs">Custos Fixos/Mês (R$)</Label>
              <Input
                id="custoFixo"
                type="number"
                placeholder="2000"
                value={custoFixo}
                onChange={(e) => setCustoFixo(e.target.value)}
                className="h-9 mt-1"
                disabled={isCalculating}
              />
            </div>
            <div>
              <Label htmlFor="custoVariavel" className="text-xs">Custo por Unidade (R$)</Label>
              <Input
                id="custoVariavel"
                type="number"
                placeholder="30"
                value={custoVariavel}
                onChange={(e) => setCustoVariavel(e.target.value)}
                className="h-9 mt-1"
                disabled={isCalculating}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="precoVenda" className="text-xs">Preço de Venda (R$)</Label>
              <Input
                id="precoVenda"
                type="number"
                placeholder="100"
                value={precoVenda}
                onChange={(e) => setPrecoVenda(e.target.value)}
                className="h-9 mt-1"
                disabled={isCalculating}
              />
            </div>
            <div>
              <Label htmlFor="vendasAtuais" className="text-xs">Vendas Atuais (opcional)</Label>
              <Input
                id="vendasAtuais"
                type="number"
                placeholder="50"
                value={vendasAtuais}
                onChange={(e) => setVendasAtuais(e.target.value)}
                className="h-9 mt-1"
                disabled={isCalculating}
              />
            </div>
          </div>
        </div>

        {parseFloat(precoVenda) <= parseFloat(custoVariavel) && precoVenda && custoVariavel && (
          <p className="text-xs text-red-600 mb-3">
            O preço de venda deve ser maior que o custo variável
          </p>
        )}

        <Button
          onClick={calcular}
          className="w-full h-9"
          disabled={isCalculating || !custoFixo || !precoVenda || parseFloat(precoVenda) <= parseFloat(custoVariavel)}
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculando...
            </>
          ) : (
            'Calcular Ponto de Equilíbrio'
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
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 mb-3">
                <div className="text-center mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Ponto de Equilíbrio</p>
                  <motion.p
                    className="text-3xl font-bold text-primary"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {formatNumber(resultado.pontoEquilibrioUnidades)} un.
                  </motion.p>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    {formatCurrency(resultado.pontoEquilibrioValor)}/mês
                  </p>
                </div>

                {/* Métricas em grid compacto */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Margem/Unidade</p>
                    <p className="text-sm font-bold text-foreground">
                      {formatCurrency(resultado.margemContribuicao)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">% do Preço</p>
                    <p className="text-sm font-bold text-foreground">
                      {resultado.margemContribuicaoPercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Status atual */}
              {vendasAtuais && (
                <div className={`rounded-lg p-3 mb-3 ${
                  isAboveBreakeven ? 'bg-green-50 dark:bg-green-950/20' : 'bg-amber-50 dark:bg-amber-950/20'
                }`}>
                  <div className="flex items-start gap-2">
                    {isAboveBreakeven ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`text-xs font-medium ${
                        isAboveBreakeven ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'
                      }`}>
                        {isAboveBreakeven ? 'Acima do ponto de equilíbrio!' : 'Abaixo do ponto de equilíbrio'}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {isAboveBreakeven ? (
                          <>Lucro atual: <strong className="text-green-600">{formatCurrency(resultado.lucroAtual)}</strong>/mês</>
                        ) : (
                          <>Faltam <strong className="text-amber-600">{formatNumber(resultado.unidadesParaLucro)} un.</strong> para lucrar</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Fórmula */}
              <div className="bg-secondary/50 rounded-lg p-2 mb-3">
                <p className="text-[10px] text-muted-foreground font-mono">
                  PE = {formatCurrency(parseFloat(custoFixo))} ÷ {formatCurrency(resultado.margemContribuicao)} = {formatNumber(resultado.pontoEquilibrioUnidades)} un.
                </p>
              </div>

              {/* Ações */}
              <div className="flex justify-end pt-3 border-t">
                <ExportActions
                  pdfDocument={
                    <PontoEquilibrioPDF
                      inputs={pdfInputs}
                      resultado={resultado}
                      userData={pdfUserData}
                    />
                  }
                  calculatorName="ponto-equilibrio"
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
            currentCalculator="ponto-equilibrio"
            show={true}
          />
        </div>
      )}
    </div>
  )
}
