'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function FaturamentoCalc() {
  const [faturamentoMensal, setFaturamentoMensal] = useState('')
  const [resultado, setResultado] = useState<{
    anual: number
    limite: number
    percentual: number
    status: 'seguro' | 'atencao' | 'perigo'
  } | null>(null)

  const LIMITE_MEI = 81000

  const calcular = () => {
    const mensal = parseFloat(faturamentoMensal)
    if (mensal) {
      const anual = mensal * 12
      const percentual = (anual / LIMITE_MEI) * 100

      let status: 'seguro' | 'atencao' | 'perigo' = 'seguro'
      if (percentual > 100) status = 'perigo'
      else if (percentual > 80) status = 'atencao'

      setResultado({ anual, limite: LIMITE_MEI, percentual, status })
    }
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Simulador de Faturamento MEI
      </h2>

      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="faturamento">Faturamento Mensal Médio (R$)</Label>
          <Input
            id="faturamento"
            type="number"
            placeholder="0.00"
            value={faturamentoMensal}
            onChange={(e) => setFaturamentoMensal(e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      <Button onClick={calcular} className="w-full h-10 mb-6">
        Simular Faturamento Anual
      </Button>

      {resultado && (
        <div className="space-y-4">
          <Card className="p-4 bg-primary/10 border-primary">
            <p className="text-sm text-muted-foreground mb-2">Faturamento Anual Estimado</p>
            <p className="text-3xl font-bold text-foreground">
              R$ {resultado.anual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </Card>

          <Card className={`p-4 ${
            resultado.status === 'perigo' ? 'bg-destructive/10 border-destructive' :
            resultado.status === 'atencao' ? 'bg-yellow-500/10 border-yellow-500' :
            'bg-primary/10 border-primary'
          }`}>
            <p className="text-sm text-muted-foreground mb-2">Status do Limite MEI</p>
            <p className="text-2xl font-bold text-foreground mb-2">
              {resultado.percentual.toFixed(1)}% do limite
            </p>
            <p className="text-xs text-muted-foreground">
              {resultado.status === 'perigo' && '⚠️ Você ultrapassou o limite do MEI!'}
              {resultado.status === 'atencao' && '⚠️ Atenção! Próximo do limite.'}
              {resultado.status === 'seguro' && '✓ Dentro do limite anual de R$ 81.000'}
            </p>
          </Card>
        </div>
      )}
    </Card>
  )
}
