'use client'

import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api/client'

export function useUserUsage() {
  return useQuery({
    queryKey: ['user-usage'],
    queryFn: () => apiFetch<{ used: number; limit: number | null; percentage: number }>('/api/user/usage'),
    enabled: typeof window !== 'undefined',
  })
}
