import { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Termos de Uso | Calcula MEI",
  description:
    "Termos e condições de uso das calculadoras e serviços do Calcula MEI",
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-mei-500 to-mei-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Termos de Uso
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Condições e regras para uso das ferramentas do Calcula MEI
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Aceitação dos Termos
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Ao acessar e usar o Calcula MEI, você concorda em estar vinculado a estes
              Termos de Uso. Se você não concorda com qualquer parte destes
              termos, não deve usar o serviço.
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Descrição do Serviço
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              O Calcula MEI fornece calculadoras financeiras para MEIs com fins
              educacionais e informativos. Os resultados das calculadoras são
              estimativas baseadas em fórmulas matemáticas e dados informados por
              você. Não constituem aconselhamento financeiro profissional.
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Limitação de Responsabilidade
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              O Calcula MEI não é responsável por:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Precisão ou atualização das calculadoras</li>
              <li>Decisões financeiras tomadas com base nos resultados</li>
              <li>Perda ou dano decorrente do uso do serviço</li>
              <li>Indisponibilidade temporária do serviço</li>
              <li>Consequências fiscais ou tributárias de seus cálculos</li>
            </ul>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Uso Apropriado
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Você concorda em usar o Calcula MEI apenas para fins legais e apropriados.
              Você não deve:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Usar o serviço para fins ilegais ou não autorizados</li>
              <li>Tentar contornar medidas de segurança</li>
              <li>Fazer engenharia reversa do código</li>
              <li>Rever excessivamente o serviço (web scraping)</li>
              <li>Transmitir malware ou código malicioso</li>
            </ul>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Propriedade Intelectual
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Todo conteúdo, funcionalidade e design do Calcula MEI são propriedade de
              Calcula MEI e protegidos por leis de direitos autorais. Você pode
              visualizar e imprimir páginas para uso pessoal, mas não pode
              reproduzir, distribuir ou transmitir o conteúdo sem permissão.
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Contas de Usuário
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Se você criar uma conta no Calcula MEI, você é responsável por manter a
              confidencialidade de suas credenciais de login. Você concorda em
              aceitar responsabilidade por todas as atividades que ocorrem sob sua
              conta.
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Pagamentos e Reembolsos
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Assinaturas Premium são cobradas mensalmente antecipadamente. Você
              pode cancelar a qualquer momento sem multa. Se insatisfeito dentro
              dos primeiros 7 dias, oferecemos reembolso total.
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Isenção de Garantias
            </h2>
            <p className="text-gray-700 leading-relaxed">
              O Calcula MEI é fornecido &quot;no estado em que se encontra&quot; sem garantias de
              qualquer tipo. Não garantimos que o serviço será ininterrupto ou
              livre de erros. Você usa o serviço por sua conta e risco.
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Consultoria Profissional
            </h2>
            <p className="text-gray-700 leading-relaxed">
              O Calcula MEI NÃO substitui aconselhamento profissional de um contador,
              advogado ou consultor financeiro. Para decisões importantes,
              sempre consulte um profissional qualificado.
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Modificações dos Termos
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Reservamos o direito de modificar estes termos a qualquer momento.
              Notificaremos você sobre alterações significativas por email ou
              aviso na plataforma. Seu uso continuado do serviço constitui
              aceitação dos termos modificados.
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Lei Aplicável
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Estes termos são regidos pelas leis da República Federativa do
              Brasil. Qualquer disputa será resolvida nos tribunais brasileiros.
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Contato
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Para dúvidas sobre estes termos, entre em contato através do
              formulário de contato no site ou pelo email de suporte.
            </p>
          </Card>

          <div className="bg-mei-50 rounded-lg p-6 sm:p-8 text-center mt-12">
            <p className="text-gray-600 text-sm">
              Última atualização: janeiro de 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
