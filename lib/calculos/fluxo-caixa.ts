export interface Transacao {
  id?: string
  descricao: string
  valor: number
  categoria: string
  tipo: 'ENTRADA' | 'SAIDA'
  data: Date | string
}

export interface FluxoCaixaInputs {
  transacoes: Transacao[]
  mesReferencia?: string // 'YYYY-MM' formato
}

export interface FluxoCaixaResultado {
  totalEntradas: number
  totalSaidas: number
  saldo: number
  margemOperacional: number // %
  entradasPorCategoria: { [key: string]: number }
  saidasPorCategoria: { [key: string]: number }
  statusSaude: 'POSITIVO' | 'NEUTRO' | 'NEGATIVO'
  mensagem: string
}

export function calcularFluxoCaixa(
  inputs: FluxoCaixaInputs
): FluxoCaixaResultado {
  const { transacoes } = inputs
  
  const entradas = transacoes.filter((t) => t.tipo === 'ENTRADA')
  const saidas = transacoes.filter((t) => t.tipo === 'SAIDA')
  
  const totalEntradas = entradas.reduce((acc, t) => acc + t.valor, 0)
  const totalSaidas = saidas.reduce((acc, t) => acc + t.valor, 0)
  const saldo = totalEntradas - totalSaidas
  
  const margemOperacional =
    totalEntradas > 0 ? (saldo / totalEntradas) * 100 : 0
  
  // Agrupar por categoria
  const entradasPorCategoria: { [key: string]: number } = {}
  entradas.forEach((t) => {
    if (!entradasPorCategoria[t.categoria]) {
      entradasPorCategoria[t.categoria] = 0
    }
    entradasPorCategoria[t.categoria] += t.valor
  })
  
  const saidasPorCategoria: { [key: string]: number } = {}
  saidas.forEach((t) => {
    if (!saidasPorCategoria[t.categoria]) {
      saidasPorCategoria[t.categoria] = 0
    }
    saidasPorCategoria[t.categoria] += t.valor
  })
  
  // Determinar status de saúde
  let statusSaude: FluxoCaixaResultado['statusSaude']
  let mensagem: string
  
  if (saldo > 0 && margemOperacional >= 20) {
    statusSaude = 'POSITIVO'
    mensagem = '✅ Excelente! Seu fluxo de caixa está saudável.'
  } else if (saldo > 0 && margemOperacional > 0) {
    statusSaude = 'NEUTRO'
    mensagem = '⚠️ Atenção! Margem baixa. Tente reduzir custos ou aumentar receita.'
  } else {
    statusSaude = 'NEGATIVO'
    mensagem = '🚨 Cuidado! Você está gastando mais do que ganha.'
  }
  
  return {
    totalEntradas: Number(totalEntradas.toFixed(2)),
    totalSaidas: Number(totalSaidas.toFixed(2)),
    saldo: Number(saldo.toFixed(2)),
    margemOperacional: Number(margemOperacional.toFixed(2)),
    entradasPorCategoria,
    saidasPorCategoria,
    statusSaude,
    mensagem,
  }
}

// Categorias padrão para sugestões
export const CATEGORIAS_ENTRADA = [
  'Vendas',
  'Serviços Prestados',
  'Outras Receitas',
]

export const CATEGORIAS_SAIDA = [
  'Fornecedores',
  'Salários/Pro-labore',
  'Aluguel',
  'Água/Luz/Internet',
  'Marketing',
  'Impostos/DAS',
  'Equipamentos',
  'Outros',
]
