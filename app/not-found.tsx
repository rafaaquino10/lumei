import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="text-center max-w-2xl">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-4xl font-bold mb-4 text-foreground">Página não encontrada</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Ops! A página que você procura não existe. Mas suas calculadoras
          favoritas estão te esperando!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg">
              <Home className="w-5 h-5 mr-2" />
              Voltar para Home
            </Button>
          </Link>

          <Link href="/calculadoras">
            <Button size="lg" variant="outline">
              <Search className="w-5 h-5 mr-2" />
              Ver Calculadoras
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
          <Link
            href="/calculadoras"
            className="p-4 border border-border rounded-lg hover:border-primary transition-colors"
          >
            <p className="font-bold mb-1 text-foreground">Margem de Lucro</p>
            <p className="text-sm text-muted-foreground">Calcule seu lucro real</p>
          </Link>

          <Link
            href="/calculadoras"
            className="p-4 border border-border rounded-lg hover:border-primary transition-colors"
          >
            <p className="font-bold mb-1 text-foreground">Preço por Hora</p>
            <p className="text-sm text-muted-foreground">Quanto cobrar</p>
          </Link>

          <Link
            href="/calculadoras"
            className="p-4 border border-border rounded-lg hover:border-primary transition-colors"
          >
            <p className="font-bold mb-1 text-foreground">Calendário DAS</p>
            <p className="text-sm text-muted-foreground">Vencimentos 2025</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
