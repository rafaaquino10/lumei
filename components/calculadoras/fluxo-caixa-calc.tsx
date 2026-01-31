'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function FluxoCaixaCalc() {
  const [entradas, setEntradas] = useState('')
  const [saidas, setSaidas] = useState('')
  const [resultado, setResultado] = useState<{
    saldo: number
    status: 'positivo' | 'negativo' | 'zerado'
  } | null>(null)

  const calcular = () => {
    const ent = parseFloat(entradas) || 0
    const sai = parseFloat(saidas) || 0
    const saldo = ent - sai

    let status: 'positivo' | 'negativo' | 'zerado' = 'zerado'
    if (saldo > 0) status = 'positivo'
    else if (saldo < 0) status = 'negativo'

    setResultado({ saldo, status })
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Calculadora de Fluxo de Caixa
      </h2>

      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="entradas">Entradas do Mês (R$)</Label>
          <Input
            id="entradas"
            type="number"
            placeholder="0.00"
            value={entradas}
            onChange={(e) => setEntradas(e.target.value)}
            className="h-10"
          />
        </div>

        <div>
          <Label htmlFor="saidas">Saídas do Mês (R$)</Label>
          <Input
            id="saidas"
            type="number"
            placeholder="0.00"
            value={saidas}
            onChange={(e) => setSaidas(e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      <Button onClick={calcular} className="w-full h-10 mb-6">
        Calcular Saldo
      </Button>

      {resultado && (
        <Card className={`p-4 ${
          resultado.status === 'positivo' ? 'bg-primary/10 border-primary' :
          resultado.status === 'negativo' ? 'bg-destructive/10 border-destructive' :
          'bg-secondary border-border'
        }`}>
          <p className="text-sm text-muted-foreground mb-2">Saldo do Fluxo de Caixa</p>
          <p className="text-3xl font-bold text-foreground">
            R$ {Math.abs(resultado.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {resultado.status === 'positivo' && '✓ Fluxo de caixa positivo'}
            {resultado.status === 'negativo' && '✗ Fluxo de caixa negativo'}
            {resultado.status === 'zerado' && '= Fluxo de caixa zerado'}
          </p>
        </Card>
      )}
    </Card>
  )
}
