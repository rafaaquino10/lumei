'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold text-red-500 mb-4">Ops!</h1>
        <h2 className="text-3xl font-bold mb-4">Algo deu errado</h2>
        <p className="text-xl text-gray-600 mb-8">
          Não se preocupe, já estamos trabalhando para resolver. Tente novamente
          ou volte para a página inicial.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={reset}>
            <RefreshCw className="w-5 h-5 mr-2" />
            Tentar Novamente
          </Button>

          <Button size="lg" variant="outline" onClick={() => (window.location.href = '/')}>
            <Home className="w-5 h-5 mr-2" />
            Voltar para Home
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="font-mono text-sm text-red-800">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
