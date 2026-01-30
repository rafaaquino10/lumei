export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Calcula MEI',
    url: 'https://calculamei.com.br',
    logo: 'https://calculamei.com.br/logo.svg',
    description: 'Calculadoras financeiras para MEI crescer',
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
