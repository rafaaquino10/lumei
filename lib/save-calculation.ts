import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { trackCalculatorSaved, type CalculatorType } from '@/lib/analytics'

type TipoCalculo = 'MARGEM_LUCRO' | 'PRECO_HORA' | 'PRECIFICACAO' | 'FATURAMENTO' | 'FLUXO_CAIXA' | 'CALENDARIO_DAS'

export function useSaveCalculation() {
  const router = useRouter()

  const saveCalculation = async (
    tipo: TipoCalculo,
    inputs: Record<string, unknown>,
    resultado: Record<string, unknown>,
    titulo?: string
  ) => {
    try {
      const response = await fetch('/api/calculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo,
          inputs,
          resultado,
          titulo:
            titulo || `${tipo} - ${new Date().toLocaleDateString('pt-BR')}`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Track successful save
        const tipoMap: Record<TipoCalculo, CalculatorType> = {
          MARGEM_LUCRO: 'margem_lucro',
          PRECO_HORA: 'preco_hora',
          PRECIFICACAO: 'precificacao',
          FATURAMENTO: 'faturamento',
          FLUXO_CAIXA: 'fluxo_caixa',
          CALENDARIO_DAS: 'calendario_das',
        }
        trackCalculatorSaved(tipoMap[tipo])

        toast.success('✅ Cálculo salvo!', {
          description: 'Acesse seus cálculos no dashboard.',
          action: {
            label: 'Ver Dashboard',
            onClick: () => router.push('/dashboard'),
          },
        })
        return true
      } else {
        // Handle different error types
        switch (data.error) {
          case 'not_authenticated':
            toast.info('🔐 Faça login para salvar', {
              description: data.message,
              action: {
                label: 'Entrar',
                onClick: () => router.push('/sign-in'),
              },
            })
            break

          case 'limit_reached':
            toast.warning('⚠️ Limite atingido', {
              description: data.message,
              action: {
                label: 'Ver Premium',
                onClick: () => router.push('/premium'),
              },
            })
            break

          case 'user_not_found':
            toast.warning('⚠️ Complete seu cadastro', {
              description: data.message,
              action: {
                label: 'Completar',
                onClick: () => router.push('/onboarding'),
              },
            })
            break

          default:
            toast.error('❌ Erro ao salvar', {
              description: data.message,
            })
        }
        return false
      }
    } catch {
      toast.error('❌ Erro ao salvar', {
        description: 'Tente novamente.',
      })
      return false
    }
  }

  return { saveCalculation }
}
