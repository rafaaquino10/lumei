import { calcularPrecoHora } from '../preco-hora';

describe('calcularPrecoHora', () => {
  it('should calculate price per hour correctly', () => {
    const result = calcularPrecoHora({
      salarioDesejado: 3000,
      custosFixos: 1000,
      horasTrabalhadasMes: 160,
      diasFeriasPorAno: 30,
      margemLucro: 20,
    });
    
    expect(result.receitaNecessaria).toBe(4800);
    expect(result.precoHoraBruto).toBe(30);
  });
  
  it('should apply vacation factor correctly', () => {
    const result = calcularPrecoHora({
      salarioDesejado: 3000,
      custosFixos: 0,
      horasTrabalhadasMes: 160,
      diasFeriasPorAno: 30,
      margemLucro: 0,
    });
    
    expect(result.fatorFerias).toBe(1.2);
  });
  
  it('should calculate with zero fixed costs', () => {
    const result = calcularPrecoHora({
      salarioDesejado: 5000,
      custosFixos: 0,
      horasTrabalhadasMes: 160,
      diasFeriasPorAno: 30,
      margemLucro: 15,
    });
    
    expect(result.receitaNecessaria).toBe(5750);
  });
  
  it('should handle high profit margins', () => {
    const result = calcularPrecoHora({
      salarioDesejado: 4000,
      custosFixos: 2000,
      horasTrabalhadasMes: 160,
      diasFeriasPorAno: 30,
      margemLucro: 50,
    });
    
    expect(result.receitaNecessaria).toBe(9000);
  });
});
