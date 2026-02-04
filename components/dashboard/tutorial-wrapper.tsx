'use client'

import { useRouter } from 'next/navigation'
import { TutorialModal, useTutorial } from '@/components/onboarding/tutorial-modal'

interface TutorialWrapperProps {
  isFirstLogin: boolean
}

/**
 * Wrapper client-side para o tutorial no dashboard
 * Verifica se é o primeiro login e exibe o tutorial
 */
export function TutorialWrapper({ isFirstLogin }: TutorialWrapperProps) {
  const router = useRouter()
  const { showTutorial, setShowTutorial, completeTutorial } = useTutorial()

  // Só mostra se for primeiro login E tutorial não foi completado
  const shouldShow = isFirstLogin && showTutorial

  const handleComplete = () => {
    completeTutorial()
    // Redireciona para registro após completar o tutorial
    router.push('/registrar')
  }

  const handleClose = () => {
    completeTutorial()
  }

  return (
    <TutorialModal
      isOpen={shouldShow}
      onClose={handleClose}
      onComplete={handleComplete}
    />
  )
}
