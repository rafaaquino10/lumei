'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Scale, CheckCircle2, Crown, Building2, Briefcase } from 'lucide-react'
import { usePaywall, UpgradeBanner } from '@/components/paywall'
import { ContextualSuggestions } from './contextual-suggestions'
import { ExportActions } from './export-actions'
import { ComparadorTributarioPDF } from '@/components/pdf'
import { usePDFUserData } from '@/hooks/use-pdf-user-data'

type TipoAtividade = 'comercio' | 'servicos' | 'industria'

const DAS_MEI = {
  comercio: 71.60,
  servicos: 75.60,
  industria: 76.60,
}

const SIMPLES_ALIQUOTAS = {
  comercio: [
    { limite: 180000, aliquota: 0.04 },
    { limite: 360000, aliquota: 0.073 },
    { limite: 720000, aliquota: 0.095 },
    { limite: 1800000, aliquota: 0.107 },
  ],
  servicos: [
    { limite: 180000, aliquota: 0.06 },
    { limite: 360000, aliquota: 0.112 },
    { limite: 720000, aliquota: 0.135 },
    { limite: 1800000, aliquota: 0.16 },
  ],
  industria: [
    { limite: 180000, aliquota: 0.045 },
    { limite: 360000, aliquota: 0.078 },
    { limite: 720000, aliquota: 0.10 },
    { limite: 1800000, aliquota: 0.112 },
  ],
}

const LUCRO_PRESUMIDO = {
  comercio: { presuncao: 0.08, irpj: 0.15, csll: 0.09, pis: 0.0065, cofins: 0.03 },
  servicos: { presuncao: 0.32, irpj: 0.15, csll: 0.09, pis: 0.0065, cofins: 0.03 },
  industria: { presuncao: 0.08, irpj: 0.15, csll: 0.09, pis: 0.0065, cofins: 0.03 },
}

interface RegimeInfo {
  nome: string
  custoAnual: number
  custoMensal: number
  percentual: number
  vantagens: string[]
  recomendado: boolean
}

interface Resultado {
  faturamentoAnual: number
  mei: RegimeInfo | null
  simples: RegimeInfo
  lucroPresumido: RegimeInfo
  melhorOpcao: 'mei' | 'simples' | 'lucroPresumido'
}

function calcularSimples(faturamento: number, tipo: TipoAtividade): number {
  const faixas = SIMPLES_ALIQUOTAS[tipo]
  for (const faixa of faixas) {
    if (faturamento <= faixa.limite) return faturamento * faixa.aliquota
  }
  return faturamento * 0.16
}

function calcularLucroPresumido(faturamento: number, tipo: TipoAtividade): number {
  const config = LUCRO_PRESUMIDO[tipo]
  const baseCalculo = faturamento * config.presuncao
  const irpj = baseCalculo * config.irpj
  const csll = baseCalculo * config.csll
  const pis = faturamento * config.pis
  const cofins = faturamento * config.cofins
  const iss = tipo === 'servicos' ? faturamento * 0.03 : 0
  const icms = tipo !== 'servicos' ? faturamento * 0.07 : 0
  return irpj + csll + pis + cofins + iss + icms
}

