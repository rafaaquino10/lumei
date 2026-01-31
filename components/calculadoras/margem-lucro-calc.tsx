'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function MargemLucroCalc() {
  const [custoTotal, setCustoTotal] = useState('')
  const [precoVenda, setPrecoVenda] = useState('')
  const [resultado, setResultado] = useState<number | null>(null)

  const calcular = () => {
    const custo = parseFloat(custoTotal)
    const preco = parseFloat(precoVenda)
    if (custo && preco && preco > 0) {
      const margem = ((preco - custo) / preco) * 100
      setResultado(margem)
    }
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Calculadora de Margem de Lucro
      </h2>

      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="custo">Custo Total (R$)</Label>
          <Input
            id="custo"
            type="number"
            placeholder="0.00"
            value={custoTotal}
            onChange={(e) => setCustoTotal(e.target.value)}
            className="h-10"
          />
        </div>

        <div>
          <Label htmlFor="preco">Preço de Venda (R$)</Label>
          <Input
            id="preco"
            type="number"
            placeholder="0.00"
            value={precoVenda}
            onChange={(e) => setPrecoVenda(e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      <Button onClick={calcular} className="w-full h-10 mb-6">
        Calcular Margem
      </Button>

      {resultado !== null && (
        <Card className="p-4 bg-primary/10 border-primary">
          <p className="text-sm text-muted-foreground mb-2">Margem de Lucro</p>
          <p className="text-3xl font-bold text-foreground">
            {resultado.toFixed(2)}%
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {resultado > 0 ? '✓ Lucro positivo' : '✗ Prejuízo'}
          </p>
        </Card>
      )}
    </Card>
  )
}
