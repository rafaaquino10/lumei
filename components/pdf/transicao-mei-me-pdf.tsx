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
  alertBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 10,
    color: '#7F1D1D',
  },
  recommendationBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#00D084',
  },
  recommendationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 10,
    color: '#14532D',
  },
  comparisonGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  comparisonCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  comparisonBadge: {
    fontSize: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  comparisonLabel: {
    fontSize: 9,
    color: '#64748B',
  },
  comparisonValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  economyBox: {
    backgroundColor: '#00D084',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  economyLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  economyValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  economySubtext: {
    fontSize: 9,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
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

interface TransicaoMeiMePDFProps {
  inputs: {
    faturamentoMensal: number
    tipoAtividade: string
  }
  resultado: {
    faturamentoAnual: number
    custoMEI: number
    custoME: number
    economia: number
    percentualMEI: number
    percentualME: number
    recomendacao: 'mei' | 'me' | 'limite'
    faturamentoIdeal: number
  }
  userData?: PDFUserData
}

const tipoAtividadeLabels: Record<string, string> = {
  comercio: 'Comércio (Anexo I)',
  servicos: 'Serviços (Anexo III)',
  industria: 'Indústria (Anexo II)',
}

export function TransicaoMeiMePDF({ inputs, resultado, userData }: TransicaoMeiMePDFProps) {
  const isLimite = resultado.recomendacao === 'limite'
  const isMEI = resultado.recomendacao === 'mei'

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        {/* Header */}
        <PDFHeader documentType="Simulação de Transição MEI → ME" />

        {/* Identificação do Usuário/Empresa */}
        <PDFUserIdentification userData={userData} />

        {/* Title */}
        <View style={baseStyles.titleSection}>
          <Text style={baseStyles.title}>
            Análise de Transição MEI → Microempresa
          </Text>
          <Text style={baseStyles.subtitle}>
            Comparativo tributário entre MEI e Simples Nacional (ME)
          </Text>
        </View>

        {/* Alerta de Limite (se aplicável) */}
        {isLimite && (
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Atenção: Limite MEI Ultrapassado</Text>
            <Text style={styles.alertText}>
              Com faturamento de {formatCurrency(resultado.faturamentoAnual)}/ano, você ultrapassa
              o limite de R$ 81.000 do MEI e precisa migrar para ME.
            </Text>
          </View>
        )}

        {/* Recomendação */}
        <View style={[styles.recommendationBox, !isMEI && !isLimite ? { backgroundColor: '#EFF6FF', borderLeftColor: '#3B82F6' } : {}]}>
          <Text style={[styles.recommendationTitle, !isMEI && !isLimite ? { color: '#1E40AF' } : {}]}>
            {isMEI ? 'Recomendação: Permanecer no MEI' :
             isLimite ? 'Migração obrigatória para ME' :
             'Recomendação: Considerar migração para ME'}
          </Text>
          <Text style={[styles.recommendationText, !isMEI && !isLimite ? { color: '#1E3A8A' } : {}]}>
            {isMEI ? `Você economiza ${formatCurrency(resultado.economia)}/ano permanecendo no MEI.` :
             isLimite ? 'A migração é necessária por exceder o limite anual do MEI.' :
             `Você economizaria ${formatCurrency(Math.abs(resultado.economia))}/ano migrando para ME.`}
          </Text>
        </View>

        {/* Economia */}
        <View style={[styles.economyBox, !isMEI ? { backgroundColor: '#3B82F6' } : {}]}>
          <Text style={styles.economyLabel}>
            {isMEI ? 'ECONOMIA ANUAL PERMANECENDO NO MEI' : 'ECONOMIA ANUAL MIGRANDO PARA ME'}
          </Text>
          <Text style={styles.economyValue}>
            {formatCurrency(Math.abs(resultado.economia))}
          </Text>
          <Text style={styles.economySubtext}>
            {isMEI ? 'O MEI é mais vantajoso no seu faturamento atual' : 'O ME é mais vantajoso no seu faturamento atual'}
          </Text>
        </View>

        {/* Comparativo */}
        <View style={styles.comparisonGrid}>
          {/* MEI */}
          <View style={styles.comparisonCard}>
            <View style={styles.comparisonHeader}>
              <Text style={styles.comparisonTitle}>MEI</Text>
              <Text style={[styles.comparisonBadge, { backgroundColor: '#DCFCE7', color: '#166534' }]}>
                {formatPercent(resultado.percentualMEI)}
              </Text>
            </View>
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>DAS Mensal</Text>
              <Text style={styles.comparisonValue}>{formatCurrency(resultado.custoMEI / 12)}</Text>
            </View>
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>DAS Anual</Text>
              <Text style={styles.comparisonValue}>{formatCurrency(resultado.custoMEI)}</Text>
            </View>
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>Limite Anual</Text>
              <Text style={styles.comparisonValue}>R$ 81.000</Text>
            </View>
          </View>

          {/* ME */}
          <View style={styles.comparisonCard}>
            <View style={styles.comparisonHeader}>
              <Text style={styles.comparisonTitle}>ME (Simples)</Text>
              <Text style={[styles.comparisonBadge, { backgroundColor: '#DBEAFE', color: '#1E40AF' }]}>
                {formatPercent(resultado.percentualME)}
              </Text>
            </View>
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>Imposto Mensal*</Text>
              <Text style={styles.comparisonValue}>{formatCurrency(resultado.custoME / 12)}</Text>
            </View>
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>Imposto Anual*</Text>
              <Text style={styles.comparisonValue}>{formatCurrency(resultado.custoME)}</Text>
            </View>
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>Limite Anual</Text>
              <Text style={styles.comparisonValue}>R$ 4.800.000</Text>
            </View>
          </View>
        </View>

        {/* Dados utilizados */}
        <View style={styles.inputsSection}>
          <Text style={styles.inputsTitle}>Dados utilizados na simulação</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Faturamento Mensal</Text>
            <Text style={styles.inputValue}>{formatCurrency(inputs.faturamentoMensal)}</Text>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Faturamento Anual</Text>
            <Text style={styles.inputValue}>{formatCurrency(resultado.faturamentoAnual)}</Text>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Tipo de Atividade</Text>
            <Text style={styles.inputValue}>{tipoAtividadeLabels[inputs.tipoAtividade] || inputs.tipoAtividade}</Text>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Ponto de Virada</Text>
          <Text style={styles.infoText}>
            Para atividades de {inputs.tipoAtividade}, o MEI deixa de ser vantajoso quando o
            faturamento anual ultrapassa aproximadamente {formatCurrency(resultado.faturamentoIdeal)}.
            Acima desse valor, considere migrar para ME (Simples Nacional).
          </Text>
        </View>

        {/* Tips */}
        <View style={baseStyles.tipsSection}>
          <Text style={baseStyles.tipsTitle}>Considerações importantes</Text>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              * Valores do Simples Nacional são estimativas. Consulte um contador.
            </Text>
          </View>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              ME exige contador obrigatório e tem mais obrigações acessórias.
            </Text>
          </View>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Considere custos adicionais: contador (~R$200-500/mês) e sistema ERP.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <PDFFooter />
      </Page>
    </Document>
  )
}
