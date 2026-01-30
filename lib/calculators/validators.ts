export function validatePositive(value: number, fieldName: string): void {
  if (value <= 0) {
    throw new Error(`${fieldName} deve ser positivo`)
  }
}

export function validateMargemRange(margem: number): void {
  if (margem < 0 || margem >= 100) {
    throw new Error('Margem deve estar entre 0 e 100%')
  }
}
