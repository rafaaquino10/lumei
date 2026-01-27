'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export function DeleteCalculationButton({ id }: { id: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este cálculo?')) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/calculos/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('✅ Cálculo excluído', {
          description: 'O cálculo foi removido com sucesso.',
        })
        router.refresh()
      } else {
        throw new Error('Failed to delete')
      }
    } catch {
      toast.error('❌ Erro ao excluir', {
        description: 'Tente novamente.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="w-full text-red-600 hover:text-red-700"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="w-4 h-4 mr-2" />
      {isDeleting ? 'Excluindo...' : 'Excluir'}
    </Button>
  )
}
