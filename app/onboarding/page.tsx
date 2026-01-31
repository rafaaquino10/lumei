'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { ArrowRight, ArrowLeft } from 'lucide-react'

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

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Bem-vindo ao Calcula MEI, {user?.name?.split(' ')[0] || ''}! 👋
        </h1>
        <p className="text-muted-foreground">
          Vamos personalizar sua experiência em 3 passos rápidos
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-16 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <Card className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">Tipo de MEI</h2>
              <p className="text-muted-foreground mb-6">
                Selecione o tipo do seu MEI
              </p>
            </div>

            <RadioGroup
              value={formData.tipoMEI}
              onValueChange={(value) =>
                setFormData({ ...formData, tipoMEI: value })
              }
            >
              <div className="flex items-center space-x-2 border border-border rounded-lg p-4 hover:bg-secondary/50 cursor-pointer transition-colors">
                <RadioGroupItem value="COMERCIO" id="comercio" />
                <Label htmlFor="comercio" className="flex-1 cursor-pointer">
                  <div className="font-semibold text-foreground">Comércio/Indústria</div>
                  <div className="text-sm text-muted-foreground">
                    Vende produtos (INSS + ICMS)
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border border-border rounded-lg p-4 hover:bg-secondary/50 cursor-pointer transition-colors">
                <RadioGroupItem value="SERVICOS" id="servicos" />
                <Label htmlFor="servicos" className="flex-1 cursor-pointer">
                  <div className="font-semibold text-foreground">Serviços</div>
                  <div className="text-sm text-muted-foreground">
                    Presta serviços (INSS + ISS)
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border border-border rounded-lg p-4 hover:bg-secondary/50 cursor-pointer transition-colors">
                <RadioGroupItem value="MISTO" id="misto" />
                <Label htmlFor="misto" className="flex-1 cursor-pointer">
                  <div className="font-semibold text-foreground">Misto</div>
                  <div className="text-sm text-muted-foreground">
                    Comércio + Serviços (INSS + ICMS + ISS)
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border border-border rounded-lg p-4 hover:bg-secondary/50 cursor-pointer transition-colors">
                <RadioGroupItem value="CAMINHONEIRO" id="caminhoneiro" />
                <Label htmlFor="caminhoneiro" className="flex-1 cursor-pointer">
                  <div className="font-semibold text-foreground">Caminhoneiro</div>
                  <div className="text-sm text-muted-foreground">
                    Transporte de cargas (INSS 12% + ICMS)
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">Dados do Negócio</h2>
              <p className="text-muted-foreground mb-6">
                Informações básicas para personalizar suas calculadoras
              </p>
            </div>

            <div>
              <Label htmlFor="ocupacao">Ocupação / Atividade</Label>
              <Input
                id="ocupacao"
                placeholder="Ex: Designer, Desenvolvedor, Confeiteira..."
                value={formData.ocupacao}
                onChange={(e) =>
                  setFormData({ ...formData, ocupacao: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="cnpj">CNPJ (opcional)</Label>
              <Input
                id="cnpj"
                placeholder="00.000.000/0000-00"
                value={formData.cnpj}
                onChange={(e) =>
                  setFormData({ ...formData, cnpj: e.target.value })
                }
              />
              <p className="text-sm text-muted-foreground mt-1">
                Usado para personalizar alertas de DAS
              </p>
            </div>

            <div>
              <Label>Você tem funcionário?</Label>
              <RadioGroup
                value={formData.temFuncionario ? 'sim' : 'nao'}
                onValueChange={(value) =>
                  setFormData({ ...formData, temFuncionario: value === 'sim' })
                }
              >
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="func-sim" />
                    <Label htmlFor="func-sim" className="cursor-pointer">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao" id="func-nao" />
                    <Label htmlFor="func-nao" className="cursor-pointer">Não</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">Faturamento</h2>
              <p className="text-muted-foreground mb-6">
                Quanto você fatura em média por mês?
              </p>
            </div>

            <RadioGroup
              value={formData.faturamentoMedio.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, faturamentoMedio: Number(value) })
              }
            >
              <div className="flex items-center space-x-2 border border-border rounded-lg p-4 hover:bg-secondary/50 cursor-pointer transition-colors">
                <RadioGroupItem value="1500" id="fat-1" />
                <Label htmlFor="fat-1" className="flex-1 cursor-pointer text-foreground">
                  Até R$ 2.000/mês
                </Label>
              </div>

              <div className="flex items-center space-x-2 border border-border rounded-lg p-4 hover:bg-secondary/50 cursor-pointer transition-colors">
                <RadioGroupItem value="4000" id="fat-2" />
                <Label htmlFor="fat-2" className="flex-1 cursor-pointer text-foreground">
                  R$ 2.000 - R$ 5.000/mês
                </Label>
              </div>

              <div className="flex items-center space-x-2 border border-border rounded-lg p-4 hover:bg-secondary/50 cursor-pointer transition-colors">
                <RadioGroupItem value="7000" id="fat-3" />
                <Label htmlFor="fat-3" className="flex-1 cursor-pointer text-foreground">
                  R$ 5.000 - R$ 8.100/mês (próximo do teto)
                </Label>
              </div>

              <div className="flex items-center space-x-2 border border-border rounded-lg p-4 hover:bg-secondary/50 cursor-pointer transition-colors">
                <RadioGroupItem value="0" id="fat-4" />
                <Label htmlFor="fat-4" className="flex-1 cursor-pointer text-foreground">
                  Ainda não faturei / Prefiro não informar
                </Label>
              </div>
            </RadioGroup>

            <div className="bg-primary/10 border-l-4 border-primary p-4 rounded">
              <p className="text-sm text-foreground">
                💡 <strong>Por que perguntamos?</strong> Para alertá-lo quando
                estiver próximo do teto de R$ 81.000/ano e personalizar suas
                calculadoras.
              </p>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}

          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !formData.tipoMEI) ||
                (step === 2 && !formData.ocupacao)
              }
              className="ml-auto bg-primary hover:bg-primary/90"
            >
              Próximo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="ml-auto bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? 'Salvando...' : 'Finalizar'}
            </Button>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            disabled={isSubmitting}
          >
            Pular por enquanto →
          </button>
        </div>
      </Card>
    </div>
  )
}
