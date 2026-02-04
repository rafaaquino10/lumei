'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type ModalView = 'login' | 'signup' | null

interface AuthModalContextType {
  isOpen: boolean
  view: ModalView
  openLogin: () => void
  openSignup: () => void
  close: () => void
  switchToLogin: () => void
  switchToSignup: () => void
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ModalView>(null)

  const openLogin = useCallback(() => setView('login'), [])
  const openSignup = useCallback(() => setView('signup'), [])
  const close = useCallback(() => setView(null), [])
  const switchToLogin = useCallback(() => setView('login'), [])
  const switchToSignup = useCallback(() => setView('signup'), [])

  return (
    <AuthModalContext.Provider
      value={{
        isOpen: view !== null,
        view,
        openLogin,
        openSignup,
        close,
        switchToLogin,
        switchToSignup,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider')
  }
  return context
}
