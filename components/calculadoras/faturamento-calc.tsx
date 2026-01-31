'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export function FaturamentoCalc() {
  const [valores, setValores] = useState<string[]>(Array(12).fill(''))
  const [resultado, setResultado] = useState<{
    total: number
    media: number
    limite: number
    percentual: number
    status: 'seguro' | 'atencao' | 'perigo'
  } | null>(null)

  const LIMITE_MEI = 81000

  const handleChange = (index: number, value: string) => {
    const novosValores = [...valores]
    novosValores[index] = value
    setValores(novosValores)
  }

  const calcular = () => {
    const total = valores.reduce((acc, val) => {
      const num = parseFloat(val) || 0
      return acc + num
    }, 0)

    const media = total / 12
    const percentual = (total / LIMITE_MEI) * 100

    let status: 'seguro' | 'atencao' | 'perigo' = 'seguro'
    if (percentual > 100) status = 'perigo'
    else if (percentual > 80) status = 'atencao'

    setResultado({ total, media, limite: LIMITE_MEI, percentual, status })
  }

  const limpar = () => {
    setValores(Array(12).fill(''))
    setResultado(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Simulador de Faturamento MEI
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Preencha o faturamento de cada mês para simular seu total anual
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {meses.map((mes, index) => (
            <div key={mes}>
              <Label htmlFor={`mes-${index}`} className="text-xs">
                {mes}
              </Label>
              <Input
                id={`mes-${index}`}
                type="number"
                placeholder="0.00"
                value={valores[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          <Button onClick={calcular} className="flex-1 h-10">
            Calcular Total Anual
          </Button>
          <Button onClick={limpar} variant="outline" className="h-10">
            Limpar
          </Button>
        </div>

        {resultado && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4 bg-primary/10 border-primary">
              <p className="text-xs text-muted-foreground mb-1">Total Anual</p>
              <p className="text-2xl font-bold text-foreground">
                R$ {resultado.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </Card>

            <Card className="p-4 bg-card">
              <p className="text-xs text-muted-foreground mb-1">Média Mensal</p>
              <p className="text-2xl font-bold text-foreground">
                R$ {resultado.media.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </Card>

            <Card className={`p-4 md:col-span-2 ${
              resultado.status === 'perigo' ? 'bg-destructive/10 border-destructive' :
              resultado.status === 'atencao' ? 'bg-yellow-500/10 border-yellow-500' :
              'bg-primary/10 border-primary'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status do Limite MEI</p>
                  <p className="text-xl font-bold text-foreground">
                    {resultado.percentual.toFixed(1)}% do limite anual
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {resultado.status === 'perigo' && '⚠️ Você ultrapassou o limite do MEI de R$ 81.000!'}
                    {resultado.status === 'atencao' && '⚠️ Atenção! Você está próximo do limite.'}
                    {resultado.status === 'seguro' && '✓ Você está dentro do limite anual de R$ 81.000'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Falta</p>
                  <p className="text-lg font-semibold text-foreground">
                    R$ {(resultado.limite - resultado.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Card>
    </div>
  )
}
