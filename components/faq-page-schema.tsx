interface FAQItem {
  question: string
  answer: string
}

interface FAQPageSchemaProps {
  faqs: FAQItem[]
  pageUrl: string
  pageTitle: string
}

export function FAQPageSchema({ faqs, pageUrl, pageTitle }: FAQPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: pageTitle,
    url: pageUrl,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// FAQs pré-definidas para a página Premium
export function PremiumFAQSchema() {
  const faqs = [
    {
      question: 'Posso cancelar a qualquer momento?',
      answer: 'Sim! Você pode cancelar quando quiser, sem multa e sem burocracia. O cancelamento é feito diretamente no seu painel com apenas 1 clique.',
    },
    {
      question: 'Como funciona o pagamento do Calcula MEI Premium?',
      answer: 'Aceitamos cartão de crédito com renovação automática mensal, e também PIX com 5% de desconto no plano anual. O valor é R$ 19/mês ou R$ 190/ano.',
    },
    {
      question: 'Tem reembolso se eu não gostar?',
      answer: 'Sim! Se você não gostar, devolvemos 100% do valor nos primeiros 7 dias após o primeiro pagamento. Garantia total de satisfação.',
    },
    {
      question: 'Como funcionam os alertas de WhatsApp do DAS?',
      answer: 'Você cadastra seu número de WhatsApp e recebe mensagens automáticas 5, 3 e 1 dia antes do vencimento do DAS. Assim você nunca mais esquece de pagar!',
    },
    {
      question: 'Posso mudar de plano depois?',
      answer: 'Sim! Você pode fazer upgrade para Premium ou voltar para o plano gratuito a qualquer momento. As mudanças são aplicadas imediatamente.',
    },
  ]

  return (
    <FAQPageSchema
      faqs={faqs}
      pageUrl="https://calculamei.com.br/premium"
      pageTitle="Calcula MEI Premium - Perguntas Frequentes"
    />
  )
}
