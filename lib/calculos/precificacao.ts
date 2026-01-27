// Precificação de Produtos
export interface PrecificacaoProdutoInputs {
  custoProduto: number
  custosFixosRateados: number
  despesasVariaveis: number
  margemDesejada: number // percentual
}

export interface PrecificacaoProdutoResultado {
  custoTotal: number
  precoVenda: number
  markup: number
  lucro: number
}

export function calcularPrecificacaoProduto(
  inputs: PrecificacaoProdutoInputs
): PrecificacaoProdutoResultado {
  const {
    custoProduto,
    custosFixosRateados,
    despesasVariaveis,
    margemDesejada,
  } = inputs
  
  const custoTotal = custoProduto + custosFixosRateados + despesasVariaveis
  const precoVenda = custoTotal / (1 - margemDesejada / 100)
  const markup = precoVenda / custoTotal
  const lucro = precoVenda - custoTotal
  
  return {
    custoTotal: Number(custoTotal.toFixed(2)),
    precoVenda: Number(precoVenda.toFixed(2)),
    markup: Number(markup.toFixed(2)),
    lucro: Number(lucro.toFixed(2)),
  }
}

// Precificação de Serviços
export interface PrecificacaoServicoInputs {
  horasServico: number
  valorHora: number
  materiaisCusto: number
  despesasAdicionais: number
  margemDesejada: number // percentual
}

export interface PrecificacaoServicoResultado {
  custoMaoDeObra: number
  custoTotal: number
  precoVenda: number
  precoHoraEfetivo: number
  lucro: number
}

export function calcularPrecificacaoServico(
  inputs: PrecificacaoServicoInputs
): PrecificacaoServicoResultado {
  const {
    horasServico,
    valorHora,
    materiaisCusto,
    despesasAdicionais,
    margemDesejada,
  } = inputs
  
  const custoMaoDeObra = horasServico * valorHora
  const custoTotal = custoMaoDeObra + materiaisCusto + despesasAdicionais
  const precoVenda = custoTotal / (1 - margemDesejada / 100)
  const precoHoraEfetivo = precoVenda / horasServico
  const lucro = precoVenda - custoTotal
  
  return {
    custoMaoDeObra: Number(custoMaoDeObra.toFixed(2)),
    custoTotal: Number(custoTotal.toFixed(2)),
    precoVenda: Number(precoVenda.toFixed(2)),
    precoHoraEfetivo: Number(precoHoraEfetivo.toFixed(2)),
    lucro: Number(lucro.toFixed(2)),
  }
}
