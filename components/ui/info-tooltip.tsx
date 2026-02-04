'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface InfoTooltipProps {
  title: string
  description: string
  children?: React.ReactNode
}

export function InfoTooltip({ title, description, children }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-flex items-center">
      {children}
      <button
        type="button"
        className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Ajuda: ${title}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-popover border border-border rounded-lg shadow-lg"
          >
            <div className="text-sm font-semibold text-foreground mb-1">
              {title}
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="w-2 h-2 bg-popover border-r border-b border-border rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Definições de tooltips para métricas do dashboard
export const METRIC_TOOLTIPS = {
  faturamentoAcumulado: {
    title: 'Faturamento Acumulado',
    description: 'Total que você faturou desde janeiro deste ano. Baseado nos registros mensais que você informou.',
  },
  percentualLimite: {
    title: '% do Limite MEI',
    description: 'Quanto do limite anual de R$ 81.000 você já usou. Acima de 80% merece atenção. Acima de 100% você pode ser desenquadrado do MEI.',
  },
  mediaMovel: {
    title: 'Média Mensal',
    description: 'Média do seu faturamento por mês. Calculada dividindo o total acumulado pelo número de meses registrados.',
  },
  projecaoAnual: {
    title: 'Projeção Anual',
    description: 'Se você continuar faturando na média atual, quanto vai faturar até dezembro. Útil para planejar se vai chegar perto do limite.',
  },
  proximoDAS: {
    title: 'Próximo DAS',
    description: 'O DAS (Documento de Arrecadação do Simples) é o imposto mensal do MEI. Vence todo dia 20. Se cair em fim de semana, vence na segunda-feira seguinte.',
  },
  valorDAS: {
    title: 'Valor do DAS',
    description: 'O valor do DAS varia conforme seu tipo de MEI: Comércio (R$ 76,90), Serviços (R$ 80,90), Misto (R$ 81,90) ou Caminhoneiro (R$ 183,16). Valores de 2026.',
  },
  margemLucro: {
    title: 'Margem de Lucro',
    description: 'Percentual do preço de venda que sobra como lucro após descontar os custos. Margem acima de 30% é considerada saudável para a maioria dos negócios.',
  },
  mesesAteEstourar: {
    title: 'Meses até o Limite',
    description: 'Quantos meses você pode continuar faturando na média atual antes de atingir o limite de R$ 81.000. Quanto maior, mais tranquilo você está.',
  },
  evolucaoMensal: {
    title: 'Evolução Mensal',
    description: 'Gráfico mostrando quanto você faturou em cada mês do ano. Barras mais altas = mais faturamento. O mês atual é destacado.',
  },
}
