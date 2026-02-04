'use client'

import { Card } from '@/components/ui/card'
import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-8 h-8 text-muted-foreground" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Sem conexão
        </h1>

        <p className="text-muted-foreground mb-6">
          Parece que você está offline. Verifique sua conexão com a internet e tente novamente.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => window.location.reload()}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>

          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              Voltar ao início
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Algumas funcionalidades podem estar disponíveis offline.
          Seus cálculos salvos localmente ainda podem ser acessados.
        </p>
      </Card>
    </div>
  )
}
