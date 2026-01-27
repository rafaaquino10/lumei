'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MoneyInput } from '@/components/ui/money-input'
import { 
  calcularFluxoCaixa, 
  FluxoCaixaResultado,
  CATEGORIAS_ENTRADA,
  CATEGORIAS_SAIDA 
} from '@/lib/calculos'
import { useSaveCalculation } from '@/lib/save-calculation'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react'

const transacaoSchema = z.object({
  descricao: z.string().min(1, 'Descrição obrigatória'),
  valor: z.number().positive('Valor deve ser maior que zero'),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  tipo: z.enum(['ENTRADA', 'SAIDA']),
  data: z.string(),
})

const schema = z.object({
  transacoes: z.array(transacaoSchema).min(1, 'Adicione pelo menos 1 transação'),
})

type FormData = z.infer<typeof schema>

const COLORS_ENTRADA = ['#00D084', '#34D399', '#6EE7B7', '#A7F3D0']
const COLORS_SAIDA = ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2']

export default function FluxoCaixaPage() {
  const [resultado, setResultado] = useState<FluxoCaixaResultado | null>(null)
  const { saveCalculation } = useSaveCalculation()

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      transacoes: [
        {
          descricao: '',
          valor: 0,
          categoria: '',
          tipo: 'ENTRADA',
          data: new Date().toISOString().split('T')[0],
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'transacoes',
  })

  const transacoes = watch('transacoes')

  const onSubmit = (data: FormData) => {
    const calc = calcularFluxoCaixa({ transacoes: data.transacoes })
    setResultado(calc)
  }

  const handleSave = async () => {
    if (!resultado) return
    await saveCalculation('FLUXO_CAIXA', { transacoes }, resultado as unknown as Record<string, unknown>)
  }

  const adicionarTransacao = () => {
    append({
      descricao: '',
      valor: 0,
      categoria: '',
      tipo: 'ENTRADA',
      data: new Date().toISOString().split('T')[0],
    })
  }

  // Preparar dados para gráficos de pizza
  const entradasChartData = resultado
    ? Object.entries(resultado.entradasPorCategoria).map(([cat, val]) => ({
        name: cat,
        value: val,
      }))
    : []

  const saidasChartData = resultado
    ? Object.entries(resultado.saidasPorCategoria).map(([cat, val]) => ({
        name: cat,
        value: val,
      }))
    : []

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600">
        <a href="/" className="hover:text-lumei-600">
          Home
        </a>
        {' / '}
        <span className="text-gray-900">Fluxo de Caixa</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Fluxo de Caixa</h1>
        <p className="text-xl text-gray-600">
          Controle suas entradas e saídas mensais. Saiba exatamente para onde vai seu dinheiro.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div>
          <Card className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Transações</h2>
              <Button
                type="button"
                onClick={adicionarTransacao}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {fields.map((field, index) => {
                  const tipo = watch(`transacoes.${index}.tipo`)
                  const categorias =
                    tipo === 'ENTRADA' ? CATEGORIAS_ENTRADA : CATEGORIAS_SAIDA

                  return (
                    <div
                      key={field.id}
                      className="border rounded-lg p-4 bg-gray-50 relative"
                    >
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        {/* Tipo */}
                        <div>
                          <Label>Tipo</Label>
                          <Select
                            value={watch(`transacoes.${index}.tipo`)}
                            onValueChange={(value) =>
                              setValue(
                                `transacoes.${index}.tipo`,
                                value as 'ENTRADA' | 'SAIDA'
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ENTRADA">
                                <span className="text-green-600">
                                  ↑ Entrada
                                </span>
                              </SelectItem>
                              <SelectItem value="SAIDA">
                                <span className="text-red-600">↓ Saída</span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Data */}
                        <div>
                          <Label>Data</Label>
                          <Input
                            type="date"
                            {...register(`transacoes.${index}.data`)}
                          />
                        </div>

                        {/* Descrição */}
                        <div className="col-span-2">
                          <Label>Descrição</Label>
                          <Input
                            placeholder="Ex: Venda de produto"
                            {...register(`transacoes.${index}.descricao`)}
                          />
                          {errors.transacoes?.[index]?.descricao && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.transacoes[index]?.descricao?.message}
                            </p>
                          )}
                        </div>

                        {/* Categoria */}
                        <div>
                          <Label>Categoria</Label>
                          <Select
                            value={watch(`transacoes.${index}.categoria`)}
                            onValueChange={(value) =>
                              setValue(`transacoes.${index}.categoria`, value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {categorias.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Valor */}
                        <div>
                          <Label>Valor</Label>
                          <MoneyInput
                            value={watch(`transacoes.${index}.valor`)}
                            onChange={(value) =>
                              setValue(`transacoes.${index}.valor`, value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {errors.transacoes && (
                <p className="text-red-500 text-sm">
                  {errors.transacoes.message}
                </p>
              )}

              <Button type="submit" className="w-full" size="lg">
                Calcular Fluxo
              </Button>
            </form>
          </Card>
        </div>

        {/* Right: Result */}
        <div>
          {resultado ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Card */}
              <Card
                className={`p-6 border-l-4 ${
                  resultado.statusSaude === 'POSITIVO'
                    ? 'bg-green-50 border-green-500'
                    : resultado.statusSaude === 'NEUTRO'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <p className="font-bold text-lg">{resultado.mensagem}</p>
              </Card>

              {/* Main Result */}
              <Card className="p-8 bg-lumei-50">
                <h2 className="text-2xl font-bold mb-6">Resumo</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-gray-600">Entradas</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600 font-mono">
                      R${' '}
                      {resultado.totalEntradas.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      <span className="text-gray-600">Saídas</span>
                    </div>
                    <span className="text-2xl font-bold text-red-600 font-mono">
                      R${' '}
                      {resultado.totalSaidas.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="border-t-2 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">Saldo</span>
                      <span
                        className={`text-4xl font-bold font-mono ${
                          resultado.saldo >= 0
                            ? 'text-lumei-600'
                            : 'text-red-600'
                        }`}
                      >
                        R${' '}
                        {resultado.saldo.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      Margem Operacional
                    </p>
                    <p className="text-3xl font-bold">
                      {resultado.margemOperacional.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </Card>

              {/* Pie Charts */}
              {entradasChartData.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-bold mb-4">Entradas por Categoria</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={entradasChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) =>
                          `${entry.name}: ${((entry.value / resultado.totalEntradas) * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {entradasChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS_ENTRADA[index % COLORS_ENTRADA.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) =>
                          `R$ ${Number(value).toLocaleString('pt-BR')}`
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {saidasChartData.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-bold mb-4">Saídas por Categoria</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={saidasChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) =>
                          `${entry.name}: ${((entry.value / resultado.totalSaidas) * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {saidasChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS_SAIDA[index % COLORS_SAIDA.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) =>
                          `R$ ${Number(value).toLocaleString('pt-BR')}`
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Actions */}
              <Button onClick={handleSave} className="w-full">
                Salvar Fluxo
              </Button>
            </motion.div>
          ) : (
            <Card className="p-12 text-center bg-gray-50">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Adicione suas transações para calcular o fluxo de caixa
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-12 bg-gray-50 rounded-lumei-lg p-8">
        <h3 className="text-2xl font-bold mb-4">O que é Fluxo de Caixa?</h3>
        <div className="prose max-w-none text-gray-600">
          <p>
            O fluxo de caixa mostra quanto dinheiro entra e sai do seu negócio
            em um período. É essencial para:
          </p>
          <ul className="list-disc pl-6 space-y-2 my-4">
            <li>Saber se você está lucrando ou tendo prejuízo</li>
            <li>Identificar para onde vai seu dinheiro</li>
            <li>Planejar investimentos e crescimento</li>
            <li>Evitar surpresas e falta de caixa</li>
          </ul>
          <p>
            <strong>Dica:</strong> Faça seu fluxo de caixa mensalmente. Isso te
            dá clareza total sobre a saúde financeira do seu MEI.
          </p>
        </div>
      </div>
    </div>
  )
}
