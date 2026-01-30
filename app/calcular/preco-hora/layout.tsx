import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculadora de Preço por Hora | Lumei',
  description: 'Descubra quanto cobrar por hora de trabalho. Calculadora gratuita para freelancers e prestadores de serviço MEI.',
}

export default function PrecoHoraLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
