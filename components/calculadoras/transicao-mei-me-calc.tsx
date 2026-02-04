'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react'
import { usePaywall, UpgradeBanner } from '@/components/paywall'
import { ContextualSuggestions } from './contextual-suggestions'
import { ExportActions } from './export-actions'
import { TransicaoMeiMePDF } from '@/components/pdf'
import { usePDFUserData } from '@/hooks/use-pdf-user-data'

type TipoAtividade = 'comercio' | 'servicos' | 'industria'

// Valores DAS MEI 2026
const DAS_MEI = {
  comercio: 71.60,
  servicos: 75.60,
  industria: 76.60,
}

// Faixas do Simples Nacional 2026 (simplificado)
// Anexo I - Comércio
const SIMPLES_COMERCIO = [
  { limite: 180000, aliquota: 0.04, deducao: 0 },
  { limite: 360000, aliquota: 0.073, deducao: 5940 },
  { limite: 720000, aliquota: 0.095, deducao: 13860 },
  { limite: 1800000, aliquota: 0.107, deducao: 22500 },
  { limite: 3600000, aliquota: 0.143, deducao: 87300 },
  { limite: 4800000, aliquota: 0.19, deducao: 378000 },
]

// Anexo III - Serviços
const SIMPLES_SERVICOS = [
  { limite: 180000, aliquota: 0.06, deducao: 0 },
  { limite: 360000, aliquota: 0.112, deducao: 9360 },
  { limite: 720000, aliquota: 0.135, deducao: 17640 },
  { limite: 1800000, aliquota: 0.16, deducao: 35640 },
  { limite: 3600000, aliquota: 0.21, deducao: 125640 },
  { limite: 4800000, aliquota: 0.33, deducao: 648000 },
]

// Anexo II - Indústria
const SIMPLES_INDUSTRIA = [
  { limite: 180000, aliquota: 0.045, deducao: 0 },
  { limite: 360000, aliquota: 0.078, deducao: 5940 },
  { limite: 720000, aliquota: 0.10, deducao: 13860 },
  { limite: 1800000, aliquota: 0.112, deducao: 22500 },
  { limite: 3600000, aliquota: 0.147, deducao: 85500 },
  { limite: 4800000, aliquota: 0.30, deducao: 720000 },
]

function calcularSimples(faturamentoAnual: number, tipo: TipoAtividade): number {
  const tabela = tipo === 'comercio' ? SIMPLES_COMERCIO :
                 tipo === 'servicos' ? SIMPLES_SERVICOS :
                 SIMPLES_INDUSTRIA

  for (const faixa of tabela) {
    if (faturamentoAnual <= faixa.limite) {
      // Fórmula: (RBT12 × Aliq - PD) / RBT12
      const aliquotaEfetiva = ((faturamentoAnual * faixa.aliquota) - faixa.deducao) / faturamentoAnual
      return faturamentoAnual * Math.max(aliquotaEfetiva, 0)
    }
  }

  // Acima do limite do Simples
  return faturamentoAnual * 0.33
}

interface Resultado {
  faturamentoAnual: number
  custoMEI: number
  custoME: number
  economia: number
  percentualMEI: number
  percentualME: number
  recomendacao: 'mei' | 'me' | 'limite'
  faturamentoIdeal: number
}

