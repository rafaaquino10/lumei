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

// Valores DAS MEI 2026
const DAS_MEI = {
  comercio: 71.60,
  servicos: 75.60,
  industria: 76.60,
}

// Alíquotas simplificadas do Simples Nacional
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

// Lucro Presumido - alíquotas base
const LUCRO_PRESUMIDO = {
  comercio: {
    presuncao: 0.08, // 8% presunção de lucro para comércio
    irpj: 0.15,
    csll: 0.09,
    pis: 0.0065,
    cofins: 0.03,
  },
  servicos: {
    presuncao: 0.32, // 32% presunção de lucro para serviços
    irpj: 0.15,
    csll: 0.09,
    pis: 0.0065,
    cofins: 0.03,
  },
  industria: {
    presuncao: 0.08,
    irpj: 0.15,
    csll: 0.09,
    pis: 0.0065,
    cofins: 0.03,
  },
}

interface RegimeInfo {
  nome: string
  custoAnual: number
  custoMensal: number
  percentual: number
  vantagens: string[]
  desvantagens: string[]
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
    if (faturamento <= faixa.limite) {
      return faturamento * faixa.aliquota
    }
  }
  return faturamento * 0.16 // Acima do limite
}

function calcularLucroPresumido(faturamento: number, tipo: TipoAtividade): number {
  const config = LUCRO_PRESUMIDO[tipo]
  const baseCalculo = faturamento * config.presuncao

  const irpj = baseCalculo * config.irpj
  const csll = baseCalculo * config.csll
  const pis = faturamento * config.pis
  const cofins = faturamento * config.cofins

  // ISS para serviços (média de 3%)
  const iss = tipo === 'servicos' ? faturamento * 0.03 : 0
  // ICMS para comércio/indústria (média de 7%)
  const icms = tipo !== 'servicos' ? faturamento * 0.07 : 0

  return irpj + csll + pis + cofins + iss + icms
}

