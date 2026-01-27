import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lumei.vercel.app'
  
  const calculadoras = [
    'margem-lucro',
    'preco-hora',
    'precificacao',
    'faturamento',
    'fluxo-caixa',
    'das',
  ]
  
  const calculadorasUrls = calculadoras.map(calc => ({
    url: `${baseUrl}/calcular/${calc}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...calculadorasUrls,
    {
      url: `${baseUrl}/premium`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]
}
