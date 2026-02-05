'use client'

import Link from 'next/link'
import { Menu, LayoutDashboard, LogOut, User } from 'lucide-react'
import { useAuth, SignedIn, SignedOut } from '@/lib/auth/context'
import { useAuthModal } from '@/components/auth/auth-modal-context'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/logo'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'

// Links para usuários não logados
const publicNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/calculadoras', label: 'Ferramentas' },
  { href: '/blog', label: 'Blog' },
]

// Links para usuários logados (ordem: Painel, Registrar, Ferramentas, Blog)
const authNavLinks = [
  { href: '/dashboard', label: 'Painel', icon: true },
  { href: '/registrar', label: 'Registrar', primary: true },
  { href: '/calculadoras', label: 'Ferramentas' },
  { href: '/blog', label: 'Blog' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isSignedIn, signOut } = useAuth()
  const { openLogin, openSignup } = useAuthModal()

  // Define home href based on auth status
  const homeHref = isSignedIn ? '/dashboard' : '/'

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-sm border-b border-border">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href={homeHref} className="flex items-center">
          <Logo className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          {/* Links para usuários não logados */}
          <SignedOut>
            {publicNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </SignedOut>

          {/* Links para usuários logados */}
          <SignedIn>
            {authNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.primary
                    ? 'flex items-center gap-1.5 text-sm font-medium text-white bg-mei-500 px-3 py-1.5 rounded-lg transition-colors hover:bg-mei-600'
                    : link.icon
                      ? 'flex items-center gap-1.5 text-sm font-medium text-mei-600 transition-colors hover:text-mei-700'
                      : 'text-sm font-medium text-foreground transition-colors hover:text-primary'
                }
              >
                {link.icon && <LayoutDashboard className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}
          </SignedIn>
        </nav>

        {/* Desktop Auth Buttons + Theme Toggle */}
        <div className="hidden items-center gap-4 ml-auto md:flex">
          <ThemeToggle />
          <SignedOut>
            <Button variant="ghost" onClick={openLogin}>
              Acessar
            </Button>
            <Button
              className="bg-mei-500 text-white hover:bg-mei-600"
              onClick={openSignup}
            >
              Criar conta grátis
            </Button>
          </SignedOut>

          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Menu do usuario">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-mei-500 bg-mei-100">
                    <User className="h-5 w-5 text-mei-600" aria-hidden="true" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name || 'Usuário'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/configuracoes" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader className="px-6">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-6 px-6">
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-1" aria-label="Navegação mobile">
                {/* Links para usuários não logados */}
                <SignedOut>
                  {publicNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center py-3 px-4 -mx-4 text-base font-medium text-foreground rounded-lg transition-colors hover:bg-muted active:bg-muted/80"
                    >
                      {link.label}
                    </Link>
                  ))}
                </SignedOut>

                {/* Links para usuários logados */}
                <SignedIn>
                  {authNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={
                        link.primary
                          ? 'flex items-center gap-3 py-3 px-4 -mx-4 text-base font-medium text-white bg-mei-500 rounded-lg transition-colors hover:bg-mei-600'
                          : link.icon
                            ? 'flex items-center gap-3 py-3 px-4 -mx-4 text-base font-medium text-mei-600 rounded-lg transition-colors hover:bg-muted active:bg-muted/80'
                            : 'flex items-center py-3 px-4 -mx-4 text-base font-medium text-foreground rounded-lg transition-colors hover:bg-muted active:bg-muted/80'
                      }
                    >
                      {link.icon && <LayoutDashboard className="h-5 w-5" />}
                      {link.label}
                    </Link>
                  ))}
                </SignedIn>
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-3 border-t pt-6">
                <SignedOut>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setIsOpen(false)
                      openLogin()
                    }}
                  >
                    Acessar
                  </Button>
                  <Button
                    className="w-full bg-mei-500 text-white hover:bg-mei-600"
                    onClick={() => {
                      setIsOpen(false)
                      openSignup()
                    }}
                  >
                    Criar conta grátis
                  </Button>
                </SignedOut>

                <SignedIn>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 py-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-mei-500 bg-mei-100">
                        <User className="h-5 w-5 text-mei-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user?.name || 'Usuário'}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600"
                      onClick={() => {
                        setIsOpen(false)
                        signOut()
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                </SignedIn>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
