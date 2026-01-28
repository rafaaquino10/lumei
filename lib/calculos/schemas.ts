import { z } from 'zod'

export const tipoCalculoEnum = z.enum([
  'MARGEM_LUCRO',
  'PRECO_HORA',
  'PRECIFICACAO',
  'FATURAMENTO',
  'FLUXO_CAIXA',
  'CALENDARIO_DAS',
])

export const margemLucroInputSchema = z.object({
  precoVenda: z.number().positive(),
  custoTotal: z.number().positive(),
})

export const margemLucroResultadoSchema = z.object({
  margemBruta: z.number(),
  margemLiquida: z.number(),
  lucroBruto: z.number(),
  markup: z.number(),
})

export const precoHoraInputSchema = z.object({
  salarioDesejado: z.number().positive(),
  custosFixos: z.number().min(0),
  horasTrabalhadasMes: z.number().min(1).max(300),
  diasFeriasPorAno: z.number().min(0).max(60),
  margemLucro: z.number().min(0).max(100),
})

export const precoHoraResultadoSchema = z.object({
  precoHoraBruto: z.number(),
  precoHoraFinal: z.number(),
  fatorFerias: z.number(),
  receitaNecessaria: z.number(),
  receitaMensal: z.number(),
})

export const precificacaoProdutoInputSchema = z.object({
  custoProduto: z.number().min(0),
  custosFixosRateados: z.number().min(0),
  despesasVariaveis: z.number().min(0),
  margemDesejada: z.number().min(0).max(99),
})

export const precificacaoProdutoResultadoSchema = z.object({
  custoTotal: z.number(),
  precoVenda: z.number(),
  markup: z.number(),
  lucro: z.number(),
})

export const precificacaoServicoInputSchema = z.object({
  horasServico: z.number().positive(),
  valorHora: z.number().positive(),
  materiaisCusto: z.number().min(0),
  despesasAdicionais: z.number().min(0),
  margemDesejada: z.number().min(0).max(99),
})

export const precificacaoServicoResultadoSchema = z.object({
  custoMaoDeObra: z.number(),
  custoTotal: z.number(),
  precoVenda: z.number(),
  precoHoraEfetivo: z.number(),
  lucro: z.number(),
})

export const faturamentoInputSchema = z.object({
  faturamentoMensal: z.array(z.number().min(0)).length(12),
})

export const faturamentoResultadoSchema = z.object({
  faturamentoAnual: z.number(),
  percentualUsado: z.number(),
  status: z.enum(['SEGURO', 'ATENCAO', 'CRITICO', 'EXCEDIDO']),
  mensagemStatus: z.string(),
  tetoMEI: z.number(),
  faltante: z.number(),
  mediaMonsal: z.number(),
  mesesProblematicos: z.array(z.number()),
})

export const fluxoCaixaInputSchema = z.object({
  transacoes: z.array(
    z.object({
      descricao: z.string(),
      valor: z.number(),
      categoria: z.string(),
      tipo: z.enum(['ENTRADA', 'SAIDA']),
      data: z.string(),
    })
  ),
})

export const fluxoCaixaResultadoSchema = z.object({
  totalEntradas: z.number(),
  totalSaidas: z.number(),
  saldo: z.number(),
  margemOperacional: z.number(),
  entradasPorCategoria: z.record(z.string(), z.number()),
  saidasPorCategoria: z.record(z.string(), z.number()),
  statusSaude: z.enum(['POSITIVO', 'NEUTRO', 'NEGATIVO']),
  mensagem: z.string(),
})

export const calendarioDasInputSchema = z.object({
  tipoMEI: z.enum(['COMERCIO', 'SERVICOS', 'MISTO', 'CAMINHONEIRO']),
  ano: z.number().optional(),
})

export const calendarioDasResultadoSchema = z.object({
  valorMensal: z.number(),
  valorAnual: z.number(),
  composicao: z.object({
    inss: z.number(),
    icms: z.number().optional(),
    iss: z.number().optional(),
  }),
  anoSolicitado: z.number(),
  anoReferencia: z.number(),
  fonteValores: z.enum(['env', 'default', 'fallback']),
  salarioMinimo: z.number(),
  proximoVencimento: z.string(),
  diasAteVencimento: z.number(),
  calendarioAnual: z.array(
    z.object({
      mes: z.number(),
      mesNome: z.string(),
      vencimento: z.string(),
      valor: z.number(),
      status: z.enum(['VENCIDO', 'PROXIMO', 'FUTURO']),
    })
  ),
})

export const calculoSchemas = {
  MARGEM_LUCRO: {
    inputs: margemLucroInputSchema,
    resultado: margemLucroResultadoSchema,
  },
  PRECO_HORA: {
    inputs: precoHoraInputSchema,
    resultado: precoHoraResultadoSchema,
  },
  PRECIFICACAO: {
    inputs: z.union([precificacaoProdutoInputSchema, precificacaoServicoInputSchema]),
    resultado: z.union([
      precificacaoProdutoResultadoSchema,
      precificacaoServicoResultadoSchema,
    ]),
  },
  FATURAMENTO: {
    inputs: faturamentoInputSchema,
    resultado: faturamentoResultadoSchema,
  },
  FLUXO_CAIXA: {
    inputs: fluxoCaixaInputSchema,
    resultado: fluxoCaixaResultadoSchema,
  },
  CALENDARIO_DAS: {
    inputs: calendarioDasInputSchema,
    resultado: calendarioDasResultadoSchema,
  },
} as const
