'use client'

import { useRouter } from 'next/navigation'
import { FinancialDashboard } from './financial-dashboard'
import { useDashboardViews } from './use-dashboard-views'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'

interface DashboardData {
  faturamentoAcumulado: number
  faturamentoMedio: number
  margemMedia: number
  limiteMEI: number
  proximoDAS: {
    data: string
    valor: number
    diasRestantes: number
  }
  lucroMes: number
  evolucaoMensal: number[]
  tipoMEI: string | null
  ocupacao: string | null
  totalCalculos: number
  onboardingCompleto: boolean
}

interface DashboardWrapperProps {
  data: DashboardData
  isPremium: boolean
}

export function DashboardWrapper({ data, isPremium }: DashboardWrapperProps) {
  const router = useRouter()
  const { isBlocked, remaining, total } = useDashboardViews(isPremium)

  const handleUpgrade = () => {
    router.push('/premium')
  }

  return (
    <div className="space-y-4">
      {/* Views counter for free users */}
      {!isPremium && data.onboardingCompleto && (
        <Card className="p-3 flex items-center justify-between bg-secondary/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>Visualizações do Dashboard</span>
          </div>
          <Badge variant={remaining <= 2 ? 'destructive' : 'secondary'}>
            {remaining} de {total} restantes
          </Badge>
        </Card>
      )}

      {/* Financial Dashboard */}
      <FinancialDashboard
        data={data}
        isBlurred={isBlocked}
        onUpgrade={handleUpgrade}
      />
    </div>
  )
}
