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

      // Registra o calculo e verifica limite
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

  const canExport = pdfUserData !== undefined

  return (
    <Card className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-3">
        Calculadora de Preco por Hora
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Calcule quanto cobrar por hora considerando ferias e margem de lucro
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="salario">Salario Liquido Desejado (R$/mes)</Label>
          <Input
            id="salario"
            type="number"
            placeholder="5000.00"
            value={salarioDesejado}
            onChange={(e) => setSalarioDesejado(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
        </div>

        <div>
          <Label htmlFor="custos">Custos Fixos Mensais (R$)</Label>
          <Input
            id="custos"
            type="number"
            placeholder="500.00"
            value={custosFixos}
            onChange={(e) => setCustosFixos(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
        </div>

        <div>
          <Label htmlFor="horas">Horas Trabalhadas/Mes</Label>
          <Input
            id="horas"
            type="number"
            placeholder="160"
            value={horasMes}
            onChange={(e) => setHorasMes(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
        </div>

        <div>
          <Label htmlFor="ferias">Dias de Ferias/Ano</Label>
          <Input
            id="ferias"
            type="number"
            placeholder="30"
            value={diasFerias}
            onChange={(e) => setDiasFerias(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="margem">Margem de Lucro (%)</Label>
          <Input
            id="margem"
            type="number"
            placeholder="20"
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
        disabled={isCalculating || !salarioDesejado}
      >
        {isCalculating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calculando...
          </>
        ) : (
          'Calcular Preco/Hora'
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
                <p className="text-sm text-muted-foreground mb-2">Preco por Hora Recomendado</p>
                <motion.p
                  className="text-2xl font-bold text-foreground"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                >
                  R$ {resultado.precoHoraFinal.toFixed(2)}/hora
                </motion.p>
                <p className="text-xs text-muted-foreground mt-2">
                  Inclui ferias + margem de {margemLucro}%
                </p>
              </Card>

              <div className="grid grid-cols-3 gap-3">
                <Card className="p-3 bg-card">
                  <p className="text-xs text-muted-foreground">Receita Mensal</p>
                  <p className="text-sm font-bold text-foreground">
                    R$ {resultado.receitaMensal.toFixed(0)}
                  </p>
                </Card>
                <Card className="p-3 bg-card">
                  <p className="text-xs text-muted-foreground">Preco Base</p>
                  <p className="text-sm font-bold text-foreground">
                    R$ {resultado.precoHoraBruto.toFixed(2)}
                  </p>
                </Card>
                <Card className="p-3 bg-card">
                  <p className="text-xs text-muted-foreground">Fator Ferias</p>
                  <p className="text-sm font-bold text-foreground">
                    {resultado.fatorFerias.toFixed(2)}x
                  </p>
                </Card>
              </div>
            </div>

            {canExport && (
              <div className="flex justify-end mt-4">
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
            )}

            {showUpgradeBanner && (
              <UpgradeBanner
                type={paywallType}
                remaining={remaining}
                limit={limit}
              />
            )}

            <ContextualSuggestions
              currentCalculator="preco-hora"
              show={resultado !== null}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
