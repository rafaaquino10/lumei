export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Lumei',
    url: 'https://lumei.vercel.app',
    logo: 'https://lumei.vercel.app/logo.svg',
    description: 'Calculadoras financeiras para MEI crescer',
    sameAs: [
      'https://instagram.com/lumei',
      'https://twitter.com/lumei',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contato@lumei.com.br',
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
