'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, Save, Share, Download } from 'lucide-react'
import { toast } from 'sonner'
import { MoneyInput } from '@/components/ui/money-input'
import { NumberInput } from '@/components/ui/number-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { calcularPrecoHora, type PrecoHoraResultado } from '@/lib/calculos'
import { PrecoHoraPDF } from '@/components/pdf/preco-hora-pdf'
import { OutrasCalculadoras } from '@/components/outras-calculadoras'
import { CalculatorSchema } from '@/components/calculator-schema'
import { trackCalculatorUsed, trackCalculatorCompleted, trackPDFExport, trackShare } from '@/lib/analytics'
import { useSaveCalculation } from '@/lib/save-calculation'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const schema = z.object({
  salarioDesejado: z.number().positive('Salário deve ser maior que zero'),
  custosFixos: z.number().min(0, 'Custos não podem ser negativos'),
  horasTrabalhadasMes: z.number().min(1, 'Mínimo 1 hora').max(300, 'Máximo 300 horas'),
  diasFeriasPorAno: z.number().min(0, 'Mínimo 0 dias').max(60, 'Máximo 60 dias'),
  margemLucro: z.number().min(0, 'Mínimo 0%').max(100, 'Máximo 100%'),
})

type FormData = z.infer<typeof schema>

