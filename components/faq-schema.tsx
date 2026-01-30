import { faqContent } from "@/lib/data/faq-content";

export function FAQSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqContent.flatMap((categoria) =>
      categoria.perguntas.map((item) => ({
        "@type": "Question",
        name: item.pergunta,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.resposta,
        },
      }))
    ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
