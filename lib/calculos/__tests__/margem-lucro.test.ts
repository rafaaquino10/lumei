import { calcularMargemLucro } from '../margem-lucro';

describe('calcularMargemLucro', () => {
  it('should calculate correct margin for R$100 sale with R$60 cost', () => {
    const result = calcularMargemLucro({
      precoVenda: 100,
      custoTotal: 60,
    });
    
    expect(result.margemBruta).toBe(40);
    expect(result.lucroBruto).toBe(40);
    expect(result.markup).toBe(1.67);
  });
  
  it('should handle zero margin correctly', () => {
    const result = calcularMargemLucro({
      precoVenda: 100,
      custoTotal: 100,
    });
    
    expect(result.margemBruta).toBe(0);
    expect(result.lucroBruto).toBe(0);
  });
  
  it('should calculate high margin products correctly', () => {
    const result = calcularMargemLucro({
      precoVenda: 200,
      custoTotal: 50,
    });
    
    expect(result.margemBruta).toBe(75);
    expect(result.lucroBruto).toBe(150);
    expect(result.markup).toBe(4);
  });
  
  it('should handle decimal values correctly', () => {
    const result = calcularMargemLucro({
      precoVenda: 99.99,
      custoTotal: 45.50,
    });
    
    expect(result.margemBruta).toBe(54.51);
    expect(result.lucroBruto).toBe(54.49);
  });
});
