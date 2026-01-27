export interface FaturamentoInputs {
  faturamentoMensal: number[] // Array de 12 meses
}

export interface FaturamentoResultado {
  faturamentoAnual: number
  percentualUsado: number // % do teto de R$ 81.000
  status: 'SEGURO' | 'ATENCAO' | 'CRITICO' | 'EXCEDIDO'
  mensagemStatus: string
  tetoMEI: number
  faltante: number // Quanto falta até o teto
  mediaMonsal: number
  mesesProblematicos: number[] // Meses que ultrapassaram proporcional
}

const TETO_MEI_ANUAL = 81000
const TETO_MEI_MENSAL = TETO_MEI_ANUAL / 12 // R$ 6.750

export function calcularFaturamento(
  inputs: FaturamentoInputs
): FaturamentoResultado {
  const { faturamentoMensal } = inputs
  
  const faturamentoAnual = faturamentoMensal.reduce((acc, val) => acc + val, 0)
  const percentualUsado = (faturamentoAnual / TETO_MEI_ANUAL) * 100
  const mediaMonsal = faturamentoAnual / 12
  const faltante = TETO_MEI_ANUAL - faturamentoAnual
  
  // Identifica meses problemáticos (acima da média proporcional)
  const mesesProblematicos: number[] = []
  let acumulado = 0
  
  faturamentoMensal.forEach((valor, index) => {
    acumulado += valor
    const mesAtual = index + 1
    const tetoProporcional = (TETO_MEI_ANUAL / 12) * mesAtual
    
    if (acumulado > tetoProporcional * 0.9) { // 90% do proporcional
      mesesProblematicos.push(mesAtual)
    }
  })
  
  // Determina status
  let status: FaturamentoResultado['status']
  let mensagemStatus: string
  
  if (percentualUsado > 100) {
    status = 'EXCEDIDO'
    mensagemStatus = '🚨 ATENÇÃO! Você ultrapassou o teto MEI. Desenquadramento obrigatório.'
  } else if (percentualUsado >= 90) {
    status = 'CRITICO'
    mensagemStatus = '⚠️ CRÍTICO! Você está muito próximo do teto. Cuidado para não ultrapassar.'
  } else if (percentualUsado >= 70) {
    status = 'ATENCAO'
    mensagemStatus = '⚠️ Atenção! Monitore seu faturamento de perto nos próximos meses.'
  } else {
    status = 'SEGURO'
    mensagemStatus = '✅ Seguro! Você está dentro do limite MEI.'
  }
  
  return {
    faturamentoAnual: Number(faturamentoAnual.toFixed(2)),
    percentualUsado: Number(percentualUsado.toFixed(2)),
    status,
    mensagemStatus,
    tetoMEI: TETO_MEI_ANUAL,
    faltante: Number(faltante.toFixed(2)),
    mediaMonsal: Number(mediaMonsal.toFixed(2)),
    mesesProblematicos,
  }
}
