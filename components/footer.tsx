import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Twitter, Mail } from 'lucide-react'

const productLinks = [
  { href: '/calculadoras', label: 'Calculadoras' },
  { href: '/premium', label: 'Premium' },
  { href: '/blog', label: 'Blog' },
]

const legalLinks = [
  { href: '/termos', label: 'Termos de Uso' },
  { href: '/privacidade', label: 'Privacidade' },
  { href: '/cookies', label: 'Cookies' },
]

const supportLinks = [
  { href: '/faq', label: 'FAQ' },
  { href: '/contato', label: 'Contato' },
]

const socialLinks = [
  { 
    href: 'https://instagram.com/lumei', 
    label: '@lumei',
    icon: Instagram,
    platform: 'Instagram'
  },
  { 
    href: 'https://twitter.com/lumei', 
    label: '@lumei',
    icon: Twitter,
    platform: 'Twitter'
  },
  { 
    href: 'mailto:contato@lumei.com.br', 
    label: 'contato@lumei.com.br',
    icon: Mail,
    platform: 'Email'
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50">
      <div className="mx-auto max-w-[1280px] px-4 py-16 md:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Column 1 - Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.svg"
                alt="Lumei"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-lg font-semibold text-gray-900">
              Lucre mais. Sempre.
            </p>
            <p className="text-sm text-gray-600">
              Calculadoras financeiras para MEI crescer.
            </p>
          </div>

          {/* Column 2 - Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-1 lg:col-span-1">
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Produto
              </h3>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors hover:text-lumei-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className="mb-4 mt-8 text-sm font-semibold text-gray-900">
                Legal
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors hover:text-lumei-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Suporte
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors hover:text-lumei-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3 - Social */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Redes Sociais
            </h3>
            <ul className="space-y-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <li key={social.platform}>
                    <a
                      href={social.href}
                      target={social.platform !== 'Email' ? '_blank' : undefined}
                      rel={social.platform !== 'Email' ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-3 text-sm text-gray-600 transition-colors hover:text-lumei-600"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{social.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Row - Copyright & Disclaimer */}
        <div className="mt-12 space-y-4 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-600">
              © {currentYear} Lumei. Todos os direitos reservados.
            </p>
            <p className="text-xs text-gray-500">
              Valores são referências. Confirme no Portal do Empreendedor.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
