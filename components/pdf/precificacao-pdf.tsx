import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#00D084',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  section: {
    marginTop: 16,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00D084',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#94A3B8',
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
}

const formatCurrency = (value: number) =>
  `R$ ${value.toFixed(2).replace('.', ',')}`

export function PrecificacaoPDF({ modo, inputs, resultado }: PrecificacaoPDFProps) {
  const isProduto = modo === 'produtos'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Calculo de Precificacao - {isProduto ? 'Produto' : 'Servico'}
          </Text>
          <Text style={{ fontSize: 10, color: '#64748B', marginTop: 4 }}>
            Gerado em {new Date().toLocaleDateString('pt-BR')}
          </Text>
        </View>

        {isProduto ? (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Custo do Produto</Text>
              <Text style={styles.value}>
                {formatCurrency((inputs as InputsProdutos).custoProduto)}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Custos Fixos Rateados</Text>
              <Text style={styles.value}>
                {formatCurrency((inputs as InputsProdutos).custosFixosRateados)}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Despesas Variaveis</Text>
              <Text style={styles.value}>
                {formatCurrency((inputs as InputsProdutos).despesasVariaveis)}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Margem Desejada</Text>
              <Text style={styles.value}>
                {(inputs as InputsProdutos).margemDesejada}%
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Preco de Venda Sugerido</Text>
              <Text style={[styles.value, { fontSize: 24 }]}>
                {formatCurrency((resultado as ResultadoProduto).precoVenda)}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Custo Total</Text>
              <Text style={styles.value}>
                {formatCurrency((resultado as ResultadoProduto).custoTotal)}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Markup</Text>
              <Text style={styles.value}>
                {(resultado as ResultadoProduto).markup.toFixed(2)}x
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Lucro</Text>
              <Text style={styles.value}>
                {formatCurrency((resultado as ResultadoProduto).lucro)}
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Horas do Servico</Text>
              <Text style={styles.value}>
                {(inputs as InputsServicos).horasServico}h
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Valor por Hora</Text>
              <Text style={styles.value}>
                {formatCurrency((inputs as InputsServicos).valorHora)}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Materiais/Insumos</Text>
              <Text style={styles.value}>
                {formatCurrency((inputs as InputsServicos).materiaisCusto)}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Despesas Adicionais</Text>
              <Text style={styles.value}>
                {formatCurrency((inputs as InputsServicos).despesasAdicionais)}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Margem Desejada</Text>
              <Text style={styles.value}>
                {(inputs as InputsServicos).margemDesejada}%
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Preco do Servico</Text>
              <Text style={[styles.value, { fontSize: 24 }]}>
                {formatCurrency((resultado as ResultadoServico).precoVenda)}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Custo Total</Text>
              <Text style={styles.value}>
                {formatCurrency((resultado as ResultadoServico).custoTotal)}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Preco/Hora Efetivo</Text>
              <Text style={styles.value}>
                {formatCurrency((resultado as ResultadoServico).precoHoraEfetivo)}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Lucro</Text>
              <Text style={styles.value}>
                {formatCurrency((resultado as ResultadoServico).lucro)}
              </Text>
            </View>
          </>
        )}

        <Text style={styles.footer}>
          Calculado em Lumei.com.br - Lucre mais. Sempre.
        </Text>
      </Page>
    </Document>
  )
}
