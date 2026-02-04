export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Calcula MEI',
    url: 'https://calculamei.com.br',
    logo: 'https://calculamei.com.br/logo.svg',
    description: 'Controle financeiro completo para MEI. Registre seu faturamento, acompanhe o limite de R$ 81.000 e nunca esqueça do DAS.',
    sameAs: [
      'https://instagram.com/calculamei',
      'https://twitter.com/calculamei',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contato@calculamei.com.br',
      contactType: 'customer service',
      availableLanguage: 'Portuguese',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Schema de Review para depoimentos reais (usar quando houver)
interface ReviewItemProps {
  author: string
  occupation: string
  reviewBody: string
  rating: number
  datePublished: string
}

interface ReviewSchemaProps {
  reviews: ReviewItemProps[]
  itemReviewed: {
    name: string
    type: 'Product' | 'SoftwareApplication'
  }
}

export function ReviewSchema({ reviews, itemReviewed }: ReviewSchemaProps) {
  // Só renderiza se houver reviews reais
  if (!reviews || reviews.length === 0) return null

  const schema = reviews.map((review) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
      jobTitle: review.occupation,
    },
    reviewBody: review.reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: {
      '@type': itemReviewed.type,
      name: itemReviewed.name,
    },
    datePublished: review.datePublished,
  }))

  return (
    <>
      {schema.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  )
}

// Schema de SoftwareApplication para o produto principal
export function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Calcula MEI',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
    description: 'Controle financeiro completo para MEI. Registre seu faturamento mensal, acompanhe o limite de R$ 81.000, receba alertas de DAS e use calculadoras financeiras.',
    featureList: [
      'Registro de faturamento mensal',
      'Controle do limite de R$ 81.000/ano',
      'Alertas de vencimento do DAS',
      'Calculadora de margem de lucro',
      'Calculadora de preço por hora',
      'Calculadora de precificação',
      'Simulador de faturamento anual',
      'Controle de fluxo de caixa',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Schema de Produto para o plano Premium
export function PremiumProductSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Calcula MEI Premium',
    description: 'Plano premium com alertas automáticos de DAS via WhatsApp, cálculos ilimitados, histórico de 5 anos e relatórios mensais.',
    brand: {
      '@type': 'Organization',
      name: 'Calcula MEI',
    },
    offers: {
      '@type': 'Offer',
      price: '14.90',
      priceCurrency: 'BRL',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      url: 'https://calculamei.com.br/premium',
      seller: {
        '@type': 'Organization',
        name: 'Calcula MEI',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
