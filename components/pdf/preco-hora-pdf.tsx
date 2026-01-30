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
}

export function PrecoHoraPDF({ inputs, resultado }: PrecoHoraPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Cálculo de Preço por Hora</Text>
          <Text style={{ fontSize: 10, color: '#64748B', marginTop: 4 }}>
            Gerado em {new Date().toLocaleDateString('pt-BR')}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Salário Desejado Mensal</Text>
          <Text style={styles.value}>
            R$ {inputs.salarioDesejado.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Custos Fixos Mensais</Text>
          <Text style={styles.value}>
            R$ {inputs.custosFixos.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Horas Trabalhadas/Mês</Text>
          <Text style={styles.value}>{inputs.horasTrabalhadasMes}h</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Dias de Férias/Ano</Text>
          <Text style={styles.value}>{inputs.diasFeriasPorAno} dias</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Margem de Lucro Desejada</Text>
          <Text style={styles.value}>{inputs.margemLucro}%</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Seu Preço por Hora Ideal</Text>
          <Text style={[styles.value, { fontSize: 32 }]}>
            R$ {resultado.precoHoraFinal.toFixed(2).replace('.', ',')}/hora
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Receita Necessária</Text>
          <Text style={styles.value}>
            R$ {resultado.receitaNecessaria.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Fator Férias</Text>
          <Text style={styles.value}>{resultado.fatorFerias.toFixed(2)}x</Text>
        </View>
        
        <Text style={styles.footer}>
          Calculado em Calcula MEI.com.br - Lucre mais. Sempre.
        </Text>
      </Page>
    </Document>
  )
}
