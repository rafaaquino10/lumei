'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, LayoutDashboard } from 'lucide-react'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useState } from 'react'

const publicNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/calculadoras', label: 'Calculadoras' },
  { href: '/blog', label: 'Blog' },
  // TODO: Reativar após implementação Stripe
  // { href: '/premium', label: 'Premium' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { isSignedIn } = useUser()

  // Define home href based on auth status
  const homeHref = isSignedIn ? '/dashboard' : '/'

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href={homeHref} className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Lumei"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.label === 'Home' ? homeHref : link.href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-lumei-600"
            >
              {link.label}
            </Link>
          ))}
          {/* Painel - só aparece para usuários logados */}
          <SignedIn>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-lumei-600 transition-colors hover:text-lumei-700"
            >
              <LayoutDashboard className="h-4 w-4" />
              Painel
            </Link>
          </SignedIn>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <SignedOut>
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Entrar</Link>
            </Button>
            <Button
              className="bg-lumei-500 text-white hover:bg-lumei-600"
              asChild
            >
              <Link href="/sign-up">Começar Grátis</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9 border-2 border-lumei-500',
                },
              }}
            />
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
                    className="text-lg font-medium text-gray-700 transition-colors hover:text-lumei-600"
                  >
                    {link.label}
                  </Link>
                ))}
                {/* Painel - só para usuários logados */}
                <SignedIn>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-lg font-medium text-lumei-600 transition-colors hover:text-lumei-700"
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
                    className="w-full bg-lumei-500 text-white hover:bg-lumei-600"
                    asChild
                  >
                    <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                      Começar Grátis
                    </Link>
                  </Button>
                </SignedOut>

                <SignedIn>
                  <div className="flex items-center gap-3 py-2">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: 'w-10 h-10 border-2 border-lumei-500',
                        },
                      }}
                    />
                    <span className="text-sm text-gray-600">Minha conta</span>
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
