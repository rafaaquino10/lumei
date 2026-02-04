'use client'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import {
  baseStyles,
  PDFHeader,
  PDFFooter,
  PDFUserIdentification,
  formatCurrency,
  formatPercent,
  PDFUserData,
} from './pdf-template'

const colors = {
  primary: '#00D084',
  text: '#0F172A',
  textSecondary: '#64748B',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
}

const styles = StyleSheet.create({
  ...baseStyles,
  resultCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  detailSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  detailLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
  },
  analysisCard: {
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  analysisTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  analysisText: {
    fontSize: 9,
    color: colors.textSecondary,
    lineHeight: 1.5,
  },
  formulaSection: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  formulaTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 6,
  },
  formulaText: {
    fontSize: 9,
    color: '#1E40AF',
    marginBottom: 4,
  },
})

interface ROIResult {
  investimentoInicial: number
  retornoTotal: number
  lucroLiquido: number
  roi: number
  paybackMeses: number
  retornoMensal: number
  multiplicador: string
}

interface ROIPDFProps {
  data: {
    investimentoInicial: number
    retornoMensal: number
    custoMensal: number
    periodoMeses: number
    resultado: ROIResult
    userData?: PDFUserData
  }
}

export function ROIPDF({ data }: ROIPDFProps) {
  const { investimentoInicial, retornoMensal, custoMensal, periodoMeses, resultado, userData } = data

  const getROIStatus = (roi: number) => {
    if (roi >= 100) return { label: 'Excelente', bgColor: '#DCFCE7', textColor: '#166534' }
    if (roi >= 50) return { label: 'Bom', bgColor: '#DBEAFE', textColor: '#1E40AF' }
    if (roi >= 20) return { label: 'Moderado', bgColor: '#FEF3C7', textColor: '#92400E' }
    if (roi >= 0) return { label: 'Baixo', bgColor: '#FFEDD5', textColor: '#9A3412' }
    return { label: 'Negativo', bgColor: '#FEE2E2', textColor: '#991B1B' }
  }

  const status = getROIStatus(resultado.roi)

  const getAnalysis = () => {
    if (resultado.roi >= 100) return 'Excelente retorno! Esse investimento tem potencial para mais que dobrar seu dinheiro no período analisado.'
    if (resultado.roi >= 50) return 'Bom retorno! Esse investimento tem potencial para um ganho significativo.'
    if (resultado.roi >= 20) return 'Retorno moderado. Considere se existem alternativas com melhor custo-benefício.'
    if (resultado.roi >= 0) return 'Retorno baixo. O investimento é viável, mas avalie se vale a pena pelo esforço.'
    return 'Retorno negativo. Esse investimento resultaria em prejuízo. Revise os números ou busque alternativas.'
  }

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <PDFHeader documentType="Cálculo de ROI" />

        <PDFUserIdentification userData={userData} />

        {/* Título */}
        <View style={baseStyles.titleSection}>
          <Text style={baseStyles.title}>Retorno sobre Investimento (ROI)</Text>
          <Text style={baseStyles.subtitle}>
            Análise completa do retorno esperado para seu investimento
          </Text>
        </View>

        {/* Resultado Principal */}
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Retorno sobre Investimento</Text>
          <Text style={[styles.resultValue, { color: resultado.roi >= 0 ? colors.success : colors.danger }]}>
            {resultado.roi >= 0 ? '+' : ''}{resultado.roi.toFixed(1)}%
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
            <Text style={[styles.statusText, { color: status.textColor }]}>
              {status.label}
            </Text>
          </View>
        </View>

        {/* Métricas */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Lucro Líquido</Text>
            <Text style={[styles.metricValue, { color: resultado.lucroLiquido >= 0 ? colors.success : colors.danger }]}>
              {formatCurrency(resultado.lucroLiquido)}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Payback</Text>
            <Text style={styles.metricValue}>
              {resultado.paybackMeses > 100 ? '100+' : resultado.paybackMeses} meses
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Multiplicador</Text>
            <Text style={styles.metricValue}>
              {resultado.multiplicador}x
            </Text>
          </View>
        </View>

        {/* Detalhamento */}
        <View style={styles.detailSection}>
          <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.text, marginBottom: 10 }}>
            Dados do Cálculo
          </Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Investimento inicial:</Text>
            <Text style={styles.detailValue}>{formatCurrency(investimentoInicial)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Receita mensal esperada:</Text>
            <Text style={styles.detailValue}>{formatCurrency(retornoMensal)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Custos mensais:</Text>
            <Text style={styles.detailValue}>{formatCurrency(custoMensal)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Lucro mensal:</Text>
            <Text style={[styles.detailValue, { color: resultado.retornoMensal >= 0 ? colors.success : colors.danger }]}>
              {formatCurrency(resultado.retornoMensal)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Período analisado:</Text>
            <Text style={styles.detailValue}>{periodoMeses} meses</Text>
          </View>
          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.detailLabel}>Retorno total no período:</Text>
            <Text style={styles.detailValue}>{formatCurrency(resultado.retornoTotal)}</Text>
          </View>
        </View>

        {/* Análise */}
        <View style={[styles.analysisCard, { backgroundColor: status.bgColor }]}>
          <Text style={[styles.analysisTitle, { color: status.textColor }]}>Análise</Text>
          <Text style={[styles.analysisText, { color: status.textColor }]}>
            {getAnalysis()}
          </Text>
          {resultado.paybackMeses <= periodoMeses && (
            <Text style={[styles.analysisText, { color: status.textColor, marginTop: 6 }]}>
              Você recupera o investimento em {resultado.paybackMeses} {resultado.paybackMeses === 1 ? 'mês' : 'meses'},
              o que representa {((resultado.paybackMeses / periodoMeses) * 100).toFixed(0)}% do período analisado.
            </Text>
          )}
        </View>

        {/* Fórmula */}
        <View style={styles.formulaSection}>
          <Text style={styles.formulaTitle}>Como calculamos</Text>
          <Text style={styles.formulaText}>ROI = ((Lucro Líquido / Investimento) x 100)</Text>
          <Text style={styles.formulaText}>Lucro Líquido = Retorno Total - Investimento Inicial</Text>
          <Text style={styles.formulaText}>Payback = Investimento / Lucro Mensal</Text>
        </View>

        <PDFFooter />
      </Page>
    </Document>
  )
}
