import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ferramentas Financeiras',
  description: 'Calculadoras financeiras gratuitas para MEI: margem de lucro, preço por hora, precificação, simulador de faturamento, fluxo de caixa e calendário DAS.',
  openGraph: {
    title: 'Ferramentas Financeiras | Calcula MEI',
    description: 'Calculadoras financeiras gratuitas para MEI: margem de lucro, preço por hora, precificação, simulador de faturamento, fluxo de caixa e calendário DAS.',
  },
  keywords: [
    'calculadora margem de lucro',
    'calculadora preço por hora',
    'precificação MEI',
    'simulador faturamento MEI',
    'fluxo de caixa MEI',
    'calendário DAS 2026',
  ],
}

export default function CalculadorasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
