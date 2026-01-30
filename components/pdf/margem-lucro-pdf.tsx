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
    marginTop: 20,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
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

interface MargemLucroPDFProps {
  inputs: {
    precoVenda: number
    custoTotal: number
  }
  resultado: {
    margemBruta: number
    lucroBruto: number
    margemLiquida: number
    markup: number
  }
}

export function MargemLucroPDF({ inputs, resultado }: MargemLucroPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Cálculo de Margem de Lucro</Text>
          <Text style={{ fontSize: 10, color: '#64748B', marginTop: 4 }}>
            Gerado em {new Date().toLocaleDateString('pt-BR')}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Preço de Venda</Text>
          <Text style={styles.value}>
            R$ {inputs.precoVenda.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Custo Total</Text>
          <Text style={styles.value}>
            R$ {inputs.custoTotal.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Margem de Lucro Bruta</Text>
          <Text style={[styles.value, { fontSize: 32 }]}>
            {resultado.margemBruta.toFixed(1)}%
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Lucro Bruto</Text>
          <Text style={styles.value}>
            R$ {resultado.lucroBruto.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Markup</Text>
          <Text style={styles.value}>{resultado.markup.toFixed(2)}x</Text>
        </View>
        
        <Text style={styles.footer}>
          Calculado em Calcula MEI.com.br - Lucre mais. Sempre.
        </Text>
      </Page>
    </Document>
  )
}
