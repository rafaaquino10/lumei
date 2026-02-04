'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Bell, Mail, MessageCircle, Loader2, Check, Crown, Phone } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface AlertsSettingsProps {
  user: {
    alertasEmail: boolean
    alertasWhatsApp: boolean
    whatsapp: string | null
    plano: string
  }
}

export function AlertsSettings({ user }: AlertsSettingsProps) {
  const [loading, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    alertasEmail: user.alertasEmail,
    alertasWhatsApp: user.alertasWhatsApp,
    whatsapp: user.whatsapp || '',
  })

  const isPremium = user.plano === 'PREMIUM'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    try {
      const response = await fetch('/api/user/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertasEmail: form.alertasEmail,
          alertasWhatsApp: form.alertasWhatsApp,
          whatsapp: form.whatsapp || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar')
      }

      setSaved(true)
      toast.success('Configurações de alertas salvas!')
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Alertas e Notificações</h2>
          <p className="text-sm text-muted-foreground">Configure como deseja receber lembretes</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Alerta de DAS por Email */}
        <div className="flex items-start justify-between gap-4 p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <Label htmlFor="alertasEmail" className="font-medium text-foreground">
                Lembrete do DAS por email
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Receba um email 5 dias antes do vencimento do DAS
              </p>
            </div>
          </div>
          <Switch
            id="alertasEmail"
            checked={form.alertasEmail}
            onCheckedChange={(checked) => setForm({ ...form, alertasEmail: checked })}
          />
        </div>

        {/* Alerta de DAS por WhatsApp (Premium) */}
        <div className={`p-4 rounded-lg border-2 transition-colors ${
          isPremium
            ? 'bg-secondary/50 border-transparent'
            : 'bg-primary/5 border-primary/20'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <MessageCircle className={`w-5 h-5 mt-0.5 ${isPremium ? 'text-green-500' : 'text-primary'}`} />
              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="alertasWhatsApp" className="font-medium text-foreground">
                    Lembrete do DAS por WhatsApp
                  </Label>
                  {!isPremium && (
                    <Badge variant="secondary" className="text-xs">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Receba mensagens 5, 3 e 1 dia antes do vencimento
                </p>
              </div>
            </div>
            <Switch
              id="alertasWhatsApp"
              checked={form.alertasWhatsApp}
              onCheckedChange={(checked) => setForm({ ...form, alertasWhatsApp: checked })}
              disabled={!isPremium}
            />
          </div>

          {/* Campo de WhatsApp */}
          {isPremium && form.alertasWhatsApp && (
            <div className="mt-4 pl-8">
              <Label htmlFor="whatsapp">Número do WhatsApp</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="whatsapp"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: formatPhone(e.target.value) })}
                  placeholder="(11) 99999-9999"
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {/* CTA para Premium */}
          {!isPremium && (
            <div className="mt-4 pt-4 border-t border-primary/20">
              <p className="text-sm text-foreground mb-2">
                Nunca mais esqueça do DAS com alertas no WhatsApp!
              </p>
              <Link href="/premium">
                <Button size="sm" variant="default">
                  <Crown className="w-4 h-4 mr-2" />
                  Fazer upgrade para Premium
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Info sobre alertas */}
        <div className="bg-muted/50 rounded-lg p-4 text-sm">
          <h4 className="font-medium text-foreground mb-2">Como funcionam os alertas?</h4>
          <ul className="space-y-1.5 text-muted-foreground text-xs">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong>Email:</strong> Enviamos um lembrete 5 dias antes do vencimento</span>
            </li>
            {isPremium && (
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span><strong>WhatsApp:</strong> Enviamos 3 lembretes (5, 3 e 1 dia antes)</span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>O DAS vence todo dia 20 de cada mês</span>
            </li>
          </ul>
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
            'Salvar Configurações'
          )}
        </Button>
      </form>
    </Card>
  )
}
