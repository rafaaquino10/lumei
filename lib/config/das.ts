export type DASConfig = {
  salarioMinimo: number
  limiteAnualFaturamento: number
  anexoI: {
    aliquota: number
    deducao: number
  }
  anexoIII: {
    aliquota: number
    deducao: number
  }
  anexoV: {
    aliquota: number
    deducao: number
  }
}

const DAS_CONFIG_2026: DASConfig = {
  salarioMinimo: 1518,
  limiteAnualFaturamento: 81000,
  anexoI: {
    aliquota: 0.04,
    deducao: 10.12,
  },
  anexoIII: {
    aliquota: 0.048,
    deducao: 15.5,
  },
  anexoV: {
    aliquota: 0.059,
    deducao: 20.36,
  },
}

const CONFIG_BY_YEAR: Record<number, DASConfig> = {
  2026: DAS_CONFIG_2026,
}

export function getDASConfig(year: number): DASConfig {
  return CONFIG_BY_YEAR[year] || CONFIG_BY_YEAR[2026]
}

export const DAS_CONFIG = DAS_CONFIG_2026
