'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function MobileCalculatorWrapper({ 
  children, 
  resultados 
}: { 
  children: React.ReactNode
  resultados?: React.ReactNode 
}) {
  const [showResults, setShowResults] = useState(false)

  // On mobile, results are collapsible
  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
      {/* Form - always visible */}
      <div>{children}</div>

      {/* Results - collapsible on mobile */}
      <div className="lg:block">
        <div className="lg:hidden mt-6">
          <Button
            onClick={() => setShowResults(!showResults)}
            variant="outline"
            className="w-full"
          >
            {showResults ? 'Ocultar' : 'Ver'} Resultado
            {showResults ? (
              <ChevronUp className="w-4 h-4 ml-2" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>

        <div className={`${showResults || 'hidden'} lg:block mt-4 lg:mt-0`}>
          {resultados}
        </div>
      </div>
    </div>
  )
}
