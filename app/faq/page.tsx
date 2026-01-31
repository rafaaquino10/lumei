import { Metadata } from "next";
import Link from "next/link";
import { faqContent } from "@/lib/data/faq-content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQSchema } from "@/components/faq-schema";

export const metadata: Metadata = {
  title: "Perguntas Frequentes | Calcula MEI",
  description:
    "Encontre respostas sobre as calculadoras do Calcula MEI, planos, pagamento e como usar as ferramentas para seu MEI.",
};

export default function FAQPage() {
  return (
    <>
      <FAQSchema />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Perguntas Frequentes
              </h1>
              <p className="text-base sm:text-lg opacity-90">
                Tire suas dúvidas sobre o Calcula MEI e como ele pode ajudar seu MEI
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {faqContent.map((categoria, categoriaIndex) => (
              <div key={categoriaIndex} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {categoria.titulo}
                </h2>
                <Accordion
                  type="multiple"
                  className="w-full bg-card rounded-lg border border-border divide-y divide-border"
                >
                  {categoria.perguntas.map((item, index) => (
                    <AccordionItem
                      key={`${categoriaIndex}-${index}`}
                      value={`item-${categoriaIndex}-${index}`}
                      className="border-b-0"
                    >
                      <AccordionTrigger className="text-base sm:text-lg">
                        {item.pergunta}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm sm:text-base">
                        {item.resposta}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}

            {/* CTA Section */}
            <div className="mt-8 pt-8 border-t border-border">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 sm:p-8 text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                  Ainda tem dúvidas?
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Nossa equipe está pronta para ajudar você a aproveitar ao
                  máximo as ferramentas do Calcula MEI.
                </p>
                <Link
                  href="/contato"
                  className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                >
                  Falar com o suporte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}