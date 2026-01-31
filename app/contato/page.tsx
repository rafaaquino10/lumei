import { Mail, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Contato</h1>
          <p className="text-base opacity-90">Entre em contato conosco. Responderemos o mais rápido possível.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2 text-foreground">Suporte</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  Email: <a className="text-primary font-medium hover:underline" href="mailto:contato@calculamei.com.br">contato@calculamei.com.br</a>
                </p>
                <p className="text-xs text-muted-foreground">Tempo médio de resposta: 1–2 dias úteis</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2 text-foreground">Parcerias e Imprensa</h2>
                <p className="text-sm text-muted-foreground">
                  Envie um email para <a className="text-primary font-medium hover:underline" href="mailto:contato@calculamei.com.br">contato@calculamei.com.br</a> com o assunto apropriado.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Contato | Calcula MEI',
  description: 'Entre em contato com o time Calcula MEI — suporte, parcerias e imprensa.',
}
