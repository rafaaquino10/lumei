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

// Cores
const colors = {
  primary: '#00D084',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  surface: '#F8FAFC',
  surfaceAlt: '#F0FDF4',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
}

const styles = StyleSheet.create({
  ...baseStyles,
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryCardHighlight: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    padding: 14,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  summaryLabel: {
    fontSize: 9,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  summaryValueGreen: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.success,
  },
  summarySubtext: {
    fontSize: 8,
    color: colors.textSecondary,
    marginTop: 4,
  },
  chartSection: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  chartContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  barLabel: {
    width: 30,
    fontSize: 8,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  barContainer: {
    flex: 1,
    height: 16,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  barValue: {
    width: 65,
    fontSize: 8,
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  statusSection: {
    marginBottom: 20,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    gap: 12,
  },
  statusOk: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  statusWarning: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusDanger: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIconOk: {
    backgroundColor: colors.success,
  },
  statusIconWarning: {
    backgroundColor: colors.warning,
  },
  statusIconDanger: {
    backgroundColor: colors.danger,
  },
  statusIconText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  statusDescription: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 6,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 8,
    color: '#64748B',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  tipsCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 5,
  },
  tipBullet: {
    fontSize: 10,
    color: colors.primary,
  },
  tipText: {
    fontSize: 9,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 1.4,
  },
})

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const MESES_CURTOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export interface RegistroFaturamento {
  mes: number
  ano: number
  valor: number
}

export interface RelatorioMensalData {
  mes: number
  ano: number
  registros: RegistroFaturamento[]
  limiteMEI: number
  valorDAS: number
  userData?: PDFUserData
}

export function RelatorioMensalPDF({ data }: { data: RelatorioMensalData }) {
  const { mes, ano, registros, limiteMEI, valorDAS, userData } = data

  // Calcula metricas
  const totalAcumulado = registros.reduce((sum, r) => sum + r.valor, 0)
  const mesesComRegistro = registros.length
  const mediaMovel = mesesComRegistro > 0 ? totalAcumulado / mesesComRegistro : 0
  const faturamentoMes = registros.find(r => r.mes === mes)?.valor || 0
  const percentualLimite = (totalAcumulado / limiteMEI) * 100
  const valorRestante = limiteMEI - totalAcumulado
  const mesesRestantes = 12 - mes
  const margemMensalRestante = mesesRestantes > 0 ? valorRestante / mesesRestantes : 0

  // Evolucao mensal ate o mes atual
  const evolucaoMensal = Array(12).fill(0)
  registros.forEach(r => {
    if (r.ano === ano) {
      evolucaoMensal[r.mes - 1] = r.valor
    }
  })
  const maxValor = Math.max(...evolucaoMensal, 1)

  // Status
  const status = percentualLimite >= 100 ? 'danger' : percentualLimite >= 80 ? 'warning' : 'ok'

  // Variacao vs media
  const variacaoVsMedia = mediaMovel > 0 ? ((faturamentoMes - mediaMovel) / mediaMovel) * 100 : 0

  // Data do relatorio
  const dataRelatorio = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <PDFHeader documentType={`Relatório Mensal - ${MESES[mes - 1]} ${ano}`} date={dataRelatorio} />

        <PDFUserIdentification userData={userData} />

        {/* Resumo do Mes */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCardHighlight}>
            <Text style={styles.summaryLabel}>Faturamento {MESES[mes - 1]}</Text>
            <Text style={styles.summaryValueGreen}>{formatCurrency(faturamentoMes)}</Text>
            <Text style={styles.summarySubtext}>
              {variacaoVsMedia >= 0 ? '+' : ''}{variacaoVsMedia.toFixed(1)}% vs média
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Acumulado {ano}</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalAcumulado)}</Text>
            <Text style={styles.summarySubtext}>{mesesComRegistro} meses registrados</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Média Mensal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(mediaMovel)}</Text>
            <Text style={styles.summarySubtext}>Projeção anual: {formatCurrency(mediaMovel * 12)}</Text>
          </View>
        </View>

        {/* Status do Limite MEI */}
        <View style={styles.statusSection}>
          <View style={[
            styles.statusCard,
            status === 'ok' ? styles.statusOk : status === 'warning' ? styles.statusWarning : styles.statusDanger
          ]}>
            <View style={[
              styles.statusIcon,
              status === 'ok' ? styles.statusIconOk : status === 'warning' ? styles.statusIconWarning : styles.statusIconDanger
            ]}>
              <Text style={styles.statusIconText}>
                {status === 'ok' ? '✓' : status === 'warning' ? '!' : '⚠'}
              </Text>
            </View>
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>
                {status === 'ok'
                  ? 'Dentro do limite MEI'
                  : status === 'warning'
                    ? 'Atenção: Próximo do limite'
                    : 'Alerta: Limite ultrapassado'}
              </Text>
              <Text style={styles.statusDescription}>
                Utilizado {formatPercent(percentualLimite)} do limite anual de {formatCurrency(limiteMEI)}
                {' • '}Restam {formatCurrency(valorRestante)}
              </Text>
            </View>
          </View>
        </View>

        {/* Evolução Mensal */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Evolução do Faturamento em {ano}</Text>
          <View style={styles.chartContainer}>
            {evolucaoMensal.slice(0, mes).map((valor, i) => {
              const width = maxValor > 0 ? (valor / maxValor) * 100 : 0
              const isCurrentMonth = i === mes - 1

              return (
                <View key={i} style={styles.barRow}>
                  <Text style={styles.barLabel}>{MESES_CURTOS[i]}</Text>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          width: `${Math.max(width, 2)}%`,
                          backgroundColor: isCurrentMonth ? colors.primary : '#94A3B8',
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.barValue}>{formatCurrency(valor)}</Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* Informações Importantes */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Informações do Mês</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>DAS a pagar</Text>
                <Text style={styles.infoValue}>{formatCurrency(valorDAS)}</Text>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Vencimento</Text>
                <Text style={styles.infoValue}>Dia 20 do próximo mês</Text>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Margem mensal restante</Text>
                <Text style={styles.infoValue}>{formatCurrency(margemMensalRestante)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Dicas */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Dicas para o próximo mês</Text>
          {status === 'ok' && (
            <>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>Continue mantendo seu faturamento dentro da média</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>Não esqueça de registrar seu faturamento mensalmente</Text>
              </View>
            </>
          )}
          {status === 'warning' && (
            <>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>Considere adiar vendas maiores para o próximo ano</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>Avalie a transição para ME se o crescimento continuar</Text>
              </View>
            </>
          )}
          {status === 'danger' && (
            <>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>Procure um contador para avaliar a transição para ME</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>Use o Comparador Tributário para simular custos</Text>
              </View>
            </>
          )}
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Pague o DAS até dia 20 para evitar multas e juros</Text>
          </View>
        </View>

        <PDFFooter />
      </Page>
    </Document>
  )
}
