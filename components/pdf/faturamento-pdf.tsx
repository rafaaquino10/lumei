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
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusSeguro: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },
  statusAtencao: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  statusPerigo: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
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
    padding: 16,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  progressSection: {
    marginTop: 20,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  progressBar: {
    height: 24,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    fontSize: 9,
    color: '#64748B',
  },
  monthsSection: {
    marginTop: 20,
  },
  monthsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthCard: {
    width: '23%',
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  monthName: {
    fontSize: 8,
    color: '#64748B',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  monthValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  infoBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 6,
    padding: 12,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0369A1',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 9,
    color: '#0C4A6E',
    lineHeight: 1.4,
  },
})

const meses = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
]

interface FaturamentoPDFProps {
  inputs: {
    valores: number[]
    ano?: number
  }
  resultado: {
    total: number
    media: number
    limite: number
    percentual: number
    status: 'seguro' | 'atencao' | 'perigo'
  }
  titulo?: string
  userData?: PDFUserData
}

export function FaturamentoPDF({ inputs, resultado, titulo, userData }: FaturamentoPDFProps) {
  const ano = inputs.ano || new Date().getFullYear()
  const faltaParaLimite = resultado.limite - resultado.total
  const isOverLimit = resultado.total > resultado.limite

  const getStatusStyle = () => {
    switch (resultado.status) {
      case 'perigo': return styles.statusPerigo
      case 'atencao': return styles.statusAtencao
      default: return styles.statusSeguro
    }
  }

  const getStatusText = () => {
    switch (resultado.status) {
      case 'perigo': return 'Limite ultrapassado - Risco de desenquadramento'
      case 'atencao': return 'Atencao - Proximo do limite anual'
      default: return 'Dentro do limite - Situacao regular'
    }
  }

  const getProgressColor = () => {
    if (resultado.percentual > 100) return '#EF4444'
    if (resultado.percentual > 80) return '#F59E0B'
    return '#00D084'
  }

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        {/* Header */}
        <PDFHeader documentType="Simulador de Faturamento MEI" />

        {/* Identificacao do Usuario/Empresa */}
        <PDFUserIdentification userData={userData} />

        {/* Title */}
        <View style={baseStyles.titleSection}>
          <Text style={baseStyles.title}>
            {titulo || `Faturamento Anual ${ano}`}
          </Text>
          <Text style={baseStyles.subtitle}>
            Acompanhe seu faturamento e mantenha-se dentro do limite do MEI.
          </Text>
        </View>

        {/* Main Result */}
        <View style={baseStyles.cardHighlight}>
          <View style={styles.resultMain}>
            <Text style={styles.resultLabel}>FATURAMENTO TOTAL {ano}</Text>
            <Text style={[styles.resultValue, isOverLimit ? { color: '#EF4444' } : {}]}>
              {formatCurrency(resultado.total)}
            </Text>
            <Text style={[styles.resultStatus, getStatusStyle()]}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Media Mensal</Text>
            <Text style={styles.metricValue}>
              {formatCurrency(resultado.media)}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Limite MEI</Text>
            <Text style={styles.metricValue}>
              {formatCurrency(resultado.limite)}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>
              {isOverLimit ? 'Excedente' : 'Disponivel'}
            </Text>
            <Text style={[styles.metricValue, isOverLimit ? { color: '#EF4444' } : {}]}>
              {formatCurrency(Math.abs(faltaParaLimite))}
            </Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Utilizacao do limite anual</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(resultado.percentual, 100)}%`,
                  backgroundColor: getProgressColor(),
                }
              ]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabelText}>0%</Text>
            <Text style={[styles.progressLabelText, { fontWeight: 'bold' }]}>
              {formatPercent(resultado.percentual)} utilizado
            </Text>
            <Text style={styles.progressLabelText}>100%</Text>
          </View>
        </View>

        {/* Monthly Breakdown */}
        <View style={styles.monthsSection}>
          <Text style={styles.monthsTitle}>Faturamento por mes</Text>
          <View style={styles.monthsGrid}>
            {meses.map((mes, index) => (
              <View key={mes} style={styles.monthCard}>
                <Text style={styles.monthName}>{mes}</Text>
                <Text style={styles.monthValue}>
                  {inputs.valores[index] > 0
                    ? formatCurrency(inputs.valores[index])
                    : '-'
                  }
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Regras do limite MEI</Text>
          <Text style={styles.infoText}>
            O limite anual do MEI e de R$ 81.000,00 (media de R$ 6.750/mes).
            Ultrapassar em ate 20% (R$ 97.200) implica em pagar diferenca de impostos.
            Acima de 20%, ocorre desenquadramento automatico.
          </Text>
        </View>

        {/* Tips */}
        <View style={baseStyles.tipsSection}>
          <Text style={baseStyles.tipsTitle}>Dicas para controle do faturamento</Text>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Registre todas as vendas, mesmo as pequenas - a Receita cruza dados.
            </Text>
          </View>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Se proximo do limite, avalie migrar para ME antes do fim do ano.
            </Text>
          </View>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Mantenha reserva para impostos caso ultrapasse o limite.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <PDFFooter />
      </Page>
    </Document>
  )
}
