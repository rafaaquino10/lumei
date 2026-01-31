interface CalculatorSchemaProps {
  name: string
  description: string
  url: string
}

export function CalculatorSchema({ name, description, url }: CalculatorSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: 'FinanceApplication',
    applicationSubCategory: 'Calculator',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '2.0',
    datePublished: '2024-01-01',
    dateModified: '2026-01-31',
    inLanguage: 'pt-BR',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: 'Calcula MEI',
      url: 'https://calculamei.com.br',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Calcula MEI',
      url: 'https://calculamei.com.br',
    },
    featureList: [
      'Cálculo de Margem de Lucro',
      'Cálculo de Preço por Hora',
      'Precificação de Produtos e Serviços',
      'Simulador de Faturamento MEI',
      'Fluxo de Caixa',
      'Calendário DAS',
      'Exportação em PDF',
      'Histórico de Cálculos',
    ],
    screenshot: 'https://calculamei.com.br/og-image.png',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Schema para a página principal de calculadoras
export function CalculadorasPageSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Calculadoras MEI - Calcula MEI',
    description: 'Calculadoras financeiras gratuitas para Microempreendedor Individual. Calcule margem de lucro, preço por hora, DAS e muito mais.',
    url: 'https://calculamei.com.br/calculadoras',
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: 'Calcula MEI',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'BRL',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1250',
      },
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://calculamei.com.br',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Calculadoras',
          item: 'https://calculamei.com.br/calculadoras',
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
