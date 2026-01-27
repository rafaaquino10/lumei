'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, Save, Share, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { MoneyInput } from '@/components/ui/money-input'
import { NumberInput } from '@/components/ui/number-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  calcularPrecificacaoProduto,
  calcularPrecificacaoServico,
  type PrecificacaoProdutoResultado,
  type PrecificacaoServicoResultado,
} from '@/lib/calculos'
import { OutrasCalculadoras } from '@/components/outras-calculadoras'
import { CalculatorSchema } from '@/components/calculator-schema'
import {
  trackCalculatorUsed,
  trackCalculatorCompleted,
  trackShare,
} from '@/lib/analytics'
import { useSaveCalculation } from '@/lib/save-calculation'

// Schema para Produtos
const schemaProdutos = z.object({
  custoProduto: z.number().min(0, 'Custo não pode ser negativo'),
  custosFixosRateados: z.number().min(0, 'Custo não pode ser negativo'),
  despesasVariaveis: z.number().min(0, 'Despesas não podem ser negativas'),
  margemDesejada: z.number().min(0, 'Mínimo 0%').max(100, 'Máximo 100%'),
})

// Schema para Serviços
const schemaServicos = z.object({
  horasServico: z.number().positive('Horas devem ser maiores que zero'),
  valorHora: z.number().positive('Valor deve ser maior que zero'),
  materiaisCusto: z.number().min(0, 'Custo não pode ser negativo'),
  despesasAdicionais: z.number().min(0, 'Despesas não podem ser negativas'),
  margemDesejada: z.number().min(0, 'Mínimo 0%').max(100, 'Máximo 100%'),
})

type FormDataProdutos = z.infer<typeof schemaProdutos>
type FormDataServicos = z.infer<typeof schemaServicos>

