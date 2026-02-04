import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileSettings } from '@/components/settings/profile-settings'
import { AlertsSettings } from '@/components/settings/alerts-settings'
import { SecuritySettings } from '@/components/settings/security-settings'
import { PrivacySettings } from '@/components/settings/privacy-settings'
import { SubscriptionStatus } from '@/components/billing/subscription-status'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, User, Bell, Shield, Database, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default async function ConfiguracoesPage() {
  const user = await getServerUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Painel
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
      </div>

      {/* Tabs para desktop, lista para mobile */}
      <Tabs defaultValue="perfil" className="space-y-6">
        <TabsList className="w-full h-auto flex-wrap gap-1 bg-muted/50 p-1">
          <TabsTrigger value="perfil" className="flex items-center gap-2 flex-1 min-w-[100px]">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="alertas" className="flex items-center gap-2 flex-1 min-w-[100px]">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Alertas</span>
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2 flex-1 min-w-[100px]">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="plano" className="flex items-center gap-2 flex-1 min-w-[100px]">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Plano</span>
          </TabsTrigger>
          <TabsTrigger value="privacidade" className="flex items-center gap-2 flex-1 min-w-[100px]">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Dados</span>
          </TabsTrigger>
        </TabsList>

        {/* Perfil */}
        <TabsContent value="perfil">
          <ProfileSettings
            user={{
              name: user.name,
              email: user.email,
              tipoMEI: user.tipoMEI,
              cnpj: user.cnpj,
              ocupacao: user.ocupacao,
              faturamentoMedio: user.faturamentoMedio,
              temFuncionario: user.temFuncionario,
              provider: user.provider,
            }}
          />
        </TabsContent>

        {/* Alertas */}
        <TabsContent value="alertas">
          <AlertsSettings
            user={{
              alertasEmail: user.alertasEmail,
              alertasWhatsApp: user.alertasWhatsApp,
              whatsapp: user.whatsapp,
              plano: user.plano,
            }}
          />
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="seguranca">
          <SecuritySettings
            user={{
              provider: user.provider,
            }}
          />
        </TabsContent>

        {/* Plano e Assinatura */}
        <TabsContent value="plano">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Plano e Assinatura</h2>
                <p className="text-sm text-muted-foreground">Gerencie seu plano atual</p>
              </div>
            </div>

            <div className="space-y-4">
              <SubscriptionStatus userId={user.id} />

              {user.plano === 'FREE' && (
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                  <h3 className="font-semibold text-foreground mb-1">
                    Aproveite o Premium!
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Alertas WhatsApp, cálculos ilimitados, histórico de 5 anos e muito mais.
                  </p>
                  <Link href="/premium">
                    <Button>
                      Fazer upgrade por R$ 14,90/mês
                    </Button>
                  </Link>
                </div>
              )}

              {user.plano === 'PREMIUM' && (
                <Link href="/api/billing/portal">
                  <Button
                    variant="outline"
                    className="w-full"
                  >
                    Gerenciar Assinatura no Stripe
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Privacidade */}
        <TabsContent value="privacidade">
          <PrivacySettings
            user={{
              id: user.id,
              email: user.email,
              provider: user.provider,
              createdAt: user.createdAt.toISOString(),
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const metadata = {
  title: 'Configurações',
  description: 'Gerencie suas configurações, alertas e preferências',
}
