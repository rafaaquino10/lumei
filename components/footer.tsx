import Link from 'next/link'
import { Instagram, Twitter, Mail } from 'lucide-react'
import { Logo } from '@/components/logo'

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
    href: 'https://instagram.com/calculamei',
    icon: Instagram,
    label: 'Instagram',
  },
  {
    href: 'https://twitter.com/calculamei',
    icon: Twitter,
    label: 'Twitter',
  },
  {
    href: 'mailto:contato@calculamei.com.br',
    icon: Mail,
    label: 'Email',
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border" role="contentinfo" aria-label="Rodapé do site">
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6 lg:px-8">
        {/* Main Footer Content - 4 columns */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
          {/* Column 1 - Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <Logo className="h-7 w-auto" />
            </Link>
            <p className="mt-2 text-sm font-medium text-foreground">
              Lucre mais. Sempre.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Calculadoras financeiras para MEI
            </p>
            {/* Social icons */}
            <div className="mt-3 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.label !== 'Email' ? '_blank' : undefined}
                    rel={social.label !== 'Email' ? 'noopener noreferrer' : undefined}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Column 2 - Produto */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Produto
            </h3>
            <ul className="space-y-1.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Suporte */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Suporte
            </h3>
            <ul className="space-y-1.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Legal
            </h3>
            <ul className="space-y-1.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Row - Copyright & Disclaimer */}
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground md:flex-row">
          <p>© {currentYear} Calcula MEI. Todos os direitos reservados.</p>
          <p>Valores são referências. Confirme no Portal do Empreendedor.</p>
        </div>
      </div>
    </footer>
  )
}
