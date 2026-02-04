'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Clock } from 'lucide-react'
import { usePaywall, UpgradeBanner } from '@/components/paywall'
import { ContextualSuggestions } from './contextual-suggestions'
import { ExportActions } from './export-actions'
import { PrecoHoraPDF } from '@/components/pdf'
import { usePDFUserData } from '@/hooks/use-pdf-user-data'

export function PrecoHoraCalc() {
  const [salarioDesejado, setSalarioDesejado] = useState('')
  const [custosFixos, setCustosFixos] = useState('')
  const [horasMes, setHorasMes] = useState('160')
  const [diasFerias, setDiasFerias] = useState('30')
  const [margemLucro, setMargemLucro] = useState('20')
  const [resultado, setResultado] = useState<{
    precoHoraBruto: number
    precoHoraFinal: number
    fatorFerias: number
    receitaNecessaria: number
    receitaMensal: number
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
    const salario = parseFloat(salarioDesejado) || 0
    const custos = parseFloat(custosFixos) || 0
    const horas = parseFloat(horasMes) || 160
    const ferias = parseFloat(diasFerias) || 30
    const margem = parseFloat(margemLucro) || 20

    if (salario > 0 && horas > 0) {
      setIsCalculating(true)
      await new Promise(resolve => setTimeout(resolve, 300))

      const necessidadeMensal = salario + custos
      const receitaNecessaria = necessidadeMensal * 12
      const horasAnoSemFerias = horas * 12
      const horasFeriasAno = (ferias / 30) * horas
      const horasEfetivasAno = horasAnoSemFerias - horasFeriasAno
      const fatorFerias = horasAnoSemFerias / horasEfetivasAno
      const precoHoraBruto = receitaNecessaria / horasEfetivasAno
      const precoHoraFinal = precoHoraBruto * (1 + margem / 100)
      const receitaMensal = precoHoraFinal * horas

      setResultado({
        precoHoraBruto,
        precoHoraFinal,
        fatorFerias,
        receitaNecessaria,
        receitaMensal,
      })
      setIsCalculating(false)

      recordCalculation()
      const { remaining: rem } = checkLimit()
      setShowUpgradeBanner(rem <= 2)
    }
  }

  const pdfInputs = {
    salarioDesejado: parseFloat(salarioDesejado) || 0,
    custosFixos: parseFloat(custosFixos) || 0,
    horasTrabalhadasMes: parseFloat(horasMes) || 160,
    diasFeriasPorAno: parseFloat(diasFerias) || 30,
    margemLucro: parseFloat(margemLucro) || 20,
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card className="p-4">
        {/* Header compacto */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Preço por Hora</h2>
            <p className="text-xs text-muted-foreground">Calcule quanto cobrar por hora</p>
          </div>
        </div>

        {/* Formulário compacto */}
        <div className="space-y-3 mb-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="salario" className="text-xs">Salário Líquido (R$/mês)</Label>
              <Input
                id="salario"
                type="number"
                placeholder="5000.00"
                value={salarioDesejado}
                onChange={(e) => setSalarioDesejado(e.target.value)}
                className="h-9 mt-1"
                disabled={isCalculating}
              />
            </div>
            <div>
              <Label htmlFor="custos" className="text-xs">Custos Fixos (R$)</Label>
              <Input
                id="custos"
                type="number"
                placeholder="500.00"
                value={custosFixos}
                onChange={(e) => setCustosFixos(e.target.value)}
                className="h-9 mt-1"
                disabled={isCalculating}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="horas" className="text-xs">Horas/Mês</Label>
              <Input
                id="horas"
                type="number"
                placeholder="160"
                value={horasMes}
                onChange={(e) => setHorasMes(e.target.value)}
                className="h-9 mt-1"
                disabled={isCalculating}
              />
            </div>
            <div>
              <Label htmlFor="ferias" className="text-xs">Férias/Ano</Label>
              <Input
                id="ferias"
                type="number"
                placeholder="30"
                value={diasFerias}
                onChange={(e) => setDiasFerias(e.target.value)}
                className="h-9 mt-1"
                disabled={isCalculating}
              />
            </div>
            <div>
              <Label htmlFor="margem" className="text-xs">Margem %</Label>
              <Input
                id="margem"
                type="number"
                placeholder="20"
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
          disabled={isCalculating || !salarioDesejado}
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculando...
            </>
          ) : (
            'Calcular Preço/Hora'
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
                  <p className="text-xs text-muted-foreground mb-1">Preço por Hora Recomendado</p>
                  <motion.p
                    className="text-3xl font-bold text-primary"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    R$ {resultado.precoHoraFinal.toFixed(2)}
                  </motion.p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Inclui férias + margem de {margemLucro}%
                  </p>
                </div>

                {/* Métricas em grid compacto */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Receita/Mês</p>
                    <p className="text-sm font-bold text-foreground">
                      R$ {resultado.receitaMensal.toFixed(0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Preço Base</p>
                    <p className="text-sm font-bold text-foreground">
                      R$ {resultado.precoHoraBruto.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Fator Férias</p>
                    <p className="text-sm font-bold text-foreground">
                      {resultado.fatorFerias.toFixed(2)}x
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-end pt-3 border-t">
                <ExportActions
                  pdfDocument={
                    <PrecoHoraPDF
                      inputs={pdfInputs}
                      resultado={resultado}
                      userData={pdfUserData}
                    />
                  }
                  calculatorName="preco-hora"
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
            currentCalculator="preco-hora"
            show={true}
          />
        </div>
      )}
    </div>
  )
}
