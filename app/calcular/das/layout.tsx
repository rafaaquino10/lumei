import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendário DAS MEI 2026 | Calcula MEI',
  description: 'Veja os valores e datas de vencimento do DAS MEI em 2026. Nunca perca um prazo de pagamento.',
}

export default function DASLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
