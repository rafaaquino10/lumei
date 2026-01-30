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
  title: "Perguntas Frequentes | Lumei",
  description:
    "Encontre respostas sobre as calculadoras do Lumei, planos, pagamento e como usar as ferramentas para seu MEI.",
};

export default function FAQPage() {
  return (
    <>
      <FAQSchema />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-lumei-500 to-lumei-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Perguntas Frequentes
              </h1>
              <p className="text-lg sm:text-xl text-white/90">
                Tire suas dúvidas sobre o Lumei e como ele pode ajudar seu MEI
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqContent.map((categoria, categoriaIndex) => (
              <div key={categoriaIndex} className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {categoria.titulo}
                </h2>
                <Accordion
                  type="multiple"
                  className="w-full bg-white rounded-lg border border-gray-200 divide-y divide-gray-200"
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
            <div className="mt-16 pt-12 border-t border-gray-200">
              <div className="bg-gradient-to-br from-lumei-50 to-lumei-100 rounded-2xl p-8 sm:p-12 text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Ainda tem dúvidas?
                </h3>
                <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                  Nossa equipe está pronta para ajudar você a aproveitar ao
                  máximo as ferramentas do Lumei.
                </p>
                <Link
                  href="/contato"
                  className="inline-block bg-lumei-600 text-white px-8 py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-lumei-700 transition-colors shadow-lg hover:shadow-xl"
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