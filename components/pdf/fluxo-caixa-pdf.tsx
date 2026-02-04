import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import {
  baseStyles,
  PDFHeader,
  PDFFooter,
  PDFUserIdentification,
  formatCurrency,
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
  },
  resultPositive: {
    color: '#00D084',
  },
  resultNegative: {
    color: '#EF4444',
  },
  resultZerado: {
    color: '#64748B',
  },
  resultStatus: {
    fontSize: 11,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusPositivo: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },
  statusNegativo: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  statusZerado: {
    backgroundColor: '#F1F5F9',
    color: '#64748B',
  },
  flowSection: {
    marginTop: 20,
    marginBottom: 16,
  },
  flowTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  flowCard: {
    flexDirection: 'row',
    gap: 12,
  },
  flowItem: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
  },
  flowEntradas: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  flowSaidas: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  flowItemIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  flowItemLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  flowItemValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  flowEntradasValue: {
    color: '#166534',
  },
  flowSaidasValue: {
    color: '#991B1B',
  },
  calculoSection: {
    marginTop: 20,
  },
  calculoTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  calculoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  calculoItemLabel: {
    fontSize: 10,
    color: '#64748B',
    flex: 1,
  },
  calculoItemValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  calculoTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  calculoTotalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  calculoTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  analysisBox: {
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  analysisPositive: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  analysisNegative: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  analysisNeutral: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  analysisTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  analysisTitlePositive: {
    color: '#166534',
  },
  analysisTitleNegative: {
    color: '#991B1B',
  },
  analysisTitleNeutral: {
    color: '#64748B',
  },
  analysisText: {
    fontSize: 9,
    lineHeight: 1.4,
  },
  analysisTextPositive: {
    color: '#15803D',
  },
  analysisTextNegative: {
    color: '#B91C1C',
  },
  analysisTextNeutral: {
    color: '#475569',
  },
})

interface FluxoCaixaPDFProps {
  inputs: {
    entradas: number
    saidas: number
    periodo?: string
  }
  resultado: {
    saldo: number
    status: 'positivo' | 'negativo' | 'zerado'
  }
  titulo?: string
  userData?: PDFUserData
}

