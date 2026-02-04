'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Target, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'
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

    if (pv <= cv) {
      return // Preço deve ser maior que custo variável
    }

    setIsCalculating(true)
    await new Promise(resolve => setTimeout(resolve, 400))

    // Margem de Contribuição = Preço de Venda - Custo Variável
    const margemContribuicao = pv - cv
    const margemContribuicaoPercent = (margemContribuicao / pv) * 100

    // Ponto de Equilíbrio (unidades) = Custo Fixo / Margem de Contribuição
    const pontoEquilibrioUnidades = cf / margemContribuicao

    // Ponto de Equilíbrio (valor) = PE unidades * Preço de Venda
    const pontoEquilibrioValor = pontoEquilibrioUnidades * pv

    // Lucro atual (se informou vendas atuais)
    const receitaAtual = va * pv
    const custoTotalAtual = cf + (cv * va)
    const lucroAtual = receitaAtual - custoTotalAtual

    // Quantas unidades faltam para atingir o PE
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

    // Registra o cálculo
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

  const canExport = pdfUserData !== undefined

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const formatNumber = (value: number) =>
    value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })

  const isAboveBreakeven = resultado && parseFloat(vendasAtuais) > resultado.pontoEquilibrioUnidades

  return (
    <Card className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-2">
        Calculadora de Ponto de Equilíbrio
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Descubra quantas vendas você precisa fazer para cobrir todos os custos
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="custoFixo">Custos Fixos Mensais (R$)</Label>
          <Input
            id="custoFixo"
            type="number"
            placeholder="Ex: 2000 (aluguel, internet, etc)"
            value={custoFixo}
            onChange={(e) => setCustoFixo(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Gastos que não mudam com as vendas
          </p>
        </div>

        <div>
          <Label htmlFor="custoVariavel">Custo Variável por Unidade (R$)</Label>
          <Input
            id="custoVariavel"
            type="number"
            placeholder="Ex: 30 (material, comissão)"
            value={custoVariavel}
            onChange={(e) => setCustoVariavel(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Custo para produzir/vender cada unidade
          </p>
        </div>

        <div>
          <Label htmlFor="precoVenda">Preço de Venda (R$)</Label>
          <Input
            id="precoVenda"
            type="number"
            placeholder="Ex: 100"
            value={precoVenda}
            onChange={(e) => setPrecoVenda(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
        </div>

        <div>
          <Label htmlFor="vendasAtuais">Vendas Atuais/Mês (opcional)</Label>
          <Input
            id="vendasAtuais"
            type="number"
            placeholder="Ex: 50 unidades"
            value={vendasAtuais}
            onChange={(e) => setVendasAtuais(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Para comparar com o ponto de equilíbrio
          </p>
        </div>
      </div>

      <Button
        onClick={calcular}
        className="w-full h-10 mb-4"
        disabled={isCalculating || !custoFixo || !precoVenda || parseFloat(precoVenda) <= parseFloat(custoVariavel)}
      >
        {isCalculating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calculando...
          </>
        ) : (
          <>
            <Target className="mr-2 h-4 w-4" />
            Calcular Ponto de Equilíbrio
          </>
        )}
      </Button>

      {parseFloat(precoVenda) <= parseFloat(custoVariavel) && precoVenda && custoVariavel && (
        <p className="text-sm text-destructive mb-4">
          O preço de venda deve ser maior que o custo variável
        </p>
      )}

      <AnimatePresence mode="wait">
        {resultado && !isCalculating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Resultado Principal */}
            <Card className="p-4 bg-primary/10 border-primary mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Ponto de Equilíbrio</p>
                </div>
                <motion.p
                  className="text-3xl font-bold text-foreground"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                >
                  {formatNumber(resultado.pontoEquilibrioUnidades)} unidades
                </motion.p>
                <p className="text-lg text-primary font-semibold mt-1">
                  {formatCurrency(resultado.pontoEquilibrioValor)}/mês
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Vendendo acima disso, você começa a ter lucro
                </p>
              </div>
            </Card>

            {/* Status atual (se informou vendas) */}
            {vendasAtuais && (
              <Card className={`p-4 mb-4 ${isAboveBreakeven ? 'bg-green-500/10 border-green-500' : 'bg-amber-500/10 border-amber-500'}`}>
                <div className="flex items-start gap-3">
                  {isAboveBreakeven ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-semibold ${isAboveBreakeven ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
                      {isAboveBreakeven ? 'Parabéns! Você está acima do ponto de equilíbrio' : 'Atenção: Você ainda não atingiu o ponto de equilíbrio'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isAboveBreakeven ? (
                        <>Seu lucro atual é de <strong className="text-green-600">{formatCurrency(resultado.lucroAtual)}</strong>/mês</>
                      ) : (
                        <>Faltam <strong className="text-amber-600">{formatNumber(resultado.unidadesParaLucro)} unidades</strong> para começar a lucrar</>
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Métricas */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Margem de Contribuição</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(resultado.margemContribuicao)}
                </p>
                <p className="text-xs text-primary">
                  {resultado.margemContribuicaoPercent.toFixed(1)}% do preço
                </p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Receita Mínima</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(resultado.pontoEquilibrioValor)}
                </p>
                <p className="text-xs text-muted-foreground">
                  por mês
                </p>
              </Card>
            </div>

            {/* Fórmula */}
            <Card className="p-3 bg-secondary mb-4">
              <p className="text-xs font-semibold text-foreground mb-2">Como calculamos:</p>
              <p className="text-xs text-muted-foreground font-mono">
                PE = Custos Fixos ÷ (Preço - Custo Variável)
              </p>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                PE = {formatCurrency(parseFloat(custoFixo))} ÷ {formatCurrency(resultado.margemContribuicao)} = {formatNumber(resultado.pontoEquilibrioUnidades)} un.
              </p>
            </Card>

            {canExport && resultado && (
              <div className="flex justify-end mt-4">
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
            )}

            {showUpgradeBanner && (
              <UpgradeBanner
                type={paywallType}
                remaining={remaining}
                limit={limit}
              />
            )}

            <ContextualSuggestions
              currentCalculator="ponto-equilibrio"
              show={resultado !== null}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
