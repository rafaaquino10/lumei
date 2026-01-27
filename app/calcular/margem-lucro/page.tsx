import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculadora de Margem de Lucro MEI | Lumei',
  description: 'Calcule sua margem de lucro real. Descubra quanto você lucra em cada venda. Ferramenta gratuita para MEI.',
}

export default function MargemLucroPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600">
        <a href="/" className="hover:text-lumei-600">Home</a>
        {' / '}
        <span className="text-gray-900">Margem de Lucro</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Calculadora de Margem de Lucro</h1>
        <p className="text-xl text-gray-600">
          Descubra quanto você lucra de verdade. Simples, rápido e preciso.
        </p>
      </div>

      {/* Main content: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="bg-white border rounded-lumei-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Dados do Cálculo</h2>
          {/* Form will go here in next prompt */}
          <div className="space-y-6">
            <p className="text-gray-500">Formulário será adicionado...</p>
          </div>
        </div>

        {/* Right: Result */}
        <div className="bg-lumei-50 border-l-4 border-lumei-500 rounded-lumei-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Resultado</h2>
          {/* Result will appear here */}
          <div className="text-center py-12">
            <p className="text-gray-400">
              Preencha os dados ao lado para ver o resultado
            </p>
          </div>
        </div>
      </div>

      {/* Explanation below */}
      <div className="mt-12 bg-gray-50 rounded-lumei-lg p-8">
        <h3 className="text-2xl font-bold mb-4">Como Calculamos</h3>
        <div className="prose max-w-none text-gray-600">
          <p>
            A margem de lucro mostra quanto você realmente ganha em cada venda.
            É essencial para precificar corretamente e garantir a saúde do seu negócio.
          </p>
          <ul className="mt-4 space-y-2">
            <li><strong>Lucro Bruto:</strong> Preço de Venda - Custo Total</li>
            <li><strong>Margem Bruta:</strong> (Lucro Bruto ÷ Preço de Venda) × 100</li>
            <li><strong>Markup:</strong> Preço de Venda ÷ Custo Total</li>
          </ul>
          <p className="mt-4 text-sm">
            ⚠️ <strong>Importante:</strong> Para MEI, a margem líquida é igual à bruta,
            pois não há imposto sobre receita (apenas o DAS fixo).
          </p>
        </div>
      </div>
    </div>
  )
}
