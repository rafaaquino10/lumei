import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Encontre um Contador | Calcula MEI',
  description: 'Encontre contadores especializados em MEI e Simples Nacional. Marketplace de profissionais verificados prontos para ajudar seu negocio.',
  openGraph: {
    title: 'Encontre um Contador | Calcula MEI',
    description: 'Contadores especializados em MEI e pequenas empresas.',
  },
  keywords: [
    'contador MEI',
    'contabilidade MEI',
    'contador Simples Nacional',
    'contador online',
    'escritorio contabil MEI',
    'encontrar contador',
    'contador especializado MEI',
  ],
}

export default function ContadoresLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
