'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
    { mes: 'Fev/26', vencimento: '20/02' },
    { mes: 'Mar/26', vencimento: '20/03' },
    { mes: 'Abr/26', vencimento: '20/04' },
    { mes: 'Mai/26', vencimento: '20/05' },
    { mes: 'Jun/26', vencimento: '20/06' },
    { mes: 'Jul/26', vencimento: '20/07' },
  ]

  const pdfInputs = {
    tipoMei: tipoMei,
    ano: 2026,
  }

  // A calculadora de DAS nao conta como calculo de limite
  // pois e apenas uma consulta de tabela
  const canExport = pdfUserData !== undefined

  return (
    <Card className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-3">
        Calendario DAS MEI 2026
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Consulte o valor do DAS e proximos vencimentos
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-4">
        {/* Coluna esquerda - Tipo e Valor */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="tipo">Tipo do MEI</Label>
            <Select value={tipoMei} onValueChange={(value) => setTipoMei(value as TipoMEI)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comercio">Comercio</SelectItem>
                <SelectItem value="servicos">Servicos</SelectItem>
                <SelectItem value="comercio-servicos">Comercio e Servicos</SelectItem>
                <SelectItem value="caminhoneiro">Caminhoneiro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <motion.div
            key={tipoMei}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-4 bg-primary/10 border-primary">
              <p className="text-xs text-muted-foreground mb-1">Valor do DAS Mensal</p>
              <motion.p
                className="text-2xl font-bold text-foreground"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                R$ {calcularDAS().toFixed(2)}
              </motion.p>
              <p className="text-xs text-muted-foreground mt-2">
                Vencimento: dia 20 de cada mes
              </p>
            </Card>
          </motion.div>

          <Card className="p-3 bg-card">
            <p className="text-xs text-muted-foreground">Total Anual</p>
            <p className="text-lg font-bold text-foreground">
              R$ {(calcularDAS() * 12).toFixed(2)}
            </p>
          </Card>
        </div>

        {/* Coluna direita - Proximos Vencimentos */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Proximos Vencimentos
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {proximosVencimentos.map((item, index) => (
              <motion.div
                key={item.mes}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-2">
                  <div className="text-center">
                    <p className="text-xs font-medium text-foreground">{item.mes}</p>
                    <p className="text-xs text-muted-foreground">{item.vencimento}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Card className="p-3 bg-secondary mb-4">
        <p className="text-xs text-muted-foreground">
          O DAS vence todo dia 20 de cada mes. Valores referencia 2026.
        </p>
      </Card>

      {canExport && (
        <div className="flex justify-end">
          <ExportActions
            pdfDocument={<DASPDF inputs={pdfInputs} userData={pdfUserData} />}
            calculatorName="das-mei"
          />
        </div>
      )}

      {/* Sugestoes contextuais */}
      <div className="mt-4">
        <ContextualSuggestions
          currentCalculator="das"
          show={true}
        />
      </div>
    </Card>
  )
}
