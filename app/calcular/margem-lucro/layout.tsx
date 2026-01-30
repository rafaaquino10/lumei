import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculadora de Margem de Lucro | Lumei',
  description: 'Calcule sua margem de lucro bruta e líquida de forma simples. Ferramenta gratuita para MEI descobrir o lucro real de cada venda.',
}

export default function MargemLucroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
