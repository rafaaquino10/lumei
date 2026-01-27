'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { MoneyInput } from '@/components/ui/money-input'
import { calcularFaturamento, FaturamentoResultado } from '@/lib/calculos'
import { useSaveCalculation } from '@/lib/save-calculation'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'

const MESES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
]

const schema = z.object({
  faturamentoMensal: z.array(z.number().min(0)).length(12),
})

type FormData = z.infer<typeof schema>

export default function FaturamentoPage() {
  const [resultado, setResultado] = useState<FaturamentoResultado | null>(null)
  const { saveCalculation } = useSaveCalculation()
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        faturamentoMensal: Array(12).fill(0),
      },
    })

  const faturamentoMensal = watch('faturamentoMensal')

  const onSubmit = (data: FormData) => {
    const calc = calcularFaturamento(data)
    setResultado(calc)
  }
  
  const handleSave = async () => {
    if (!resultado) return
    await saveCalculation(
      'FATURAMENTO',
      { faturamentoMensal },
      resultado
    )
  }

  // Preencher todos os meses com mesmo valor
  const preencherTodos = () => {
    const valor = faturamentoMensal[0] || 0
    const novoArray = Array(12).fill(valor)
    setValue('faturamentoMensal', novoArray)
  }

  // Preparar dados para o gráfico
  const chartData = MESES.map((mes, index) => ({
    mes,
    valor: faturamentoMensal[index] || 0,
    acumulado: faturamentoMensal
      .slice(0, index + 1)
      .reduce((acc, val) => acc + val, 0),
  }))

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600">
        <a href="/" className="hover:text-lumei-600">Home</a>
        {' / '}
        <span className="text-gray-900">Simulador Faturamento</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Simulador de Faturamento MEI
        </h1>
        <p className="text-xl text-gray-600">
          Monitore seu faturamento anual e saiba se está próximo do teto de R$ 81.000
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="space-y-6">
          <Card className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Faturamento Mensal</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={preencherTodos}
              >
                Preencher Todos
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {MESES.map((mes, index) => (
                  <div key={mes}>
                    <Label htmlFor={`mes-${index}`}>{mes}</Label>
                    <MoneyInput
                      id={`mes-${index}`}
                      value={faturamentoMensal[index]}
                      onChange={(value) => {
                        const newArray = [...faturamentoMensal]
                        newArray[index] = value
                        setValue('faturamentoMensal', newArray)
                      }}
                    />
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full" size="lg">
                Calcular
              </Button>
            </form>
          </Card>

          {/* Preview Chart */}
          {faturamentoMensal.some((v) => v > 0) && (
            <Card className="p-6">
              <h3 className="font-bold mb-4">Prévia Mensal</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#00D084"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>

        {/* Right: Result */}
        <div>
          {resultado ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Alert */}
              <Card
                className={`p-6 border-l-4 ${
                  resultado.status === 'SEGURO'
                    ? 'bg-green-50 border-green-500'
                    : resultado.status === 'ATENCAO'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  {resultado.status === 'SEGURO' ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      {resultado.mensagemStatus}
                    </h3>
                  </div>
                </div>
              </Card>

              {/* Main Result */}
              <Card className="p-8 bg-lumei-50">
                <h2 className="text-2xl font-bold mb-6">Resultado Anual</h2>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">Faturamento Anual</p>
                  <p className="text-5xl font-bold text-lumei-600 font-mono">
                    R$ {resultado.faturamentoAnual.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">
                      {resultado.percentualUsado.toFixed(1)}% do teto
                    </span>
                    <span className="text-sm text-gray-600">
                      R$ 81.000 (teto MEI)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all ${
                        resultado.percentualUsado >= 90
                          ? 'bg-red-500'
                          : resultado.percentualUsado >= 70
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(resultado.percentualUsado, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Média Mensal</p>
                    <p className="text-2xl font-bold font-mono">
                      R$ {resultado.mediaMonsal.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ainda Pode Faturar</p>
                    <p className="text-2xl font-bold font-mono">
                      R$ {Math.max(0, resultado.faltante).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Chart Acumulado */}
              <Card className="p-6">
                <h3 className="font-bold mb-4">Faturamento Acumulado</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) =>
                        `R$ ${Number(value).toLocaleString('pt-BR')}`
                      }
                    />
                    <ReferenceLine
                      y={81000}
                      stroke="#EF4444"
                      strokeDasharray="3 3"
                      label="Teto MEI"
                    />
                    <Line
                      type="monotone"
                      dataKey="acumulado"
                      stroke="#00D084"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={handleSave} className="flex-1">
                  Salvar Simulação
                </Button>
              </div>
            </motion.div>
          ) : (
            <Card className="p-12 text-center bg-gray-50">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Preencha o faturamento dos meses para ver a simulação
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-12 bg-gray-50 rounded-lumei-lg p-8">
        <h3 className="text-2xl font-bold mb-4">Sobre o Teto MEI</h3>
        <div className="prose max-w-none text-gray-600 space-y-4">
          <p>
            O MEI tem um limite de faturamento anual de <strong>R$ 81.000</strong> (ou R$ 6.750/mês em média).
          </p>
          <div className="grid md:grid-cols-3 gap-4 my-6">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="font-bold text-green-900">✅ Até 70%</p>
              <p className="text-sm text-green-700">Você está seguro</p>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="font-bold text-yellow-900">⚠️ 70-90%</p>
              <p className="text-sm text-yellow-700">Fique atento</p>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="font-bold text-red-900">🚨 Acima de 90%</p>
              <p className="text-sm text-red-700">Risco de ultrapassar</p>
            </div>
          </div>
          <p>
            <strong>O que acontece se ultrapassar?</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Até 20% acima (R$ 97.200):</strong> Você paga DAS proporcional ao excedente no ano seguinte
            </li>
            <li>
              <strong>Mais de 20% acima:</strong> Desenquadramento retroativo. Você vira ME e precisa pagar impostos retroativos
            </li>
          </ul>
          <p className="text-sm mt-4">
            ⚠️ <strong>Importante:</strong> Estes valores são referência. Sempre confirme no Portal do Empreendedor.
          </p>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Simulador de Faturamento MEI | Lumei',
  description: 'Monitore seu faturamento anual e evite ultrapassar o teto de R$ 81.000. Simulação gratuita para MEI.',
}
