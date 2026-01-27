export interface DASInputs {
  tipoMEI: 'COMERCIO' | 'SERVICOS' | 'MISTO' | 'CAMINHONEIRO'
  ano?: number
}

export interface DASResultado {
  valorMensal: number
  valorAnual: number
  composicao: {
    inss: number
    icms?: number
    iss?: number
  }
  proximoVencimento: Date
  diasAteVencimento: number
  calendarioAnual: {
    mes: number
    mesNome: string
    vencimento: Date
    valor: number
    status: 'VENCIDO' | 'PROXIMO' | 'FUTURO'
  }[]
}

// Valores DAS 2025 (baseados em salário mínimo R$ 1.412)
const VALORES_DAS_2025 = {
  COMERCIO: {
    inss: 70.60, // 5% do salário mínimo
    icms: 1.00,
    total: 71.60,
  },
  SERVICOS: {
    inss: 70.60,
    iss: 5.00,
    total: 75.60,
  },
  MISTO: {
    inss: 70.60,
    icms: 1.00,
    iss: 5.00,
    total: 76.60,
  },
  CAMINHONEIRO: {
    inss: 169.44, // 12% do salário mínimo
    icms: 1.00,
    total: 170.44,
  },
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export function calcularDAS(inputs: DASInputs): DASResultado {
  const { tipoMEI, ano = new Date().getFullYear() } = inputs
  
  const valores = VALORES_DAS_2025[tipoMEI]
  const valorMensal = valores.total
  const valorAnual = valorMensal * 12
  
  const composicao = {
    inss: valores.inss,
    icms: valores.icms,
    iss: valores.iss,
  }
  
  // Próximo vencimento (sempre dia 20 do mês seguinte)
  const hoje = new Date()
  const mesAtual = hoje.getMonth()
  const anoAtual = hoje.getFullYear()
  
  let proximoVencimento = new Date(anoAtual, mesAtual + 1, 20)
  
  // Se já passou do dia 20, pega o próximo mês
  if (hoje.getDate() > 20) {
    proximoVencimento = new Date(anoAtual, mesAtual + 2, 20)
  }
  
  const diasAteVencimento = Math.ceil(
    (proximoVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  // Gerar calendário anual
  const calendarioAnual = MESES.map((mesNome, index) => {
    const vencimento = new Date(ano, index + 1, 20)
    
    // Ajustar se cair em fim de semana
    if (vencimento.getDay() === 0) {
      // Domingo
      vencimento.setDate(21)
    } else if (vencimento.getDay() === 6) {
      // Sábado
      vencimento.setDate(22)
    }
    
    let status: 'VENCIDO' | 'PROXIMO' | 'FUTURO'
    if (vencimento < hoje) {
      status = 'VENCIDO'
    } else if (diasAteVencimento <= 30 && index === mesAtual) {
      status = 'PROXIMO'
    } else {
      status = 'FUTURO'
    }
    
    return {
      mes: index + 1,
      mesNome,
      vencimento,
      valor: valorMensal,
      status,
    }
  })
  
  return {
    valorMensal: Number(valorMensal.toFixed(2)),
    valorAnual: Number(valorAnual.toFixed(2)),
    composicao,
    proximoVencimento,
    diasAteVencimento,
    calendarioAnual,
  }
}
