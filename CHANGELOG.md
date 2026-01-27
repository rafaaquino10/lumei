# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [0.2.0] - 2025-01-27

### ✨ Adicionado
- **Calculadora de Margem de Lucro** - 100% funcional com validação, resultados em tempo real
- **Calculadora de Preço por Hora** - Considera férias, custos fixos e margem desejada
- **Calculadora de Precificação** - Modo dual: Produtos e Serviços com inputs específicos
- **Sistema de salvar cálculos** - API endpoint preparado para autenticação Clerk
- **Exportar PDF** - Todas as calculadoras podem exportar resultados em PDF
- **Compartilhar resultados** - Web Share API com fallback para clipboard
- **Google Analytics 4** - Tracking completo de eventos customizados:
  - `calculator_used` - Página visitada
  - `calculator_completed` - Cálculo realizado
  - `calculator_saved` - Cálculo salvo
  - `pdf_export` - PDF exportado
  - `share` - Resultado compartilhado
- **SEO completo**:
  - Sitemap.xml com 6 calculadoras + páginas principais
  - Robots.txt otimizado
  - Structured data (Organization + WebApplication)
  - Meta tags OpenGraph e Twitter Cards
  - Title templates dinâmicos
- **Componente "Outras Calculadoras"** - Sugestões contextuais em cada página
- **Componentes UI customizados**:
  - MoneyInput - Input formatado em BRL com currency.js
  - NumberInput - Input numérico com sufixo configurável
- **Animações** - Framer Motion em todos os componentes com scroll triggers
- **Toast notifications** - Sonner para feedback de ações

### 🔧 Alterado
- Homepage agora linka para calculadoras funcionais
- Grid de calculadoras atualizado (3 ativas + 3 "em breve")
- Layout melhorado com breadcrumbs em todas as páginas
- Performance otimizada com Turbopack no build
- Prisma Client gerado automaticamente no build (postinstall)

### 🗄️ Infraestrutura
- Database: Supabase PostgreSQL conectado
- Prisma schema com 3 models (User, Calculo, Alerta)
- Clerk auth instalado (não configurado ainda)
- Stripe preparado para integração futura

### 🐛 Corrigido
- Erro TypeScript em margem-lucro (despesasOperacionais removido)
- Prisma generate no build para Vercel deployment

## [0.1.0] - 2025-01-24

### ✨ Adicionado
- Landing page inicial com Hero, Steps e Pricing
- Header responsivo com mobile menu (Sheet)
- Footer com 3 colunas e links sociais
- Design system Lumei:
  - Cor principal: #00D084 (Lumei Green)
  - Escala de cores 50-900
  - Fontes: Manrope (sans) + Space Mono (mono)
  - Sombras customizadas
- Infraestrutura base:
  - Next.js 16.1.5 com App Router
  - TypeScript 5
  - Tailwind CSS v4 (CSS-first)
  - shadcn/ui components (10+ instalados)
  - Prisma 5.22.0 ORM
- Configuração completa de desenvolvimento
- Deploy automático no Vercel (região GRU1 - São Paulo)
- Repositório GitHub configurado

---

**Legenda:**
- ✨ Adicionado - Novas funcionalidades
- 🔧 Alterado - Mudanças em funcionalidades existentes
- 🐛 Corrigido - Correções de bugs
- 🗑️ Removido - Funcionalidades removidas
- 🗄️ Infraestrutura - Mudanças de infraestrutura/setup
