'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Download, Loader2, Crown } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import { RelatorioMensalPDF, RelatorioMensalData } from '@/components/pdf'
import Link from 'next/link'

interface RegistroFaturamento {
  mes: number
  ano: number
  valor: number
}

interface RelatorioMensalButtonProps {
  registros: RegistroFaturamento[]
  ano: number
  mes: number
  limiteMEI: number
  valorDAS: number
  isPremium: boolean
  userData?: {
    nome?: string
    nomeEmpresa?: string
    cnpj?: string
    tipoMEI?: string
  }
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export function RelatorioMensalButton({
  registros,
  ano,
  mes,
  limiteMEI,
  valorDAS,
  isPremium,
  userData,
}: RelatorioMensalButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    if (!isPremium) return

    setIsGenerating(true)

    try {
      const data: RelatorioMensalData = {
        mes,
        ano,
        registros,
        limiteMEI,
        valorDAS,
        userData: userData ? {
          ...userData,
          isPremium: true,
        } : undefined,
      }

      const blob = await pdf(<RelatorioMensalPDF data={data} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `relatorio-mensal-${MESES[mes - 1].toLowerCase()}-${ano}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Se nao e Premium, mostra botao desabilitado com link para upgrade
  if (!isPremium) {
    return (
      <Link href="/premium">
        <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
          <Crown className="w-4 h-4 text-amber-500" />
          Relatorio PDF
          <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded ml-1">
            Premium
          </span>
        </Button>
      </Link>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={isGenerating || registros.length === 0}
      className="gap-2"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Gerando...
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          Relatorio PDF
        </>
      )}
    </Button>
  )
}
