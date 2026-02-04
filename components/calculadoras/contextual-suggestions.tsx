'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import {
  TrendingUp,
  Clock,
  Tag,
  BarChart3,
  ArrowLeftRight,
  Calendar,
  ArrowRight,
  ArrowUpCircle,
  Target,
  Scale,
  LucideIcon,
} from 'lucide-react'
import { trackContextualSuggestionClicked } from '@/lib/analytics'

type CalculatorType =
  | 'margem-lucro'
  | 'preco-hora'
  | 'precificacao'
  | 'faturamento'
  | 'fluxo-caixa'
  | 'das'
  | 'transicao-mei-me'
  | 'ponto-equilibrio'
  | 'comparador-tributario'

interface Suggestion {
  id: CalculatorType
  title: string
  description: string
  icon: LucideIcon
  href: string
  contextText: string
}

const ALL_SUGGESTIONS: Record<CalculatorType, Suggestion> = {
  'margem-lucro': {
    id: 'margem-lucro',
    title: 'Margem de Lucro',
    description: 'Calcule quanto você está lucrando',
    icon: TrendingUp,
    href: '/calculadoras?calc=margem-lucro',
    contextText: 'Veja sua margem de lucro',
  },
  'preco-hora': {
    id: 'preco-hora',
    title: 'Preço por Hora',
    description: 'Descubra seu valor/hora ideal',
    icon: Clock,
    href: '/calculadoras?calc=preco-hora',
    contextText: 'Calcule seu valor por hora',
  },
  'precificacao': {
    id: 'precificacao',
    title: 'Precificação',
    description: 'Defina o preço ideal',
    icon: Tag,
    href: '/calculadoras?calc=precificacao',
    contextText: 'Defina o preço certo',
  },
  'faturamento': {
    id: 'faturamento',
    title: 'Simulador Faturamento',
    description: 'Projete seu faturamento anual',
    icon: BarChart3,
    href: '/calculadoras?calc=faturamento',
    contextText: 'Simule seu faturamento',
  },
  'fluxo-caixa': {
    id: 'fluxo-caixa',
    title: 'Fluxo de Caixa',
    description: 'Controle entradas e saídas',
    icon: ArrowLeftRight,
    href: '/calculadoras?calc=fluxo-caixa',
    contextText: 'Organize seu fluxo de caixa',
  },
  'das': {
    id: 'das',
    title: 'Calendário DAS',
    description: 'Veja datas e valores do DAS',
    icon: Calendar,
    href: '/calculadoras?calc=das',
    contextText: 'Confira seu DAS',
  },
  'transicao-mei-me': {
    id: 'transicao-mei-me',
    title: 'Transição MEI → ME',
    description: 'Simule quando migrar para ME',
    icon: ArrowUpCircle,
    href: '/calculadoras?calc=transicao-mei-me',
    contextText: 'Vale migrar para ME?',
  },
  'ponto-equilibrio': {
    id: 'ponto-equilibrio',
    title: 'Ponto de Equilíbrio',
    description: 'Descubra suas vendas mínimas',
    icon: Target,
    href: '/calculadoras?calc=ponto-equilibrio',
    contextText: 'Quantas vendas preciso?',
  },
  'comparador-tributario': {
    id: 'comparador-tributario',
    title: 'Comparador Tributário',
    description: 'Compare regimes tributários',
    icon: Scale,
    href: '/calculadoras?calc=comparador-tributario',
    contextText: 'Compare MEI, Simples e LP',
  },
}

// Mapeamento de sugestões contextuais por calculadora
const CONTEXTUAL_MAP: Record<CalculatorType, CalculatorType[]> = {
  'margem-lucro': ['precificacao', 'ponto-equilibrio'],
  'preco-hora': ['margem-lucro', 'faturamento'],
  'precificacao': ['margem-lucro', 'ponto-equilibrio'],
  'faturamento': ['das', 'transicao-mei-me'],
  'fluxo-caixa': ['faturamento', 'ponto-equilibrio'],
  'das': ['faturamento', 'transicao-mei-me'],
  'transicao-mei-me': ['comparador-tributario', 'faturamento'],
  'ponto-equilibrio': ['margem-lucro', 'precificacao'],
  'comparador-tributario': ['transicao-mei-me', 'faturamento'],
}

// Textos contextuais personalizados
const CONTEXT_TEXTS: Partial<Record<CalculatorType, Partial<Record<CalculatorType, string>>>> = {
  'margem-lucro': {
    'precificacao': 'Quer melhorar essa margem? Reveja seus preços',
    'ponto-equilibrio': 'Descubra quantas vendas precisa fazer',
  },
  'preco-hora': {
    'margem-lucro': 'Agora veja quanto você lucra em cada projeto',
    'faturamento': 'Projete quanto pode faturar no ano',
  },
  'precificacao': {
    'margem-lucro': 'Confira a margem real desse preço',
    'ponto-equilibrio': 'Quantas vendas para cobrir os custos?',
  },
  'faturamento': {
    'das': 'Não esqueça do DAS - veja datas e valores',
    'transicao-mei-me': 'Crescendo? Veja quando migrar para ME',
  },
  'fluxo-caixa': {
    'faturamento': 'Projete seu faturamento anual',
    'ponto-equilibrio': 'Descubra seu ponto de equilíbrio',
  },
  'das': {
    'faturamento': 'Acompanhe se está perto do limite MEI',
    'transicao-mei-me': 'Simule quando vale migrar para ME',
  },
  'transicao-mei-me': {
    'comparador-tributario': 'Compare todos os regimes tributários',
    'faturamento': 'Registre seu faturamento mensal',
  },
  'ponto-equilibrio': {
    'margem-lucro': 'Veja qual é sua margem atual',
    'precificacao': 'Ajuste seus preços para lucrar mais',
  },
  'comparador-tributario': {
    'transicao-mei-me': 'Simule a transição MEI para ME',
    'faturamento': 'Registre seu faturamento atual',
  },
}

interface ContextualSuggestionsProps {
  currentCalculator: CalculatorType
  show: boolean
}

/**
 * Mostra sugestões contextuais de outras calculadoras
 * após o usuário completar um cálculo
 */
export function ContextualSuggestions({ currentCalculator, show }: ContextualSuggestionsProps) {
  if (!show) return null

  const suggestionIds = CONTEXTUAL_MAP[currentCalculator] || []
  const suggestions = suggestionIds.map(id => ({
    ...ALL_SUGGESTIONS[id],
    contextText: CONTEXT_TEXTS[currentCalculator]?.[id] || ALL_SUGGESTIONS[id].contextText,
  }))

  if (suggestions.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="mt-4"
    >
      <p className="text-xs text-muted-foreground mb-2">Próximo passo:</p>
      <div className={`grid gap-2 ${suggestions.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <Link
              href={suggestion.href}
              onClick={() => trackContextualSuggestionClicked(currentCalculator, suggestion.id)}
            >
              <Card className="p-3 hover:border-primary hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <suggestion.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {suggestion.contextText}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {suggestion.title}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
