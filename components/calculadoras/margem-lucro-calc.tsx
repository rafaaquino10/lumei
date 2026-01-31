'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function MargemLucroCalc() {
  const [custoTotal, setCustoTotal] = useState('')
  const [precoVenda, setPrecoVenda] = useState('')
  const [resultado, setResultado] = useState<number | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calcular = async () => {
    const custo = parseFloat(custoTotal)
    const preco = parseFloat(precoVenda)
    if (custo && preco && preco > 0) {
      setIsCalculating(true)
      // Simula processamento para feedback visual
      await new Promise(resolve => setTimeout(resolve, 300))
      const margem = ((preco - custo) / preco) * 100
      setResultado(margem)
      setIsCalculating(false)
    }
  }

  return (
    <Card className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-3">
        Calculadora de Margem de Lucro
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="custo">Custo Total (R$)</Label>
          <Input
            id="custo"
            type="number"
            placeholder="0.00"
            value={custoTotal}
            onChange={(e) => setCustoTotal(e.target.value)}
            className="h-10"
          />
        </div>

        <div>
          <Label htmlFor="preco">Preço de Venda (R$)</Label>
          <Input
            id="preco"
            type="number"
            placeholder="0.00"
            value={precoVenda}
            onChange={(e) => setPrecoVenda(e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      <Button
        onClick={calcular}
        className="w-full h-10 mb-4"
        disabled={isCalculating || !custoTotal || !precoVenda}
      >
        {isCalculating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calculando...
          </>
        ) : (
          'Calcular Margem'
        )}
      </Button>

      <AnimatePresence mode="wait">
        {resultado !== null && !isCalculating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 bg-primary/10 border-primary">
              <p className="text-sm text-muted-foreground mb-2">Margem de Lucro</p>
              <motion.p
                className="text-2xl font-bold text-foreground"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                {resultado.toFixed(2)}%
              </motion.p>
              <p className="text-xs text-muted-foreground mt-2">
                {resultado > 0 ? '✓ Lucro positivo' : '✗ Prejuízo'}
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
