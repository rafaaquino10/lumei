'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TrendingUp, Info, ChevronDown, ChevronUp } from 'lucide-react'
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
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const handleCurrencyInput = (value: string, setter: (v: string) => void) => {
    const numbers = value.replace(/\D/g, '')
    if (!numbers) { setter(''); return }
    const formatted = (parseInt(numbers) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
    setter(formatted)
  }

  const getROIStatus = (roi: number) => {
    if (roi >= 100) return { label: 'Excelente', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' }
    if (roi >= 50) return { label: 'Bom', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' }
    if (roi >= 20) return { label: 'Moderado', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' }
    if (roi >= 0) return { label: 'Baixo', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' }
    return { label: 'Negativo', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' }
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
            <h2 className="text-base font-semibold text-foreground">Calculadora de ROI</h2>
            <p className="text-xs text-muted-foreground">Retorno sobre investimento</p>
          </div>
        </div>

        {/* Formulário compacto */}
        <div className="space-y-3 mb-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="investimento" className="text-xs">Investimento Inicial</Label>
              <Input
                id="investimento"
                type="text"
                inputMode="numeric"
                placeholder="R$ 0,00"
                value={investimento}
                onChange={(e) => handleCurrencyInput(e.target.value, setInvestimento)}
                className="h-9 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="retornoMensal" className="text-xs">Receita Mensal</Label>
              <Input
                id="retornoMensal"
                type="text"
                inputMode="numeric"
                placeholder="R$ 0,00"
                value={retornoMensal}
                onChange={(e) => handleCurrencyInput(e.target.value, setRetornoMensal)}
                className="h-9 mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="custoMensal" className="text-xs">Custos Mensais</Label>
              <Input
                id="custoMensal"
                type="text"
                inputMode="numeric"
                placeholder="R$ 0,00"
                value={custoMensal}
                onChange={(e) => handleCurrencyInput(e.target.value, setCustoMensal)}
                className="h-9 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="periodo" className="text-xs">Período</Label>
              <select
                id="periodo"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="mt-1 w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="6">6 meses</option>
                <option value="12">12 meses</option>
                <option value="24">24 meses</option>
                <option value="36">36 meses</option>
              </select>
            </div>
          </div>
        </div>

        <Button onClick={calcular} className="w-full h-9">
          Calcular ROI
        </Button>

        {/* Resultado */}
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4"
          >
            {/* Resultado Principal */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 mb-3">
              <div className="text-center mb-3">
                <p className="text-xs text-muted-foreground mb-1">Retorno sobre Investimento</p>
                <p className={`text-3xl font-bold ${result.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.roi >= 0 ? '+' : ''}{result.roi.toFixed(1)}%
                </p>
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${getROIStatus(result.roi).bg} ${getROIStatus(result.roi).color}`}>
                  {getROIStatus(result.roi).label}
                </span>
              </div>

              {/* Métricas em grid compacto */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-muted-foreground">Lucro</p>
                  <p className={`text-sm font-bold ${result.lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(result.lucroLiquido)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Payback</p>
                  <p className="text-sm font-bold text-foreground">
                    {result.paybackMeses > 100 ? '100+' : result.paybackMeses}m
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Mult.</p>
                  <p className="text-sm font-bold text-foreground">
                    {result.multiplicador}x
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Lucro/Mês</p>
                  <p className={`text-sm font-bold ${result.retornoMensal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(result.retornoMensal)}
                  </p>
                </div>
              </div>
            </div>

            {/* Análise compacta */}
            <div className={`rounded-lg p-3 mb-3 text-sm ${result.roi >= 50 ? 'bg-green-50 dark:bg-green-900/20' : result.roi >= 0 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <p className="text-muted-foreground">
                {result.roi >= 100 && 'Excelente! Potencial para dobrar o investimento.'}
                {result.roi >= 50 && result.roi < 100 && 'Bom retorno com ganho significativo.'}
                {result.roi >= 20 && result.roi < 50 && 'Retorno moderado. Avalie alternativas.'}
                {result.roi >= 0 && result.roi < 20 && 'Retorno baixo. Considere se vale o esforço.'}
                {result.roi < 0 && 'Retorno negativo. Revise os números.'}
                {result.paybackMeses <= parseInt(periodo) && ` Payback em ${result.paybackMeses} meses.`}
              </p>
            </div>

            {/* Fórmula colapsável */}
            <button
              onClick={() => setShowFormula(!showFormula)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground w-full"
            >
              <Info className="w-3 h-3" />
              Como calculamos?
              {showFormula ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
            </button>

            {showFormula && (
              <div className="mt-2 p-2 bg-secondary/50 rounded text-xs text-muted-foreground space-y-1">
                <p><strong>ROI</strong> = (Lucro Líquido / Investimento) × 100</p>
                <p><strong>Payback</strong> = Investimento / Lucro Mensal</p>
              </div>
            )}

            {/* Ações */}
            <div className="flex justify-end pt-3 border-t mt-3">
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
            </div>
          </motion.div>
        )}
      </Card>

      {/* Sugestões */}
      {result && (
        <div className="mt-3">
          <ContextualSuggestions currentCalculator="roi" show={true} />
        </div>
      )}
    </div>
  )
}
