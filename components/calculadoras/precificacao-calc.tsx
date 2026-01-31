'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function PrecificacaoCalc() {
  const [custoMaterial, setCustoMaterial] = useState('')
  const [tempoHoras, setTempoHoras] = useState('')
  const [valorHora, setValorHora] = useState('')
  const [margemLucro, setMargemLucro] = useState('30')
  const [resultado, setResultado] = useState<number | null>(null)

  const calcular = () => {
    const material = parseFloat(custoMaterial) || 0
    const tempo = parseFloat(tempoHoras) || 0
    const hora = parseFloat(valorHora) || 0
    const margem = parseFloat(margemLucro) || 0

    const custoTotal = material + (tempo * hora)
    const precoFinal = custoTotal * (1 + margem / 100)
    setResultado(precoFinal)
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Calculadora de Precificação
      </h2>

      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="material">Custo do Material (R$)</Label>
          <Input
            id="material"
            type="number"
            placeholder="0.00"
            value={custoMaterial}
            onChange={(e) => setCustoMaterial(e.target.value)}
            className="h-10"
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
          />
        </div>
      </div>

      <Button onClick={calcular} className="w-full h-10 mb-6">
        Calcular Preço
      </Button>

      {resultado !== null && (
        <Card className="p-4 bg-primary/10 border-primary">
          <p className="text-sm text-muted-foreground mb-2">Preço Sugerido</p>
          <p className="text-3xl font-bold text-foreground">
            R$ {resultado.toFixed(2)}
          </p>
        </Card>
      )}
    </Card>
  )
}
