'use client'

import { useState, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Download, FileText, Image, Loader2, Share2 } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'

// Funcao para gerar nome do arquivo com data e hora
function generateFilename(calculatorName: string, extension: string): string {
  const now = new Date()
  const date = now.toLocaleDateString('pt-BR').replace(/\//g, '-')
  const time = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).replace(':', 'h')

  return `${calculatorName}_${date}_${time}.${extension}`
}

// Funcao para converter PDF em imagem PNG
async function pdfToImage(pdfBlob: Blob): Promise<string> {
  // Importar pdfjs-dist dinamicamente
  const pdfjsLib = await import('pdfjs-dist')

  // Usar worker da pasta public
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

  // Carregar o PDF
  const arrayBuffer = await pdfBlob.arrayBuffer()
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
  const pdfDoc = await loadingTask.promise

  // Pegar a primeira pagina
  const page = await pdfDoc.getPage(1)

  // Configurar escala para alta qualidade (2x)
  const scale = 2
  const viewport = page.getViewport({ scale })

  // Criar canvas
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  canvas.width = viewport.width
  canvas.height = viewport.height

  // Renderizar pagina no canvas
  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise

  // Retornar como data URL
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

  const handlePDFExport = async () => {
    setIsExporting(true)

    try {
      const blob = await pdf(pdfDocument as any).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = generateFilename(calculatorName, 'pdf')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleImageExport = async () => {
    setIsExporting(true)

    try {
      // Gerar o PDF primeiro
      const pdfBlob = await pdf(pdfDocument as any).toBlob()

      // Converter PDF para imagem
      const dataUrl = await pdfToImage(pdfBlob)

      const link = document.createElement('a')
      link.href = dataUrl
      link.download = generateFilename(calculatorName, 'png')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Erro ao gerar imagem:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    setIsExporting(true)

    try {
      // Gerar o PDF primeiro
      const pdfBlob = await pdf(pdfDocument as any).toBlob()

      // Converter PDF para imagem
      const dataUrl = await pdfToImage(pdfBlob)

      // Converter data URL para Blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const filename = generateFilename(calculatorName, 'png')
      const file = new File([blob], filename, { type: 'image/png' })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Calcula MEI - Resultado',
          text: 'Veja o resultado do meu calculo no Calcula MEI!',
        })
      } else {
        // Fallback: download da imagem
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
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
  )
}
