'use client'

import Link from 'next/link'
import { Menu, LayoutDashboard, LogOut, User } from 'lucide-react'
import { useAuth, SignedIn, SignedOut } from '@/lib/auth/context'
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

const publicNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/calculadoras', label: 'Calculadoras' },
  { href: '/blog', label: 'Blog' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isSignedIn, signOut } = useAuth()

  // Define home href based on auth status
  const homeHref = isSignedIn ? '/dashboard' : '/'

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-sm border-b border-border">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href={homeHref} className="flex items-center">
          <Logo className="h-8 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.label === 'Home' ? homeHref : link.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          {/* Painel - só aparece para usuários logados */}
          <SignedIn>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-mei-600 transition-colors hover:text-mei-700"
            >
              <LayoutDashboard className="h-4 w-4" />
              Painel
            </Link>
          </SignedIn>
        </nav>

        {/* Desktop Auth Buttons + Theme Toggle */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <SignedOut>
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Entrar</Link>
            </Button>
            <Button
              className="bg-mei-500 text-white hover:bg-mei-600"
              asChild
            >
              <Link href="/sign-up">Começar Grátis</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-mei-500 bg-mei-100">
                    <User className="h-5 w-5 text-mei-600" />
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
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Painel
                  </Link>
                </DropdownMenuItem>
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
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col gap-6">
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-4">
                {publicNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.label === 'Home' ? homeHref : link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-foreground transition-colors hover:text-mei-600"
                  >
                    {link.label}
                  </Link>
                ))}
                {/* Painel - só para usuários logados */}
                <SignedIn>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-lg font-medium text-mei-600 transition-colors hover:text-mei-700"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Painel
                  </Link>
                </SignedIn>
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="mt-4 flex flex-col gap-3 border-t pt-6">
                <SignedOut>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                      Entrar
                    </Link>
                  </Button>
                  <Button
                    className="w-full bg-mei-500 text-white hover:bg-mei-600"
                    asChild
                  >
                    <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                      Começar Grátis
                    </Link>
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