export default function PrecoHoraPage() {
  const [resultado, setResultado] = useState<PrecoHoraResultado | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    trackCalculatorUsed('preco_hora')
  }, [])

  const searchParams = useSearchParams()
  const loadId = searchParams.get('load')

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      salarioDesejado: 0,
      custosFixos: 0,
      horasTrabalhadasMes: 160,
      diasFeriasPorAno: 30,
      margemLucro: 30,
    },
  })

  useEffect(() => {
    if (!loadId) return

    let active = true

    const loadCalculation = async () => {
      try {
        const response = await fetch(`/api/calculos/${loadId}`)
        if (!response.ok) return
        const data = await response.json()
        const calculo = data?.calculo
        if (!calculo || !active) return

        const inputs = calculo.inputs as Partial<FormData>
        if (typeof inputs.salarioDesejado === 'number') {
          setValue('salarioDesejado', inputs.salarioDesejado)
        }
        if (typeof inputs.custosFixos === 'number') {
          setValue('custosFixos', inputs.custosFixos)
        }
        if (typeof inputs.horasTrabalhadasMes === 'number') {
          setValue('horasTrabalhadasMes', inputs.horasTrabalhadasMes)
        }
        if (typeof inputs.diasFeriasPorAno === 'number') {
          setValue('diasFeriasPorAno', inputs.diasFeriasPorAno)
        }
        if (typeof inputs.margemLucro === 'number') {
          setValue('margemLucro', inputs.margemLucro)
        }

        if (calculo.resultado) {
          setResultado(calculo.resultado as PrecoHoraResultado)
        }
      } catch {
        // Ignore load errors
      }
    }

    loadCalculation()

    return () => {
      active = false
    }
  }, [loadId, setValue])

  const onSubmit = (data: FormData) => {
    const result = calcularPrecoHora(data)
    setResultado(result)
    trackCalculatorCompleted('preco_hora')
  }

  const { saveCalculation } = useSaveCalculation()

  const handleSave = async () => {
    if (!resultado) return
    
    setIsSaving(true)
    try {
      const formValues = getValues()
      await saveCalculation(
        'PRECO_HORA',
        formValues,
        resultado as unknown as Record<string, unknown>,
        `Preço por Hora - ${new Date().toLocaleDateString('pt-BR')}`
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = async () => {
    if (!resultado) return
    
    const shareData = {
      title: 'Meu Cálculo de Preço por Hora - Lumei',
      text: `Preço por Hora: R$ ${resultado.precoHoraFinal.toFixed(2).replace('.', ',')}/hora`,
      url: window.location.href,
    }
    
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        trackShare('preco_hora')
        toast.success('✅ Compartilhado com sucesso!')
      } catch {
        // User cancelled or error - do nothing
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url)
        trackShare('preco_hora')
        toast.success('📋 Link copiado!', {
          description: 'Cole onde quiser compartilhar.',
        })
      } catch {
        toast.error('❌ Erro ao copiar link')
      }
    }
  }

  const handleExportPDF = async () => {
    if (!resultado) return
    
    try {
      const formValues = getValues()
      const { pdf } = await import('@react-pdf/renderer')
      const blob = await pdf(
        <PrecoHoraPDF inputs={formValues} resultado={resultado} />
      ).toBlob()
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `preco-hora-${Date.now()}.pdf`
      link.click()
      
      URL.revokeObjectURL(url)
      
      trackPDFExport('preco_hora')
      toast.success('✅ PDF exportado!', {
        description: 'Arquivo baixado com sucesso.',
      })
    } catch {
      toast.error('❌ Erro ao exportar', {
        description: 'Tente novamente.',
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <CalculatorSchema
        name="Calculadora de Preço por Hora MEI"
        description="Descubra quanto cobrar por hora considerando férias, custos fixos e margem de lucro"
        url="https://lumei.vercel.app/calcular/preco-hora"
      />
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600">
        <Link href="/" className="hover:text-lumei-600">Home</Link>
        {' / '}
        <span className="text-gray-900">Preço por Hora</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Calculadora de Preço por Hora</h1>
        <p className="text-xl text-gray-600">
          Descubra quanto cobrar por hora de trabalho. Considere todos os custos.
        </p>
      </div>

      {/* Main content: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="bg-white border rounded-lumei-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Dados do Cálculo</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Salário Desejado */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="salarioDesejado">Salário Desejado Mensal</Label>
                <div className="group relative">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    Quanto você quer receber por mês
                  </div>
                </div>
              </div>
              <MoneyInput
                id="salarioDesejado"
                value={watch('salarioDesejado')}
                onChange={(value) => setValue('salarioDesejado', value)}
                placeholder="R$ 0,00"
              />
              {errors.salarioDesejado && (
                <p className="text-sm text-red-600">{errors.salarioDesejado.message}</p>
              )}
            </div>

            {/* Custos Fixos */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="custosFixos">Custos Fixos Mensais</Label>
                <div className="group relative">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    Internet, luz, aluguel, etc
                  </div>
                </div>
              </div>
              <MoneyInput
                id="custosFixos"
                value={watch('custosFixos')}
                onChange={(value) => setValue('custosFixos', value)}
                placeholder="R$ 0,00"
              />
              {errors.custosFixos && (
                <p className="text-sm text-red-600">{errors.custosFixos.message}</p>
              )}
            </div>

            {/* Horas Trabalhadas/Mês */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="horasTrabalhadasMes">Horas Trabalhadas/Mês</Label>
                <div className="group relative">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    Ex: 160h = 8h/dia × 20 dias
                  </div>
                </div>
              </div>
              <NumberInput
                id="horasTrabalhadasMes"
                value={watch('horasTrabalhadasMes')}
                onChange={(value) => setValue('horasTrabalhadasMes', value)}
                suffix="h/mês"
                decimals={0}
              />
              {errors.horasTrabalhadasMes && (
                <p className="text-sm text-red-600">{errors.horasTrabalhadasMes.message}</p>
              )}
            </div>

            {/* Dias de Férias/Ano */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="diasFeriasPorAno">Dias de Férias/Ano</Label>
                <div className="group relative">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    Quantos dias você tira de férias por ano
                  </div>
                </div>
              </div>
              <NumberInput
                id="diasFeriasPorAno"
                value={watch('diasFeriasPorAno')}
                onChange={(value) => setValue('diasFeriasPorAno', value)}
                suffix="dias"
                decimals={0}
              />
              {errors.diasFeriasPorAno && (
                <p className="text-sm text-red-600">{errors.diasFeriasPorAno.message}</p>
              )}
            </div>

            {/* Margem de Lucro */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="margemLucro">Margem de Lucro Desejada</Label>
                <div className="group relative">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    Percentual de lucro que você quer ter
                  </div>
                </div>
              </div>
              <NumberInput
                id="margemLucro"
                value={watch('margemLucro')}
                onChange={(value) => setValue('margemLucro', value)}
                suffix="%"
                decimals={0}
              />
              {errors.margemLucro && (
                <p className="text-sm text-red-600">{errors.margemLucro.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg">
              Calcular Preço por Hora
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
                {/* Preço por Hora (Principal) */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Seu Preço por Hora Ideal</p>
                  <p className="text-5xl font-bold text-lumei-600">
                    R$ {resultado.precoHoraFinal.toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">/hora</p>
                </div>

                {/* Divider */}
                <div className="border-t border-lumei-200" />

                {/* Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Receita Necessária</span>
                    <span className="text-xl font-bold text-lumei-600">
                      R$ {resultado.receitaNecessaria.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fator Férias</span>
                    <span className="text-xl font-bold text-lumei-600">
                      {resultado.fatorFerias.toFixed(2)}x
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Receita Mensal</span>
                    <span className="text-xl font-bold text-lumei-600">
                      R$ {resultado.receitaMensal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* MEI Note */}
                <div className="bg-white rounded-lg p-4 text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-2">💡 Por que esse valor?</p>
                  <p className="mb-2">
                    A fórmula considera:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Seu salário desejado</li>
                    <li>Custos fixos do negócio</li>
                    <li>Margem de lucro para reinvestir/poupar</li>
                    <li>Férias (ganhar em 11 meses o que sustenta 12)</li>
                  </ul>
                  <p className="mt-2 text-xs">
                    Por isso o preço/hora parece &quot;alto&quot;. Você não está cobrando só pelo tempo, 
                    mas por todos os custos invisíveis de ser MEI.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </Button>
                  
                  <Button 
                    onClick={handleShare}
                    variant="outline"
                    className="w-full"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                  
                  <Button 
                    onClick={handleExportPDF}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
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
            O cálculo de preço por hora considera todos os custos do seu negócio, 
            não apenas o tempo trabalhado.
          </p>
          <ul className="mt-4 space-y-2">
            <li><strong>Receita Necessária:</strong> Salário + Custos Fixos + Margem de Lucro</li>
            <li><strong>Fator Férias:</strong> 12 meses ÷ (12 - dias de férias ÷ 30)</li>
            <li><strong>Preço/Hora Final:</strong> (Receita Necessária ÷ Horas/Mês) × Fator Férias</li>
          </ul>
          <p className="mt-4 text-sm">
            ⚠️ <strong>Importante:</strong> Este é o preço MÍNIMO. Em projetos complexos ou 
            com prazos apertados, você pode (e deve) cobrar mais.
          </p>
        </div>
      </div>

      <OutrasCalculadoras currentPath="/calcular/preco-hora" />
    </div>
  )
}