export function ComparadorTributarioCalc() {
  const [faturamentoAnual, setFaturamentoAnual] = useState('')
  const [tipoAtividade, setTipoAtividade] = useState<TipoAtividade>('servicos')
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false)

  const { checkLimit, recordCalculation, paywallType, remaining, limit } = usePaywall()
  const pdfUserData = usePDFUserData()

  const calcular = async () => {
    const faturamento = parseFloat(faturamentoAnual) || 0
    if (faturamento <= 0) return

    setIsCalculating(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    const limiteMEI = 81000

    let meiInfo: RegimeInfo | null = null
    if (faturamento <= limiteMEI) {
      const custoMEI = DAS_MEI[tipoAtividade] * 12
      meiInfo = {
        nome: 'MEI',
        custoAnual: custoMEI,
        custoMensal: custoMEI / 12,
        percentual: (custoMEI / faturamento) * 100,
        vantagens: ['Menor custo', 'Sem contador', 'INSS incluído'],
        recomendado: false,
      }
    }

    const custoSimples = calcularSimples(faturamento, tipoAtividade)
    const simplesInfo: RegimeInfo = {
      nome: 'Simples',
      custoAnual: custoSimples,
      custoMensal: custoSimples / 12,
      percentual: (custoSimples / faturamento) * 100,
      vantagens: ['Guia única', 'Até R$ 4,8mi', 'Menos burocracia'],
      recomendado: false,
    }

    const custoLP = calcularLucroPresumido(faturamento, tipoAtividade)
    const lpInfo: RegimeInfo = {
      nome: 'L. Presumido',
      custoAnual: custoLP,
      custoMensal: custoLP / 12,
      percentual: (custoLP / faturamento) * 100,
      vantagens: ['Sem limite', 'Alta margem', 'Créditos PIS/COFINS'],
      recomendado: false,
    }

    const opcoes: { tipo: 'mei' | 'simples' | 'lucroPresumido'; custo: number }[] = []
    if (meiInfo) opcoes.push({ tipo: 'mei', custo: meiInfo.custoAnual })
    opcoes.push({ tipo: 'simples', custo: simplesInfo.custoAnual })
    opcoes.push({ tipo: 'lucroPresumido', custo: lpInfo.custoAnual })

    const melhorOpcao = opcoes.reduce((a, b) => a.custo < b.custo ? a : b).tipo

    if (melhorOpcao === 'mei' && meiInfo) meiInfo.recomendado = true
    if (melhorOpcao === 'simples') simplesInfo.recomendado = true
    if (melhorOpcao === 'lucroPresumido') lpInfo.recomendado = true

    setResultado({ faturamentoAnual: faturamento, mei: meiInfo, simples: simplesInfo, lucroPresumido: lpInfo, melhorOpcao })
    setIsCalculating(false)

    recordCalculation()
    const { remaining: rem } = checkLimit()
    setShowUpgradeBanner(rem <= 2)
  }

  const pdfInputs = { faturamentoAnual: parseFloat(faturamentoAnual) || 0, tipoAtividade }

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const RegimeCard = ({ regime, icon: Icon }: { regime: RegimeInfo; icon: React.ElementType }) => (
    <div className={`rounded-lg p-3 ${regime.recomendado ? 'bg-primary/10 ring-2 ring-primary' : 'bg-secondary/50'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded flex items-center justify-center ${
            regime.recomendado ? 'bg-primary text-white' : 'bg-secondary'
          }`}>
            <Icon className="w-3 h-3" />
          </div>
          <span className="text-xs font-semibold text-foreground">{regime.nome}</span>
        </div>
        {regime.recomendado && (
          <CheckCircle2 className="w-4 h-4 text-primary" />
        )}
      </div>
      <p className="text-lg font-bold text-foreground">{formatCurrency(regime.custoMensal)}<span className="text-[10px] text-muted-foreground">/mês</span></p>
      <p className="text-[10px] text-muted-foreground">{regime.percentual.toFixed(1)}% do faturamento</p>
      <div className="mt-2 space-y-0.5">
        {regime.vantagens.map((v, i) => (
          <p key={i} className="text-[10px] text-muted-foreground">• {v}</p>
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-lg mx-auto">
      <Card className="p-4">
        {/* Header compacto */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Scale className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Comparador Tributário</h2>
            <p className="text-xs text-muted-foreground">MEI vs Simples vs Lucro Presumido</p>
          </div>
        </div>

        {/* Formulário compacto */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <Label htmlFor="faturamento" className="text-xs">Faturamento Anual (R$)</Label>
            <Input
              id="faturamento"
              type="number"
              placeholder="150000"
              value={faturamentoAnual}
              onChange={(e) => setFaturamentoAnual(e.target.value)}
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
          disabled={isCalculating || !faturamentoAnual}
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculando...
            </>
          ) : (
            'Comparar Regimes'
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
              {/* Resumo */}
              <div className="bg-primary/10 rounded-lg p-3 mb-3 text-center">
                <p className="text-[10px] text-muted-foreground">
                  Para {formatCurrency(resultado.faturamentoAnual)}/ano
                </p>
                <p className="text-sm font-bold text-foreground">
                  Melhor opção:{' '}
                  <span className="text-primary">
                    {resultado.melhorOpcao === 'mei' ? 'MEI' :
                     resultado.melhorOpcao === 'simples' ? 'Simples Nacional' :
                     'Lucro Presumido'}
                  </span>
                </p>
              </div>

              {/* Cards dos regimes */}
              <div className="space-y-2 mb-3">
                {resultado.mei && <RegimeCard regime={resultado.mei} icon={Crown} />}
                <RegimeCard regime={resultado.simples} icon={Building2} />
                <RegimeCard regime={resultado.lucroPresumido} icon={Briefcase} />
              </div>

              {/* Aviso */}
              <div className="bg-secondary/50 rounded-lg p-2 mb-3">
                <p className="text-[10px] text-muted-foreground">
                  <strong>Importante:</strong> Estimativa simplificada. Consulte um contador para análise detalhada.
                </p>
              </div>

              {/* Ações */}
              <div className="flex justify-end pt-3 border-t">
                <ExportActions
                  pdfDocument={
                    <ComparadorTributarioPDF
                      inputs={pdfInputs}
                      resultado={resultado}
                      userData={pdfUserData}
                    />
                  }
                  calculatorName="comparador-tributario"
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
            currentCalculator="comparador-tributario"
            show={true}
          />
        </div>
      )}
    </div>
  )
}
