'use client'

import { useAuth } from '@/lib/auth/context'
import type { PDFUserData } from '@/components/pdf'

const TIPO_MEI_LABELS: Record<string, string> = {
  'COMERCIO': 'Comércio',
  'SERVICOS': 'Serviços',
  'MISTO': 'Comércio e Serviços',
  'CAMINHONEIRO': 'Caminhoneiro',
}

export function usePDFUserData(): PDFUserData | undefined {
  const { user, isSignedIn } = useAuth()

  if (!isSignedIn || !user) {
    return undefined
  }

  const isPremium = user.plano === 'PREMIUM'

  // Retorna undefined se nao tem dados relevantes para o PDF
  if (!user.name && !user.cnpj && !user.tipoMEI) {
    return isPremium ? { isPremium } : undefined
  }

  return {
    nome: user.name || undefined,
    cnpj: user.cnpj || undefined,
    tipoMEI: user.tipoMEI ? TIPO_MEI_LABELS[user.tipoMEI] || user.tipoMEI : undefined,
    isPremium,
  }
}
