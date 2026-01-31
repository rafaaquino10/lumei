'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { PaywallModal, usePaywall } from '@/components/paywall'

export function FluxoCaixaCalc() {
  const [entradas, setEntradas] = useState('')
  const [saidas, setSaidas] = useState('')
  const [resultado, setResultado] = useState<{
    saldo: number
    status: 'positivo' | 'negativo' | 'zerado'
  } | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const {
    checkLimit,
    recordCalculation,
    showPaywall,
    setShowPaywall,
    paywallType,
    remaining,
    limit
  } = usePaywall()

  const calcular = async () => {
    const { isBlocked } = checkLimit()
    if (isBlocked) {
      setShowPaywall(true)
      return
    }

    const ent = parseFloat(entradas) || 0
    const sai = parseFloat(saidas) || 0

    setIsCalculating(true)
    await new Promise(resolve => setTimeout(resolve, 300))

    const saldo = ent - sai
    let status: 'positivo' | 'negativo' | 'zerado' = 'zerado'
    if (saldo > 0) status = 'positivo'
    else if (saldo < 0) status = 'negativo'

    setResultado({ saldo, status })
    setIsCalculating(false)
    recordCalculation()
  }

  return (
    <Card className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-3">
        Calculadora de Fluxo de Caixa
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="entradas">Entradas do Mês (R$)</Label>
          <Input
            id="entradas"
            type="number"
            placeholder="0.00"
            value={entradas}
            onChange={(e) => setEntradas(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
        </div>

        <div>
          <Label htmlFor="saidas">Saídas do Mês (R$)</Label>
          <Input
            id="saidas"
            type="number"
            placeholder="0.00"
            value={saidas}
            onChange={(e) => setSaidas(e.target.value)}
            className="h-10"
            disabled={isCalculating}
          />
        </div>
      </div>

      <Button
        onClick={calcular}
        className="w-full h-10 mb-4"
        disabled={isCalculating}
      >
        {isCalculating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calculando...
          </>
        ) : (
          'Calcular Saldo'
        )}
      </Button>

      <AnimatePresence mode="wait">
        {resultado && !isCalculating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`p-4 ${
              resultado.status === 'positivo' ? 'bg-primary/10 border-primary' :
              resultado.status === 'negativo' ? 'bg-destructive/10 border-destructive' :
              'bg-secondary border-border'
            }`}>
              <p className="text-sm text-muted-foreground mb-2">Saldo do Fluxo de Caixa</p>
              <motion.p
                className="text-2xl font-bold text-foreground"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                R$ {Math.abs(resultado.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </motion.p>
              <p className="text-xs text-muted-foreground mt-2">
                {resultado.status === 'positivo' && '✓ Fluxo de caixa positivo'}
                {resultado.status === 'negativo' && '✗ Fluxo de caixa negativo'}
                {resultado.status === 'zerado' && '= Fluxo de caixa zerado'}
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        type={paywallType}
        remaining={remaining}
        limit={limit}
      />
    </Card>
  )
}
