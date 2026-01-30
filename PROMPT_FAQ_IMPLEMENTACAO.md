# PROMPT DE EXECUÇÃO COMPLETO - FAQ PAGE + ACCORDION COMPONENT

## CONTEXTO
Você é um executor de código. Sua única tarefa é implementar a página FAQ do Lumei seguindo EXATAMENTE as instruções abaixo. NÃO tome decisões, NÃO proponha alternativas, NÃO melhore o código.

---

## TAREFA FECHADA

1. Instalar dependência Radix UI Accordion
2. Criar componente Accordion reutilizável
3. Criar componente FAQ Schema (JSON-LD)
4. Criar arquivo de dados FAQ
5. Criar página FAQ completa
6. Validar build

---

## PASSO 1: INSTALAR DEPENDÊNCIA

**Comando exato:**
```bash
npm install @radix-ui/react-accordion
```

**Aguardar conclusão antes de prosseguir.**

---

## PASSO 2: CRIAR ARQUIVO DE DADOS FAQ

**Caminho absoluto**: `lib/data/faq-content.ts`

**Ação**: CRIAR arquivo novo

**Conteúdo EXATO**:

```typescript
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
    titulo: "Sobre o Lumei",
    perguntas: [
      {
        pergunta: "O que é o Lumei?",
        resposta: "O Lumei é uma plataforma gratuita com 6 calculadoras financeiras desenvolvidas especialmente para MEIs (Microempreendedores Individuais). Ajudamos você a calcular margem de lucro, definir preços, simular faturamento, organizar fluxo de caixa e acompanhar o calendário do DAS. Tudo em um só lugar, de forma simples e sem complicação.",
      },
      {
        pergunta: "As calculadoras são realmente gratuitas?",
        resposta: "Sim! Você pode usar todas as 6 calculadoras gratuitamente, sem limite de vezes. No plano FREE, você pode salvar até 50 cálculos e acessar seu histórico dos últimos 6 meses. Se precisar de mais, temos o plano Premium por R$ 19/mês com cálculos ilimitados.",
      },
      {
        pergunta: "Preciso criar conta para usar?",
        resposta: "Não necessariamente. Você pode usar todas as calculadoras sem criar conta. Porém, para salvar seus cálculos e acessar o histórico, é necessário fazer um cadastro rápido e gratuito.",
      },
      {
        pergunta: "O Lumei substitui um contador?",
        resposta: "Não. O Lumei é uma ferramenta complementar para ajudar você a organizar suas finanças e tomar decisões no dia a dia. Para questões tributárias, fiscais e declarações obrigatórias, sempre consulte um contador profissional.",
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
        resposta: "Sim! O Lumei funciona em computadores, tablets e celulares. Seus dados ficam salvos na nuvem e você pode acessar de qualquer dispositivo, a qualquer hora.",
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
        resposta: "O plano FREE permite salvar até 50 cálculos, acessar histórico de 6 meses e receber 1 alerta de DAS. O Premium (R$ 19/mês) oferece cálculos salvos ilimitados, histórico completo, alertas por WhatsApp e exportação para Excel.",
      },
      {
        pergunta: "O que acontece se eu passar do limite de 50 cálculos?",
        resposta: "Quando você atingir 45 cálculos salvos, mostraremos um aviso. Ao chegar nos 50, você não poderá salvar novos cálculos até fazer upgrade para Premium ou excluir cálculos antigos. Você ainda pode usar as calculadoras normalmente, apenas não poderá salvar.",
      },
      {
        pergunta: "Como funciona o pagamento?",
        resposta: "Aceitamos cartão de crédito via Stripe (processador de pagamentos seguro usado por empresas como Amazon e Google). O valor é de R$ 19/mês, cobrado automaticamente todo mês. Não trabalhamos com boleto no momento.",
      },
      {
        pergunta: "Como cancelo minha assinatura?",
        resposta: "Acesse Configurações > Assinatura > Gerenciar assinatura. Você será direcionado para o portal de pagamentos onde pode cancelar a qualquer momento. Não há multa ou período mínimo de fidelidade.",
      },
      {
        pergunta: "O que acontece se eu cancelar o Premium?",
        resposta: "Você mantém acesso Premium até o final do período pago. Depois, volta automaticamente para o plano FREE. Se tiver mais de 50 cálculos salvos, não perde nada, mas não poderá salvar novos até ficar abaixo do limite.",
      },
    ],
  },
  {
    titulo: "MEI e Obrigações",
    perguntas: [
      {
        pergunta: "O Lumei me ajuda com a Declaração Anual (DASN-SIMEI)?",
        resposta: "Não diretamente. Nossa calculadora de Fluxo de Caixa pode ajudar você a organizar faturamento e despesas ao longo do ano, facilitando o preenchimento da declaração. Porém, o envio oficial da DASN deve ser feito no Portal do Empreendedor ou com seu contador.",
      },
      {
        pergunta: "Como sei qual é meu anexo do DAS?",
        resposta: "Depende da sua atividade: Anexo I (comércio, indústria, transporte), Anexo III (serviços em geral como designer, consultor), Anexo V (serviços específicos como cabeleireiro, arquiteto). Você pode verificar no seu CCMEI (Certificado da Condição de MEI) ou consultando um contador.",
      },
      {
        pergunta: "O Lumei emite notas fiscais?",
        resposta: "Não. O Lumei é uma ferramenta de gestão financeira, não um sistema de emissão de notas. Para emitir notas fiscais como MEI, utilize o sistema da sua prefeitura ou aplicativos específicos para isso.",
      },
    ],
  },
];
```

