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
  summaryBox: {
    backgroundColor: '#00D084',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  regimesGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  regimeCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
  },
  regimeCardRecommended: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: '#00D084',
  },
  regimeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  regimeName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  regimeBadge: {
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    color: '#64748B',
  },
  regimeBadgeRecommended: {
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#00D084',
    color: '#FFFFFF',
  },
  regimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  regimeLabel: {
    fontSize: 8,
    color: '#64748B',
  },
  regimeValue: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  regimeValueMain: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#00D084',
  },
  advantagesSection: {
    marginTop: 8,
  },
  advantagesTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 4,
  },
  disadvantagesTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
    marginTop: 6,
  },
  listItem: {
    fontSize: 7,
    color: '#64748B',
    marginBottom: 2,
  },
  inputsSection: {
    marginTop: 16,
    marginBottom: 16,
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
  disclaimer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    padding: 10,
    marginTop: 12,
  },
  disclaimerText: {
    fontSize: 8,
    color: '#92400E',
    lineHeight: 1.4,
  },
})

interface RegimeInfo {
  nome: string
  custoAnual: number
  custoMensal: number
  percentual: number
  vantagens: string[]
  desvantagens?: string[]
  recomendado: boolean
}

interface ComparadorTributarioPDFProps {
  inputs: {
    faturamentoAnual: number
    tipoAtividade: string
  }
  resultado: {
    faturamentoAnual: number
    mei: RegimeInfo | null
    simples: RegimeInfo
    lucroPresumido: RegimeInfo
    melhorOpcao: 'mei' | 'simples' | 'lucroPresumido'
  }
  userData?: PDFUserData
}

const tipoAtividadeLabels: Record<string, string> = {
  comercio: 'Comércio',
  servicos: 'Serviços',
  industria: 'Indústria',
}

export function ComparadorTributarioPDF({ inputs, resultado, userData }: ComparadorTributarioPDFProps) {
  const melhorNome = resultado.melhorOpcao === 'mei' ? 'MEI' :
                     resultado.melhorOpcao === 'simples' ? 'Simples Nacional' :
                     'Lucro Presumido'

  const RegimeCardPDF = ({ regime }: { regime: RegimeInfo }) => (
    <View style={regime.recomendado ? styles.regimeCardRecommended : styles.regimeCard}>
      <View style={styles.regimeHeader}>
        <Text style={styles.regimeName}>{regime.nome}</Text>
        <Text style={regime.recomendado ? styles.regimeBadgeRecommended : styles.regimeBadge}>
          {regime.percentual.toFixed(1)}%
        </Text>
      </View>

      <View style={styles.regimeRow}>
        <Text style={styles.regimeLabel}>Custo Mensal</Text>
        <Text style={styles.regimeValue}>{formatCurrency(regime.custoMensal)}</Text>
      </View>
      <View style={styles.regimeRow}>
        <Text style={styles.regimeLabel}>Custo Anual</Text>
        <Text style={regime.recomendado ? styles.regimeValueMain : styles.regimeValue}>
          {formatCurrency(regime.custoAnual)}
        </Text>
      </View>

      <View style={styles.advantagesSection}>
        <Text style={styles.advantagesTitle}>Vantagens:</Text>
        {regime.vantagens.slice(0, 3).map((v, i) => (
          <Text key={i} style={styles.listItem}>• {v}</Text>
        ))}
      </View>
    </View>
  )

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        {/* Header */}
        <PDFHeader documentType="Comparativo de Regimes Tributários" />

        {/* Identificação do Usuário/Empresa */}
        <PDFUserIdentification userData={userData} />

        {/* Title */}
        <View style={baseStyles.titleSection}>
          <Text style={baseStyles.title}>
            Análise Comparativa de Regimes Tributários
          </Text>
          <Text style={baseStyles.subtitle}>
            MEI vs Simples Nacional vs Lucro Presumido
          </Text>
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>
            Para faturamento de {formatCurrency(resultado.faturamentoAnual)}/ano
          </Text>
          <Text style={styles.summaryValue}>
            O regime mais vantajoso é: {melhorNome}
          </Text>
        </View>

        {/* Regimes Grid */}
        <View style={styles.regimesGrid}>
          {resultado.mei && <RegimeCardPDF regime={resultado.mei} />}
          <RegimeCardPDF regime={resultado.simples} />
          <RegimeCardPDF regime={resultado.lucroPresumido} />
        </View>

        {/* Inputs */}
        <View style={styles.inputsSection}>
          <Text style={styles.inputsTitle}>Dados utilizados na simulação</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Faturamento Anual</Text>
            <Text style={styles.inputValue}>{formatCurrency(inputs.faturamentoAnual)}</Text>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Tipo de Atividade</Text>
            <Text style={styles.inputValue}>{tipoAtividadeLabels[inputs.tipoAtividade] || inputs.tipoAtividade}</Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Importante: Este comparativo é uma estimativa simplificada. Os valores reais podem variar
            conforme a atividade específica, deduções aplicáveis, regime de tributação do ICMS/ISS,
            e outros fatores. Consulte um contador para uma análise detalhada antes de tomar decisões.
          </Text>
        </View>

        {/* Tips */}
        <View style={baseStyles.tipsSection}>
          <Text style={baseStyles.tipsTitle}>Considerações importantes</Text>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              MEI é ideal para faturamento até R$ 81.000/ano com atividades permitidas.
            </Text>
          </View>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Simples Nacional unifica tributos e é vantajoso para a maioria das PMEs.
            </Text>
          </View>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Lucro Presumido pode compensar para empresas com alta margem de lucro.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <PDFFooter />
      </Page>
    </Document>
  )
}
