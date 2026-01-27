import { Card } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import Link from 'next/link'

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Blog Lumei</h1>
      <p className="text-xl text-gray-600 mb-12">
        Dicas, guias e novidades para MEI crescer
      </p>

      <Card className="p-12 text-center">
        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">
          Em breve: artigos sobre gestão financeira, precificação, impostos e
          muito mais!
        </p>
        <p className="text-sm text-gray-400">
          Enquanto isso, aproveite nossas calculadoras gratuitas →{' '}
          <Link href="/" className="text-lumei-600 hover:underline">
            Acessar
          </Link>
        </p>
      </Card>
    </div>
  )
}

export const metadata = {
  title: 'Blog',
  description: 'Dicas, guias e novidades sobre gestão financeira para MEI.',
}
