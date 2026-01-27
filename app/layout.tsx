import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Space_Mono } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Lumei - Lucre mais. Sempre.',
  description: 'Calculadoras financeiras feitas para MEI crescer. Calcule margem de lucro, preço por hora, DAS e muito mais. 100% grátis.',
  keywords: ['MEI', 'calculadora', 'margem de lucro', 'preço por hora', 'DAS', 'microempreendedor'],
  appleWebApp: {
    title: 'luMEI',
  },
  openGraph: {
    title: 'Lumei - Calculadoras para MEI',
    description: 'Lucre mais. Sempre.',
    url: 'https://lumei.com.br',
    siteName: 'Lumei',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${spaceMono.variable}`}>
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
