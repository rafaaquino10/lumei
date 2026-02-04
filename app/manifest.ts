import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Calcula MEI - Calculadoras Financeiras para MEI',
    short_name: 'Calcula MEI',
    description: 'Calculadoras financeiras feitas para MEI crescer. Calcule margem de lucro, preço por hora, DAS e muito mais.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#00D084',
    categories: ['finance', 'business', 'productivity'],
    lang: 'pt-BR',
    dir: 'ltr',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Calculadoras',
        short_name: 'Calcular',
        description: 'Acesse as calculadoras',
        url: '/calculadoras',
      },
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'Seu painel de controle',
        url: '/dashboard',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
