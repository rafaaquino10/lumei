import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import { AuthProvider } from '@/lib/auth/context';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { OrganizationSchema } from "./structured-data";
import { Providers } from "./providers";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL('https://calculamei.com.br'),
  title: {
    default: 'Calcula MEI - Calculadoras Financeiras para MEI',
    template: '%s | Calcula MEI',
  },
  verification: {
    google: '1ef182a217917cfd',
  },
  description: 'Calculadoras financeiras feitas para MEI crescer. Calcule margem de lucro, preço por hora, DAS e muito mais. 100% grátis.',
  keywords: [
    'MEI',
    'calculadora MEI',
    'margem de lucro',
    'preço por hora',
    'precificação',
    'DAS',
    'microempreendedor individual',
    'gestão financeira MEI',
    'calculadora DAS',
    'fluxo de caixa MEI',
  ],
  authors: [{ name: 'Calcula MEI' }],
  creator: 'Calcula MEI',
  publisher: 'Calcula MEI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    title: 'Calcula MEI',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://calculamei.com.br',
    title: 'Calcula MEI - Lucre mais. Sempre.',
    description: 'Calculadoras financeiras feitas para MEI crescer. 100% grátis.',
    siteName: 'Calcula MEI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Calcula MEI - Calculadoras para MEI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calcula MEI - Lucre mais. Sempre.',
    description: 'Calculadoras financeiras para MEI. 100% grátis.',
    images: ['/og-image.png'],
    creator: '@calculamei',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="antialiased">
        <Providers>
          <AuthProvider>
            <OrganizationSchema />
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <Toaster />
            <CookieConsentBanner />
          </AuthProvider>
        </Providers>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
