'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api/client'

export function useCalculatorSave() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      tipo: string
      inputs: unknown
      resultado: unknown
      titulo?: string
      descricao?: string
      formulaVersion?: string
    }) => apiFetch('/api/calculos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calculations'] })
      queryClient.invalidateQueries({ queryKey: ['user-usage'] })
    },
  })
}
