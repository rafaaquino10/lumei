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

const styles = StyleSheet.create({
  ...baseStyles,
  resultMain: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  resultLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00D084',
  },
  resultStatus: {
    fontSize: 11,
    color: '#166534',
    marginTop: 8,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  inputsSection: {
    marginTop: 20,
  },
  inputsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  inputLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  inputValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  formulaBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 6,
    padding: 12,
    marginTop: 16,
  },
  formulaTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0369A1',
    marginBottom: 6,
  },
  formulaText: {
    fontSize: 9,
    color: '#0C4A6E',
    fontFamily: 'Courier',
  },
})

interface MargemLucroPDFProps {
  inputs: {
    precoVenda: number
    custoTotal: number
  }
  resultado: {
    margemBruta: number
    lucroBruto: number
    margemLiquida?: number
    markup: number
  }
  titulo?: string
  userData?: PDFUserData
}

export function MargemLucroPDF({ inputs, resultado, titulo, userData }: MargemLucroPDFProps) {
  const isPositive = resultado.margemBruta > 0

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        {/* Header */}
        <PDFHeader documentType="Calculo de Margem de Lucro" />

        {/* Identificacao do Usuario/Empresa */}
        <PDFUserIdentification userData={userData} />

        {/* Title */}
        <View style={baseStyles.titleSection}>
          <Text style={baseStyles.title}>
            {titulo || 'Analise de Margem de Lucro'}
          </Text>
          <Text style={baseStyles.subtitle}>
            Veja quanto voce esta lucrando em cada venda e se o preco esta adequado.
          </Text>
        </View>

        {/* Main Result */}
        <View style={baseStyles.cardHighlight}>
          <View style={styles.resultMain}>
            <Text style={styles.resultLabel}>MARGEM DE LUCRO BRUTA</Text>
            <Text style={styles.resultValue}>
              {formatPercent(resultado.margemBruta)}
            </Text>
            <Text style={[styles.resultStatus, !isPositive ? { backgroundColor: '#FEE2E2', color: '#991B1B' } : {}]}>
              {isPositive ? 'Lucro positivo' : 'Prejuizo identificado'}
            </Text>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Lucro por Venda</Text>
            <Text style={[styles.metricValue, { color: isPositive ? '#00D084' : '#EF4444' }]}>
              {formatCurrency(resultado.lucroBruto)}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Markup</Text>
            <Text style={styles.metricValue}>{resultado.markup.toFixed(2)}x</Text>
          </View>
          {resultado.margemLiquida !== undefined && (
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Margem Liquida</Text>
              <Text style={styles.metricValue}>{formatPercent(resultado.margemLiquida)}</Text>
            </View>
          )}
        </View>

        {/* Inputs Section */}
        <View style={styles.inputsSection}>
          <Text style={styles.inputsTitle}>Dados utilizados no calculo</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Preco de Venda</Text>
            <Text style={styles.inputValue}>{formatCurrency(inputs.precoVenda)}</Text>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Custo Total</Text>
            <Text style={styles.inputValue}>{formatCurrency(inputs.custoTotal)}</Text>
          </View>
        </View>

        {/* Formula Box */}
        <View style={styles.formulaBox}>
          <Text style={styles.formulaTitle}>Formula utilizada</Text>
          <Text style={styles.formulaText}>
            Margem = (Preco - Custo) / Preco x 100
          </Text>
          <Text style={styles.formulaText}>
            Margem = ({formatCurrency(inputs.precoVenda)} - {formatCurrency(inputs.custoTotal)}) / {formatCurrency(inputs.precoVenda)} x 100
          </Text>
        </View>

        {/* Tips */}
        <View style={baseStyles.tipsSection}>
          <Text style={baseStyles.tipsTitle}>Dicas para melhorar sua margem</Text>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Margem ideal para MEI de servicos: 40-60%. Comercio: 25-40%.
            </Text>
          </View>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Revise seus custos fixos mensalmente para identificar economia.
            </Text>
          </View>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Considere aumentar o preco se sua margem estiver abaixo de 20%.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <PDFFooter />
      </Page>
    </Document>
  )
}
