'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { User, Building2, Briefcase, DollarSign, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileSettingsProps {
  user: {
    name: string | null
    email: string
    tipoMEI: string | null
    cnpj: string | null
    ocupacao: string | null
    faturamentoMedio: number | null
    temFuncionario: boolean
    provider: string
  }
}

const TIPO_MEI_OPTIONS = [
  { value: 'COMERCIO', label: 'Comércio' },
  { value: 'SERVICOS', label: 'Serviços' },
  { value: 'MISTO', label: 'Comércio e Serviços' },
  { value: 'CAMINHONEIRO', label: 'Caminhoneiro' },
]

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [loading, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: user.name || '',
    ocupacao: user.ocupacao || '',
    tipoMEI: user.tipoMEI || '',
    cnpj: user.cnpj || '',
    faturamentoMedio: user.faturamentoMedio?.toString() || '',
    temFuncionario: user.temFuncionario,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name || undefined,
          ocupacao: form.ocupacao || undefined,
          tipoMEI: form.tipoMEI || undefined,
          cnpj: form.cnpj || undefined,
          faturamentoMedio: form.faturamentoMedio ? parseFloat(form.faturamentoMedio) : undefined,
          temFuncionario: form.temFuncionario,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar')
      }

      setSaved(true)
      toast.success('Perfil atualizado com sucesso!')
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar perfil')
    } finally {
      setSaving(false)
    }
  }

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Dados do Perfil</h2>
          <p className="text-sm text-muted-foreground">Suas informações pessoais e do MEI</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email (readonly) */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={user.email}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {user.provider === 'google' ? 'Login via Google' : 'Login via email'}
          </p>
        </div>

        {/* Nome */}
        <div>
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Seu nome"
          />
        </div>

        {/* Ocupação */}
        <div>
          <Label htmlFor="ocupacao">Ocupação / Atividade</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="ocupacao"
              value={form.ocupacao}
              onChange={(e) => setForm({ ...form, ocupacao: e.target.value })}
              placeholder="Ex: Designer Gráfico"
              className="pl-10"
            />
          </div>
        </div>

        {/* Tipo MEI */}
        <div>
          <Label htmlFor="tipoMEI">Tipo de MEI</Label>
          <Select
            value={form.tipoMEI}
            onValueChange={(value) => setForm({ ...form, tipoMEI: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {TIPO_MEI_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* CNPJ */}
        <div>
          <Label htmlFor="cnpj">CNPJ (opcional)</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="cnpj"
              value={form.cnpj}
              onChange={(e) => setForm({ ...form, cnpj: formatCNPJ(e.target.value) })}
              placeholder="00.000.000/0001-00"
              className="pl-10"
            />
          </div>
        </div>

        {/* Faturamento Médio */}
        <div>
          <Label htmlFor="faturamentoMedio">Faturamento Médio Mensal (R$)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="faturamentoMedio"
              type="number"
              value={form.faturamentoMedio}
              onChange={(e) => setForm({ ...form, faturamentoMedio: e.target.value })}
              placeholder="0,00"
              className="pl-10"
            />
          </div>
        </div>

        {/* Tem funcionário */}
        <div className="flex items-center justify-between py-3 border-t">
          <div>
            <Label htmlFor="temFuncionario" className="font-medium">
              Tenho funcionário
            </Label>
            <p className="text-xs text-muted-foreground">
              MEI pode ter até 1 funcionário
            </p>
          </div>
          <Switch
            id="temFuncionario"
            checked={form.temFuncionario}
            onCheckedChange={(checked) => setForm({ ...form, temFuncionario: checked })}
          />
        </div>

        {/* Submit */}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Salvo!
            </>
          ) : (
            'Salvar Alterações'
          )}
        </Button>
      </form>
    </Card>
  )
}
