import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculadora de Precificação | Lumei',
  description: 'Calcule o preço ideal para seus produtos e serviços. Ferramenta gratuita de precificação para MEI.',
}

export default function PrecificacaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
