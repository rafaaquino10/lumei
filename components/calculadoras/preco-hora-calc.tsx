'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function PrecoHoraCalc() {
  const [salarioDesejado, setSalarioDesejado] = useState('')
  const [horasMes, setHorasMes] = useState('160')
  const [resultado, setResultado] = useState<number | null>(null)

  const calcular = () => {
    const salario = parseFloat(salarioDesejado)
    const horas = parseFloat(horasMes)
    if (salario && horas && horas > 0) {
      const valorHora = salario / horas
      setResultado(valorHora)
    }
  }

  return (
    <Card className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-3">
        Calculadora de Preço por Hora
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="salario">Salário Mensal Desejado (R$)</Label>
          <Input
            id="salario"
            type="number"
            placeholder="0.00"
            value={salarioDesejado}
            onChange={(e) => setSalarioDesejado(e.target.value)}
            className="h-10"
          />
        </div>

        <div>
          <Label htmlFor="horas">Horas Trabalhadas por Mês</Label>
          <Input
            id="horas"
            type="number"
            placeholder="160"
            value={horasMes}
            onChange={(e) => setHorasMes(e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      <Button onClick={calcular} className="w-full h-10 mb-4">
        Calcular Valor/Hora
      </Button>

      {resultado !== null && (
        <Card className="p-4 bg-primary/10 border-primary">
          <p className="text-sm text-muted-foreground mb-2">Valor por Hora</p>
          <p className="text-2xl font-bold text-foreground">
            R$ {resultado.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Esse é o valor mínimo que você deve cobrar por hora de trabalho
          </p>
        </Card>
      )}
    </Card>
  )
}
