'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Receipt } from 'lucide-react'
import { ContextualSuggestions } from './contextual-suggestions'
import { ExportActions } from './export-actions'
import { DASPDF } from '@/components/pdf'
import { usePDFUserData } from '@/hooks/use-pdf-user-data'

type TipoMEI = 'comercio' | 'servicos' | 'comercio-servicos' | 'caminhoneiro'

export function DasCalc() {
  const [tipoMei, setTipoMei] = useState<TipoMEI>('comercio')
  const pdfUserData = usePDFUserData()

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
    { mes: 'Fev', dia: '20' },
    { mes: 'Mar', dia: '20' },
    { mes: 'Abr', dia: '20' },
    { mes: 'Mai', dia: '20' },
  ]

  const pdfInputs = {
    tipoMei: tipoMei,
    ano: 2026,
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card className="p-4">
        {/* Header compacto */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Receipt className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Calendário DAS MEI 2026</h2>
            <p className="text-xs text-muted-foreground">Valor do DAS e próximos vencimentos</p>
          </div>
        </div>

        {/* Layout horizontal: Seletor + Resultado */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Seletor */}
          <div>
            <Label htmlFor="tipo" className="text-xs">Tipo do MEI</Label>
            <Select value={tipoMei} onValueChange={(value) => setTipoMei(value as TipoMEI)}>
              <SelectTrigger className="h-9 mt-1">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comercio">Comércio</SelectItem>
                <SelectItem value="servicos">Serviços</SelectItem>
                <SelectItem value="comercio-servicos">Comércio e Serviços</SelectItem>
                <SelectItem value="caminhoneiro">Caminhoneiro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Total Anual */}
          <div>
            <Label className="text-xs">Total Anual</Label>
            <div className="h-9 mt-1 bg-secondary/50 rounded-md flex items-center justify-center">
              <p className="text-sm font-bold text-foreground">
                R$ {(calcularDAS() * 12).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Resultado Principal */}
        <motion.div
          key={tipoMei}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Valor do DAS Mensal</p>
                <motion.p
                  className="text-3xl font-bold text-primary"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  R$ {calcularDAS().toFixed(2)}
                </motion.p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Vencimento</p>
                <p className="text-lg font-bold text-foreground">Dia 20</p>
                <p className="text-[10px] text-muted-foreground">de cada mês</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Próximos Vencimentos - inline */}
        <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-2 mb-3">
          <span className="text-[10px] text-muted-foreground">Próximos:</span>
          <div className="flex gap-2">
            {proximosVencimentos.map((item) => (
              <span key={item.mes} className="text-xs font-medium text-foreground">
                {item.dia}/{item.mes}
              </span>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-between pt-3 border-t">
          <p className="text-[10px] text-muted-foreground">
            Valores referência 2026
          </p>
          <ExportActions
            pdfDocument={<DASPDF inputs={pdfInputs} userData={pdfUserData} />}
            calculatorName="das-mei"
          />
        </div>
      </Card>

      {/* Sugestões */}
      <div className="mt-3">
        <ContextualSuggestions
          currentCalculator="das"
          show={true}
        />
      </div>
    </div>
  )
}
