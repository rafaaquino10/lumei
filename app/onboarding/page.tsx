'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth/context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { ArrowRight, ArrowLeft, Store, Wrench, Layers, Truck, TrendingUp, Sparkles, Calculator } from 'lucide-react'

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    tipoMEI: '',
    cnpj: '',
    ocupacao: '',
    temFuncionario: false,
    faturamentoMedio: 0,
  })

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('✅ Perfil configurado com sucesso!')
        router.push('/dashboard')
      } else {
        throw new Error('Failed to save')
      }
    } catch {
      toast.error('❌ Erro ao salvar. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepTitles = ['Tipo de MEI', 'Seu Negócio', 'Faturamento']

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-4">
          <motion.div
            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <Calculator className="w-8 h-8 text-primary" />
          </motion.div>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Bem-vindo, {user?.name?.split(' ')[0] || 'empreendedor'}!
        </h1>
        <p className="text-muted-foreground">
          Desbloqueie seu Dashboard financeiro em 3 passos rápidos
        </p>
      </motion.div>

      {/* Progress indicator with labels */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    s < step ? 'bg-primary text-primary-foreground' :
                    s === step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                  animate={s === step ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {s < step ? '✓' : s}
                </motion.div>
                <span className={`text-xs mt-1 ${s === step ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {stepTitles[i]}
                </span>
              </div>
              {i < 2 && (
                <div className={`w-12 h-0.5 mx-2 ${s < step ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-8 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2 text-foreground">Qual o tipo do seu MEI?</h2>
                <p className="text-muted-foreground">
                  Isso nos ajuda a calcular o valor correto do seu DAS
                </p>
              </div>

              <RadioGroup
                value={formData.tipoMEI}
                onValueChange={(value) =>
                  setFormData({ ...formData, tipoMEI: value })
                }
                className="space-y-3"
              >
                {[
                  { value: 'COMERCIO', label: 'Comércio/Indústria', desc: 'Vende produtos (INSS + ICMS)', icon: Store, das: 'R$ 76,90' },
                  { value: 'SERVICOS', label: 'Serviços', desc: 'Presta serviços (INSS + ISS)', icon: Wrench, das: 'R$ 80,90' },
                  { value: 'MISTO', label: 'Misto', desc: 'Comércio + Serviços', icon: Layers, das: 'R$ 81,90' },
                  { value: 'CAMINHONEIRO', label: 'Caminhoneiro', desc: 'Transporte de cargas', icon: Truck, das: 'R$ 183,16' },
                ].map((option, i) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div
                      className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                        formData.tipoMEI === option.value
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:bg-secondary/50'
                      }`}
                      onClick={() => setFormData({ ...formData, tipoMEI: option.value })}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <option.icon className={`w-5 h-5 ${formData.tipoMEI === option.value ? 'text-primary' : 'text-muted-foreground'}`} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                        <div className="font-semibold text-foreground">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.desc}</div>
                      </Label>
                      <span className={`text-sm font-medium ${formData.tipoMEI === option.value ? 'text-primary' : 'text-muted-foreground'}`}>
                        {option.das}/mês
                      </span>
                    </div>
                  </motion.div>
                ))}
              </RadioGroup>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2 text-foreground">Conte sobre seu negócio</h2>
                <p className="text-muted-foreground">
                  Informações para personalizar suas calculadoras
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label htmlFor="ocupacao">O que você faz? *</Label>
                <Input
                  id="ocupacao"
                  placeholder="Ex: Designer, Desenvolvedor, Confeiteira..."
                  value={formData.ocupacao}
                  onChange={(e) =>
                    setFormData({ ...formData, ocupacao: e.target.value })
                  }
                  className="mt-1"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="cnpj">CNPJ (opcional)</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={(e) =>
                    setFormData({ ...formData, cnpj: e.target.value })
                  }
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Usado para personalizar alertas de DAS
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label>Você tem funcionário?</Label>
                <RadioGroup
                  value={formData.temFuncionario ? 'sim' : 'nao'}
                  onValueChange={(value) =>
                    setFormData({ ...formData, temFuncionario: value === 'sim' })
                  }
                  className="mt-2"
                >
                  <div className="flex gap-4">
                    <div className={`flex items-center space-x-2 border rounded-lg px-4 py-2 cursor-pointer transition-all ${
                      formData.temFuncionario ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50'
                    }`}>
                      <RadioGroupItem value="sim" id="func-sim" />
                      <Label htmlFor="func-sim" className="cursor-pointer">Sim, tenho 1</Label>
                    </div>
                    <div className={`flex items-center space-x-2 border rounded-lg px-4 py-2 cursor-pointer transition-all ${
                      !formData.temFuncionario ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50'
                    }`}>
                      <RadioGroupItem value="nao" id="func-nao" />
                      <Label htmlFor="func-nao" className="cursor-pointer">Não</Label>
                    </div>
                  </div>
                </RadioGroup>
              </motion.div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2 text-foreground">Qual seu faturamento médio?</h2>
                <p className="text-muted-foreground">
                  Isso nos ajuda a monitorar se você está próximo do limite
                </p>
              </div>

              <RadioGroup
                value={formData.faturamentoMedio.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, faturamentoMedio: Number(value) })
                }
                className="space-y-3"
              >
                {[
                  { value: '1500', label: 'Até R$ 2.000/mês', percent: '29%', color: 'text-green-600' },
                  { value: '4000', label: 'R$ 2.000 - R$ 5.000/mês', percent: '59%', color: 'text-yellow-600' },
                  { value: '7000', label: 'R$ 5.000 - R$ 8.100/mês', percent: '100%', color: 'text-red-600' },
                  { value: '0', label: 'Ainda não faturei / Prefiro não informar', percent: null, color: '' },
                ].map((option, i) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div
                      className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                        formData.faturamentoMedio.toString() === option.value
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:bg-secondary/50'
                      }`}
                      onClick={() => setFormData({ ...formData, faturamentoMedio: Number(option.value) })}
                    >
                      <RadioGroupItem value={option.value} id={`fat-${option.value}`} />
                      <TrendingUp className={`w-5 h-5 ${option.color || 'text-muted-foreground'}`} />
                      <Label htmlFor={`fat-${option.value}`} className="flex-1 cursor-pointer text-foreground">
                        {option.label}
                      </Label>
                      {option.percent && (
                        <span className={`text-sm font-medium ${option.color}`}>
                          ~{option.percent} do limite
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </RadioGroup>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-primary/10 border-l-4 border-primary p-4 rounded"
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-foreground">
                    <strong>Quase lá!</strong> Ao finalizar você terá acesso ao:
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      <li>• Dashboard financeiro personalizado</li>
                      <li>• Métricas de faturamento e margem</li>
                      <li>• Alertas de DAS e limite MEI</li>
                      <li>• Gráfico de evolução mensal</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !formData.tipoMEI) ||
                  (step === 2 && !formData.ocupacao)
                }
                className="bg-primary hover:bg-primary/90"
              >
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Começar a Usar
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/calculadoras')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            disabled={isSubmitting}
          >
            Ir direto para as calculadoras
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </Card>
    </div>
  )
}
