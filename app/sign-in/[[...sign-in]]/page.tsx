import { SignIn } from '@clerk/nextjs'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Entrar | Lumei',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-lumei-500 hover:bg-lumei-600 text-white',
            footerActionLink: 'text-lumei-600 hover:text-lumei-700',
            card: 'shadow-lg',
          },
        }}
      />
    </div>
  )
}
