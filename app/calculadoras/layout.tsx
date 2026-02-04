import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculadoras MEI Gratuitas',
  description: 'Calculadoras financeiras gratuitas para MEI: margem de lucro, preço por hora, precificação, ponto de equilíbrio, simulador de transição MEI para ME, comparador tributário e calendário DAS 2026.',
  openGraph: {
    title: 'Calculadoras MEI Gratuitas | Calcula MEI',
    description: '9 calculadoras financeiras gratuitas para Microempreendedor Individual. Margem de lucro, ponto de equilíbrio, comparador tributário MEI vs Simples Nacional e mais.',
  },
  keywords: [
    'calculadora MEI',
    'calculadora margem de lucro',
    'calculadora preço por hora',
    'precificação MEI',
    'simulador faturamento MEI',
    'fluxo de caixa MEI',
    'calendário DAS 2026',
    'transição MEI para ME',
    'ponto de equilíbrio',
    'comparador tributário',
    'MEI vs Simples Nacional',
    'MEI vs Lucro Presumido',
    'calculadora gratuita MEI',
    'ferramentas MEI',
  ],
}

export default function CalculadorasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
