'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, Save } from 'lucide-react'
import { toast } from 'sonner'
import { MoneyInput } from '@/components/ui/money-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { calcularMargemLucro, type MargemLucroResultado } from '@/lib/calculos'

const schema = z.object({
  precoVenda: z.number().positive('Preço deve ser maior que zero'),
  custoTotal: z.number().min(0, 'Custo não pode ser negativo'),
}).refine(data => data.custoTotal < data.precoVenda, {
  message: 'Custo total não pode ser maior que o preço de venda',
  path: ['custoTotal'],
})

type FormData = z.infer<typeof schema>

export default function MargemLucroPage() {
  const [resultado, setResultado] = useState<MargemLucroResultado | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      precoVenda: 0,
      custoTotal: 0,
    },
  })

  const onSubmit = (data: FormData) => {
    const result = calcularMargemLucro({
      precoVenda: data.precoVenda,
      custoTotal: data.custoTotal,
      despesasOperacionais: 0, // For simplified version
    })
    setResultado(result)
  }

  const handleSave = async () => {
    if (!resultado) return
    
    setIsSaving(true)
    try {
      const formValues = getValues()
      const response = await fetch('/api/calculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'MARGEM_LUCRO',
          inputs: formValues,
          resultado: resultado,
          titulo: `Margem de Lucro - ${new Date().toLocaleDateString('pt-BR')}`,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('✅ Cálculo salvo!', {
          description: 'Acesse seus cálculos no histórico.',
        })
      } else {
        toast.info('🔐 Faça login para salvar', {
          description: data.message,
          action: {
            label: 'Entrar',
            onClick: () => window.location.href = '/sign-in',
          },
        })
      }
    } catch (error) {
      toast.error('❌ Erro ao salvar', {
        description: 'Tente novamente.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600">
        <a href="/" className="hover:text-lumei-600">Home</a>
        {' / '}
        <span className="text-gray-900">Margem de Lucro</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Calculadora de Margem de Lucro</h1>
        <p className="text-xl text-gray-600">
          Descubra quanto você lucra de verdade. Simples, rápido e preciso.
        </p>
      </div>

      {/* Main content: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="bg-white border rounded-lumei-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Dados do Cálculo</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Preço de Venda */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="precoVenda">Preço de Venda</Label>
                <div className="group relative">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    Quanto você cobra do cliente
                  </div>
                </div>
              </div>
              <MoneyInput
                id="precoVenda"
                value={watch('precoVenda')}
                onChange={(value) => setValue('precoVenda', value)}
                placeholder="R$ 0,00"
              />
              {errors.precoVenda && (
                <p className="text-sm text-red-600">{errors.precoVenda.message}</p>
              )}
            </div>

            {/* Custo Total */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="custoTotal">Custo Total</Label>
                <div className="group relative">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    Soma de todos os custos (produto, embalagem, frete, etc)
                  </div>
                </div>
              </div>
              <MoneyInput
                id="custoTotal"
                value={watch('custoTotal')}
                onChange={(value) => setValue('custoTotal', value)}
                placeholder="R$ 0,00"
              />
              {errors.custoTotal && (
                <p className="text-sm text-red-600">{errors.custoTotal.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg">
              Calcular Margem
            </Button>
          </form>
        </div>

        {/* Right: Result */}
        <div className="bg-lumei-50 border-l-4 border-lumei-500 rounded-lumei-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Resultado</h2>
          
          <AnimatePresence mode="wait">
            {!resultado ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <p className="text-gray-400">
                  Preencha os dados ao lado para ver o resultado
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Margem Bruta (Principal) */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Margem Bruta</p>
                  <p className="text-5xl font-bold text-lumei-600">
                    {resultado.margemBruta.toFixed(1)}%
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-lumei-200" />

                {/* Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Lucro Bruto</span>
                    <span className="text-xl font-bold text-lumei-600">
                      R$ {resultado.lucroBruto.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Margem Líquida</span>
                    <span className="text-xl font-bold text-lumei-600">
                      {resultado.margemLiquida.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Markup</span>
                    <span className="text-xl font-bold text-lumei-600">
                      {resultado.markup.toFixed(2)}x
                    </span>
                  </div>
                </div>

                {/* MEI Note */}
                <div className="bg-white rounded-lg p-4 text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">📊 Para MEI:</p>
                  <p>
                    Margem líquida = bruta (sem impostos sobre receita, apenas DAS fixo)
                  </p>
                </div>

                {/* Save Button */}
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full"
                  variant="outline"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Salvando...' : 'Salvar Cálculo'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Explanation below */}
      <div className="mt-12 bg-gray-50 rounded-lumei-lg p-8">
        <h3 className="text-2xl font-bold mb-4">Como Calculamos</h3>
        <div className="prose max-w-none text-gray-600">
          <p>
            A margem de lucro mostra quanto você realmente ganha em cada venda.
            É essencial para precificar corretamente e garantir a saúde do seu negócio.
          </p>
          <ul className="mt-4 space-y-2">
            <li><strong>Lucro Bruto:</strong> Preço de Venda - Custo Total</li>
            <li><strong>Margem Bruta:</strong> (Lucro Bruto ÷ Preço de Venda) × 100</li>
            <li><strong>Markup:</strong> Preço de Venda ÷ Custo Total</li>
          </ul>
          <p className="mt-4 text-sm">
            ⚠️ <strong>Importante:</strong> Para MEI, a margem líquida é igual à bruta,
            pois não há imposto sobre receita (apenas o DAS fixo).
          </p>
        </div>
      </div>
    </div>
  )
}
