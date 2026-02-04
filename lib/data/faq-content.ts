export interface Pergunta {
  pergunta: string;
  resposta: string;
}

export interface CategoriaFAQ {
  titulo: string;
  perguntas: Pergunta[];
}

export const faqContent: CategoriaFAQ[] = [
  {
    titulo: "Sobre o Calcula MEI",
    perguntas: [
      {
        pergunta: "O que é o Calcula MEI?",
        resposta: "O Calcula MEI é uma plataforma gratuita com 6 calculadoras financeiras desenvolvidas especialmente para MEIs (Microempreendedores Individuais). Ajudamos você a calcular margem de lucro, definir preços, simular faturamento, organizar fluxo de caixa e acompanhar o calendário do DAS. Tudo em um só lugar, de forma simples e sem complicação.",
      },
      {
        pergunta: "As calculadoras são realmente gratuitas?",
        resposta: "Sim! Você pode usar todas as 6 calculadoras gratuitamente. No plano FREE, você tem 10 cálculos por mês e acesso ao histórico dos últimos 6 meses. Se precisar de mais, temos o plano Premium por R$ 14,90/mês com cálculos ilimitados.",
      },
      {
        pergunta: "Preciso criar conta para usar?",
        resposta: "Não necessariamente. Você pode usar todas as calculadoras sem criar conta. Porém, para salvar seus cálculos e acessar o histórico, é necessário fazer um cadastro rápido e gratuito.",
      },
      {
        pergunta: "O Calcula MEI substitui um contador?",
        resposta: "Não. O Calcula MEI é uma ferramenta complementar para ajudar você a organizar suas finanças e tomar decisões no dia a dia. Para questões tributárias, fiscais e declarações obrigatórias, sempre consulte um contador profissional.",
      },
    ],
  },
  {
    titulo: "Calculadoras",
    perguntas: [
      {
        pergunta: "Quais calculadoras estão disponíveis?",
        resposta: "Oferecemos 6 calculadoras: Margem de Lucro (calcule quanto você realmente lucra), Preço por Hora (descubra quanto cobrar por hora), Precificação (defina o preço ideal dos seus produtos/serviços), Simulador de Faturamento (projete seu faturamento mensal/anual), Fluxo de Caixa (organize entradas e saídas), e Calendário DAS (veja quanto pagar de imposto mensal).",
      },
      {
        pergunta: "Como o DAS é calculado?",
        resposta: "O cálculo do DAS depende do seu anexo (tipo de atividade). No Anexo I (comércio) você paga 4% do salário mínimo, Anexo III (serviços) paga 6%, e Anexo V (serviços específicos) paga 15,5%. Nossa calculadora usa os valores oficiais atualizados de 2026 (salário mínimo R$ 1.518).",
      },
      {
        pergunta: "Os cálculos são salvos automaticamente?",
        resposta: "Não. Você precisa clicar no botão \"Salvar\" após fazer um cálculo. Isso permite que você experimente diferentes cenários antes de decidir salvar. Cálculos salvos ficam disponíveis no seu histórico.",
      },
      {
        pergunta: "Posso exportar meus cálculos?",
        resposta: "Sim! Assinantes Premium podem exportar todo o histórico de cálculos para Excel (formato .xlsx), facilitando a organização e compartilhamento com seu contador ou sócios.",
      },
      {
        pergunta: "Os valores das calculadoras são confiáveis?",
        resposta: "Sim. Todas as fórmulas são baseadas em práticas contábeis e fiscais vigentes no Brasil. Para o DAS, usamos valores oficiais atualizados. Porém, cada negócio é único, então use os resultados como referência e consulte um contador para decisões importantes.",
      },
    ],
  },
  {
    titulo: "Conta e Acesso",
    perguntas: [
      {
        pergunta: "Meus dados estão seguros?",
        resposta: "Sim. Usamos criptografia de ponta a ponta e seguimos as normas da LGPD (Lei Geral de Proteção de Dados). Seus dados nunca são compartilhados com terceiros. Você pode acessar nossa Política de Privacidade para mais detalhes.",
      },
      {
        pergunta: "Como faço login?",
        resposta: "Você pode fazer login com Google, e-mail ou outros provedores seguros. Não armazenamos sua senha, utilizamos autenticação moderna e segura via Clerk.",
      },
      {
        pergunta: "Posso acessar de qualquer dispositivo?",
        resposta: "Sim! O Calcula MEI funciona em computadores, tablets e celulares. Seus dados ficam salvos na nuvem e você pode acessar de qualquer dispositivo, a qualquer hora.",
      },
      {
        pergunta: "Como excluo minha conta?",
        resposta: "Acesse Configurações > Conta > Excluir conta. A exclusão é permanente e todos os seus dados serão removidos em até 30 dias. Se tiver uma assinatura ativa, ela será cancelada automaticamente.",
      },
    ],
  },
  {
    titulo: "Planos e Pagamento",
    perguntas: [
      {
        pergunta: "Qual a diferença entre FREE e PREMIUM?",
        resposta: "O plano FREE permite 10 cálculos por mês, acessar histórico de 6 meses e receber 1 alerta de DAS. O Premium (R$ 14,90/mês) oferece cálculos ilimitados, histórico de 5 anos, alertas por WhatsApp e exportação para Excel.",
      },
      {
        pergunta: "O que acontece se eu atingir o limite mensal?",
        resposta: "Quando você atingir os 10 cálculos do mês, não poderá fazer novos cálculos até o próximo mês ou fazer upgrade para Premium. O limite é renovado automaticamente no início de cada mês.",
      },
      {
        pergunta: "Como funciona o pagamento?",
        resposta: "Aceitamos cartão de crédito via Stripe (processador de pagamentos seguro usado por empresas como Amazon e Google). O valor é de R$ 14,90/mês, cobrado automaticamente todo mês. Não trabalhamos com boleto no momento.",
      },
      {
        pergunta: "Como cancelo minha assinatura?",
        resposta: "Acesse Configurações > Assinatura > Gerenciar assinatura. Você será direcionado para o portal de pagamentos onde pode cancelar a qualquer momento. Não há multa ou período mínimo de fidelidade.",
      },
      {
        pergunta: "O que acontece se eu cancelar o Premium?",
        resposta: "Você mantém acesso Premium até o final do período pago. Depois, volta automaticamente para o plano FREE com 10 cálculos por mês. Seu histórico continua salvo.",
      },
    ],
  },
  {
    titulo: "MEI e Obrigações",
    perguntas: [
      {
        pergunta: "O Calcula MEI me ajuda com a Declaração Anual (DASN-SIMEI)?",
        resposta: "Não diretamente. Nossa calculadora de Fluxo de Caixa pode ajudar você a organizar faturamento e despesas ao longo do ano, facilitando o preenchimento da declaração. Porém, o envio oficial da DASN deve ser feito no Portal do Empreendedor ou com seu contador.",
      },
      {
        pergunta: "Como sei qual é meu anexo do DAS?",
        resposta: "Depende da sua atividade: Anexo I (comércio, indústria, transporte), Anexo III (serviços em geral como designer, consultor), Anexo V (serviços específicos como cabeleireiro, arquiteto). Você pode verificar no seu CCMEI (Certificado da Condição de MEI) ou consultando um contador.",
      },
      {
        pergunta: "O Calcula MEI emite notas fiscais?",
        resposta: "Não. O Calcula MEI é uma ferramenta de gestão financeira, não um sistema de emissão de notas. Para emitir notas fiscais como MEI, utilize o sistema da sua prefeitura ou aplicativos específicos para isso.",
      },
    ],
  },
];
