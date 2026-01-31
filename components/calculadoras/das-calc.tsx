'use client'

import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'

export function DasCalc() {
  const [tipoMei, setTipoMei] = useState('comercio')

  const calcularDAS = () => {
    const valores: Record<string, number> = {
      'comercio': 71.60,
      'servicos': 75.60,
      'comercio-servicos': 76.60,
      'caminhoneiro': 169.44
    }
    return valores[tipoMei] || 71.60
  }

  const proximosVencimentos = [
    { mes: 'Fevereiro 2026', vencimento: '20/02/2026' },
    { mes: 'Março 2026', vencimento: '20/03/2026' },
    { mes: 'Abril 2026', vencimento: '20/04/2026' },
  ]

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Calendário DAS MEI 2026
      </h2>

      <div className="space-y-6 mb-6">
        <div>
          <Label htmlFor="tipo">Tipo do MEI</Label>
          <Select value={tipoMei} onValueChange={setTipoMei}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comercio">Comércio</SelectItem>
              <SelectItem value="servicos">Serviços</SelectItem>
              <SelectItem value="comercio-servicos">Comércio e Serviços</SelectItem>
              <SelectItem value="caminhoneiro">Caminhoneiro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="p-4 bg-primary/10 border-primary">
          <p className="text-sm text-muted-foreground mb-2">Valor do DAS Mensal</p>
          <p className="text-3xl font-bold text-foreground">
            R$ {calcularDAS().toFixed(2)}
          </p>
        </Card>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Próximos Vencimentos
          </h3>
          <div className="space-y-2">
            {proximosVencimentos.map((item) => (
              <Card key={item.mes} className="p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{item.mes}</span>
                  <span className="text-sm text-muted-foreground">{item.vencimento}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-4 bg-secondary">
          <p className="text-xs text-muted-foreground">
            ℹ️ O DAS vence todo dia 20 de cada mês. Valores referência 2026.
          </p>
        </Card>
      </div>
    </Card>
  )
}
