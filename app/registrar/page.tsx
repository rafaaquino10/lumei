'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth/context'
import { toast } from 'sonner'
import {
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Info,
} from 'lucide-react'
import { InfoTooltip, METRIC_TOOLTIPS } from '@/components/ui/info-tooltip'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const LIMITE_MEI = 81000

interface Registro {
  id: string
  mes: number
  ano: number
  valor: number
  notas?: string
}

interface Metricas {
  totalAcumulado: number
  mesesComRegistro: number
  mediaMovel: number
  projecaoAnual: number
  percentualLimite: number
  valorRestante: number
  mesesAteEstourar: number
}

export default function RegistrarPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [ano, setAno] = useState(new Date().getFullYear())
  const [registros, setRegistros] = useState<Registro[]>([])
  const [metricas, setMetricas] = useState<Metricas | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [mesEditando, setMesEditando] = useState<number | null>(null)
  const [valorEditando, setValorEditando] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/sign-in?redirect=/registrar')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchRegistros()
    }
  }, [user, ano])

  const fetchRegistros = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/faturamento?ano=${ano}`)
      const data = await res.json()
      setRegistros(data.registros || [])
      setMetricas(data.metricas || null)
    } catch (error) {
      console.error('Erro ao buscar registros:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (mes: number) => {
    const valor = parseFloat(valorEditando.replace(/[^\d,]/g, '').replace(',', '.'))
    if (isNaN(valor) || valor < 0) {
      toast.error('Informe um valor válido')
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/faturamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mes, ano, valor }),
      })

      if (res.ok) {
        toast.success(`Faturamento de ${MESES[mes - 1]} registrado!`)
        setMesEditando(null)
        setValorEditando('')
        fetchRegistros()
      } else {
        throw new Error('Erro ao salvar')
      }
    } catch (error) {
      toast.error('Erro ao salvar. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const getRegistroDoMes = (mes: number) => {
    return registros.find(r => r.mes === mes)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const mesAtual = new Date().getMonth() + 1

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Registrar Faturamento
        </h1>
        <p className="text-muted-foreground">
          Registre quanto você faturou a cada mês para acompanhar seu MEI
        </p>
      </div>

      {/* Resumo do Ano */}
      {metricas && metricas.mesesComRegistro > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <InfoTooltip {...METRIC_TOOLTIPS.faturamentoAcumulado}>
                    <span>Acumulado {ano}</span>
                  </InfoTooltip>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(metricas.totalAcumulado)}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <InfoTooltip {...METRIC_TOOLTIPS.percentualLimite}>
                    <span>% do Limite</span>
                  </InfoTooltip>
                </div>
                <p className={`text-lg font-bold ${
                  metricas.percentualLimite >= 100 ? 'text-red-600' :
                  metricas.percentualLimite >= 80 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {metricas.percentualLimite.toFixed(1)}%
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <InfoTooltip {...METRIC_TOOLTIPS.mediaMovel}>
                    <span>Média Mensal</span>
                  </InfoTooltip>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(metricas.mediaMovel)}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <InfoTooltip {...METRIC_TOOLTIPS.projecaoAnual}>
                    <span>Projeção Anual</span>
                  </InfoTooltip>
                </div>
                <p className={`text-lg font-bold ${
                  metricas.projecaoAnual > LIMITE_MEI ? 'text-red-600' : 'text-foreground'
                }`}>
                  {formatCurrency(metricas.projecaoAnual)}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Seletor de Ano */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAno(ano - 1)}
          disabled={ano <= 2020}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {ano - 1}
        </Button>
        <h2 className="text-xl font-bold text-foreground">{ano}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAno(ano + 1)}
          disabled={ano >= 2100}
        >
          {ano + 1}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Grid de Meses */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MESES.map((nomeMes, index) => {
            const mes = index + 1
            const registro = getRegistroDoMes(mes)
            const isEditing = mesEditando === mes
            const isFuturo = ano > new Date().getFullYear() ||
              (ano === new Date().getFullYear() && mes > mesAtual)
            const isAtual = ano === new Date().getFullYear() && mes === mesAtual

            return (
              <motion.div
                key={mes}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card
                  className={`p-4 transition-all ${
                    isAtual ? 'border-primary shadow-md' : ''
                  } ${isFuturo ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${
                        isAtual ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <span className="font-semibold text-foreground">{nomeMes}</span>
                      {isAtual && (
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Atual
                        </span>
                      )}
                    </div>
                    {registro && !isEditing && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div
                        key="editing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        <div>
                          <Label htmlFor={`valor-${mes}`} className="text-xs">
                            Quanto você faturou em {nomeMes}?
                          </Label>
                          <Input
                            id={`valor-${mes}`}
                            placeholder="R$ 0,00"
                            value={valorEditando}
                            onChange={(e) => setValorEditando(e.target.value)}
                            autoFocus
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleSave(mes)}
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Salvar'
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setMesEditando(null)
                              setValorEditando('')
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="display"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {registro ? (
                          <div>
                            <p className="text-2xl font-bold text-foreground">
                              {formatCurrency(registro.valor)}
                            </p>
                            <button
                              onClick={() => {
                                setMesEditando(mes)
                                setValorEditando(registro.valor.toString())
                              }}
                              className="text-xs text-primary hover:underline mt-2"
                            >
                              Editar
                            </button>
                          </div>
                        ) : isFuturo ? (
                          <p className="text-sm text-muted-foreground">
                            Mês futuro
                          </p>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              setMesEditando(mes)
                              setValorEditando('')
                            }}
                          >
                            Registrar
                          </Button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Dica */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card className="p-4 bg-secondary/50 border-dashed">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Dica: O que contar como faturamento?
              </p>
              <p className="text-xs text-muted-foreground">
                Some todos os valores que você recebeu de clientes no mês: transferências,
                PIX, dinheiro, cartão. Não desconte impostos ou despesas - queremos o valor
                bruto total que entrou.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
