'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Tag } from 'lucide-react'
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

  return (
    <div className="max-w-lg mx-auto">
      <Card className="p-4">
        {/* Header compacto */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Tag className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Precificação</h2>
            <p className="text-xs text-muted-foreground">Calcule o preço ideal para seus serviços</p>
          </div>
        </div>

        {/* Formulário compacto */}
        <div className="space-y-3 mb-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="material" className="text-xs">Custo Materiais (R$)</Label>
              <Input
                id="material"
                type="number"
                placeholder="0.00"
                value={custoMaterial}
                onChange={(e) => setCustoMaterial(e.target.value)}
                className="h-9 mt-1"
                disabled={isCalculating}
              />
            </div>
            <div>
              <Label htmlFor="despesas" className="text-xs">Despesas Extras (R$)</Label>
              <Input
                id="despesas"
                type="number"
                placeholder="0.00"
                value={despesasAdicionais}
                onChange={(e) => setDespesasAdicionais(e.target.value)}
                className="h-9 mt-1"
                disabled={isCalculating}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="tempo" className="text-xs">Horas</Label>
              <Input
                id="tempo"
                type="number"
                placeholder="0"
                value={tempoHoras}
                onChange={(e) => setTempoHoras(e.target.value)}
                className="h-9 mt-1"
                disabled={isCalculating}
              />
            </div>
            <div>
              <Label htmlFor="valorhora" className="text-xs">R$/Hora</Label>
              <Input
                id="valorhora"
                type="number"
                placeholder="0.00"
                value={valorHora}
                onChange={(e) => setValorHora(e.target.value)}
                className="h-9 mt-1"
                disabled={isCalculating}
              />
            </div>
            <div>
              <Label htmlFor="margem" className="text-xs">Margem %</Label>
              <Input
                id="margem"
                type="number"
                placeholder="30"
                value={margemLucro}
                onChange={(e) => setMargemLucro(e.target.value)}
                className="h-9 mt-1"
                disabled={isCalculating}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={calcular}
          className="w-full h-9"
          disabled={isCalculating}
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculando...
            </>
          ) : (
            'Calcular Preço'
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
                <div className="text-center mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Preço do Serviço</p>
                  <motion.p
                    className="text-3xl font-bold text-primary"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    R$ {resultado.precoVenda.toFixed(2)}
                  </motion.p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lucro de R$ {resultado.lucro.toFixed(2)} por serviço
                  </p>
                </div>

                {/* Métricas em grid compacto */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Custo Total</p>
                    <p className="text-sm font-bold text-foreground">
                      R$ {resultado.custoTotal.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">R$/Hora Efetivo</p>
                    <p className="text-sm font-bold text-foreground">
                      R$ {resultado.precoHoraEfetivo.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Lucro</p>
                    <p className={`text-sm font-bold ${resultado.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {resultado.lucro.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-end pt-3 border-t">
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
            currentCalculator="precificacao"
            show={true}
          />
        </div>
      )}
    </div>
  )
}
