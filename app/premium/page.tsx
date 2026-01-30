'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SignedIn, SignedOut } from '@/lib/auth/context'
import { Check, X, Zap, Shield, Clock, TrendingUp } from 'lucide-react'
import { CheckoutButton } from '@/components/billing/checkout-button'
import { PLANS } from '@/lib/billing/plans'

export default function PremiumPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          ⭐ Calcula MEI Premium
        </div>
        <h1 className="text-5xl font-bold mb-6">
          Nunca mais atrase o DAS.<br />
          Tenha controle total.
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Por apenas R$ 19/mês, você tem alertas automáticos, relatórios
          ilimitados e muito mais. Cancele quando quiser.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SignedOut>
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8">
                Assinar Premium →
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Button size="lg" className="text-lg px-8" disabled>
              Assinar Premium (em breve)
            </Button>
          </SignedIn>
          <Link href="#plano-gratis">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Ver Plano Grátis
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          💳 Cancele quando quiser • Sem multa • Sem burocracia
        </p>
      </div>

      {/* Comparison Table */}
      <div className="max-w-5xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Compare os Planos
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FREE */}
          <Card id="plano-gratis" className="p-8 border-2 scroll-mt-24">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Grátis</h3>
              <p className="text-4xl font-bold">R$ 0<span className="text-lg text-gray-600">/mês</span></p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Todas as 6 calculadoras</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Até 50 cálculos salvos</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Histórico de 6 meses</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>1 alerta DAS por email</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>1 exportação PDF/mês</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Alertas WhatsApp</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Exportar Excel</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Relatórios automáticos</span>
              </li>
            </ul>

            <SignedOut>
              <Link href="/sign-up">
                <Button variant="outline" className="w-full">
                  Começar Grátis
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  Ir para o Dashboard
                </Button>
              </Link>
            </SignedIn>
          </Card>

          {/* PREMIUM */}
          <Card className="p-8 border-4 border-mei-500 relative bg-gradient-to-br from-mei-50 to-white">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-mei-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              Mais Popular
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-4xl font-bold text-mei-600">
                R$ 19<span className="text-lg text-gray-600">/mês</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                ou R$ 190/ano (economize R$ 38)
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-mei-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Tudo do Grátis +</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-mei-600 flex-shrink-0 mt-0.5" />
                <span>Cálculos ilimitados</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-mei-600 flex-shrink-0 mt-0.5" />
                <span>Histórico de 5 anos</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-mei-600 flex-shrink-0 mt-0.5" />
                <span><strong>3 alertas DAS</strong> (5, 3, 1 dia antes)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-mei-600 flex-shrink-0 mt-0.5" />
                <span><strong>Alertas WhatsApp</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-mei-600 flex-shrink-0 mt-0.5" />
                <span>PDF e Excel ilimitados</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-mei-600 flex-shrink-0 mt-0.5" />
                <span>Sem anúncios</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-mei-600 flex-shrink-0 mt-0.5" />
                <span>Relatórios mensais automáticos</span>
              </li>
            </ul>

            <SignedOut>
              <Link href="/sign-up">
                <Button className="w-full" size="lg">
                  Assinar Premium →
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              {PLANS.PREMIUM.stripePriceId ? (
                <CheckoutButton
                  stripePriceId={PLANS.PREMIUM.stripePriceId}
                  className="w-full"
                />
              ) : (
                <Button className="w-full" size="lg" disabled>
                  Configurar Stripe
                </Button>
              )}
            </SignedIn>
          </Card>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Por que Premium?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-mei-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-mei-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Economize Tempo</h3>
            <p className="text-gray-600 text-sm">
              Alertas automáticos em 3 momentos. Você nunca esquece.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-mei-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-mei-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Evite Multas</h3>
            <p className="text-gray-600 text-sm">
              DAS atrasado = multa de 0,33%/dia + juros. Premium se paga sozinho.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-mei-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-mei-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Cresça Mais</h3>
            <p className="text-gray-600 text-sm">
              Relatórios mensais mostram como seu MEI está evoluindo.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-mei-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-mei-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Sem Limites</h3>
            <p className="text-gray-600 text-sm">
              Salve quantos cálculos quiser. Histórico de 5 anos sempre acessível.
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="max-w-4xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          O que os usuários dizem
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-yellow-500">⭐⭐⭐⭐⭐</div>
            </div>
            <p className="text-gray-700 mb-4">
              &quot;Os alertas de WhatsApp salvaram minha vida. Nunca mais atrasei o DAS!&quot;
            </p>
            <p className="text-sm text-gray-600">
              - Maria S., Designer MEI
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-yellow-500">⭐⭐⭐⭐⭐</div>
            </div>
            <p className="text-gray-700 mb-4">
              &quot;R$ 19/mês é menos que um almoço. Vale muito a pena pela tranquilidade.&quot;
            </p>
            <p className="text-sm text-gray-600">
              - João P., Desenvolvedor MEI
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-yellow-500">⭐⭐⭐⭐⭐</div>
            </div>
            <p className="text-gray-700 mb-4">
              &quot;Relatórios mensais me ajudam a ver como meu negócio está crescendo.&quot;
            </p>
            <p className="text-sm text-gray-600">
              - Ana L., Confeiteira MEI
            </p>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Perguntas Frequentes
        </h2>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-2">Posso cancelar a qualquer momento?</h3>
            <p className="text-gray-600">
              Sim! Sem multa, sem burocracia. Cancele direto no painel com 1 clique.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-2">Como funciona o pagamento?</h3>
            <p className="text-gray-600">
              Aceitamos cartão de crédito (renovação automática mensal) e PIX (com 5% de desconto no plano anual).
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-2">Tem reembolso?</h3>
            <p className="text-gray-600">
              Sim! Se não gostar, devolvemos 100% do valor nos primeiros 7 dias do primeiro pagamento.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-2">Como funcionam os alertas de WhatsApp?</h3>
            <p className="text-gray-600">
              Você cadastra seu número e recebe mensagens automáticas 5, 3 e 1 dia antes do vencimento do DAS.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-2">Posso mudar de plano depois?</h3>
            <p className="text-gray-600">
              Sim! Você pode fazer upgrade ou downgrade a qualquer momento.
            </p>
          </Card>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto text-center">
        <Card className="p-12 bg-gradient-to-br from-mei-500 to-mei-600 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para nunca mais atrasar?
          </h2>
          <p className="text-xl mb-8 text-mei-50">
            Junte-se a centenas de MEI que já usam o Calcula MEI Premium
          </p>
          <SignedOut>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="text-lg px-10">
                Assinar Premium por R$ 19/mês →
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            {PLANS.PREMIUM.stripePriceId ? (
              <CheckoutButton
                stripePriceId={PLANS.PREMIUM.stripePriceId}
                className="text-lg px-10"
              />
            ) : (
              <Button size="lg" variant="secondary" className="text-lg px-10" disabled>
                Configurar Stripe
              </Button>
            )}
          </SignedIn>
          <p className="text-sm mt-4 text-mei-100">
            7 dias de garantia • Cancele quando quiser
          </p>
        </Card>
      </div>
    </div>
  )
}
