import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import { AuthProvider } from '@/lib/auth/context';
import { AuthModalProvider } from '@/components/auth/auth-modal-context';
import { AuthModal } from '@/components/auth/auth-modal';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { OrganizationSchema, SoftwareApplicationSchema } from "./structured-data";
import { Providers } from "./providers";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { PWAInstallPrompt, ServiceWorkerRegister } from "@/components/pwa";
import { SkipToContent } from "@/components/skip-to-content";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL('https://calculamei.com.br'),
  title: {
    default: 'Calcula MEI - Controle seu MEI em 1 minuto/mês',
    template: '%s | Calcula MEI',
  },
  verification: {
    google: '1ef182a217917cfd',
  },
  description: 'Controle financeiro completo para MEI. Registre seu faturamento, acompanhe o limite de R$ 81.000 e nunca esqueça do DAS. Grátis para começar.',
  keywords: [
    'MEI',
    'controle financeiro MEI',
    'limite MEI',
    'faturamento MEI',
    'DAS MEI',
    'microempreendedor individual',
    'gestão MEI',
    'calculadora MEI',
    'margem de lucro',
    'preço por hora',
    'fluxo de caixa MEI',
    '81000 MEI',
    'desenquadramento MEI',
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
    title: 'Calcula MEI - Controle seu MEI em 1 minuto/mês',
    description: 'Registre seu faturamento e saiba exatamente como está seu negócio. Controle do limite, alertas de DAS e ferramentas financeiras. Grátis.',
    siteName: 'Calcula MEI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calcula MEI - Controle seu MEI em 1 minuto/mês',
    description: 'Controle financeiro completo para MEI. Grátis para começar.',
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
        {/* Preconnect para recursos externos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID && (
          <>
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>
      <body className="antialiased">
        <Providers>
          <AuthProvider>
            <AuthModalProvider>
              <SkipToContent />
              <OrganizationSchema />
              <SoftwareApplicationSchema />
              <Header />
              <main id="main-content" className="min-h-screen" role="main">
                {children}
              </main>
              <Footer />
              <Toaster />
              <CookieConsentBanner />
              <PWAInstallPrompt />
              <ServiceWorkerRegister />
              <AuthModal />
            </AuthModalProvider>
          </AuthProvider>
        </Providers>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
