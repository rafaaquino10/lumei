import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculadora de Fluxo de Caixa | Lumei',
  description: 'Controle entradas e saídas do seu negócio. Calculadora gratuita de fluxo de caixa para MEI.',
}

export default function FluxoCaixaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
