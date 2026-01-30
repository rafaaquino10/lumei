import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ptBR } from '@clerk/localizations';
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
  metadataBase: new URL('https://lumei.com.br'),
  title: {
    default: 'Lumei - Calculadoras Financeiras para MEI',
    template: '%s | Lumei',
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
  authors: [{ name: 'Lumei' }],
  creator: 'Lumei',
  publisher: 'Lumei',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    title: 'Lumei',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://lumei.com.br',
    title: 'Lumei - Lucre mais. Sempre.',
    description: 'Calculadoras financeiras feitas para MEI crescer. 100% grátis.',
    siteName: 'Lumei',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lumei - Calculadoras para MEI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumei - Lucre mais. Sempre.',
    description: 'Calculadoras financeiras para MEI. 100% grátis.',
    images: ['/og-image.png'],
    creator: '@lumei',
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
    <ClerkProvider localization={ptBR}>
      <Providers>
        <html lang="pt-BR" className={manrope.variable}>
          <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          </head>
          <body className="antialiased">
            <OrganizationSchema />
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <Toaster />
            <CookieConsentBanner />
            {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
              <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
            )}
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
