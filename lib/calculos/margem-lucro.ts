export interface MargemLucroInputs {
  precoVenda: number;
  custoTotal: number;
}

export interface MargemLucroResultado {
  margemBruta: number;
  margemLiquida: number;
  lucroBruto: number;
  markup: number;
}

export function calcularMargemLucro(
  inputs: MargemLucroInputs
): MargemLucroResultado {
  const { precoVenda, custoTotal } = inputs;
  
  const lucroBruto = precoVenda - custoTotal;
  const margemBruta = (lucroBruto / precoVenda) * 100;
  const margemLiquida = margemBruta; // MEI não tem imposto sobre receita
  const markup = precoVenda / custoTotal;
  
  return {
    margemBruta: Number(margemBruta.toFixed(2)),
    margemLiquida: Number(margemLiquida.toFixed(2)),
    lucroBruto: Number(lucroBruto.toFixed(2)),
    markup: Number(markup.toFixed(2)),
  };
}