---

## PASSO 3: CRIAR COMPONENTE ACCORDION

**Caminho absoluto**: `components/ui/accordion.tsx`

**Ação**: CRIAR arquivo novo

**Conteúdo EXATO**:

```typescript
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-gray-200", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:bg-gray-50 px-4 sm:px-6 text-left [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0 px-4 sm:px-6 text-gray-700 leading-relaxed", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
```

---

## PASSO 4: ATUALIZAR TAILWIND CONFIG

**Caminho**: `tailwind.config.ts`

**Ação**: ADICIONAR animações no objeto `theme.extend`

**Localizar a seção `theme: { extend: { ... } }`**

**Adicionar dentro de `extend`:**

```typescript
animation: {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
},
keyframes: {
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" },
  },
},
```

**Se já existirem outras animações, mesclar com as existentes.**

---

## PASSO 5: CRIAR FAQ SCHEMA COMPONENT

**Caminho absoluto**: `components/faq-schema.tsx`

**Ação**: CRIAR arquivo novo

**Conteúdo EXATO**:

```typescript
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
```

---

## PASSO 6: CRIAR PÁGINA FAQ

**Caminho absoluto**: `app/faq/page.tsx`

**Ação**: SUBSTITUIR conteúdo completo do arquivo

**Conteúdo EXATO**:

```typescript
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
```

---

## PASSO 7: VERIFICAR CORES LUMEI NO TAILWIND

**Caminho**: `tailwind.config.ts`

**Ação**: VERIFICAR se cores `lumei-*` existem

**Localizar seção `theme.extend.colors`**

**Se NÃO existir `lumei`, ADICIONAR:**

```typescript
lumei: {
  50: "#e6fbf4",
  100: "#ccf7e9",
  200: "#99efd3",
  300: "#66e7bd",
  400: "#33dfa7",
  500: "#00d084", // cor principal
  600: "#00a86b", // cor hover
  700: "#007d50",
  800: "#005336",
  900: "#002a1b",
},
```

**Se JÁ existir, NÃO modificar.**

---

## PASSO 8: VALIDAÇÃO FINAL

**Executar comandos na ordem:**

```bash
npm run build
```

**Critérios de sucesso:**
- ✅ Build completa sem erros TypeScript
- ✅ Zero erros de import
- ✅ Zero erros de Tailwind classes
- ✅ Página acessível em `/faq`

**Depois de build bem-sucedido, executar:**

```bash
npm run dev
```

**Testar manualmente:**
1. Abrir `http://localhost:3000/faq`
2. Verificar 5 categorias visíveis
3. Clicar em uma pergunta → deve expandir
4. Clicar em outra pergunta → ambas devem ficar abertas
5. Verificar responsividade (redimensionar janela)
6. Verificar no código-fonte: `<script type="application/ld+json">` presente

---

## CHECKLIST DE ARQUIVOS

**Arquivos CRIADOS (4 arquivos):**
- [ ] `lib/data/faq-content.ts`
- [ ] `components/ui/accordion.tsx`
- [ ] `components/faq-schema.tsx`
- [ ] Substituído: `app/faq/page.tsx`

**Arquivos MODIFICADOS (1 arquivo):**
- [ ] `tailwind.config.ts` (adicionar animações + verificar cores lumei)

**Dependências INSTALADAS:**
- [ ] `@radix-ui/react-accordion`

---

## RESULTADO ESPERADO

**Ao final da execução:**
- Página FAQ acessível em `/faq`
- 5 categorias com títulos H2
- 19 perguntas em accordion interativo
- Múltiplos itens podem ficar abertos simultaneamente
- Schema JSON-LD presente no HTML
- Design responsivo (mobile + desktop)
- Cores consistentes com marca Lumei
- CTA "Ainda tem dúvidas?" visível no final
- Build sem erros
- Zero warnings TypeScript

**FIM DO PROMPT DE EXECUÇÃO**
