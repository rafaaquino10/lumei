'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface LoadMoreCalculationsProps {
  initialCount: number
  totalCount: number
  onLoadMore: () => void
}

export function LoadMoreCalculations({
  initialCount,
  totalCount,
  onLoadMore,
}: LoadMoreCalculationsProps) {
  const [loading, setLoading] = useState(false)

  if (initialCount >= totalCount) {
    return null
  }

  const handleLoadMore = async () => {
    setLoading(true)
    try {
      onLoadMore()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center mt-8">
      <Button
        onClick={handleLoadMore}
        disabled={loading}
        variant="outline"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Carregando...
          </>
        ) : (
          `Carregar mais (${initialCount} de ${totalCount})`
        )}
      </Button>
    </div>
  )
}
