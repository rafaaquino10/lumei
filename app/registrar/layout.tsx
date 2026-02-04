import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registrar Faturamento',
  description: 'Registre seu faturamento mensal e acompanhe o limite do MEI de R$ 81.000/ano em tempo real.',
  openGraph: {
    title: 'Registrar Faturamento | Calcula MEI',
    description: 'Registre seu faturamento mensal e acompanhe o limite do MEI de R$ 81.000/ano em tempo real.',
  },
}

export default function RegistrarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
