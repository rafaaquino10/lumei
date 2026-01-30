'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, User } from 'lucide-react'

export default function SignUpPage() {
  const { signUp } = useAuth()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

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
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Criar Conta</h1>
          <p className="text-gray-600">
            Comece a usar as calculadoras gratuitamente
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome (opcional)</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="name"
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
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
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
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
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
            <p className="text-xs text-gray-500">
              Mínimo 8 caracteres, com letra maiúscula, minúscula e número
            </p>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              disabled={isLoading}
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-600 leading-tight cursor-pointer"
            >
              Li e aceito os{' '}
              <Link href="/termos" className="text-mei-600 hover:underline">
                Termos de Uso
              </Link>{' '}
              e a{' '}
              <Link href="/privacidade" className="text-mei-600 hover:underline">
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

        <div className="mt-6 text-center text-sm text-gray-600">
          Já tem conta?{' '}
          <Link
            href={redirect ? `/sign-in?redirect=${redirect}` : '/sign-in'}
            className="text-mei-600 hover:text-mei-700 font-medium"
          >
            Entrar
          </Link>
        </div>
      </Card>
    </div>
  )
}
