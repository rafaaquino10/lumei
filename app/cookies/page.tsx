import { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Política de Cookies | Calcula MEI",
  description:
    "Saiba como o Calcula MEI usa cookies para melhorar sua experiência",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Política de Cookies
            </h1>
            <p className="text-base sm:text-lg opacity-90">
              Como usamos cookies para melhorar sua experiência
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <Card className="p-4">
            <h2 className="text-lg font-bold text-foreground mb-4">
              O que são Cookies?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies são pequenos arquivos de texto armazenados no seu navegador
              que ajudam a lembrar informações sobre você, como suas preferências
              e atividades no site. Eles não contêm vírus e são essenciais para
              melhorar sua experiência.
            </p>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Tipos de Cookies que Usamos
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  1. Cookies Essenciais
                </h3>
                <p className="text-muted-foreground">
                  Necessários para o funcionamento do site. Incluem autenticação
                  de usuário, segurança e conformidade legal. Não podem ser
                  desativados.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  2. Cookies de Preferência
                </h3>
                <p className="text-muted-foreground">
                  Lembram suas escolhas (como idioma, tema escuro/claro) para
                  personalizar sua experiência em visitas futuras.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  3. Cookies de Análise
                </h3>
                <p className="text-muted-foreground">
                  Ajudam a entender como você usa o site, quais páginas são
                  populares e como melhorar o serviço. Usamos Google Analytics
                  para isso.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  4. Cookies de Marketing
                </h3>
                <p className="text-muted-foreground">
                  Rastreiam suas atividades para mostrar anúncios relevantes em
                  outros sites. Você pode optar por não participar.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Tabela de Cookies
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-muted-foreground">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-3 px-4 font-semibold">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold">Tipo</th>
                    <th className="text-left py-3 px-4 font-semibold">Duração</th>
                    <th className="text-left py-3 px-4 font-semibold">Propósito</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">_ga</td>
                    <td className="py-3 px-4">Analytics</td>
                    <td className="py-3 px-4">2 anos</td>
                    <td className="py-3 px-4">Google Analytics</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">_gid</td>
                    <td className="py-3 px-4">Analytics</td>
                    <td className="py-3 px-4">24 horas</td>
                    <td className="py-3 px-4">Google Analytics</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">calculamei_cookie_consent</td>
                    <td className="py-3 px-4">Preferência</td>
                    <td className="py-3 px-4">1 ano</td>
                    <td className="py-3 px-4">Consentimento do usuário</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">session_id</td>
                    <td className="py-3 px-4">Essencial</td>
                    <td className="py-3 px-4">Sessão</td>
                    <td className="py-3 px-4">Manter sua sessão autenticada</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">csrf_token</td>
                    <td className="py-3 px-4">Essencial</td>
                    <td className="py-3 px-4">Sessão</td>
                    <td className="py-3 px-4">Segurança contra ataques</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Como Controlar Cookies
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              A maioria dos navegadores permite controlar cookies através de
              suas configurações:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
              <li>
                <strong>Chrome:</strong> Configurações → Privacidade e segurança
                → Cookies
              </li>
              <li>
                <strong>Firefox:</strong> Configurações → Privacidade e Segurança
              </li>
              <li>
                <strong>Safari:</strong> Preferências → Privacidade →
                Gerenciar dados do site
              </li>
              <li>
                <strong>Edge:</strong> Configurações → Privacidade e segurança
                → Cookies
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Você também pode usar opt-out tools para restringir cookies de
              publicidade em vários sites.
            </p>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Cookies de Terceiros
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Alguns cookies vêm de parceiros como Google Analytics e Stripe. Eles
              estão sujeitos às políticas de privacidade desses serviços. Você
              pode optar por não permitir cookies de terceiros nas configurações
              do seu navegador.
            </p>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Consentimento
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ao continuar navegando no Calcula MEI após ver nossa notificação de
              cookies, você concorda com o uso de cookies conforme descrito nesta
              política. Você pode revogar seu consentimento a qualquer momento
              alterando suas configurações de cookies.
            </p>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Atualizações desta Política
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Esta política pode ser atualizada periodicamente. Notificaremos você
              sobre mudanças significativas postando a nova política nesta página.
            </p>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Contato
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Se tiver perguntas sobre cookies ou nossa política, entre em
              contato através do formulário de contato no site.
            </p>
          </Card>

          <div className="bg-secondary rounded-lg p-4 text-center mt-8">
            <p className="text-muted-foreground text-sm">
              Última atualização: janeiro de 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
