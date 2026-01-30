"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CategoriaFAQ } from "@/lib/data/faq-content";

interface FAQSectionProps {
  categoria: CategoriaFAQ;
  index: number;
}

export function FAQSection({ categoria, index }: FAQSectionProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {categoria.titulo}
      </h2>
      <div className="space-y-4">
        {categoria.perguntas.map((item, idx) => (
          <FAQItem
            key={`${index}-${idx}`}
            pergunta={item.pergunta}
            resposta={item.resposta}
          />
        ))}
      </div>
    </div>
  );
}

interface FAQItemProps {
  pergunta: string;
  resposta: string;
}

function FAQItem({ pergunta, resposta }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between gap-4"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900">{pergunta}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700 leading-relaxed">{resposta}</p>
        </div>
      )}
    </div>
  );
}
