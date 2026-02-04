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
import { PrecificacaoPDF } from '@/components/pdf'
import { usePDFUserData } from '@/hooks/use-pdf-user-data'

export function PrecificacaoCalc() {
  const [custoMaterial, setCustoMaterial] = useState('')
  const [despesasAdicionais, setDespesasAdicionais] = useState('')
  const [tempoHoras, setTempoHoras] = useState('')
  const [valorHora, setValorHora] = useState('')
  const [margemLucro, setMargemLucro] = useState('30')
  const [resultado, setResultado] = useState<{
    custoMaoDeObra: number
    custoTotal: number
    precoVenda: number
    precoHoraEfetivo: number
    lucro: number
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
    const material = parseFloat(custoMaterial) || 0
    const despesas = parseFloat(despesasAdicionais) || 0
    const tempo = parseFloat(tempoHoras) || 0
    const hora = parseFloat(valorHora) || 0
    const margem = parseFloat(margemLucro) || 0

    setIsCalculating(true)
    await new Promise(resolve => setTimeout(resolve, 300))

    const custoMaoDeObra = tempo * hora
    const custoTotal = material + despesas + custoMaoDeObra
    const precoVenda = custoTotal / (1 - margem / 100)
    const lucro = precoVenda - custoTotal
    const precoHoraEfetivo = tempo > 0 ? precoVenda / tempo : 0

    setResultado({
      custoMaoDeObra,
      custoTotal,
      precoVenda,
      precoHoraEfetivo,
      lucro,
    })
    setIsCalculating(false)

    // Registra o calculo e verifica limite
    recordCalculation()
    const { remaining: rem } = checkLimit()
    setShowUpgradeBanner(rem <= 2)
  }

  const pdfInputs = {
    horasServico: parseFloat(tempoHoras) || 0,
    valorHora: parseFloat(valorHora) || 0,
    materiaisCusto: parseFloat(custoMaterial) || 0,
    despesasAdicionais: parseFloat(despesasAdicionais) || 0,
    margemDesejada: parseFloat(margemLucro) || 30,
  }

  const canExport = pdfUserData !== undefined

  return (
    <Card className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-3">
        Calculadora de Precificacao
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Calcule o preco ideal para seus servicos
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="material">Custo de Materiais (R$)</Label>
          <Input
            id="material"
            type="number"
            placeholder="0.00"
            value={custoMaterial}
            onChange={(e) => setCustoMaterial(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
        </div>

        <div>
          <Label htmlFor="despesas">Despesas Adicionais (R$)</Label>
          <Input
            id="despesas"
            type="number"
            placeholder="0.00"
            value={despesasAdicionais}
            onChange={(e) => setDespesasAdicionais(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
        </div>

        <div>
          <Label htmlFor="tempo">Tempo de Trabalho (horas)</Label>
          <Input
            id="tempo"
            type="number"
            placeholder="0"
            value={tempoHoras}
            onChange={(e) => setTempoHoras(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
        </div>

        <div>
          <Label htmlFor="valorhora">Valor da Hora (R$)</Label>
          <Input
            id="valorhora"
            type="number"
            placeholder="0.00"
            value={valorHora}
            onChange={(e) => setValorHora(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="margem">Margem de Lucro (%)</Label>
          <Input
            id="margem"
            type="number"
            placeholder="30"
            value={margemLucro}
            onChange={(e) => setMargemLucro(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
        </div>
      </div>

      <Button
        onClick={calcular}
        className="w-full h-10 mb-4"
        disabled={isCalculating}
      >
        {isCalculating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calculando...
          </>
        ) : (
          'Calcular Preco'
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
                <p className="text-sm text-muted-foreground mb-2">Preco do Servico</p>
                <motion.p
                  className="text-2xl font-bold text-foreground"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                >
                  R$ {resultado.precoVenda.toFixed(2)}
                </motion.p>
                <p className="text-xs text-muted-foreground mt-2">
                  Lucro de R$ {resultado.lucro.toFixed(2)} por servico
                </p>
              </Card>

              <div className="grid grid-cols-3 gap-3">
                <Card className="p-3 bg-card">
                  <p className="text-xs text-muted-foreground">Custo Total</p>
                  <p className="text-sm font-bold text-foreground">
                    R$ {resultado.custoTotal.toFixed(2)}
                  </p>
                </Card>
                <Card className="p-3 bg-card">
                  <p className="text-xs text-muted-foreground">Preco/Hora Efetivo</p>
                  <p className="text-sm font-bold text-foreground">
                    R$ {resultado.precoHoraEfetivo.toFixed(2)}
                  </p>
                </Card>
                <Card className="p-3 bg-card">
                  <p className="text-xs text-muted-foreground">Lucro</p>
                  <p className={`text-sm font-bold ${resultado.lucro >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    R$ {resultado.lucro.toFixed(2)}
                  </p>
                </Card>
              </div>
            </div>

            {canExport && (
              <div className="flex justify-end mt-4">
                <ExportActions
                  pdfDocument={
                    <PrecificacaoPDF
                      modo="servicos"
                      inputs={pdfInputs}
                      resultado={resultado}
                      userData={pdfUserData}
                    />
                  }
                  calculatorName="precificacao"
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
              currentCalculator="precificacao"
              show={resultado !== null}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
