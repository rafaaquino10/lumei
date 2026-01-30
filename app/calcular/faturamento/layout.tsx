import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulador de Faturamento MEI | Lumei',
  description: 'Simule seu faturamento anual e veja se está dentro do limite MEI de R$ 81.000. Alerta de desenquadramento.',
}

export default function FaturamentoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
