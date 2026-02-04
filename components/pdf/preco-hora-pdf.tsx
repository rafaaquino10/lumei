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
  resultUnit: {
    fontSize: 18,
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
  breakdownSection: {
    marginTop: 20,
  },
  breakdownTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  breakdownItemLabel: {
    fontSize: 10,
    color: '#64748B',
    flex: 1,
  },
  breakdownItemValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  breakdownItemHighlight: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#00D084',
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
    marginBottom: 2,
  },
})

interface PrecoHoraPDFProps {
  inputs: {
    salarioDesejado: number
    custosFixos: number
    horasTrabalhadasMes: number
    diasFeriasPorAno: number
    margemLucro: number
  }
  resultado: {
    precoHoraBruto: number
    precoHoraFinal: number
    fatorFerias: number
    receitaNecessaria: number
    receitaMensal: number
  }
  titulo?: string
  userData?: PDFUserData
}

export function PrecoHoraPDF({ inputs, resultado, titulo, userData }: PrecoHoraPDFProps) {
  const horasAnoSemFerias = inputs.horasTrabalhadasMes * 12
  const horasFeriasAno = (inputs.diasFeriasPorAno / 30) * inputs.horasTrabalhadasMes
  const horasEfetivasAno = horasAnoSemFerias - horasFeriasAno

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        {/* Header */}
        <PDFHeader documentType="Calculo de Preco por Hora" />

        {/* Identificacao do Usuario/Empresa */}
        <PDFUserIdentification userData={userData} />

        {/* Title */}
        <View style={baseStyles.titleSection}>
          <Text style={baseStyles.title}>
            {titulo || 'Seu Preco por Hora Ideal'}
          </Text>
          <Text style={baseStyles.subtitle}>
            Descubra quanto cobrar por hora considerando seus custos, ferias e margem de lucro.
          </Text>
        </View>

        {/* Main Result */}
        <View style={baseStyles.cardHighlight}>
          <View style={styles.resultMain}>
            <Text style={styles.resultLabel}>PRECO POR HORA RECOMENDADO</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.resultValue}>
                {formatCurrency(resultado.precoHoraFinal)}
              </Text>
              <Text style={styles.resultUnit}>/hora</Text>
            </View>
            <Text style={styles.resultStatus}>
              Inclui ferias + margem de {inputs.margemLucro}%
            </Text>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Receita Mensal</Text>
            <Text style={styles.metricValue}>
              {formatCurrency(resultado.receitaMensal)}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Preco Base (s/ margem)</Text>
            <Text style={styles.metricValue}>
              {formatCurrency(resultado.precoHoraBruto)}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Fator Ferias</Text>
            <Text style={styles.metricValue}>
              {resultado.fatorFerias.toFixed(2)}x
            </Text>
          </View>
        </View>

        {/* Inputs Section */}
        <View style={styles.inputsSection}>
          <Text style={styles.inputsTitle}>Dados utilizados no calculo</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Salario Liquido Desejado</Text>
            <Text style={styles.inputValue}>{formatCurrency(inputs.salarioDesejado)}/mes</Text>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Custos Fixos Mensais</Text>
            <Text style={styles.inputValue}>{formatCurrency(inputs.custosFixos)}</Text>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Horas Trabalhadas/Mes</Text>
            <Text style={styles.inputValue}>{inputs.horasTrabalhadasMes}h</Text>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Dias de Ferias/Ano</Text>
            <Text style={styles.inputValue}>{inputs.diasFeriasPorAno} dias</Text>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Margem de Lucro</Text>
            <Text style={styles.inputValue}>{formatPercent(inputs.margemLucro)}</Text>
          </View>
        </View>

        {/* Breakdown Section */}
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Como chegamos nesse valor</Text>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownItemLabel}>Necessidade mensal (salario + custos)</Text>
            <Text style={styles.breakdownItemValue}>
              {formatCurrency(inputs.salarioDesejado + inputs.custosFixos)}
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownItemLabel}>Receita anual necessaria</Text>
            <Text style={styles.breakdownItemValue}>
              {formatCurrency(resultado.receitaNecessaria)}
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownItemLabel}>Horas efetivas/ano (descontando ferias)</Text>
            <Text style={styles.breakdownItemValue}>
              {Math.round(horasEfetivasAno)}h
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownItemLabel}>Preco/hora base</Text>
            <Text style={styles.breakdownItemValue}>
              {formatCurrency(resultado.precoHoraBruto)}
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownItemLabel}>+ Margem de lucro ({inputs.margemLucro}%)</Text>
            <Text style={styles.breakdownItemHighlight}>
              {formatCurrency(resultado.precoHoraFinal)}
            </Text>
          </View>
        </View>

        {/* Formula Box */}
        <View style={styles.formulaBox}>
          <Text style={styles.formulaTitle}>Formula utilizada</Text>
          <Text style={styles.formulaText}>
            Preco/hora = (Salario + Custos) x 12 / Horas Efetivas/Ano x (1 + Margem%)
          </Text>
        </View>

        {/* Tips */}
        <View style={baseStyles.tipsSection}>
          <Text style={baseStyles.tipsTitle}>Dicas para aplicar seu preco</Text>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Use este valor como base, mas ajuste conforme a complexidade de cada projeto.
            </Text>
          </View>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Projetos urgentes podem ter adicional de 20-50% sobre o preco base.
            </Text>
          </View>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Revise seu preco a cada 6 meses considerando inflacao e novos custos.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <PDFFooter />
      </Page>
    </Document>
  )
}
