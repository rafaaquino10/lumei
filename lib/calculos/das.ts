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
  anoSolicitado: number
  anoReferencia: number
  fonteValores: 'env' | 'default' | 'fallback'
  salarioMinimo: number
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

type DasYearConfig = {
  salarioMinimo: number
  icms: number
  iss: number
  aliquotaMEI: number
  aliquotaCaminhoneiro: number
}

const DEFAULT_DAS_CONFIG_BY_YEAR: Record<number, DasYearConfig> = {
  2025: {
    salarioMinimo: 1412,
    icms: 1.0,
    iss: 5.0,
    aliquotaMEI: 0.05,
    aliquotaCaminhoneiro: 0.12,
  },
}

const loadEnvConfig = (): Record<number, DasYearConfig> => {
  const raw = process.env.NEXT_PUBLIC_DAS_CONFIG
  if (!raw) return {}

  try {
    const parsed = JSON.parse(raw) as Record<number, DasYearConfig>
    return parsed || {}
  } catch {
    return {}
  }
}

const resolveDasConfig = (ano: number) => {
  const envConfig = loadEnvConfig()
  const merged = { ...DEFAULT_DAS_CONFIG_BY_YEAR, ...envConfig }

  if (merged[ano]) {
    return {
      anoReferencia: ano,
      fonteValores: (envConfig[ano] ? 'env' : 'default') as DASResultado['fonteValores'],
      config: merged[ano],
    }
  }

  const fallbackYear = Object.keys(merged)
    .map(Number)
    .filter((y) => y < ano)
    .sort((a, b) => b - a)[0]

  if (fallbackYear && merged[fallbackYear]) {
    return {
      anoReferencia: fallbackYear,
      fonteValores: 'fallback' as DASResultado['fonteValores'],
      config: merged[fallbackYear],
    }
  }

  const latestYear = Object.keys(merged)
    .map(Number)
    .sort((a, b) => b - a)[0]

  if (!latestYear || !merged[latestYear]) {
    throw new Error('DAS config not available')
  }

  return {
    anoReferencia: latestYear,
    fonteValores: 'fallback' as DASResultado['fonteValores'],
    config: merged[latestYear],
  }
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export function calcularDAS(inputs: DASInputs): DASResultado {
  const { tipoMEI, ano = new Date().getFullYear() } = inputs

  const { config, anoReferencia, fonteValores } = resolveDasConfig(ano)
  const inssBase = config.salarioMinimo * config.aliquotaMEI
  const inssCaminhoneiro = config.salarioMinimo * config.aliquotaCaminhoneiro

  const valores: Record<
    DASInputs['tipoMEI'],
    { inss: number; total: number; icms?: number; iss?: number }
  > = {
    COMERCIO: {
      inss: inssBase,
      icms: config.icms,
      total: inssBase + config.icms,
    },
    SERVICOS: {
      inss: inssBase,
      iss: config.iss,
      total: inssBase + config.iss,
    },
    MISTO: {
      inss: inssBase,
      icms: config.icms,
      iss: config.iss,
      total: inssBase + config.icms + config.iss,
    },
    CAMINHONEIRO: {
      inss: inssCaminhoneiro,
      icms: config.icms,
      total: inssCaminhoneiro + config.icms,
    },
  }

  const valorMensal = valores[tipoMEI].total
  const valorAnual = valorMensal * 12
  
  const composicao: {
    inss: number
    icms?: number
    iss?: number
  } = {
    inss: valores[tipoMEI].inss,
    ...(typeof valores[tipoMEI].icms === 'number' ? { icms: valores[tipoMEI].icms } : {}),
    ...(typeof valores[tipoMEI].iss === 'number' ? { iss: valores[tipoMEI].iss } : {}),
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
    const vencimento = new Date(anoReferencia, index + 1, 20)

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

    // Only access icms/iss if they exist
    const valor = valorMensal
    return {
      mes: index + 1,
      mesNome,
      vencimento,
      valor,
      status,
    }
  })
  
  return {
    valorMensal: Number(valorMensal.toFixed(2)),
    valorAnual: Number(valorAnual.toFixed(2)),
    composicao,
    anoSolicitado: ano,
    anoReferencia,
    fonteValores,
    salarioMinimo: config.salarioMinimo,
    proximoVencimento,
    diasAteVencimento,
    calendarioAnual,
  }
}
