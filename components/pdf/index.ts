// PDF Template Components
export {
  baseStyles,
  PDFHeader,
  PDFFooter,
  PDFUserIdentification,
  LogoIcon,
  formatCurrency,
  formatPercent,
} from './pdf-template'

// Types
export type { PDFUserData } from './pdf-template'

// Calculator PDF Reports
export { MargemLucroPDF } from './margem-lucro-pdf'
export { PrecoHoraPDF } from './preco-hora-pdf'
export { PrecificacaoPDF } from './precificacao-pdf'
export { FaturamentoPDF } from './faturamento-pdf'
export { FluxoCaixaPDF } from './fluxo-caixa-pdf'
export { DASPDF } from './das-pdf'
export { TransicaoMeiMePDF } from './transicao-mei-me-pdf'
export { PontoEquilibrioPDF } from './ponto-equilibrio-pdf'
export { ComparadorTributarioPDF } from './comparador-tributario-pdf'
export { RelatorioMensalPDF } from './relatorio-mensal-pdf'
export type { RelatorioMensalData, RegistroFaturamento as RelatorioRegistroFaturamento } from './relatorio-mensal-pdf'
