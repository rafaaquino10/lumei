'use client'

import { useState, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Download, FileText, Image, Loader2, Share2, Crown, Sparkles } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'

// Limite mensal de exportações para usuários FREE
const FREE_EXPORT_LIMIT = 6

// Função para gerar nome do arquivo com data e hora
function generateFilename(calculatorName: string, extension: string): string {
  const now = new Date()
  const date = now.toLocaleDateString('pt-BR').replace(/\//g, '-')
  const time = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).replace(':', 'h')

  return `${calculatorName}_${date}_${time}.${extension}`
}

// Funções para rastrear exportações no localStorage
function getExportKey(): string {
  const now = new Date()
  return `exports_${now.getFullYear()}_${now.getMonth() + 1}`
}

function getMonthlyExports(): number {
  if (typeof window === 'undefined') return 0
  const key = getExportKey()
  return parseInt(localStorage.getItem(key) || '0', 10)
}

function recordExport(): void {
  if (typeof window === 'undefined') return
  const key = getExportKey()
  const current = getMonthlyExports()
  localStorage.setItem(key, String(current + 1))
}

function canExportFree(): { allowed: boolean; remaining: number } {
  const used = getMonthlyExports()
  const remaining = Math.max(0, FREE_EXPORT_LIMIT - used)
  return { allowed: remaining > 0, remaining }
}

// Função para converter PDF em imagem PNG
async function pdfToImage(pdfBlob: Blob): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

  const arrayBuffer = await pdfBlob.arrayBuffer()
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
  const pdfDoc = await loadingTask.promise

  const page = await pdfDoc.getPage(1)
  const scale = 2
  const viewport = page.getViewport({ scale })

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  canvas.width = viewport.width
  canvas.height = viewport.height

  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise

  return canvas.toDataURL('image/png')
}

interface ExportActionsProps {
  pdfDocument: ReactNode
  calculatorName: string
  disabled?: boolean
}

export function ExportActions({
  pdfDocument,
  calculatorName,
  disabled = false,
}: ExportActionsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const { user, isSignedIn, isLoading } = useAuth()

  const isPremium = isSignedIn && user?.plano === 'PREMIUM'
  const isAnonymous = !isSignedIn && !isLoading

  // Usuário anônimo: mostra botão com coroa → criar conta
  if (isAnonymous) {
    return (
      <Link href="/sign-up">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Crown className="h-4 w-4 text-amber-500" />
          Exportar
          <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded ml-1">
            Criar conta
          </span>
        </Button>
      </Link>
    )
  }

  const checkLimitAndExport = async (exportFn: () => Promise<void>) => {
    // Premium: sem limite
    if (isPremium) {
      await exportFn()
      return
    }

    // FREE: verificar limite
    const { allowed } = canExportFree()
    if (!allowed) {
      setShowLimitModal(true)
      return
    }

    // Exportar e registrar
    await exportFn()
    recordExport()
  }

  const handlePDFExport = async () => {
    setIsExporting(true)

    try {
      await checkLimitAndExport(async () => {
        const blob = await pdf(pdfDocument as any).toBlob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = generateFilename(calculatorName, 'pdf')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      })
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleImageExport = async () => {
    setIsExporting(true)

    try {
      await checkLimitAndExport(async () => {
        const pdfBlob = await pdf(pdfDocument as any).toBlob()
        const dataUrl = await pdfToImage(pdfBlob)

        const link = document.createElement('a')
        link.href = dataUrl
        link.download = generateFilename(calculatorName, 'png')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    } catch (error) {
      console.error('Erro ao gerar imagem:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    setIsExporting(true)

    try {
      await checkLimitAndExport(async () => {
        const pdfBlob = await pdf(pdfDocument as any).toBlob()
        const dataUrl = await pdfToImage(pdfBlob)

        const response = await fetch(dataUrl)
        const blob = await response.blob()
        const filename = generateFilename(calculatorName, 'png')
        const file = new File([blob], filename, { type: 'image/png' })

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Calcula MEI - Resultado',
            text: 'Veja o resultado do meu cálculo no Calcula MEI!',
          })
        } else {
          const link = document.createElement('a')
          link.href = dataUrl
          link.download = filename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      })
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // Verificar quantos exports restam para mostrar no botão (só FREE)
  const { remaining } = canExportFree()
  const showRemainingBadge = !isPremium && remaining > 0

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={disabled || isExporting}
            className="gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Exportar
                {showRemainingBadge && (
                  <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded ml-1">
                    {remaining}/{FREE_EXPORT_LIMIT}
                  </span>
                )}
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handlePDFExport} disabled={isExporting}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Baixar PDF</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImageExport} disabled={isExporting}>
            <Image className="mr-2 h-4 w-4" />
            <span>Baixar Imagem</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShare} disabled={isExporting}>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Compartilhar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de limite atingido */}
      <Dialog open={showLimitModal} onOpenChange={setShowLimitModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              Limite de exportações atingido
            </DialogTitle>
            <DialogDescription className="pt-2">
              Você já usou sua exportação gratuita deste mês. Faça upgrade para o Premium e tenha exportações ilimitadas!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-4">
              <p className="font-semibold text-foreground mb-2">Premium inclui:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-primary" />
                  PDFs e imagens ilimitados
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Relatórios profissionais com seus dados
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Alertas DAS por WhatsApp
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Sem anúncios
                </li>
              </ul>
            </div>
            <Link href="/premium" className="block">
              <Button className="w-full">
                <Crown className="h-4 w-4 mr-2" />
                Ver Premium - R$ 14,90/mês
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
