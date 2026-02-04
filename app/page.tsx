'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, TrendingUp, Clock, Tag, BarChart3, ArrowLeftRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { HeroDashboard } from '@/components/hero-dashboard'

const trustBadges = [
  { text: 'Grátis para começar', icon: Check },
  { text: 'Alerta de DAS', icon: Check },
  { text: 'Controle do limite', icon: Check },
]

const calculadoras = [
  {
    icon: TrendingUp,
    titulo: 'Margem de Lucro',
    descricao: 'Descubra quanto você lucra de verdade',
    href: '/calculadoras',
    ativo: true,
  },
  {
    icon: Clock,
    titulo: 'Preço por Hora',
    descricao: 'Calcule o valor mínimo que deve cobrar',
    href: '/calculadoras',
    ativo: true,
  },
  {
    icon: Tag,
    titulo: 'Precificação',
    descricao: 'Defina o preço ideal dos seus produtos/serviços',
    href: '/calculadoras',
    ativo: true,
  },
  {
    icon: BarChart3,
    titulo: 'Simulador Faturamento',
    descricao: 'Saiba se vai estourar o teto do MEI',
    href: '/calculadoras',
    ativo: true,
  },
  {
    icon: ArrowLeftRight,
    titulo: 'Fluxo de Caixa',
    descricao: 'Controle entradas e saídas mensais',
    href: '/calculadoras',
    ativo: true,
  },
  {
    icon: Calendar,
    titulo: 'Calendário DAS',
    descricao: 'Nunca mais atrase o pagamento',
    href: '/calculadoras',
    ativo: true,
  },
]

const steps = [
  {
    number: '1',
    title: 'Escolha a Calculadora',
    description: 'Selecione o que você quer calcular: preço, margem, DAS...',
  },
  {
    number: '2',
    title: 'Preencha os Dados',
    description: 'Interface guiada. Responda perguntas simples. Sem jargão técnico.',
  },
  {
    number: '3',
    title: 'Veja o Resultado',
    description: 'Resposta clara, em segundos. Salve e consulte quando quiser.',
  },
]

const pricingPlans = [
  {
    name: 'Grátis',
    price: 'R$ 0',
    period: '/mês',
    features: [
      'Todas as 6 calculadoras',
      '10 cálculos/mês',
      'Histórico 6 meses',
      '1 alerta DAS (email)',
      '1 PDF/mês',
    ],
    cta: 'Começar Grátis',
    ctaLink: '/cadastrar',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: 'R$ 14,90',
    period: '/mês',
    badge: '⭐ Mais Popular',
    features: [
      'Tudo do Free +',
      'Cálculos ilimitados',
      'Histórico 5 anos',
      '3 alertas DAS',
      'Alertas WhatsApp',
      'PDF/Excel ilimitados',
      'Sem anúncios',
      'Relatórios automáticos',
    ],
    cta: 'Assinar Premium',
    ctaLink: '/premium',
    highlighted: true,
  },
]

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center space-y-6"
            >
              {/* Main Heading */}
              <div className="space-y-3">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Controle seu MEI
                  <br />
                  <span className="text-mei-600">em 1 minuto/mês</span>
                </h1>
                <p className="text-lg text-muted-foreground sm:text-xl">
                  Registre seu faturamento e saiba exatamente como está seu negócio.
                </p>
              </div>

              {/* CTA Button */}
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="group h-12 bg-mei-500 px-6 text-base font-semibold text-white shadow-mei transition-all hover:bg-mei-600 hover:shadow-mei-lg"
                  asChild
                >
                  <Link href="/calculadoras">
                    Calcular Grátis
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4">
                {trustBadges.map((badge) => {
                  const Icon = badge.icon
                  return (
                    <div
                      key={badge.text}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Icon className="h-4 w-4 text-mei-600" />
                      <span>{badge.text}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Right column - Dashboard Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex items-center justify-center lg:justify-end"
            >
              <HeroDashboard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Calculadoras Section */}
      <section className="w-full bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:py-16 lg:px-8">
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Todas as Calculadoras
            </h2>
            <p className="text-lg text-muted-foreground">
              Ferramentas essenciais para gerenciar seu MEI
            </p>
          </motion.div>

          {/* Calculators Grid - Compact */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {calculadoras.map((calc, i) => (
              <motion.div
                key={calc.titulo}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={calc.ativo ? calc.href : '#'}
                  className={cn(
                    "block h-full",
                    !calc.ativo && "pointer-events-none"
                  )}
                >
                  <Card className={cn(
                    "p-4 h-full transition-all duration-200 relative bg-card text-center group",
                    calc.ativo
                      ? "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border-border hover:border-mei-300"
                      : "opacity-60"
                  )}>
                    {!calc.ativo && (
                      <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                        Breve
                      </div>
                    )}
                    <calc.icon className="w-8 h-8 text-mei-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="text-sm font-bold text-foreground mb-1 leading-tight">{calc.titulo}</h3>
                    <p className="text-muted-foreground text-xs leading-snug">{calc.descricao}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="w-full bg-card">
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 lg:py-16 lg:px-8">
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-bold text-foreground">
              Simples em 3 Passos
            </h2>
          </motion.div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex flex-col items-center rounded-lg bg-secondary p-6"
              >
                {/* Number Badge */}
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-mei-500 text-xl font-bold text-white">
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="mb-2 text-center text-lg font-bold text-foreground">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-center text-sm text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex justify-center"
          >
            <Button
              size="lg"
              className="h-11 bg-mei-500 px-6 text-base font-semibold text-white shadow-mei transition-all hover:bg-mei-600 hover:shadow-mei-lg"
              asChild
            >
              <Link href="/calculadoras">
                Começar Agora
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full bg-secondary">
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 lg:py-16 lg:px-8">
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-bold text-foreground">
              Planos Transparentes
            </h2>
          </motion.div>

          {/* Pricing Cards - Compact */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-3xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative rounded-lg bg-card p-5 ${
                  plan.highlighted
                    ? 'border-2 border-mei-500 shadow-md'
                    : 'border border-border'
                }`}
              >
                {/* Badge for Premium */}
                {plan.badge && (
                  <div className="absolute -top-2.5 right-3 rounded-full bg-mei-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    {plan.badge}
                  </div>
                )}

                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  <div>
                    <span className={`text-2xl font-bold ${plan.highlighted ? 'text-mei-600' : 'text-foreground'}`}>
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                </div>

                {/* Features List - Compact */}
                <ul className="mb-4 space-y-1.5">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 flex-shrink-0 text-mei-600" />
                      <span className="text-xs text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  size="sm"
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-mei-500 text-white hover:bg-mei-600'
                      : 'border border-mei-500 bg-transparent text-mei-600 hover:bg-mei-50'
                  }`}
                  asChild
                >
                  <Link href={plan.ctaLink}>{plan.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground">
              💡 Cancele quando quiser. Sem compromisso.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
