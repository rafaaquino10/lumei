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
    descricao: 'Defina o preço ideal dos seus produtos/serviços',
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
    descricao: 'Controle entradas e saídas mensais',
    href: '/calcular/fluxo-caixa',
    ativo: true,
  },
  {
    icon: Calendar,
    titulo: 'Calendário DAS',
    descricao: 'Nunca mais atrase o pagamento',
    href: '/calcular/das',
    ativo: true,
  },
]

export const metadata: Metadata = {
  title: 'Calculadoras | Calcula MEI',
  description:
    'Todas as calculadoras financeiras do Calcula MEI para MEI: margem, preço por hora, precificação, DAS e mais.',
}

export default function CalculadorasPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Todas as Calculadoras
        </h1>
        <p className="text-xl text-muted-foreground">
          Ferramentas essenciais para gerenciar seu MEI
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {calculadoras.map((calc) => (
          <Link
            key={calc.titulo}
            href={calc.ativo ? calc.href : '#'}
            className={cn('block h-full', !calc.ativo && 'pointer-events-none')}
          >
            <Card
              className={cn(
                'p-4 h-full transition-all duration-300 relative',
                calc.ativo
                  ? 'hover:shadow-mei-lg hover:-translate-y-1 cursor-pointer'
                  : 'opacity-60'
              )}
            >
              {!calc.ativo && (
                <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-medium">
                  Em breve
                </div>
              )}
              <calc.icon className="w-8 h-8 text-mei-500 mb-3" />
              <h3 className="text-base font-bold mb-2 text-foreground">{calc.titulo}</h3>
              <p className="text-muted-foreground text-xs mb-4">{calc.descricao}</p>
              <Button
                variant={calc.ativo ? 'default' : 'ghost'}
                className={cn(
                  'w-full',
                  calc.ativo && 'bg-mei-500 hover:bg-mei-600 text-white'
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
