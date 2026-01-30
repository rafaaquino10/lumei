import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Twitter, Mail } from 'lucide-react'

const productLinks = [
  { href: '/calculadoras', label: 'Calculadoras' },
  { href: '/premium', label: 'Premium' },
  { href: '/blog', label: 'Blog' },
]

const supportLinks = [
  { href: '/faq', label: 'FAQ' },
  { href: '/contato', label: 'Contato' },
]

const legalLinks = [
  { href: '/termos', label: 'Termos' },
  { href: '/privacidade', label: 'Privacidade' },
  { href: '/cookies', label: 'Cookies' },
]

const socialLinks = [
  {
    href: 'https://instagram.com/lumei',
    icon: Instagram,
    label: 'Instagram',
  },
  {
    href: 'https://twitter.com/lumei',
    icon: Twitter,
    label: 'Twitter',
  },
  {
    href: 'mailto:contato@lumei.com.br',
    icon: Mail,
    label: 'Email',
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-6 lg:px-8">
        {/* Main Footer Content - 4 columns */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Column 1 - Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.svg"
                alt="Lumei"
                width={100}
                height={28}
                className="h-7 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-3 text-sm font-medium text-white">
              Lucre mais. Sempre.
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Calculadoras financeiras para MEI
            </p>
            {/* Social icons */}
            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.label !== 'Email' ? '_blank' : undefined}
                    rel={social.label !== 'Email' ? 'noopener noreferrer' : undefined}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-lumei-500 hover:text-white"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Column 2 - Produto */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Produto
            </h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 transition-colors hover:text-lumei-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Suporte */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Suporte
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 transition-colors hover:text-lumei-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Legal
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 transition-colors hover:text-lumei-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Row - Copyright & Disclaimer */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-gray-800 pt-6 text-xs text-gray-500 md:flex-row">
          <p>© {currentYear} Lumei. Todos os direitos reservados.</p>
          <p>Valores são referências. Confirme no Portal do Empreendedor.</p>
        </div>
      </div>
    </footer>
  )
}
