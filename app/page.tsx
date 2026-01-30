'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Check, TrendingUp, Clock, Tag, BarChart3, ArrowLeftRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const trustBadges = [
  { text: 'Sem cadastro', icon: Check },
  { text: '100% grátis', icon: Check },
  { text: 'Resultados agora', icon: Check },
]

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
      '50 cálculos salvos',
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
    price: 'R$ 19',
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
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                  Lucre mais.
                  <br />
                  <span className="text-lumei-600">Sempre.</span>
                </h1>
                <p className="text-lg text-gray-600 sm:text-xl">
                  Calculadoras financeiras feitas para MEI crescer.
                </p>
              </div>

              {/* CTA Button */}
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="group h-12 bg-lumei-500 px-6 text-base font-semibold text-white shadow-lumei transition-all hover:bg-lumei-600 hover:shadow-lumei-lg"
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
                      className="flex items-center gap-2 text-sm text-gray-500"
                    >
                      <Icon className="h-4 w-4 text-lumei-600" />
                      <span>{badge.text}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Right column */}
            <div className="relative flex items-center justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                <Image
                  src="/hero-screenshot.png"
                  alt="Calculadora Lumei em ação"
                  width={600}
                  height={400}
                  className="w-full"
                  priority
                  style={{ display: 'block' }}
                />
              </div>
              {/* Floating badges (opcional, pra dar vida) */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <p className="text-sm font-bold text-lumei-600">✅ Gratuito</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculadoras Section */}
      <section className="w-full bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:py-16 lg:px-8">
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Todas as Calculadoras
            </h2>
            <p className="text-lg text-gray-600">
              Ferramentas essenciais para gerenciar seu MEI
            </p>
          </motion.div>

          {/* Calculators Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {calculadoras.map((calc, i) => (
              <motion.div
                key={calc.titulo}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={calc.ativo ? calc.href : '#'}
                  className={cn(
                    "block h-full",
                    !calc.ativo && "pointer-events-none"
                  )}
                >
                  <Card className={cn(
                    "p-5 h-full transition-all duration-300 relative bg-white",
                    calc.ativo
                      ? "hover:shadow-lumei-lg hover:-translate-y-1 cursor-pointer border-gray-200"
                      : "opacity-60"
                  )}>
                    {!calc.ativo && (
                      <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-medium">
                        Em breve
                      </div>
                    )}
                    <calc.icon className="w-9 h-9 text-lumei-500 mb-3" />
                    <h3 className="text-lg font-bold mb-1 text-gray-900">{calc.titulo}</h3>
                    <p className="text-gray-600 text-sm mb-4">{calc.descricao}</p>
                    <Button
                      variant={calc.ativo ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "w-full",
                        calc.ativo && "bg-lumei-500 hover:bg-lumei-600 text-white"
                      )}
                      disabled={!calc.ativo}
                    >
                      {calc.ativo ? 'Calcular →' : 'Em breve'}
                    </Button>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 lg:py-16 lg:px-8">
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900">
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
                className="flex flex-col items-center rounded-lg bg-gray-50 p-6"
              >
                {/* Number Badge */}
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-lumei-500 text-xl font-bold text-white">
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="mb-2 text-center text-lg font-bold text-gray-900">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-center text-sm text-gray-600">
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
              className="h-11 bg-lumei-500 px-6 text-base font-semibold text-white shadow-lumei transition-all hover:bg-lumei-600 hover:shadow-lumei-lg"
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
      <section className="w-full bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 lg:py-16 lg:px-8">
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900">
              Planos Transparentes
            </h2>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative rounded-xl bg-white p-6 ${
                  plan.highlighted
                    ? 'border-2 border-lumei-500 shadow-lg'
                    : 'border border-gray-200 shadow-sm'
                }`}
              >
                {/* Badge for Premium */}
                {plan.badge && (
                  <div className="absolute -top-3 right-4 rounded-full bg-lumei-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    {plan.badge}
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <span
                    className={`text-3xl font-bold ${
                      plan.highlighted ? 'text-lumei-600' : 'text-gray-900'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>

                {/* Features List */}
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 flex-shrink-0 text-lumei-600 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-lumei-500 text-white hover:bg-lumei-600'
                      : 'border-2 border-lumei-500 bg-transparent text-lumei-600 hover:bg-lumei-50'
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
            <p className="text-sm text-gray-500">
              💡 Cancele quando quiser. Sem compromisso.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
