import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lumei - Calculadoras para MEI',
    short_name: 'Lumei',
    description: 'Calculadoras financeiras feitas para MEI crescer',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#00D084',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
