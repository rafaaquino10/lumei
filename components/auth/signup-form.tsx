'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'
import { useAuthModal } from './auth-modal-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, User } from 'lucide-react'
import { GoogleButton } from '@/components/auth/google-button'

export function SignupForm() {
  const { signUp } = useAuth()
  const { close, switchToLogin } = useAuthModal()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptTerms) {
      toast.error('Você precisa aceitar os termos de uso')
      return
    }

    setIsLoading(true)

    const result = await signUp(email, password, name || undefined)

    if (result.error) {
      toast.error(result.error)
      setIsLoading(false)
    } else {
      close()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Criar Conta</h2>
        <p className="text-muted-foreground">
          Comece a usar as calculadoras gratuitamente
        </p>
      </div>

      <GoogleButton mode="signup" />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">ou cadastre com email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name">Nome (opcional)</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              id="signup-name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              id="signup-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              id="signup-password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
              minLength={8}
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Mínimo 8 caracteres, com letra maiúscula, minúscula e número
          </p>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="signup-terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            disabled={isLoading}
          />
          <label
            htmlFor="signup-terms"
            className="text-sm text-muted-foreground leading-tight cursor-pointer"
          >
            Li e aceito os{' '}
            <Link href="/termos" onClick={close} className="text-mei-600 hover:underline">
              Termos de Uso
            </Link>{' '}
            e a{' '}
            <Link href="/privacidade" onClick={close} className="text-mei-600 hover:underline">
              Política de Privacidade
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-mei-500 hover:bg-mei-600"
          disabled={isLoading || !acceptTerms}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar Conta Grátis'
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <button
          type="button"
          onClick={switchToLogin}
          className="text-mei-600 hover:text-mei-700 font-medium"
        >
          Acessar
        </button>
      </div>
    </div>
  )
}
