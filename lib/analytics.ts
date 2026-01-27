export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Event types
export type CalculatorType = 
  | 'margem_lucro'
  | 'preco_hora'
  | 'precificacao'
  | 'faturamento'
  | 'fluxo_caixa'
  | 'calendario_das'

export const trackCalculatorUsed = (tipo: CalculatorType) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'calculator_used', {
      calculator_type: tipo,
    })
  }
}

export const trackCalculatorCompleted = (tipo: CalculatorType) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'calculator_completed', {
      calculator_type: tipo,
    })
  }
}

export const trackCalculatorSaved = (tipo: CalculatorType) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'calculator_saved', {
      calculator_type: tipo,
    })
  }
}

export const trackPDFExport = (tipo: CalculatorType) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'pdf_export', {
      calculator_type: tipo,
    })
  }
}

export const trackShare = (tipo: CalculatorType) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'share', {
      calculator_type: tipo,
    })
  }
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}