export function FluxoCaixaPDF({ inputs, resultado, titulo, userData }: FluxoCaixaPDFProps) {
  const periodo = inputs.periodo || new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const getValueStyle = () => {
    switch (resultado.status) {
      case 'positivo': return styles.resultPositive
      case 'negativo': return styles.resultNegative
      default: return styles.resultZerado
    }
  }

  const getStatusStyle = () => {
    switch (resultado.status) {
      case 'positivo': return styles.statusPositivo
      case 'negativo': return styles.statusNegativo
      default: return styles.statusZerado
    }
  }

  const getStatusText = () => {
    switch (resultado.status) {
      case 'positivo': return 'Fluxo de caixa positivo - Negocios saudaveis'
      case 'negativo': return 'Fluxo de caixa negativo - Atencao necessaria'
      default: return 'Fluxo de caixa zerado'
    }
  }

  const getAnalysisStyle = () => {
    switch (resultado.status) {
      case 'positivo': return styles.analysisPositive
      case 'negativo': return styles.analysisNegative
      default: return styles.analysisNeutral
    }
  }

  const getAnalysisTitleStyle = () => {
    switch (resultado.status) {
      case 'positivo': return styles.analysisTitlePositive
      case 'negativo': return styles.analysisTitleNegative
      default: return styles.analysisTitleNeutral
    }
  }

  const getAnalysisTextStyle = () => {
    switch (resultado.status) {
      case 'positivo': return styles.analysisTextPositive
      case 'negativo': return styles.analysisTextNegative
      default: return styles.analysisTextNeutral
    }
  }

  const getAnalysisContent = () => {
    if (resultado.status === 'positivo') {
      return `Parabens! Seu fluxo de caixa esta positivo em ${formatCurrency(resultado.saldo)}. Isso significa que suas entradas superam suas saidas, permitindo reinvestir no negocio ou criar reserva de emergencia.`
    } else if (resultado.status === 'negativo') {
      return `Alerta: Seu fluxo de caixa esta negativo em ${formatCurrency(Math.abs(resultado.saldo))}. Revise suas despesas e busque aumentar as entradas. Considere renegociar prazos com fornecedores.`
    }
    return 'Seu fluxo de caixa esta equilibrado. Entradas e saidas estao equivalentes. Busque aumentar sua margem para criar reservas.'
  }

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        {/* Header */}
        <PDFHeader documentType="Fluxo de Caixa" />

        {/* Identificacao do Usuario/Empresa */}
        <PDFUserIdentification userData={userData} />

        {/* Title */}
        <View style={baseStyles.titleSection}>
          <Text style={baseStyles.title}>
            {titulo || `Fluxo de Caixa - ${periodo}`}
          </Text>
          <Text style={baseStyles.subtitle}>
            Acompanhe o saldo entre suas entradas e saidas para manter a saude financeira.
          </Text>
        </View>

        {/* Main Result */}
        <View style={baseStyles.cardHighlight}>
          <View style={styles.resultMain}>
            <Text style={styles.resultLabel}>SALDO DO PERIODO</Text>
            <Text style={[styles.resultValue, getValueStyle()]}>
              {resultado.status === 'negativo' ? '-' : ''}{formatCurrency(Math.abs(resultado.saldo))}
            </Text>
            <Text style={[styles.resultStatus, getStatusStyle()]}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        {/* Flow Cards */}
        <View style={styles.flowSection}>
          <Text style={styles.flowTitle}>Movimentacao do periodo</Text>
          <View style={styles.flowCard}>
            <View style={[styles.flowItem, styles.flowEntradas]}>
              <Text style={styles.flowItemIcon}>+</Text>
              <Text style={styles.flowItemLabel}>Entradas</Text>
              <Text style={[styles.flowItemValue, styles.flowEntradasValue]}>
                {formatCurrency(inputs.entradas)}
              </Text>
            </View>
            <View style={[styles.flowItem, styles.flowSaidas]}>
              <Text style={styles.flowItemIcon}>-</Text>
              <Text style={styles.flowItemLabel}>Saidas</Text>
              <Text style={[styles.flowItemValue, styles.flowSaidasValue]}>
                {formatCurrency(inputs.saidas)}
              </Text>
            </View>
          </View>
        </View>

        {/* Calculation Breakdown */}
        <View style={styles.calculoSection}>
          <Text style={styles.calculoTitle}>Detalhamento do calculo</Text>
          <View style={styles.calculoItem}>
            <Text style={styles.calculoItemLabel}>Total de entradas</Text>
            <Text style={[styles.calculoItemValue, { color: '#166534' }]}>
              + {formatCurrency(inputs.entradas)}
            </Text>
          </View>
          <View style={styles.calculoItem}>
            <Text style={styles.calculoItemLabel}>Total de saidas</Text>
            <Text style={[styles.calculoItemValue, { color: '#991B1B' }]}>
              - {formatCurrency(inputs.saidas)}
            </Text>
          </View>
          <View style={styles.calculoTotal}>
            <Text style={styles.calculoTotalLabel}>Saldo final</Text>
            <Text style={[styles.calculoTotalValue, getValueStyle()]}>
              {resultado.status === 'negativo' ? '-' : ''}{formatCurrency(Math.abs(resultado.saldo))}
            </Text>
          </View>
        </View>

        {/* Analysis Box */}
        <View style={[styles.analysisBox, getAnalysisStyle()]}>
          <Text style={[styles.analysisTitle, getAnalysisTitleStyle()]}>
            Analise do fluxo de caixa
          </Text>
          <Text style={[styles.analysisText, getAnalysisTextStyle()]}>
            {getAnalysisContent()}
          </Text>
        </View>

        {/* Tips */}
        <View style={baseStyles.tipsSection}>
          <Text style={baseStyles.tipsTitle}>Dicas para melhorar seu fluxo de caixa</Text>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Registre todas as entradas e saidas diariamente para maior controle.
            </Text>
          </View>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Mantenha uma reserva de 3 a 6 meses de despesas fixas.
            </Text>
          </View>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Negocie prazos maiores com fornecedores e menores com clientes.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <PDFFooter />
      </Page>
    </Document>
  )
}
