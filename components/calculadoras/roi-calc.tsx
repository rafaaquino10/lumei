'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  Calculator,
  Info,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  DollarSign,
} from 'lucide-react'
import { ExportActions } from './export-actions'
import { ContextualSuggestions } from './contextual-suggestions'
import { ROIPDF } from '@/components/pdf/roi-pdf'

interface ROIResult {
  investimentoInicial: number
  retornoTotal: number
  lucroLiquido: number
  roi: number
  paybackMeses: number
  retornoMensal: number
  multiplicador: string
}

export function ROICalc() {
  const [investimento, setInvestimento] = useState('')
  const [retornoMensal, setRetornoMensal] = useState('')
  const [periodo, setPeriodo] = useState('12')
  const [custoMensal, setCustoMensal] = useState('')
  const [result, setResult] = useState<ROIResult | null>(null)
  const [showFormula, setShowFormula] = useState(false)

  const calcular = () => {
    const inv = parseFloat(investimento.replace(/\D/g, '')) / 100 || 0
    const ret = parseFloat(retornoMensal.replace(/\D/g, '')) / 100 || 0
    const per = parseInt(periodo) || 12
    const custo = parseFloat(custoMensal.replace(/\D/g, '')) / 100 || 0

    if (inv <= 0 || ret <= 0) return

    // Calculos
    const lucroMensal = ret - custo
    const retornoTotal = lucroMensal * per
    const lucroLiquido = retornoTotal - inv
    const roi = (lucroLiquido / inv) * 100
    const paybackMeses = lucroMensal > 0 ? Math.ceil(inv / lucroMensal) : 999
    const multiplicador = (1 + lucroLiquido / inv).toFixed(2)

    setResult({
      investimentoInicial: inv,
      retornoTotal,
      lucroLiquido,
      roi,
      paybackMeses,
      retornoMensal: lucroMensal,
      multiplicador,
    })
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

  const handleCurrencyInput = (
    value: string,
    setter: (v: string) => void
  ) => {
    const numbers = value.replace(/\D/g, '')
    const formatted = (parseInt(numbers) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
    setter(formatted)
  }

  const getROIStatus = (roi: number) => {
    if (roi >= 100) return { label: 'Excelente', color: 'text-green-600', bg: 'bg-green-100' }
    if (roi >= 50) return { label: 'Bom', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (roi >= 20) return { label: 'Moderado', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (roi >= 0) return { label: 'Baixo', color: 'text-orange-600', bg: 'bg-orange-100' }
    return { label: 'Negativo', color: 'text-red-600', bg: 'bg-red-100' }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Titulo */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Calculadora de ROI</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Calcule o retorno sobre investimento do seu negocio
        </p>
      </div>

      {/* Formulario */}
      <Card className="p-5">
        <div className="space-y-4">
          {/* Investimento Inicial */}
          <div>
            <Label htmlFor="investimento" className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Investimento Inicial
            </Label>
            <Input
              id="investimento"
              type="text"
              inputMode="numeric"
              placeholder="R$ 0,00"
              value={investimento}
              onChange={(e) => handleCurrencyInput(e.target.value, setInvestimento)}
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ex: equipamentos, estoque inicial, marketing
            </p>
          </div>

          {/* Retorno Mensal Esperado */}
          <div>
            <Label htmlFor="retornoMensal" className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Receita Mensal Esperada
            </Label>
            <Input
              id="retornoMensal"
              type="text"
              inputMode="numeric"
              placeholder="R$ 0,00"
              value={retornoMensal}
              onChange={(e) => handleCurrencyInput(e.target.value, setRetornoMensal)}
              className="mt-1.5"
            />
          </div>

          {/* Custo Mensal */}
          <div>
            <Label htmlFor="custoMensal" className="text-sm font-medium flex items-center gap-2">
              <Calculator className="w-4 h-4 text-primary" />
              Custos Mensais (opcional)
            </Label>
            <Input
              id="custoMensal"
              type="text"
              inputMode="numeric"
              placeholder="R$ 0,00"
              value={custoMensal}
              onChange={(e) => handleCurrencyInput(e.target.value, setCustoMensal)}
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ex: aluguel, insumos, DAS, marketing continuo
            </p>
          </div>

          {/* Periodo de Analise */}
          <div>
            <Label htmlFor="periodo" className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Periodo de Analise (meses)
            </Label>
            <select
              id="periodo"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="mt-1.5 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="6">6 meses</option>
              <option value="12">12 meses (1 ano)</option>
              <option value="24">24 meses (2 anos)</option>
              <option value="36">36 meses (3 anos)</option>
            </select>
          </div>

          {/* Botao Calcular */}
          <Button onClick={calcular} className="w-full" size="lg">
            <Calculator className="w-4 h-4 mr-2" />
            Calcular ROI
          </Button>
        </div>
      </Card>

      {/* Resultado */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Card Principal */}
          <Card className="p-5 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground mb-1">Retorno sobre Investimento</p>
              <p className={`text-4xl font-bold ${result.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {result.roi >= 0 ? '+' : ''}{result.roi.toFixed(1)}%
              </p>
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-2 ${getROIStatus(result.roi).bg} ${getROIStatus(result.roi).color}`}>
                {getROIStatus(result.roi).label}
              </div>
            </div>

            {/* Metricas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background/80 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Lucro Liquido</p>
                <p className={`text-lg font-bold ${result.lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(result.lucroLiquido)}
                </p>
              </div>
              <div className="bg-background/80 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Payback</p>
                <p className="text-lg font-bold text-foreground">
                  {result.paybackMeses > 100 ? '100+' : result.paybackMeses} {result.paybackMeses === 1 ? 'mes' : 'meses'}
                </p>
              </div>
              <div className="bg-background/80 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Multiplicador</p>
                <p className="text-lg font-bold text-foreground">
                  {result.multiplicador}x
                </p>
              </div>
              <div className="bg-background/80 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Lucro/Mes</p>
                <p className={`text-lg font-bold ${result.retornoMensal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(result.retornoMensal)}
                </p>
              </div>
            </div>
          </Card>

          {/* Detalhamento */}
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Detalhamento</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Investimento inicial:</span>
                <span className="font-medium">{formatCurrency(result.investimentoInicial)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Retorno total ({periodo} meses):</span>
                <span className="font-medium">{formatCurrency(result.retornoTotal)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Lucro liquido:</span>
                <span className={`font-bold ${result.lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(result.lucroLiquido)}
                </span>
              </div>
            </div>
          </Card>

          {/* Formula */}
          <Card className="p-4">
            <button
              onClick={() => setShowFormula(!showFormula)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <Info className="w-4 h-4 text-primary" />
                Como calculamos?
              </span>
              {showFormula ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showFormula && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-3 pt-3 border-t text-sm text-muted-foreground space-y-2"
              >
                <p>
                  <strong>ROI = </strong>((Lucro Liquido / Investimento) x 100)
                </p>
                <p>
                  <strong>Lucro Liquido = </strong>Retorno Total - Investimento Inicial
                </p>
                <p>
                  <strong>Payback = </strong>Investimento / Lucro Mensal
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-2">
                  <p className="text-blue-800 dark:text-blue-200 text-xs">
                    <strong>Dica:</strong> Um ROI positivo significa que voce recuperou o investimento e ainda teve lucro.
                    O payback indica em quantos meses voce recupera o valor investido.
                  </p>
                </div>
              </motion.div>
            )}
          </Card>

          {/* Analise */}
          <Card className={`p-4 ${result.roi >= 50 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : result.roi >= 0 ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
            <h3 className="font-semibold text-foreground mb-2">Analise</h3>
            <p className="text-sm text-muted-foreground">
              {result.roi >= 100 && 'Excelente retorno! Esse investimento tem potencial para mais que dobrar seu dinheiro no periodo analisado.'}
              {result.roi >= 50 && result.roi < 100 && 'Bom retorno! Esse investimento tem potencial para um ganho significativo.'}
              {result.roi >= 20 && result.roi < 50 && 'Retorno moderado. Considere se existem alternativas com melhor custo-beneficio.'}
              {result.roi >= 0 && result.roi < 20 && 'Retorno baixo. O investimento e viavel, mas avalie se vale a pena pelo esforco.'}
              {result.roi < 0 && 'Retorno negativo. Esse investimento resultaria em prejuizo. Revise os numeros ou busque alternativas.'}
            </p>
            {result.paybackMeses <= parseInt(periodo) && (
              <p className="text-sm text-muted-foreground mt-2">
                Voce recupera o investimento em <strong>{result.paybackMeses} {result.paybackMeses === 1 ? 'mes' : 'meses'}</strong>,
                o que representa {((result.paybackMeses / parseInt(periodo)) * 100).toFixed(0)}% do periodo analisado.
              </p>
            )}
          </Card>

          {/* Export Actions */}
          <ExportActions
            pdfDocument={
              <ROIPDF
                data={{
                  investimentoInicial: result.investimentoInicial,
                  retornoMensal: parseFloat(retornoMensal.replace(/\D/g, '')) / 100 || 0,
                  custoMensal: parseFloat(custoMensal.replace(/\D/g, '')) / 100 || 0,
                  periodoMeses: parseInt(periodo),
                  resultado: result,
                }}
              />
            }
            calculatorName="ROI"
          />

          {/* Sugestoes Contextuais */}
          <ContextualSuggestions currentCalculator="margem-lucro" show={true} />
        </motion.div>
      )}
    </div>
  )
}
