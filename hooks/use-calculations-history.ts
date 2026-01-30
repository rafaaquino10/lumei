'use client'

import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api/client'

export interface Calculation {
  id: string
  tipo: string
  inputs: unknown
  resultado: unknown
  createdAt: string
  titulo?: string
  descricao?: string
}

interface CalculationsResponse {
  data: Calculation[]
  total: number
  hasMore: boolean
}

export function useCalculationsHistory(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['calculations', page, limit],
    queryFn: () => apiFetch<CalculationsResponse>(`/api/calculos?page=${page}&limit=${limit}`),
    enabled: typeof window !== 'undefined',
  })
}
