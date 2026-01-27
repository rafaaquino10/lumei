'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Clock, 
  Tag, 
  BarChart3, 
  ArrowLeftRight, 
  Calendar,
  LucideIcon
} from 'lucide-react'

interface Calculadora {
  icon: LucideIcon
  titulo: string
  descricao: string
  href: string
  ativo: boolean
}

const calculadoras: Calculadora[] = [
  {
    icon: TrendingUp,
    titulo: 'Margem de Lucro',
    descricao: 'Descubra quanto você lucra de verdade',
    href: '/calcular/margem-lucro',
    ativo: true,
  },
  {
    icon: Clock,
    titulo: 'Preço por Hora',
    descricao: 'Calcule o valor mínimo que deve cobrar',
    href: '/calcular/preco-hora',
    ativo: true,
  },
  {
    icon: Tag,
    titulo: 'Precificação',
    descricao: 'Defina o preço ideal',
    href: '/calcular/precificacao',
    ativo: true,
  },
  {
    icon: BarChart3,
    titulo: 'Faturamento',
    descricao: 'Monitore o teto MEI',
    href: '/calcular/faturamento',
    ativo: false,
  },
  {
    icon: ArrowLeftRight,
    titulo: 'Fluxo de Caixa',
    descricao: 'Controle financeiro',
    href: '/calcular/fluxo-caixa',
    ativo: false,
  },
  {
    icon: Calendar,
    titulo: 'Calendário DAS',
    descricao: 'Alertas automáticos',
    href: '/calcular/das',
    ativo: false,
  },
]

interface OutrasCalculadorasProps {
  currentPath: string
}

export function OutrasCalculadoras({ currentPath }: OutrasCalculadorasProps) {
  // Filter out current calculator and inactive ones
  const outras = calculadoras
    .filter(calc => calc.ativo && calc.href !== currentPath)
    .slice(0, 3) // Show max 3

  if (outras.length === 0) return null

  return (
    <div className="mt-20 border-t pt-12">
      <h3 className="text-2xl font-bold mb-8 text-center">
        Outras Calculadoras
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {outras.map(calc => (
          <Link key={calc.href} href={calc.href}>
            <Card className="p-6 h-full hover:shadow-lumei-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <calc.icon className="w-10 h-10 text-lumei-500 mb-3" />
              <h4 className="font-bold text-lg mb-2">{calc.titulo}</h4>
              <p className="text-gray-600 text-sm mb-4">{calc.descricao}</p>
              <Button variant="ghost" className="w-full text-lumei-600 hover:text-lumei-700">
                Calcular →
              </Button>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
