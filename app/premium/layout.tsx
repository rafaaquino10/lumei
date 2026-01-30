import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcula MEI Premium - Alertas Automáticos de DAS | R$ 19/mês',
  description:
    'Nunca mais atrase o DAS. Alertas WhatsApp, relatórios ilimitados e muito mais por R$ 19/mês. Cancele quando quiser.',
}

export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
