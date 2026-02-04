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
    fontSize: 42,
    fontWeight: 'bold',
    color: '#00D084',
  },
  resultSubvalue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 4,
  },
  resultHint: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  statusBox: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  statusPositive: {
    backgroundColor: '#DCFCE7',
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  statusNegative: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  statusTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
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
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  metricSubtext: {
    fontSize: 8,
    color: '#00D084',
    marginTop: 2,
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

interface PontoEquilibrioPDFProps {
  inputs: {
    custoFixo: number
    custoVariavel: number
    precoVenda: number
    vendasAtuais: number
  }
  resultado: {
    pontoEquilibrioUnidades: number
    pontoEquilibrioValor: number
    margemContribuicao: number
    margemContribuicaoPercent: number
    lucroAtual: number
    unidadesParaLucro: number
  }
  userData?: PDFUserData
}

export function PontoEquilibrioPDF({ inputs, resultado, userData }: PontoEquilibrioPDFProps) {
  const isAboveBreakeven = inputs.vendasAtuais > resultado.pontoEquilibrioUnidades
  const formatNumber = (value: number) => Math.round(value).toLocaleString('pt-BR')

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        {/* Header */}
        <PDFHeader documentType="Cálculo de Ponto de Equilíbrio" />

        {/* Identificação do Usuário/Empresa */}
        <PDFUserIdentification userData={userData} />

        {/* Title */}
        <View style={baseStyles.titleSection}>
          <Text style={baseStyles.title}>
            Análise de Ponto de Equilíbrio
          </Text>
          <Text style={baseStyles.subtitle}>
            Quantidade mínima de vendas para cobrir todos os custos
          </Text>
        </View>

        {/* Main Result */}
        <View style={baseStyles.cardHighlight}>
          <View style={styles.resultMain}>
            <Text style={styles.resultLabel}>PONTO DE EQUILÍBRIO</Text>
            <Text style={styles.resultValue}>
              {formatNumber(resultado.pontoEquilibrioUnidades)} un.
            </Text>
            <Text style={styles.resultSubvalue}>
              {formatCurrency(resultado.pontoEquilibrioValor)}/mês
            </Text>
            <Text style={styles.resultHint}>
              Vendendo acima disso, você começa a ter lucro
            </Text>
          </View>
        </View>

        {/* Status (se informou vendas atuais) */}
        {inputs.vendasAtuais > 0 && (
          <View style={[styles.statusBox, isAboveBreakeven ? styles.statusPositive : styles.statusNegative]}>
            <Text style={[styles.statusTitle, { color: isAboveBreakeven ? '#166534' : '#92400E' }]}>
              {isAboveBreakeven
                ? 'Você está acima do ponto de equilíbrio!'
                : 'Atenção: Abaixo do ponto de equilíbrio'}
            </Text>
            <Text style={[styles.statusText, { color: isAboveBreakeven ? '#14532D' : '#78350F' }]}>
              {isAboveBreakeven
                ? `Seu lucro atual é de ${formatCurrency(resultado.lucroAtual)}/mês`
                : `Faltam ${formatNumber(resultado.unidadesParaLucro)} unidades para começar a lucrar`}
            </Text>
          </View>
        )}

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Margem de Contribuição</Text>
            <Text style={styles.metricValue}>{formatCurrency(resultado.margemContribuicao)}</Text>
            <Text style={styles.metricSubtext}>{resultado.margemContribuicaoPercent.toFixed(1)}% do preço</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Receita Mínima</Text>
            <Text style={styles.metricValue}>{formatCurrency(resultado.pontoEquilibrioValor)}</Text>
            <Text style={styles.metricSubtext}>por mês</Text>
          </View>
        </View>

        {/* Inputs Section */}
        <View style={styles.inputsSection}>
          <Text style={styles.inputsTitle}>Dados utilizados no cálculo</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Custos Fixos Mensais</Text>
            <Text style={styles.inputValue}>{formatCurrency(inputs.custoFixo)}</Text>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Custo Variável por Unidade</Text>
            <Text style={styles.inputValue}>{formatCurrency(inputs.custoVariavel)}</Text>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Preço de Venda</Text>
            <Text style={styles.inputValue}>{formatCurrency(inputs.precoVenda)}</Text>
          </View>
          {inputs.vendasAtuais > 0 && (
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Vendas Atuais/Mês</Text>
              <Text style={styles.inputValue}>{formatNumber(inputs.vendasAtuais)} unidades</Text>
            </View>
          )}
        </View>

        {/* Formula Box */}
        <View style={styles.formulaBox}>
          <Text style={styles.formulaTitle}>Fórmula utilizada</Text>
          <Text style={styles.formulaText}>
            PE = Custos Fixos ÷ Margem de Contribuição
          </Text>
          <Text style={styles.formulaText}>
            PE = Custos Fixos ÷ (Preço de Venda - Custo Variável)
          </Text>
          <Text style={styles.formulaText}>
            PE = {formatCurrency(inputs.custoFixo)} ÷ {formatCurrency(resultado.margemContribuicao)} = {formatNumber(resultado.pontoEquilibrioUnidades)} unidades
          </Text>
        </View>

        {/* Tips */}
        <View style={baseStyles.tipsSection}>
          <Text style={baseStyles.tipsTitle}>Dicas para melhorar seu ponto de equilíbrio</Text>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Reduza custos fixos: renegocie aluguel, reveja assinaturas desnecessárias.
            </Text>
          </View>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Aumente a margem: negocie com fornecedores ou ajuste o preço de venda.
            </Text>
          </View>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Quanto menor o PE, mais rápido você começa a lucrar.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <PDFFooter />
      </Page>
    </Document>
  )
}
