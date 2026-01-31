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
    { mes: 'Fev/26', vencimento: '20/02' },
    { mes: 'Mar/26', vencimento: '20/03' },
    { mes: 'Abr/26', vencimento: '20/04' },
    { mes: 'Mai/26', vencimento: '20/05' },
    { mes: 'Jun/26', vencimento: '20/06' },
    { mes: 'Jul/26', vencimento: '20/07' },
  ]

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Calendário DAS MEI 2026
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Coluna esquerda - Tipo e Valor */}
        <div className="space-y-4">
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
            <p className="text-xs text-muted-foreground mb-1">Valor do DAS Mensal</p>
            <p className="text-3xl font-bold text-foreground">
              R$ {calcularDAS().toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Vencimento: dia 20 de cada mês
            </p>
          </Card>
        </div>

        {/* Coluna direita - Próximos Vencimentos */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Próximos Vencimentos
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {proximosVencimentos.map((item) => (
              <Card key={item.mes} className="p-2">
                <div className="text-center">
                  <p className="text-xs font-medium text-foreground">{item.mes}</p>
                  <p className="text-xs text-muted-foreground">{item.vencimento}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Card className="p-3 bg-secondary">
        <p className="text-xs text-muted-foreground">
          ℹ️ O DAS vence todo dia 20 de cada mês. Valores referência 2026.
        </p>
      </Card>
    </Card>
  )
}