export function ComparadorTributarioCalc() {
  const [faturamentoAnual, setFaturamentoAnual] = useState('')
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
    const faturamento = parseFloat(faturamentoAnual) || 0
    if (faturamento <= 0) return

    setIsCalculating(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    const limiteMEI = 81000

    // MEI (só se elegível)
    let meiInfo: RegimeInfo | null = null
    if (faturamento <= limiteMEI) {
      const custoMEI = DAS_MEI[tipoAtividade] * 12
      meiInfo = {
        nome: 'MEI',
        custoAnual: custoMEI,
        custoMensal: custoMEI / 12,
        percentual: (custoMEI / faturamento) * 100,
        vantagens: [
          'Menor custo tributário',
          'Dispensa de contador',
          'Emissão simplificada de NF',
          'INSS incluído no DAS',
        ],
        desvantagens: [
          'Limite de R$ 81.000/ano',
          'Máximo 1 funcionário',
          'Atividades limitadas',
        ],
        recomendado: false,
      }
    }

    // Simples Nacional
    const custoSimples = calcularSimples(faturamento, tipoAtividade)
    const simplesInfo: RegimeInfo = {
      nome: 'Simples Nacional',
      custoAnual: custoSimples,
      custoMensal: custoSimples / 12,
      percentual: (custoSimples / faturamento) * 100,
      vantagens: [
        'Alíquota unificada',
        'Guia única de pagamento',
        'Limite até R$ 4,8 milhões',
        'Menos burocracia que LP',
      ],
      desvantagens: [
        'Exige contador',
        'Algumas atividades vedadas',
        'Pode não compensar para alta margem',
      ],
      recomendado: false,
    }

    // Lucro Presumido
    const custoLP = calcularLucroPresumido(faturamento, tipoAtividade)
    const lpInfo: RegimeInfo = {
      nome: 'Lucro Presumido',
      custoAnual: custoLP,
      custoMensal: custoLP / 12,
      percentual: (custoLP / faturamento) * 100,
      vantagens: [
        'Sem limite de faturamento',
        'Vantajoso para alta margem de lucro',
        'Créditos de PIS/COFINS',
        'Flexibilidade de atividades',
      ],
      desvantagens: [
        'Mais obrigações acessórias',
        'Contador obrigatório',
        'Cálculo mais complexo',
        'Pode ter ICMS/ISS separados',
      ],
      recomendado: false,
    }

    // Determinar melhor opção
    const opcoes: { tipo: 'mei' | 'simples' | 'lucroPresumido'; custo: number }[] = []

    if (meiInfo) opcoes.push({ tipo: 'mei', custo: meiInfo.custoAnual })
    opcoes.push({ tipo: 'simples', custo: simplesInfo.custoAnual })
    opcoes.push({ tipo: 'lucroPresumido', custo: lpInfo.custoAnual })

    const melhorOpcao = opcoes.reduce((a, b) => a.custo < b.custo ? a : b).tipo

    // Marcar recomendado
    if (melhorOpcao === 'mei' && meiInfo) meiInfo.recomendado = true
    if (melhorOpcao === 'simples') simplesInfo.recomendado = true
    if (melhorOpcao === 'lucroPresumido') lpInfo.recomendado = true

    setResultado({
      faturamentoAnual: faturamento,
      mei: meiInfo,
      simples: simplesInfo,
      lucroPresumido: lpInfo,
      melhorOpcao,
    })

    setIsCalculating(false)

    recordCalculation()
    const { remaining: rem } = checkLimit()
    setShowUpgradeBanner(rem <= 2)
  }

  const pdfInputs = {
    faturamentoAnual: parseFloat(faturamentoAnual) || 0,
    tipoAtividade,
  }

  const canExport = pdfUserData !== undefined

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const RegimeCard = ({ regime, icon: Icon }: { regime: RegimeInfo; icon: React.ElementType }) => (
    <Card className={`p-4 ${regime.recomendado ? 'border-primary border-2 bg-primary/5' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            regime.recomendado ? 'bg-primary text-white' : 'bg-secondary'
          }`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{regime.nome}</h3>
            {regime.recomendado && (
              <span className="text-xs text-primary font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Mais vantajoso
              </span>
            )}
          </div>
        </div>
        <span className="text-xs px-2 py-1 bg-secondary rounded">
          {regime.percentual.toFixed(1)}%
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Custo Mensal</span>
          <span className="font-semibold">{formatCurrency(regime.custoMensal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Custo Anual</span>
          <span className="font-bold text-foreground">{formatCurrency(regime.custoAnual)}</span>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <p className="font-medium text-green-600 dark:text-green-400 mb-1">Vantagens:</p>
          <ul className="space-y-0.5 text-muted-foreground">
            {regime.vantagens.slice(0, 2).map((v, i) => (
              <li key={i}>• {v}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-medium text-amber-600 dark:text-amber-400 mb-1">Desvantagens:</p>
          <ul className="space-y-0.5 text-muted-foreground">
            {regime.desvantagens.slice(0, 2).map((d, i) => (
              <li key={i}>• {d}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )

  return (
    <Card className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-2">
        Comparador de Regimes Tributários
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Compare MEI, Simples Nacional e Lucro Presumido para seu faturamento
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="faturamento">Faturamento Anual (R$)</Label>
          <Input
            id="faturamento"
            type="number"
            placeholder="Ex: 150000"
            value={faturamentoAnual}
            onChange={(e) => setFaturamentoAnual(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
        </div>

        <div>
          <Label htmlFor="tipo">Tipo de Atividade Principal</Label>
          <Select
            value={tipoAtividade}
            onValueChange={(value) => setTipoAtividade(value as TipoAtividade)}
            disabled={isCalculating}
          >
            <SelectTrigger className="h-10">
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
        className="w-full h-10 mb-4"
        disabled={isCalculating || !faturamentoAnual}
      >
        {isCalculating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calculando...
          </>
        ) : (
          <>
            <Scale className="mr-2 h-4 w-4" />
            Comparar Regimes
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
            {/* Resumo */}
            <Card className="p-4 bg-primary/10 border-primary mb-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Para faturamento de {formatCurrency(resultado.faturamentoAnual)}/ano
                </p>
                <p className="text-lg font-bold text-foreground">
                  O regime mais vantajoso é:{' '}
                  <span className="text-primary">
                    {resultado.melhorOpcao === 'mei' ? 'MEI' :
                     resultado.melhorOpcao === 'simples' ? 'Simples Nacional' :
                     'Lucro Presumido'}
                  </span>
                </p>
              </div>
            </Card>

            {/* Cards dos regimes */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {resultado.mei && (
                <RegimeCard regime={resultado.mei} icon={Crown} />
              )}
              <RegimeCard regime={resultado.simples} icon={Building2} />
              <RegimeCard regime={resultado.lucroPresumido} icon={Briefcase} />
            </div>

            {/* Aviso */}
            <Card className="p-3 bg-secondary mb-4">
              <p className="text-xs text-muted-foreground">
                <strong>Importante:</strong> Este comparativo é uma estimativa simplificada.
                Os valores reais podem variar conforme a atividade específica, deduções aplicáveis,
                e outros fatores. Consulte um contador para uma análise detalhada.
              </p>
            </Card>

            {canExport && resultado && (
              <div className="flex justify-end mt-4">
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
            )}

            {showUpgradeBanner && (
              <UpgradeBanner
                type={paywallType}
                remaining={remaining}
                limit={limit}
              />
            )}

            <ContextualSuggestions
              currentCalculator="comparador-tributario"
              show={resultado !== null}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
