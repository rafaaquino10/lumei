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
  metricValueSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  metricValueHighlight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00D084',
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
  modeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modeTagText: {
    fontSize: 10,
    color: '#0369A1',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: 'bold',
  },
})

type Modo = 'produtos' | 'servicos'

type InputsProdutos = {
  custoProduto: number
  custosFixosRateados: number
  despesasVariaveis: number
  margemDesejada: number
}

type InputsServicos = {
  horasServico: number
  valorHora: number
  materiaisCusto: number
  despesasAdicionais: number
  margemDesejada: number
}

type ResultadoProduto = {
  custoTotal: number
  precoVenda: number
  markup: number
  lucro: number
}

type ResultadoServico = {
  custoMaoDeObra: number
  custoTotal: number
  precoVenda: number
  precoHoraEfetivo: number
  lucro: number
}

interface PrecificacaoPDFProps {
  modo: Modo
  inputs: InputsProdutos | InputsServicos
  resultado: ResultadoProduto | ResultadoServico
  titulo?: string
  userData?: PDFUserData
}

export function PrecificacaoPDF({ modo, inputs, resultado, titulo, userData }: PrecificacaoPDFProps) {
  const isProduto = modo === 'produtos'
  const produtoInputs = inputs as InputsProdutos
  const servicoInputs = inputs as InputsServicos
  const produtoResultado = resultado as ResultadoProduto
  const servicoResultado = resultado as ResultadoServico

  const lucro = isProduto ? produtoResultado.lucro : servicoResultado.lucro
  const isPositive = lucro > 0

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        {/* Header */}
        <PDFHeader documentType={`Precificacao de ${isProduto ? 'Produto' : 'Servico'}`} />

        {/* Identificacao do Usuario/Empresa */}
        <PDFUserIdentification userData={userData} />

        {/* Title */}
        <View style={baseStyles.titleSection}>
          <View style={styles.modeTag}>
            <Text style={styles.modeTagText}>
              {isProduto ? 'PRODUTO' : 'SERVIÇO'}
            </Text>
          </View>
          <Text style={baseStyles.title}>
            {titulo || `Precificação de ${isProduto ? 'Produto' : 'Serviço'}`}
          </Text>
          <Text style={baseStyles.subtitle}>
            {isProduto
              ? 'Calcule o preço ideal do seu produto para garantir lucro em cada venda.'
              : 'Calcule o preço ideal do seu serviço considerando tempo e materiais.'
            }
          </Text>
        </View>

        {/* Main Result */}
        <View style={baseStyles.cardHighlight}>
          <View style={styles.resultMain}>
            <Text style={styles.resultLabel}>
              {isProduto ? 'PREÇO DE VENDA SUGERIDO' : 'PREÇO DO SERVIÇO'}
            </Text>
            <Text style={styles.resultValue}>
              {formatCurrency(isProduto ? produtoResultado.precoVenda : servicoResultado.precoVenda)}
            </Text>
            <Text style={[styles.resultStatus, !isPositive ? { backgroundColor: '#FEE2E2', color: '#991B1B' } : {}]}>
              {isPositive
                ? `Lucro de ${formatCurrency(lucro)} por ${isProduto ? 'unidade' : 'serviço'}`
                : `Prejuízo de ${formatCurrency(Math.abs(lucro))} - revise seus custos`
              }
            </Text>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Custo Total</Text>
            <Text style={styles.metricValue}>
              {formatCurrency(isProduto ? produtoResultado.custoTotal : servicoResultado.custoTotal)}
            </Text>
          </View>
          {isProduto ? (
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Markup</Text>
              <Text style={styles.metricValue}>{produtoResultado.markup.toFixed(2)}x</Text>
            </View>
          ) : (
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Preço/Hora Efetivo</Text>
              <Text style={styles.metricValueSmall}>
                {formatCurrency(servicoResultado.precoHoraEfetivo)}
              </Text>
            </View>
          )}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Lucro</Text>
            <Text style={[styles.metricValueHighlight, !isPositive ? { color: '#EF4444' } : {}]}>
              {formatCurrency(lucro)}
            </Text>
          </View>
        </View>

        {/* Inputs Section */}
        <View style={styles.inputsSection}>
          <Text style={styles.inputsTitle}>Dados utilizados no cálculo</Text>

          {isProduto ? (
            <>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Custo do Produto</Text>
                <Text style={styles.inputValue}>{formatCurrency(produtoInputs.custoProduto)}</Text>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Custos Fixos Rateados</Text>
                <Text style={styles.inputValue}>{formatCurrency(produtoInputs.custosFixosRateados)}</Text>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Despesas Variáveis</Text>
                <Text style={styles.inputValue}>{formatCurrency(produtoInputs.despesasVariaveis)}</Text>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Margem Desejada</Text>
                <Text style={styles.inputValue}>{formatPercent(produtoInputs.margemDesejada)}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Horas do Serviço</Text>
                <Text style={styles.inputValue}>{servicoInputs.horasServico}h</Text>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Valor por Hora</Text>
                <Text style={styles.inputValue}>{formatCurrency(servicoInputs.valorHora)}</Text>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Materiais/Insumos</Text>
                <Text style={styles.inputValue}>{formatCurrency(servicoInputs.materiaisCusto)}</Text>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Despesas Adicionais</Text>
                <Text style={styles.inputValue}>{formatCurrency(servicoInputs.despesasAdicionais)}</Text>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Margem Desejada</Text>
                <Text style={styles.inputValue}>{formatPercent(servicoInputs.margemDesejada)}</Text>
              </View>
            </>
          )}
        </View>

        {/* Breakdown Section */}
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Composição do preço</Text>

          {isProduto ? (
            <>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownItemLabel}>Custo do produto</Text>
                <Text style={styles.breakdownItemValue}>{formatCurrency(produtoInputs.custoProduto)}</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownItemLabel}>+ Custos fixos rateados</Text>
                <Text style={styles.breakdownItemValue}>{formatCurrency(produtoInputs.custosFixosRateados)}</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownItemLabel}>+ Despesas variáveis</Text>
                <Text style={styles.breakdownItemValue}>{formatCurrency(produtoInputs.despesasVariaveis)}</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownItemLabel}>= Custo total</Text>
                <Text style={styles.breakdownItemValue}>{formatCurrency(produtoResultado.custoTotal)}</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownItemLabel}>+ Margem ({formatPercent(produtoInputs.margemDesejada)})</Text>
                <Text style={styles.breakdownItemHighlight}>{formatCurrency(produtoResultado.lucro)}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownItemLabel}>Mão de obra ({servicoInputs.horasServico}h x {formatCurrency(servicoInputs.valorHora)})</Text>
                <Text style={styles.breakdownItemValue}>{formatCurrency(servicoResultado.custoMaoDeObra)}</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownItemLabel}>+ Materiais/insumos</Text>
                <Text style={styles.breakdownItemValue}>{formatCurrency(servicoInputs.materiaisCusto)}</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownItemLabel}>+ Despesas adicionais</Text>
                <Text style={styles.breakdownItemValue}>{formatCurrency(servicoInputs.despesasAdicionais)}</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownItemLabel}>= Custo total</Text>
                <Text style={styles.breakdownItemValue}>{formatCurrency(servicoResultado.custoTotal)}</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownItemLabel}>+ Margem ({formatPercent(servicoInputs.margemDesejada)})</Text>
                <Text style={styles.breakdownItemHighlight}>{formatCurrency(servicoResultado.lucro)}</Text>
              </View>
            </>
          )}
        </View>

        {/* Formula Box */}
        <View style={styles.formulaBox}>
          <Text style={styles.formulaTitle}>Fórmula utilizada</Text>
          <Text style={styles.formulaText}>
            Preço = Custo Total / (1 - Margem%)
          </Text>
          <Text style={styles.formulaText}>
            Markup = Preço de Venda / Custo Total
          </Text>
        </View>

        {/* Tips */}
        <View style={baseStyles.tipsSection}>
          <Text style={baseStyles.tipsTitle}>
            Dicas para {isProduto ? 'precificar produtos' : 'cobrar por serviços'}
          </Text>
          {isProduto ? (
            <>
              <View style={baseStyles.tipItem}>
                <Text style={baseStyles.tipBullet}>•</Text>
                <Text style={baseStyles.tipText}>
                  Markup ideal para varejo: 2.0x a 3.0x sobre o custo.
                </Text>
              </View>
              <View style={baseStyles.tipItem}>
                <Text style={baseStyles.tipBullet}>•</Text>
                <Text style={baseStyles.tipText}>
                  Inclua todos os custos ocultos: embalagem, frete, taxas de cartão.
                </Text>
              </View>
              <View style={baseStyles.tipItem}>
                <Text style={baseStyles.tipBullet}>•</Text>
                <Text style={baseStyles.tipText}>
                  Pesquise o preço da concorrência antes de definir o preço final.
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={baseStyles.tipItem}>
                <Text style={baseStyles.tipBullet}>•</Text>
                <Text style={baseStyles.tipText}>
                  Sempre adicione uma margem para imprevistos (10-20% do tempo estimado).
                </Text>
              </View>
              <View style={baseStyles.tipItem}>
                <Text style={baseStyles.tipBullet}>•</Text>
                <Text style={baseStyles.tipText}>
                  Serviços especializados podem ter margem de 50% ou mais.
                </Text>
              </View>
              <View style={baseStyles.tipItem}>
                <Text style={baseStyles.tipBullet}>•</Text>
                <Text style={baseStyles.tipText}>
                  Considere cobrar por projeto em vez de hora para servicos recorrentes.
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Footer */}
        <PDFFooter />
      </Page>
    </Document>
  )
}
