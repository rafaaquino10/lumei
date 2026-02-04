'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Database, Download, Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface PrivacySettingsProps {
  user: {
    id: string
    email: string
    provider: string
    createdAt: string | Date
  }
}

export function PrivacySettings({ user }: PrivacySettingsProps) {
  const router = useRouter()
  const [exportLoading, setExportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteForm, setDeleteForm] = useState({
    password: '',
    confirmation: '',
  })

  const handleExportData = async () => {
    setExportLoading(true)

    try {
      const response = await fetch('/api/user/export')

      if (!response.ok) {
        throw new Error('Erro ao exportar dados')
      }

      // Download do arquivo
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `calculamei-dados-${user.id}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Dados exportados com sucesso!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao exportar dados')
    } finally {
      setExportLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteForm.confirmation !== 'EXCLUIR MINHA CONTA') {
      toast.error('Digite "EXCLUIR MINHA CONTA" para confirmar')
      return
    }

    setDeleteLoading(true)

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: user.provider === 'email' ? deleteForm.password : undefined,
          confirmation: deleteForm.confirmation,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir conta')
      }

      toast.success('Conta excluída com sucesso')
      router.push('/')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir conta')
    } finally {
      setDeleteLoading(false)
    }
  }

  const accountAge = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Database className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Dados e Privacidade</h2>
          <p className="text-sm text-muted-foreground">Gerencie seus dados pessoais</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Info da conta */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            Conta criada há <strong className="text-foreground">{accountAge} dias</strong>
          </p>
        </div>

        {/* Exportar dados */}
        <div className="flex items-start justify-between gap-4 p-4 border rounded-lg">
          <div>
            <h3 className="font-medium text-foreground">Exportar meus dados</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Baixe todos os seus dados em formato JSON (LGPD)
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleExportData}
            disabled={exportLoading}
          >
            {exportLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </>
            )}
          </Button>
        </div>

        {/* Excluir conta */}
        <div className="p-4 border border-destructive/30 rounded-lg bg-destructive/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium text-destructive">Excluir minha conta</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Esta ação é irreversível. Todos os seus dados serão apagados permanentemente.
              </p>
            </div>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    Excluir conta permanentemente
                  </DialogTitle>
                  <DialogDescription>
                    Esta ação não pode ser desfeita. Todos os seus cálculos, registros de faturamento
                    e configurações serão excluídos permanentemente.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {user.provider === 'email' && (
                    <div>
                      <Label htmlFor="deletePassword">Sua senha</Label>
                      <Input
                        id="deletePassword"
                        type="password"
                        value={deleteForm.password}
                        onChange={(e) => setDeleteForm({ ...deleteForm, password: e.target.value })}
                        placeholder="Digite sua senha"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="deleteConfirmation">
                      Digite <strong className="text-destructive">EXCLUIR MINHA CONTA</strong> para confirmar
                    </Label>
                    <Input
                      id="deleteConfirmation"
                      value={deleteForm.confirmation}
                      onChange={(e) => setDeleteForm({ ...deleteForm, confirmation: e.target.value.toUpperCase() })}
                      placeholder="EXCLUIR MINHA CONTA"
                      className="font-mono"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading || deleteForm.confirmation !== 'EXCLUIR MINHA CONTA'}
                  >
                    {deleteLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Excluindo...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir permanentemente
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Links úteis */}
        <div className="text-sm text-muted-foreground space-y-2">
          <a href="/termos" className="block hover:text-primary hover:underline">
            Termos de Uso
          </a>
          <a href="/privacidade" className="block hover:text-primary hover:underline">
            Política de Privacidade
          </a>
        </div>
      </div>
    </Card>
  )
}