export function TransicaoMeiMeCalc() {
  const [faturamentoMensal, setFaturamentoMensal] = useState('')
  const [tipoAtividade, setTipoAtividade] = useState<TipoAtividade>('servicos')
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
    const mensal = parseFloat(faturamentoMensal)
    if (!mensal || mensal <= 0) return

    setIsCalculating(true)
    await new Promise(resolve => setTimeout(resolve, 400))

    const faturamentoAnual = mensal * 12
    const limiteMEI = 81000

    // Custo MEI (DAS anual)
    const custoMEI = DAS_MEI[tipoAtividade] * 12

    // Custo ME (Simples Nacional)
    const custoME = calcularSimples(faturamentoAnual, tipoAtividade)

    // Percentuais
    const percentualMEI = (custoMEI / faturamentoAnual) * 100
    const percentualME = (custoME / faturamentoAnual) * 100

    // Economia (positivo = MEI é melhor, negativo = ME é melhor)
    const economia = custoME - custoMEI

    // Calcular ponto de virada (quando ME passa a valer mais a pena)
    let faturamentoIdeal = limiteMEI
    for (let fat = 81000; fat <= 200000; fat += 1000) {
      const custME = calcularSimples(fat, tipoAtividade)
      const custMEI = DAS_MEI[tipoAtividade] * 12
      if (custME <= custMEI) {
        faturamentoIdeal = fat
        break
      }
    }

    // Recomendação
    let recomendacao: 'mei' | 'me' | 'limite'
    if (faturamentoAnual > limiteMEI) {
      recomendacao = 'limite' // Obrigado a migrar
    } else if (economia > 0) {
      recomendacao = 'mei' // MEI é mais vantajoso
    } else {
      recomendacao = 'me' // ME é mais vantajoso (raro abaixo do limite)
    }

    setResultado({
      faturamentoAnual,
      custoMEI,
      custoME,
      economia,
      percentualMEI,
      percentualME,
      recomendacao,
      faturamentoIdeal,
    })

    setIsCalculating(false)

    // Registra o cálculo e verifica limite
    recordCalculation()
    const { remaining: rem } = checkLimit()
    setShowUpgradeBanner(rem <= 2)
  }

  const pdfInputs = {
    faturamentoMensal: parseFloat(faturamentoMensal) || 0,
    tipoAtividade,
  }

  const canExport = pdfUserData !== undefined

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <Card className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-2">
        Simulador de Transição MEI → ME
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Descubra quando vale a pena migrar de MEI para Microempresa (Simples Nacional)
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="faturamento">Faturamento Mensal Médio (R$)</Label>
          <Input
            id="faturamento"
            type="number"
            placeholder="0.00"
            value={faturamentoMensal}
            onChange={(e) => setFaturamentoMensal(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
        </div>

        <div>
          <Label htmlFor="tipo">Tipo de Atividade</Label>
          <Select
            value={tipoAtividade}
            onValueChange={(value) => setTipoAtividade(value as TipoAtividade)}
            disabled={isCalculating}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comercio">Comércio (Anexo I)</SelectItem>
              <SelectItem value="servicos">Serviços (Anexo III)</SelectItem>
              <SelectItem value="industria">Indústria (Anexo II)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={calcular}
        className="w-full h-10 mb-4"
        disabled={isCalculating || !faturamentoMensal}
      >
        {isCalculating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calculando...
          </>
        ) : (
          <>
            <TrendingUp className="mr-2 h-4 w-4" />
            Simular Transição
          </>
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
            {/* Alerta de limite */}
            {resultado.recomendacao === 'limite' && (
              <Card className="p-4 bg-destructive/10 border-destructive mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-destructive">Atenção: Limite MEI ultrapassado!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Com faturamento de {formatCurrency(resultado.faturamentoAnual)}/ano, você ultrapassa
                      o limite de R$ 81.000 do MEI e precisa migrar para ME.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Recomendação */}
            <Card className={`p-4 mb-4 ${
              resultado.recomendacao === 'mei' ? 'bg-primary/10 border-primary' :
              resultado.recomendacao === 'me' ? 'bg-blue-500/10 border-blue-500' :
              'bg-amber-500/10 border-amber-500'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className={`w-5 h-5 ${
                  resultado.recomendacao === 'mei' ? 'text-primary' :
                  resultado.recomendacao === 'me' ? 'text-blue-500' :
                  'text-amber-500'
                }`} />
                <p className="font-semibold text-foreground">
                  {resultado.recomendacao === 'mei' && 'Recomendação: Permanecer no MEI'}
                  {resultado.recomendacao === 'me' && 'Recomendação: Migrar para ME'}
                  {resultado.recomendacao === 'limite' && 'Migração obrigatória para ME'}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {resultado.recomendacao === 'mei' && (
                  <>Você economiza <strong className="text-primary">{formatCurrency(resultado.economia)}/ano</strong> permanecendo no MEI.</>
                )}
                {resultado.recomendacao === 'me' && (
                  <>Você economizaria <strong className="text-blue-500">{formatCurrency(Math.abs(resultado.economia))}/ano</strong> migrando para ME.</>
                )}
                {resultado.recomendacao === 'limite' && (
                  <>A migração é necessária por exceder o limite anual do MEI.</>
                )}
              </p>
            </Card>

            {/* Comparativo */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* MEI */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">MEI</h3>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                    {resultado.percentualMEI.toFixed(2)}% do faturamento
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">DAS Mensal</span>
                    <span className="font-medium">{formatCurrency(DAS_MEI[tipoAtividade])}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">DAS Anual</span>
                    <span className="font-medium">{formatCurrency(resultado.custoMEI)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Limite Anual</span>
                    <span className="font-medium">R$ 81.000</span>
                  </div>
                </div>
              </Card>

              {/* ME */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">ME (Simples)</h3>
                  <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 rounded">
                    {resultado.percentualME.toFixed(2)}% do faturamento
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Imposto Mensal*</span>
                    <span className="font-medium">{formatCurrency(resultado.custoME / 12)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Imposto Anual*</span>
                    <span className="font-medium">{formatCurrency(resultado.custoME)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Limite Anual</span>
                    <span className="font-medium">R$ 4.800.000</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Projeção */}
            <Card className="p-4 bg-secondary mb-4">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Ponto de Virada
              </h3>
              <p className="text-sm text-muted-foreground">
                Para seu tipo de atividade ({tipoAtividade}), o MEI deixa de ser vantajoso
                quando o faturamento anual ultrapassa aproximadamente{' '}
                <strong className="text-foreground">{formatCurrency(resultado.faturamentoIdeal)}</strong>.
                Acima desse valor, considere migrar para ME.
              </p>
            </Card>

            <p className="text-xs text-muted-foreground mb-4">
              * Valores estimados com base no Simples Nacional 2026. Consulte um contador para análise detalhada.
            </p>

            {canExport && resultado && (
              <div className="flex justify-end mt-4">
                <ExportActions
                  pdfDocument={
                    <TransicaoMeiMePDF
                      inputs={pdfInputs}
                      resultado={resultado}
                      userData={pdfUserData}
                    />
                  }
                  calculatorName="transicao-mei-me"
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
              currentCalculator="transicao-mei-me"
              show={resultado !== null}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
