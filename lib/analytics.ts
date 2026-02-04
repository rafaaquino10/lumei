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

// ===========================================
// Eventos de Registro de Faturamento
// ===========================================

export const trackRevenueRegistered = (mes: number, ano: number, valor: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'revenue_registered', {
      month: mes,
      year: ano,
      value: valor,
    })
  }
}

export const trackRevenueUpdated = (mes: number, ano: number, valor: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'revenue_updated', {
      month: mes,
      year: ano,
      value: valor,
    })
  }
}

export const trackRevenueDeleted = (mes: number, ano: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'revenue_deleted', {
      month: mes,
      year: ano,
    })
  }
}

// ===========================================
// Eventos de Onboarding e Tutorial
// ===========================================

export const trackTutorialStarted = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'tutorial_started')
  }
}

export const trackTutorialStepCompleted = (step: number, stepName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'tutorial_step_completed', {
      step_number: step,
      step_name: stepName,
    })
  }
}

export const trackTutorialCompleted = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'tutorial_completed')
  }
}

export const trackTutorialSkipped = (atStep: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'tutorial_skipped', {
      skipped_at_step: atStep,
    })
  }
}

// ===========================================
// Eventos de Engajamento
// ===========================================

export const trackDashboardViewed = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'dashboard_viewed')
  }
}

export const trackMonthlyReminderShown = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'monthly_reminder_shown')
  }
}

export const trackMonthlyReminderClicked = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'monthly_reminder_clicked')
  }
}

export const trackMonthlyReminderDismissed = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'monthly_reminder_dismissed')
  }
}

export const trackContextualSuggestionClicked = (fromCalculator: string, toCalculator: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'contextual_suggestion_clicked', {
      from_calculator: fromCalculator,
      to_calculator: toCalculator,
    })
  }
}

// ===========================================
// Eventos de Limite MEI
// ===========================================

export const trackLimitWarningShown = (percentageUsed: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'limit_warning_shown', {
      percentage_used: percentageUsed,
    })
  }
}

export const trackLimitExceeded = (totalRevenue: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'limit_exceeded', {
      total_revenue: totalRevenue,
    })
  }
}

// ===========================================
// Eventos de Conversão
// ===========================================

export const trackPremiumCTAClicked = (source: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'premium_cta_clicked', {
      source: source,
    })
  }
}

export const trackSignUpStarted = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up_started')
  }
}

export const trackSignUpCompleted = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up_completed')
  }
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}
