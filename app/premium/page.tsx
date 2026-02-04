'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SignedIn, SignedOut } from '@/lib/auth/context'
import { Check, X, Zap, Shield, Clock, TrendingUp, FileCheck } from 'lucide-react'
import { CheckoutButton } from '@/components/billing/checkout-button'
import { PLANS } from '@/lib/billing/plans'
import { PremiumFAQSchema } from '@/components/faq-page-schema'
import { PremiumProductSchema } from '../structured-data'
import { BreadcrumbSchema } from '@/components/calculator-schema'

export default function PremiumPage() {
  return (
    <>
      <PremiumFAQSchema />
      <PremiumProductSchema />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://calculamei.com.br' },
          { name: 'Premium', url: 'https://calculamei.com.br/premium' },
        ]}
      />
      <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
          ⭐ Calcula MEI Premium
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
          Nunca mais atrase o DAS.<br />
          Tenha controle total.
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          Por apenas R$ 14,90/mês, você tem alertas automáticos, relatórios
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
            {PLANS.PREMIUM.stripePriceId ? (
              <CheckoutButton
                stripePriceId={PLANS.PREMIUM.stripePriceId}
                className="text-lg px-8"
              />
            ) : (
              <Button size="lg" className="text-lg px-8" disabled>
                Configurar Stripe
              </Button>
            )}
          </SignedIn>
          <Link href="#plano-gratis">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Ver Plano Grátis
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          💳 Cancele quando quiser • Sem multa • Sem burocracia
        </p>
      </div>

      {/* Comparison Table */}
      <div className="max-w-5xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
          Compare os Planos
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* FREE */}
          <Card id="plano-gratis" className="p-4 border-2 scroll-mt-24">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2 text-foreground">Grátis</h3>
              <p className="text-3xl font-bold text-foreground">R$ 0<span className="text-base text-muted-foreground">/mês</span></p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">Todas as 6 calculadoras</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">10 cálculos por mês</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">Histórico de 6 meses</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">1 alerta DAS por email</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">1 exportação PDF/mês</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">Alertas WhatsApp</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">Exportar Excel</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">Relatórios automáticos</span>
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
          <Card className="p-4 border-4 border-primary relative bg-primary/5">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
              Mais Popular
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2 text-foreground">Premium</h3>
              <p className="text-3xl font-bold text-primary">
                R$ 14,90<span className="text-base text-muted-foreground">/mês</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                ou R$ 149/ano (economize R$ 29,80)
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-semibold text-foreground text-sm">Tudo do Grátis +</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">Cálculos ilimitados</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">Histórico de 5 anos</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm"><strong>3 alertas DAS</strong> (5, 3, 1 dia antes)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm"><strong>Alertas WhatsApp</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">PDF e Excel ilimitados</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm"><strong>PDFs verificados</strong> com seus dados</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">Sem anúncios</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">Relatórios mensais automáticos</span>
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
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
          Por que Premium?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold text-base mb-2 text-foreground">Economize Tempo</h3>
            <p className="text-muted-foreground text-sm">
              Alertas automáticos em 3 momentos. Você nunca esquece.
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold text-base mb-2 text-foreground">Evite Multas</h3>
            <p className="text-muted-foreground text-sm">
              DAS atrasado = multa de 0,33%/dia + juros. Premium se paga sozinho.
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold text-base mb-2 text-foreground">Cresça Mais</h3>
            <p className="text-muted-foreground text-sm">
              Relatórios mensais mostram como seu MEI está evoluindo.
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileCheck className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold text-base mb-2 text-foreground">Documentos Verificados</h3>
            <p className="text-muted-foreground text-sm">
              PDFs com seus dados e selo de verificação. Use para comprovar renda em bancos.
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold text-base mb-2 text-foreground">Sem Limites</h3>
            <p className="text-muted-foreground text-sm">
              Salve quantos cálculos quiser. Histórico de 5 anos sempre acessível.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
          Perguntas Frequentes
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-bold mb-2 text-foreground text-sm">Posso cancelar a qualquer momento?</h3>
            <p className="text-muted-foreground text-sm">
              Sim! Sem multa, sem burocracia. Cancele direto no painel com 1 clique.
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold mb-2 text-foreground text-sm">Como funciona o pagamento?</h3>
            <p className="text-muted-foreground text-sm">
              Aceitamos cartão de crédito (renovação automática mensal) e PIX (com 5% de desconto no plano anual).
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold mb-2 text-foreground text-sm">Tem reembolso?</h3>
            <p className="text-muted-foreground text-sm">
              Sim! Se não gostar, devolvemos 100% do valor nos primeiros 7 dias do primeiro pagamento.
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold mb-2 text-foreground text-sm">Como funcionam os alertas de WhatsApp?</h3>
            <p className="text-muted-foreground text-sm">
              Você cadastra seu número e recebe mensagens automáticas 5, 3 e 1 dia antes do vencimento do DAS.
            </p>
          </Card>

          <Card className="p-4 md:col-span-2">
            <h3 className="font-bold mb-2 text-foreground text-sm">Posso mudar de plano depois?</h3>
            <p className="text-muted-foreground text-sm">
              Sim! Você pode fazer upgrade ou downgrade a qualquer momento.
            </p>
          </Card>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto text-center">
        <Card className="p-6 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
          <h2 className="text-2xl font-bold mb-3">
            Pronto para nunca mais atrasar?
          </h2>
          <p className="text-base mb-6 opacity-90">
            Junte-se a centenas de MEI que já usam o Calcula MEI Premium
          </p>
          <SignedOut>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="text-lg px-10">
                Assinar Premium por R$ 14,90/mês →
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
          <p className="text-sm mt-4 opacity-80">
            7 dias de garantia • Cancele quando quiser
          </p>
        </Card>
      </div>
    </div>
    </>
  )
}
