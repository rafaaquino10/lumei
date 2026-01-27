export default function ContatoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Contato</h1>
      <p className="text-gray-600 mb-6">Se tiver dúvidas, sugestões ou precisar de ajuda, entre em contato conosco. Responderemos o mais rápido possível.</p>

      <div className="space-y-4 max-w-lg">
        <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Suporte</h2>
          <p className="text-sm text-gray-700">Email: <a className="text-lumei-600 font-medium" href="mailto:contato@lumei.com.br">contato@lumei.com.br</a></p>
          <p className="text-sm text-gray-700 mt-2">Tempo médio de resposta: 1–2 dias úteis.</p>
        </div>

        <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Parcerias e imprensa</h2>
          <p className="text-sm text-gray-700">Para parcerias e imprensa, envie um email para <a className="text-lumei-600 font-medium" href="mailto:contato@lumei.com.br">contato@lumei.com.br</a> com o assunto apropriado.</p>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Contato | Lumei',
  description: 'Entre em contato com o time Lumei — suporte, parcerias e imprensa.',
}
