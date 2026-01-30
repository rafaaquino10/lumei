import { Metadata } from "next";
import Link from "next/link";
import { faqContent } from "@/lib/data/faq-content";
import { FAQSection } from "@/components/faq/faq-section";

export const metadata: Metadata = {
  title: "Perguntas Frequentes | Lumei",
  description:
    "Tire suas dúvidas sobre o Lumei: calculadoras, planos, pagamentos, segurança e obrigações do MEI.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Perguntas Frequentes
          </h1>
          <p className="text-xl text-blue-100">
            Encontre respostas rápidas sobre o Lumei, calculadoras, planos e
            muito mais.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {faqContent.map((categoria, index) => (
          <FAQSection key={index} categoria={categoria} index={index} />
        ))}

        {/* CTA Footer */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Não encontrou sua resposta?
            </h3>
            <p className="text-gray-700 mb-6">
              Entre em contato conosco e teremos prazer em ajudar.
            </p>
            <Link
              href="/contato"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Falar com o suporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}