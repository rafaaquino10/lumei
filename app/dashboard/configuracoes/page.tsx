import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { SubscriptionStatus } from '@/components/billing/subscription-status'
import { Button } from '@/components/ui/button'

export default async function ConfiguracoesPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    redirect('/onboarding')
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Configurações</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Plano e Assinatura</h2>
          <SubscriptionStatus userId={user.id} />

          {user.plano === 'FREE' && (
            <div className="mt-6">
              <Button size="lg" asChild className="w-full">
                <a href="/premium">Fazer upgrade para Premium</a>
              </Button>
            </div>
          )}

          {user.plano === 'PREMIUM' && (
            <div className="mt-6">
              <Button
                variant="outline"
                size="lg"
                onClick={() => (window.location.href = '/api/billing/portal')}
                className="w-full"
              >
                Gerenciar Assinatura
              </Button>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Informações da Conta</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-medium">{user.name || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo de MEI</p>
                <p className="font-medium">{user.tipoMEI || 'Não informado'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Configurações | Lumei',
  description: 'Gerencie suas configurações e assinatura',
}
