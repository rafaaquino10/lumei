import { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Política de Privacidade | Lumei",
  description:
    "Saiba como o Lumei protege seus dados pessoais e como usamos informações",
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-lumei-500 to-lumei-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Política de Privacidade
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Como protegemos seus dados e respeitamos sua privacidade
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Informações que Coletamos
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Coletamos as seguintes informações para fornecer e melhorar nossos
              serviços:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Nome, email e dados de contato fornecidos voluntariamente</li>
              <li>Dados sobre tipo de MEI e faturamento</li>
              <li>Histórico de cálculos realizados</li>
              <li>
                Dados de navegação e uso do site (através de cookies e
                analytics)
              </li>
              <li>Informações de pagamento (processadas via Stripe)</li>
            </ul>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Como Usamos Suas Informações
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Usamos as informações coletadas para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Fornecer e manter nossos serviços</li>
              <li>Processar pagamentos e gerenciar assinaturas</li>
              <li>Enviar alertas e notificações (com sua permissão)</li>
              <li>Melhorar e otimizar nossos serviços</li>
              <li>Analisar tendências de uso e comportamento</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Proteção de Dados
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Implementamos medidas de segurança apropriadas para proteger suas
              informações contra acesso não autorizado, alteração, divulgação ou
              destruição. Todos os dados em trânsito são criptografados usando
              HTTPS/TLS. Seguimos as melhores práticas de segurança da
              indústria.
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Cookies e Tecnologias de Rastreamento
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Usamos cookies para melhorar sua experiência, lembrar suas
              preferências e analisar o uso do site. Você pode controlar os
              cookies através das configurações do seu navegador. Para mais
              informações, consulte nossa Política de Cookies.
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Compartilhamento de Dados
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Seus dados nunca são compartilhados com terceiros sem sua
              permissão, exceto quando obrigado por lei ou para prestadores de
              serviços essenciais (como Stripe para pagamentos e Supabase para
              banco de dados). Todos os prestadores de serviços são obrigados a
              manter a confidencialidade de seus dados.
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Seus Direitos
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Sob a LGPD (Lei Geral de Proteção de Dados), você tem o direito de:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados imprecisos</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Optar por não receber comunicações de marketing</li>
              <li>Revogar sua permissão para coleta de dados</li>
            </ul>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Retenção de Dados
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Retemos seus dados pelo tempo necessário para fornecer nossos
              serviços. Você pode solicitar a exclusão de seus dados a qualquer
              momento. Após exclusão, dados serão removidos em até 30 dias.
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Contato
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Se tiver perguntas sobre esta política de privacidade ou sobre como
              gerenciamos seus dados, entre em contato conosco através do
              formulário de contato no site ou pelo email de suporte.
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Atualizações desta Política
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Esta política pode ser atualizada periodicamente. Notificaremos
              você sobre mudanças significativas postando a nova política nesta
              página. Sua continuação no uso do serviço após as alterações
              significa sua aceitação da nova política.
            </p>
          </Card>

          <div className="bg-lumei-50 rounded-lg p-6 sm:p-8 text-center mt-12">
            <p className="text-gray-600 text-sm">
              Última atualização: janeiro de 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
