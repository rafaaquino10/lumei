'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { usePaywall, UpgradeBanner } from '@/components/paywall'
import { ContextualSuggestions } from './contextual-suggestions'
import { ExportActions } from './export-actions'
import { TransicaoMeiMePDF } from '@/components/pdf'
import { usePDFUserData } from '@/hooks/use-pdf-user-data'

type TipoAtividade = 'comercio' | 'servicos' | 'industria'

const DAS_MEI = {
  comercio: 71.60,
  servicos: 75.60,
  industria: 76.60,
}

const SIMPLES_COMERCIO = [
  { limite: 180000, aliquota: 0.04, deducao: 0 },
  { limite: 360000, aliquota: 0.073, deducao: 5940 },
  { limite: 720000, aliquota: 0.095, deducao: 13860 },
  { limite: 1800000, aliquota: 0.107, deducao: 22500 },
  { limite: 3600000, aliquota: 0.143, deducao: 87300 },
  { limite: 4800000, aliquota: 0.19, deducao: 378000 },
]

const SIMPLES_SERVICOS = [
  { limite: 180000, aliquota: 0.06, deducao: 0 },
  { limite: 360000, aliquota: 0.112, deducao: 9360 },
  { limite: 720000, aliquota: 0.135, deducao: 17640 },
  { limite: 1800000, aliquota: 0.16, deducao: 35640 },
  { limite: 3600000, aliquota: 0.21, deducao: 125640 },
  { limite: 4800000, aliquota: 0.33, deducao: 648000 },
]

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
      const aliquotaEfetiva = ((faturamentoAnual * faixa.aliquota) - faixa.deducao) / faturamentoAnual
      return faturamentoAnual * Math.max(aliquotaEfetiva, 0)
    }
  }
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
    const custoMEI = DAS_MEI[tipoAtividade] * 12
    const custoME = calcularSimples(faturamentoAnual, tipoAtividade)
    const percentualMEI = (custoMEI / faturamentoAnual) * 100
    const percentualME = (custoME / faturamentoAnual) * 100
    const economia = custoME - custoMEI

    let faturamentoIdeal = limiteMEI
    for (let fat = 81000; fat <= 200000; fat += 1000) {
      const custME = calcularSimples(fat, tipoAtividade)
      const custMEI = DAS_MEI[tipoAtividade] * 12
      if (custME <= custMEI) {
        faturamentoIdeal = fat
        break
      }
    }

    let recomendacao: 'mei' | 'me' | 'limite'
    if (faturamentoAnual > limiteMEI) {
      recomendacao = 'limite'
    } else if (economia > 0) {
      recomendacao = 'mei'
    } else {
      recomendacao = 'me'
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
    recordCalculation()
    const { remaining: rem } = checkLimit()
    setShowUpgradeBanner(rem <= 2)
  }

  const pdfInputs = {
    faturamentoMensal: parseFloat(faturamentoMensal) || 0,
    tipoAtividade,
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="max-w-lg mx-auto">
      <Card className="p-4">
        {/* Header compacto */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Transição MEI → ME</h2>
            <p className="text-xs text-muted-foreground">Quando vale migrar para Simples Nacional</p>
          </div>
        </div>

        {/* Formulário compacto */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <Label htmlFor="faturamento" className="text-xs">Faturamento Mensal (R$)</Label>
            <Input
              id="faturamento"
              type="number"
              placeholder="0.00"
              value={faturamentoMensal}
              onChange={(e) => setFaturamentoMensal(e.target.value)}
              className="h-9 mt-1"
              disabled={isCalculating}
            />
          </div>
          <div>
            <Label htmlFor="tipo" className="text-xs">Tipo de Atividade</Label>
            <Select
              value={tipoAtividade}
              onValueChange={(value) => setTipoAtividade(value as TipoAtividade)}
              disabled={isCalculating}
            >
              <SelectTrigger className="h-9 mt-1">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comercio">Comércio</SelectItem>
                <SelectItem value="servicos">Serviços</SelectItem>
                <SelectItem value="industria">Indústria</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={calcular}
          className="w-full h-9"
          disabled={isCalculating || !faturamentoMensal}
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculando...
            </>
          ) : (
            'Simular Transição'
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
              {/* Alerta de limite */}
              {resultado.recomendacao === 'limite' && (
                <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-red-700 dark:text-red-400">
                        Limite MEI ultrapassado!
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Com {formatCurrency(resultado.faturamentoAnual)}/ano, você precisa migrar para ME.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recomendação */}
              <div className={`rounded-lg p-3 mb-3 ${
                resultado.recomendacao === 'mei' ? 'bg-green-50 dark:bg-green-950/20' :
                resultado.recomendacao === 'me' ? 'bg-blue-50 dark:bg-blue-950/20' :
                'bg-amber-50 dark:bg-amber-950/20'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className={`w-4 h-4 ${
                    resultado.recomendacao === 'mei' ? 'text-green-500' :
                    resultado.recomendacao === 'me' ? 'text-blue-500' :
                    'text-amber-500'
                  }`} />
                  <p className="text-xs font-medium text-foreground">
                    {resultado.recomendacao === 'mei' && 'Permanecer no MEI'}
                    {resultado.recomendacao === 'me' && 'Migrar para ME'}
                    {resultado.recomendacao === 'limite' && 'Migração obrigatória'}
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {resultado.recomendacao === 'mei' && (
                    <>Economia de <strong className="text-green-600">{formatCurrency(resultado.economia)}/ano</strong> no MEI</>
                  )}
                  {resultado.recomendacao === 'me' && (
                    <>Economia de <strong className="text-blue-600">{formatCurrency(Math.abs(resultado.economia))}/ano</strong> no ME</>
                  )}
                  {resultado.recomendacao === 'limite' && 'Excede o limite anual do MEI'}
                </p>
              </div>

              {/* Comparativo */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-foreground">MEI</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                      {resultado.percentualMEI.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Mensal</p>
                  <p className="text-sm font-bold text-foreground">{formatCurrency(DAS_MEI[tipoAtividade])}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Anual</p>
                  <p className="text-xs font-medium text-foreground">{formatCurrency(resultado.custoMEI)}</p>
                </div>

                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-foreground">ME (Simples)</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded">
                      {resultado.percentualME.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Mensal*</p>
                  <p className="text-sm font-bold text-foreground">{formatCurrency(resultado.custoME / 12)}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Anual*</p>
                  <p className="text-xs font-medium text-foreground">{formatCurrency(resultado.custoME)}</p>
                </div>
              </div>

              {/* Ponto de virada */}
              <div className="bg-secondary/50 rounded-lg p-2 mb-3">
                <p className="text-[10px] text-muted-foreground">
                  <strong>Ponto de virada:</strong> MEI deixa de valer a pena acima de{' '}
                  <strong className="text-foreground">{formatCurrency(resultado.faturamentoIdeal)}/ano</strong>
                </p>
              </div>

              <p className="text-[10px] text-muted-foreground mb-3">
                * Valores estimados. Consulte um contador para análise detalhada.
              </p>

              {/* Ações */}
              <div className="flex justify-end pt-3 border-t">
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
            currentCalculator="transicao-mei-me"
            show={true}
          />
        </div>
      )}
    </div>
  )
}
