export interface PrecoHoraInputs {
  salarioDesejado: number;
  custosFixos: number;
  horasTrabalhadasMes: number;
  diasFeriasPorAno: number;
  margemLucro: number; // percentual
}

export interface PrecoHoraResultado {
  precoHoraBruto: number;
  precoHoraFinal: number;
  fatorFerias: number;
  receitaNecessaria: number;
  receitaMensal: number;
}

export function calcularPrecoHora(
  inputs: PrecoHoraInputs
): PrecoHoraResultado {
  const {
    salarioDesejado,
    custosFixos,
    horasTrabalhadasMes,
    diasFeriasPorAno,
    margemLucro,
  } = inputs;
  
  const fatorFerias = 12 / (12 - diasFeriasPorAno / 30);
  const margemLucroReais = (salarioDesejado + custosFixos) * (margemLucro / 100);
  const receitaNecessaria = salarioDesejado + custosFixos + margemLucroReais;
  const precoHoraBruto = receitaNecessaria / horasTrabalhadasMes;
  const precoHoraFinal = precoHoraBruto * fatorFerias;
  const receitaMensal = precoHoraFinal * horasTrabalhadasMes;
  
  return {
    precoHoraBruto: Number(precoHoraBruto.toFixed(2)),
    precoHoraFinal: Number(precoHoraFinal.toFixed(2)),
    fatorFerias: Number(fatorFerias.toFixed(2)),
    receitaNecessaria: Number(receitaNecessaria.toFixed(2)),
    receitaMensal: Number(receitaMensal.toFixed(2)),
  };
}
