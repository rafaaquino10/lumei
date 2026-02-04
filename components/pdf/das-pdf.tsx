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
    color: '#00D084',
  },
  resultUnit: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
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
  tipoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipoTagText: {
    fontSize: 10,
    color: '#0369A1',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: 'bold',
  },
  composicaoSection: {
    marginTop: 20,
  },
  composicaoTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  composicaoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  composicaoItemLabel: {
    fontSize: 10,
    color: '#64748B',
    flex: 1,
  },
  composicaoItemValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  composicaoTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  composicaoTotalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#166534',
  },
  composicaoTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00D084',
  },
  calendarioSection: {
    marginTop: 20,
  },
  calendarioTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  calendarioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  calendarioItem: {
    width: '31%',
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  calendarioMes: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  calendarioData: {
    fontSize: 8,
    color: '#64748B',
  },
  calendarioValor: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#00D084',
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  infoTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 9,
    color: '#78350F',
    lineHeight: 1.4,
  },
  anualSection: {
    marginTop: 20,
  },
  anualTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  anualCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00D084',
  },
  anualLabel: {
    fontSize: 10,
    color: '#166534',
    marginBottom: 4,
  },
  anualValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00D084',
  },
})

type TipoMEI = 'comercio' | 'servicos' | 'comercio-servicos' | 'caminhoneiro'

interface DASPDFProps {
  inputs: {
    tipoMei: TipoMEI
    ano?: number
  }
  titulo?: string
  userData?: PDFUserData
}

const tipoLabels: Record<TipoMEI, string> = {
  'comercio': 'Comércio',
  'servicos': 'Serviços',
  'comercio-servicos': 'Comércio e Serviços',
  'caminhoneiro': 'Caminhoneiro',
}

const valores2026: Record<TipoMEI, { total: number; inss: number; icms: number; iss: number }> = {
  'comercio': { total: 71.60, inss: 70.60, icms: 1.00, iss: 0 },
  'servicos': { total: 75.60, inss: 70.60, icms: 0, iss: 5.00 },
  'comercio-servicos': { total: 76.60, inss: 70.60, icms: 1.00, iss: 5.00 },
  'caminhoneiro': { total: 169.44, inss: 169.44, icms: 0, iss: 0 },
}

const vencimentos2026 = [
  { mes: 'Janeiro', vencimento: '20/01/2026' },
  { mes: 'Fevereiro', vencimento: '20/02/2026' },
  { mes: 'Março', vencimento: '20/03/2026' },
  { mes: 'Abril', vencimento: '20/04/2026' },
  { mes: 'Maio', vencimento: '20/05/2026' },
  { mes: 'Junho', vencimento: '20/06/2026' },
  { mes: 'Julho', vencimento: '20/07/2026' },
  { mes: 'Agosto', vencimento: '20/08/2026' },
  { mes: 'Setembro', vencimento: '20/09/2026' },
  { mes: 'Outubro', vencimento: '20/10/2026' },
  { mes: 'Novembro', vencimento: '20/11/2026' },
  { mes: 'Dezembro', vencimento: '20/12/2026' },
]

export function DASPDF({ inputs, titulo, userData }: DASPDFProps) {
  const ano = inputs.ano || 2026
  const valores = valores2026[inputs.tipoMei]
  const totalAnual = valores.total * 12

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        {/* Header */}
        <PDFHeader documentType={`Calendário DAS MEI ${ano}`} />

        {/* Identificacao do Usuario/Empresa */}
        <PDFUserIdentification userData={userData} />

        {/* Title */}
        <View style={baseStyles.titleSection}>
          <View style={styles.tipoTag}>
            <Text style={styles.tipoTagText}>
              {tipoLabels[inputs.tipoMei].toUpperCase()}
            </Text>
          </View>
          <Text style={baseStyles.title}>
            {titulo || `Guia DAS MEI ${ano}`}
          </Text>
          <Text style={baseStyles.subtitle}>
            Calendario de pagamentos e valores do DAS para o ano de {ano}.
          </Text>
        </View>

        {/* Main Result */}
        <View style={baseStyles.cardHighlight}>
          <View style={styles.resultMain}>
            <Text style={styles.resultLabel}>VALOR MENSAL DO DAS</Text>
            <Text style={styles.resultValue}>
              {formatCurrency(valores.total)}
            </Text>
            <Text style={styles.resultUnit}>por mes</Text>
            <Text style={styles.resultStatus}>
              Vencimento: dia 20 de cada mes
            </Text>
          </View>
        </View>

        {/* Composicao do DAS */}
        <View style={styles.composicaoSection}>
          <Text style={styles.composicaoTitle}>Composicao do valor</Text>
          <View style={styles.composicaoItem}>
            <Text style={styles.composicaoItemLabel}>INSS (contribuicao previdenciaria)</Text>
            <Text style={styles.composicaoItemValue}>{formatCurrency(valores.inss)}</Text>
          </View>
          {valores.icms > 0 && (
            <View style={styles.composicaoItem}>
              <Text style={styles.composicaoItemLabel}>ICMS (comercio)</Text>
              <Text style={styles.composicaoItemValue}>{formatCurrency(valores.icms)}</Text>
            </View>
          )}
          {valores.iss > 0 && (
            <View style={styles.composicaoItem}>
              <Text style={styles.composicaoItemLabel}>ISS (servicos)</Text>
              <Text style={styles.composicaoItemValue}>{formatCurrency(valores.iss)}</Text>
            </View>
          )}
          <View style={styles.composicaoTotal}>
            <Text style={styles.composicaoTotalLabel}>Total mensal</Text>
            <Text style={styles.composicaoTotalValue}>{formatCurrency(valores.total)}</Text>
          </View>
        </View>

        {/* Calendario de Vencimentos */}
        <View style={styles.calendarioSection}>
          <Text style={styles.calendarioTitle}>Calendario de vencimentos {ano}</Text>
          <View style={styles.calendarioGrid}>
            {vencimentos2026.map((item) => (
              <View key={item.mes} style={styles.calendarioItem}>
                <Text style={styles.calendarioMes}>{item.mes}</Text>
                <Text style={styles.calendarioData}>{item.vencimento}</Text>
                <Text style={styles.calendarioValor}>{formatCurrency(valores.total)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Total Anual */}
        <View style={styles.anualSection}>
          <Text style={styles.anualTitle}>Custo anual total</Text>
          <View style={styles.anualCard}>
            <Text style={styles.anualLabel}>Total de DAS em {ano}</Text>
            <Text style={styles.anualValue}>{formatCurrency(totalAnual)}</Text>
          </View>
        </View>

        {/* Warning Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Importante sobre o pagamento</Text>
          <Text style={styles.infoText}>
            O DAS vence todo dia 20. Pagamento em atraso gera multa de 0,33% ao dia (max 20%) + juros (Selic).
            Pague em dia para manter seus direitos previdenciarios (aposentadoria, auxilio-doenca, etc).
          </Text>
        </View>

        {/* Tips */}
        <View style={baseStyles.tipsSection}>
          <Text style={baseStyles.tipsTitle}>Dicas para organizar seus pagamentos</Text>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Configure debito automatico no Portal do Empreendedor para nunca atrasar.
            </Text>
          </View>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Separe o valor do DAS logo no inicio do mes como despesa fixa.
            </Text>
          </View>
          <View style={baseStyles.tipItem}>
            <Text style={baseStyles.tipBullet}>•</Text>
            <Text style={baseStyles.tipText}>
              Guarde os comprovantes de pagamento por pelo menos 5 anos.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <PDFFooter />
      </Page>
    </Document>
  )
}