export default function PrecificacaoPage() {
  const [modo, setModo] = useState<'produtos' | 'servicos'>('produtos')
  const [resultadoProduto, setResultadoProduto] = useState<PrecificacaoProdutoResultado | null>(null)
  const [resultadoServico, setResultadoServico] = useState<PrecificacaoServicoResultado | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { saveCalculation } = useSaveCalculation()

  // Track page view
  useEffect(() => {
    trackCalculatorUsed('precificacao')
  }, [])

  // Form para Produtos
  const formProdutos = useForm<FormDataProdutos>({
    resolver: zodResolver(schemaProdutos),
    defaultValues: {
      custoProduto: 0,
      custosFixosRateados: 0,
      despesasVariaveis: 0,
      margemDesejada: 40,
    },
  })

  // Form para Serviços
  const formServicos = useForm<FormDataServicos>({
    resolver: zodResolver(schemaServicos),
    defaultValues: {
      horasServico: 0,
      valorHora: 0,
      materiaisCusto: 0,
      despesasAdicionais: 0,
      margemDesejada: 40,
    },
  })

  const onSubmitProdutos = (data: FormDataProdutos) => {
    const result = calcularPrecificacaoProduto(data)
    setResultadoProduto(result)
    setResultadoServico(null) // Clear other result
    trackCalculatorCompleted('precificacao')
  }

  const onSubmitServicos = (data: FormDataServicos) => {
    const result = calcularPrecificacaoServico(data)
    setResultadoServico(result)
    setResultadoProduto(null) // Clear other result
    trackCalculatorCompleted('precificacao')
  }

  const handleSave = async () => {
    const resultado = modo === 'produtos' ? resultadoProduto : resultadoServico
    if (!resultado) return
    
    setIsSaving(true)
    try {
      const formValues = modo === 'produtos' ? formProdutos.getValues() : formServicos.getValues()
      await saveCalculation(
        'PRECIFICACAO',
        formValues as unknown as Record<string, unknown>,
        resultado as unknown as Record<string, unknown>,
        `Precificação ${modo === 'produtos' ? 'Produto' : 'Serviço'} - ${new Date().toLocaleDateString('pt-BR')}`
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = async () => {
    const resultado = modo === 'produtos' ? resultadoProduto : resultadoServico
    if (!resultado) return
    
    const precoVenda = 'precoVenda' in resultado ? resultado.precoVenda : 0
    
    const shareData = {
      title: `Minha Precificação de ${modo === 'produtos' ? 'Produto' : 'Serviço'} - Lumei`,
      text: `Preço ${modo === 'produtos' ? 'de Venda' : 'do Serviço'}: R$ ${precoVenda.toFixed(2).replace('.', ',')}`,
      url: window.location.href,
    }
    
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        trackShare('precificacao')
        toast.success('✅ Compartilhado com sucesso!')
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url)
        trackShare('precificacao')
        toast.success('📋 Link copiado!', {
          description: 'Cole onde quiser compartilhar.',
        })
      } catch {
        toast.error('❌ Erro ao copiar link')
      }
    }
  }

  const resultado = modo === 'produtos' ? resultadoProduto : resultadoServico

  return (
    <div className="container mx-auto px-4 py-12">
      <CalculatorSchema
        name="Calculadora de Precificação MEI"
        description="Calcule o preço ideal para seus produtos e serviços incluindo todos os custos e margem desejada"
        url="https://lumei.vercel.app/calcular/precificacao"
      />
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600">
        <Link href="/" className="hover:text-lumei-600">Home</Link>
        {' / '}
        <span className="text-gray-900">Precificação</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Calculadora de Precificação</h1>
        <p className="text-xl text-gray-600">
          Calcule o preço ideal para seus produtos e serviços considerando todos os custos.
        </p>
      </div>

      {/* Main content: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form with Tabs */}
        <div className="bg-white border rounded-lumei-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Dados do Cálculo</h2>
          
          <Tabs defaultValue="produtos" onValueChange={(value) => setModo(value as 'produtos' | 'servicos')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="produtos">🏷️ Produtos</TabsTrigger>
              <TabsTrigger value="servicos">🛠️ Serviços</TabsTrigger>
            </TabsList>
            
            {/* PRODUTOS TAB */}
            <TabsContent value="produtos">
              <form onSubmit={formProdutos.handleSubmit(onSubmitProdutos)} className="space-y-6">
                {/* Custo do Produto */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="custoProduto">Custo do Produto</Label>
                    <div className="group relative">
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        Quanto você paga pelo produto
                      </div>
                    </div>
                  </div>
                  <MoneyInput
                    id="custoProduto"
                    value={formProdutos.watch('custoProduto')}
                    onChange={(value) => formProdutos.setValue('custoProduto', value)}
                    placeholder="R$ 0,00"
                  />
                  {formProdutos.formState.errors.custoProduto && (
                    <p className="text-sm text-red-600">{formProdutos.formState.errors.custoProduto.message}</p>
                  )}
                </div>

                {/* Custos Fixos Rateados */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="custosFixosRateados">Custos Fixos Rateados</Label>
                    <div className="group relative">
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        Parte dos custos fixos mensais dividida por produto
                      </div>
                    </div>
                  </div>
                  <MoneyInput
                    id="custosFixosRateados"
                    value={formProdutos.watch('custosFixosRateados')}
                    onChange={(value) => formProdutos.setValue('custosFixosRateados', value)}
                    placeholder="R$ 0,00"
                  />
                  {formProdutos.formState.errors.custosFixosRateados && (
                    <p className="text-sm text-red-600">{formProdutos.formState.errors.custosFixosRateados.message}</p>
                  )}
                </div>

                {/* Despesas Variáveis */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="despesasVariaveis">Despesas Variáveis</Label>
                    <div className="group relative">
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        Embalagem, etiqueta, sacola, etc
                      </div>
                    </div>
                  </div>
                  <MoneyInput
                    id="despesasVariaveis"
                    value={formProdutos.watch('despesasVariaveis')}
                    onChange={(value) => formProdutos.setValue('despesasVariaveis', value)}
                    placeholder="R$ 0,00"
                  />
                  {formProdutos.formState.errors.despesasVariaveis && (
                    <p className="text-sm text-red-600">{formProdutos.formState.errors.despesasVariaveis.message}</p>
                  )}
                </div>

                {/* Margem Desejada */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="margemDesejada">Margem Desejada</Label>
                    <div className="group relative">
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        Percentual de lucro que você quer ter
                      </div>
                    </div>
                  </div>
                  <NumberInput
                    id="margemDesejada"
                    value={formProdutos.watch('margemDesejada')}
                    onChange={(value) => formProdutos.setValue('margemDesejada', value)}
                    suffix="%"
                    decimals={0}
                  />
                  {formProdutos.formState.errors.margemDesejada && (
                    <p className="text-sm text-red-600">{formProdutos.formState.errors.margemDesejada.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Calcular Preço do Produto
                </Button>
              </form>
            </TabsContent>

            {/* SERVIÇOS TAB */}
            <TabsContent value="servicos">
              <form onSubmit={formServicos.handleSubmit(onSubmitServicos)} className="space-y-6">
                {/* Horas do Serviço */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="horasServico">Horas do Serviço</Label>
                    <div className="group relative">
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        Quantas horas você vai trabalhar
                      </div>
                    </div>
                  </div>
                  <NumberInput
                    id="horasServico"
                    value={formServicos.watch('horasServico')}
                    onChange={(value) => formServicos.setValue('horasServico', value)}
                    suffix="h"
                    decimals={1}
                  />
                  {formServicos.formState.errors.horasServico && (
                    <p className="text-sm text-red-600">{formServicos.formState.errors.horasServico.message}</p>
                  )}
                </div>

                {/* Valor por Hora */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="valorHora">Valor por Hora</Label>
                    <div className="group relative">
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        Seu preço por hora de trabalho
                      </div>
                    </div>
                  </div>
                  <MoneyInput
                    id="valorHora"
                    value={formServicos.watch('valorHora')}
                    onChange={(value) => formServicos.setValue('valorHora', value)}
                    placeholder="R$ 0,00"
                  />
                  {formServicos.formState.errors.valorHora && (
                    <p className="text-sm text-red-600">{formServicos.formState.errors.valorHora.message}</p>
                  )}
                  <a
                    href="/calcular/preco-hora"
                    target="_blank"
                    className="text-xs text-lumei-600 hover:text-lumei-700 flex items-center gap-1"
                  >
                    Não sabe seu valor/hora? Calcular →
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* Materiais/Insumos */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="materiaisCusto">Materiais/Insumos</Label>
                    <div className="group relative">
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        Materiais necessários para o serviço
                      </div>
                    </div>
                  </div>
                  <MoneyInput
                    id="materiaisCusto"
                    value={formServicos.watch('materiaisCusto')}
                    onChange={(value) => formServicos.setValue('materiaisCusto', value)}
                    placeholder="R$ 0,00"
                  />
                  {formServicos.formState.errors.materiaisCusto && (
                    <p className="text-sm text-red-600">{formServicos.formState.errors.materiaisCusto.message}</p>
                  )}
                </div>

                {/* Despesas Adicionais */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="despesasAdicionais">Despesas Adicionais</Label>
                    <div className="group relative">
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        Deslocamento, ajudantes, etc
                      </div>
                    </div>
                  </div>
                  <MoneyInput
                    id="despesasAdicionais"
                    value={formServicos.watch('despesasAdicionais')}
                    onChange={(value) => formServicos.setValue('despesasAdicionais', value)}
                    placeholder="R$ 0,00"
                  />
                  {formServicos.formState.errors.despesasAdicionais && (
                    <p className="text-sm text-red-600">{formServicos.formState.errors.despesasAdicionais.message}</p>
                  )}
                </div>

                {/* Margem Desejada */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="margemDesejadaServico">Margem Desejada</Label>
                    <div className="group relative">
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        Percentual de lucro que você quer ter
                      </div>
                    </div>
                  </div>
                  <NumberInput
                    id="margemDesejadaServico"
                    value={formServicos.watch('margemDesejada')}
                    onChange={(value) => formServicos.setValue('margemDesejada', value)}
                    suffix="%"
                    decimals={0}
                  />
                  {formServicos.formState.errors.margemDesejada && (
                    <p className="text-sm text-red-600">{formServicos.formState.errors.margemDesejada.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Calcular Preço do Serviço
                </Button>
              </form>
            </TabsContent>
          </Tabs>
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
            ) : modo === 'produtos' && resultadoProduto ? (
              <motion.div
                key="result-produto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Preço de Venda (Principal) */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Preço de Venda Sugerido</p>
                  <p className="text-5xl font-bold text-lumei-600">
                    R$ {resultadoProduto.precoVenda.toFixed(2).replace('.', ',')}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-lumei-200" />

                {/* Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Custo Total</span>
                    <span className="text-xl font-bold text-lumei-600">
                      R$ {resultadoProduto.custoTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Markup</span>
                    <span className="text-xl font-bold text-lumei-600">
                      {resultadoProduto.markup.toFixed(2)}x
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Lucro</span>
                    <span className="text-xl font-bold text-lumei-600">
                      R$ {resultadoProduto.lucro.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Note */}
                <div className="bg-white rounded-lg p-4 text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">💡 Dica:</p>
                  <p>
                    Este é o preço mínimo para cobrir todos os custos e ter a margem desejada.
                    Considere o valor percebido pelo cliente para ajustar.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                </div>
              </motion.div>
            ) : modo === 'servicos' && resultadoServico ? (
              <motion.div
                key="result-servico"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Preço do Serviço (Principal) */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Preço do Serviço</p>
                  <p className="text-5xl font-bold text-lumei-600">
                    R$ {resultadoServico.precoVenda.toFixed(2).replace('.', ',')}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-lumei-200" />

                {/* Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Custo Mão de Obra</span>
                    <span className="text-xl font-bold text-lumei-600">
                      R$ {resultadoServico.custoMaoDeObra.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Custo Total</span>
                    <span className="text-xl font-bold text-lumei-600">
                      R$ {resultadoServico.custoTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Preço/Hora Efetivo</span>
                    <span className="text-xl font-bold text-lumei-600">
                      R$ {resultadoServico.precoHoraEfetivo.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Lucro</span>
                    <span className="text-xl font-bold text-lumei-600">
                      R$ {resultadoServico.lucro.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Note */}
                <div className="bg-white rounded-lg p-4 text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">💡 Dica:</p>
                  <p>
                    O &quot;Preço/Hora Efetivo&quot; mostra quanto você está ganhando por hora
                    neste serviço específico (incluindo materiais e despesas).
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Explanation below */}
      <div className="mt-12 bg-gray-50 rounded-lumei-lg p-8">
        <h3 className="text-2xl font-bold mb-4">Como Calculamos</h3>
        <div className="prose max-w-none text-gray-600">
          <p className="mb-4">
            A precificação correta é fundamental para a saúde do seu negócio. 
            Considere TODOS os custos, não apenas o óbvio.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">🏷️ Produtos</h4>
              <ul className="space-y-1 text-sm">
                <li><strong>Custo Total:</strong> Produto + Fixos Rateados + Variáveis</li>
                <li><strong>Preço Venda:</strong> Custo Total ÷ (1 - Margem/100)</li>
                <li><strong>Markup:</strong> Preço Venda ÷ Custo Total</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-2">🛠️ Serviços</h4>
              <ul className="space-y-1 text-sm">
                <li><strong>Custo Mão de Obra:</strong> Horas × Valor/Hora</li>
                <li><strong>Custo Total:</strong> Mão de Obra + Materiais + Despesas</li>
                <li><strong>Preço:</strong> Custo Total ÷ (1 - Margem/100)</li>
              </ul>
            </div>
          </div>
          
          <p className="mt-4 text-sm">
            ⚠️ <strong>Importante:</strong> A margem desejada deve cobrir imprevistos, 
            reinvestimento no negócio e seu lucro real. Margens muito baixas comprometem 
            a sustentabilidade do negócio.
          </p>
        </div>
      </div>

      <OutrasCalculadoras currentPath="/calcular/precificacao" />
    </div>
  )
}
