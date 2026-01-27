import Link from 'next/link'
import { Metadata } from 'next'
import { TrendingUp, Clock, Tag, BarChart3, ArrowLeftRight, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const calculadoras = [
  {
    icon: TrendingUp,
    titulo: 'Margem de Lucro',
    descricao: 'Descubra quanto voce lucra de verdade',
    href: '/calcular/margem-lucro',
    ativo: true,
  },
  {
    icon: Clock,
    titulo: 'Preco por Hora',
    descricao: 'Calcule o valor minimo que deve cobrar',
    href: '/calcular/preco-hora',
    ativo: true,
  },
  {
    icon: Tag,
    titulo: 'Precificacao',
    descricao: 'Defina o preco ideal dos seus produtos/servicos',
    href: '/calcular/precificacao',
    ativo: true,
  },
  {
    icon: BarChart3,
    titulo: 'Simulador Faturamento',
    descricao: 'Saiba se vai estourar o teto do MEI',
    href: '/calcular/faturamento',
    ativo: true,
  },
  {
    icon: ArrowLeftRight,
    titulo: 'Fluxo de Caixa',
    descricao: 'Controle entradas e saidas mensais',
    href: '/calcular/fluxo-caixa',
    ativo: true,
  },
  {
    icon: Calendar,
    titulo: 'Calendario DAS',
    descricao: 'Nunca mais atrase o pagamento',
    href: '/calcular/das',
    ativo: true,
  },
]

export const metadata: Metadata = {
  title: 'Calculadoras | Lumei',
  description:
    'Todas as calculadoras financeiras do Lumei para MEI: margem, preco por hora, precificacao, DAS e mais.',
}

export default function CalculadorasPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Todas as Calculadoras
        </h1>
        <p className="text-xl text-gray-600">
          Ferramentas essenciais para gerenciar seu MEI
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {calculadoras.map((calc) => (
          <Link
            key={calc.titulo}
            href={calc.ativo ? calc.href : '#'}
            className={cn('block h-full', !calc.ativo && 'pointer-events-none')}
          >
            <Card
              className={cn(
                'p-8 h-full transition-all duration-300 relative',
                calc.ativo
                  ? 'hover:shadow-lumei-lg hover:-translate-y-1 cursor-pointer border-gray-200'
                  : 'opacity-60'
              )}
            >
              {!calc.ativo && (
                <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-medium">
                  Em breve
                </div>
              )}
              <calc.icon className="w-12 h-12 text-lumei-500 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">{calc.titulo}</h3>
              <p className="text-gray-600 text-sm mb-6">{calc.descricao}</p>
              <Button
                variant={calc.ativo ? 'default' : 'ghost'}
                className={cn(
                  'w-full',
                  calc.ativo && 'bg-lumei-500 hover:bg-lumei-600 text-white'
                )}
                disabled={!calc.ativo}
              >
                {calc.ativo ? 'Calcular →' : 'Em breve'}
              </Button>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
