'use client'

import { useAuthModal } from './auth-modal-context'
import { LoginForm } from './login-form'
import { SignupForm } from './signup-form'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

export function AuthModal() {
  const { isOpen, view, close } = useAuthModal()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent
        className={
          view === 'signup'
            ? 'sm:max-w-md p-8 bg-background/95 backdrop-blur-sm'
            : 'sm:max-w-md p-8'
        }
      >
        <DialogTitle className="sr-only">
          {view === 'login' ? 'Acessar sua conta' : 'Criar nova conta'}
        </DialogTitle>
        {view === 'login' && <LoginForm />}
        {view === 'signup' && <SignupForm />}
      </DialogContent>
    </Dialog>
  )
}
