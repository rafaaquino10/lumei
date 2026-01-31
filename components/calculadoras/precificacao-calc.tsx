'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function PrecificacaoCalc() {
  const [custoMaterial, setCustoMaterial] = useState('')
  const [tempoHoras, setTempoHoras] = useState('')
  const [valorHora, setValorHora] = useState('')
  const [margemLucro, setMargemLucro] = useState('30')
  const [resultado, setResultado] = useState<number | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calcular = async () => {
    const material = parseFloat(custoMaterial) || 0
    const tempo = parseFloat(tempoHoras) || 0
    const hora = parseFloat(valorHora) || 0
    const margem = parseFloat(margemLucro) || 0

    setIsCalculating(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    const custoTotal = material + (tempo * hora)
    const precoFinal = custoTotal * (1 + margem / 100)
    setResultado(precoFinal)
    setIsCalculating(false)
  }

  return (
    <Card className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-3">
        Calculadora de Precificação
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="material">Custo do Material (R$)</Label>
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

        <div>
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
          'Calcular Preço'
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
            <Card className="p-4 bg-primary/10 border-primary">
              <p className="text-sm text-muted-foreground mb-2">Preço Sugerido</p>
              <motion.p
                className="text-2xl font-bold text-foreground"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                R$ {resultado.toFixed(2)}
              </motion.p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
