'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'
import { useAuthModal } from './auth-modal-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Mail, Lock } from 'lucide-react'
import { GoogleButton } from '@/components/auth/google-button'

export function LoginForm() {
  const { signIn } = useAuth()
  const { close, switchToSignup } = useAuthModal()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await signIn(email, password)

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
        <h2 className="text-2xl font-bold mb-2">Acessar</h2>
        <p className="text-muted-foreground">
          Entre na sua conta para continuar
        </p>
      </div>

      <GoogleButton mode="signin" />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">ou continue com email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              id="login-email"
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
          <Label htmlFor="login-password">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              id="login-password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            onClick={close}
            className="text-sm text-mei-600 hover:text-mei-700"
          >
            Esqueci minha senha
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-mei-500 hover:bg-mei-600"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            'Acessar'
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Ainda sem conta?{' '}
        <button
          type="button"
          onClick={switchToSignup}
          className="text-mei-600 hover:text-mei-700 font-medium"
        >
          Criar conta grátis
        </button>
      </div>
    </div>
  )
}
