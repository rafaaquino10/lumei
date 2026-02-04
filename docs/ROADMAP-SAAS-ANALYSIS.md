# Roadmap Calcula MEI - Análise Completa SaaS

> Documento de tracking baseado na análise completa solicitada.
> Última atualização: 2026-02-02 (Semana 6 completa - ROADMAP FINALIZADO)

---

## Visão Geral do Progresso

| Área | Status | Progresso |
|------|--------|-----------|
| 1. Análise de Produto | ✅ Completo | 100% |
| 2. Free vs Premium | ✅ Completo | 100% |
| 3. Preço | ✅ Completo | 100% |
| 4. UX & Jornada | ✅ Completo | 100% |
| 5. Hero Image | ✅ Completo | 100% |
| 6. SVGs e Identidade | ✅ Completo | 100% |
| 7. SEO | ✅ Completo | 100% |
| 8. Blog - Conteúdo | ✅ Completo | 100% |
| 9. AdSense | ✅ Completo | 100% |

**Progresso Total: 100% - PRONTO PARA LAUNCH**

---

## Semana 1 ✅ COMPLETA

### Tarefas Realizadas:
- [x] Fundação do projeto (Next.js 16, Prisma, Supabase)
- [x] 6 calculadoras funcionais
- [x] Sistema de autenticação JWT customizado
- [x] Dashboard do usuário
- [x] Histórico de cálculos
- [x] Exportação PDF
- [x] Funcionalidade de compartilhamento

---

## Semana 2 ✅ COMPLETA

### Tarefas Realizadas:

#### 2.1 Free vs Premium (Paywall)
- [x] Hook `usePaywall` para controle de limites
- [x] Componente `PaywallModal` para conversão
- [x] Componente `BlurredResult` - mostra resultado borrado quando bloqueado
- [x] Implementado em 5 calculadoras (margem-lucro, preco-hora, precificacao, faturamento, fluxo-caixa)
- [x] DAS calc mantida livre (referência/utilidade pública)

**Limites definidos:**
| Recurso | Free | Premium |
|---------|------|---------|
| Cálculos/mês | 10 | Ilimitado |
| Histórico | 6 meses | 5 anos |
| Alertas DAS | 1 (email) | 3 (email + WhatsApp) |
| Export PDF | 1/mês | Ilimitado |
| Export Excel | ❌ | ✅ |
| Anúncios | Sim | Não |

#### 2.2 Preço Reavaliado
- [x] Alterado de R$ 19,90 para **R$ 14,90/mês**
- [x] Plano anual: R$ 149/ano (economia de R$ 29,80)
- [x] Justificativa: ticket mais acessível para MEI, < 1 almoço

#### 2.3 AdSense - Estrutura
- [x] Arquivo `public/ads.txt` criado
- [x] Componente `AdBanner` para renderizar anúncios
- [x] Componente `AdWrapper` - oculta ads para Premium
- [x] Posicionamento na página de calculadoras
- [x] Link "Assine Premium para remover anúncios"

#### 2.4 Blog - 5 Novos Posts
- [x] `limite-faturamento-mei-como-saber` (2026-01-08)
- [x] `mei-precisa-contador-quando-contratar` (2026-01-15)
- [x] `erros-precificacao-mei` (2026-01-22)
- [x] `fluxo-caixa-mei-basico` (2026-01-28)
- [x] `novidades-calculamei-fevereiro-2026` (2026-02-01)

**Total de posts no blog: 11**

---

## Semana 3 ✅ COMPLETA

### Tarefas Realizadas:

#### 3.1 Hero Image SVG
- [x] Componente `components/hero-illustration.tsx`
- [x] Ilustração animada com Framer Motion
- [x] Elementos: calculadora, gráfico de crescimento, moedas flutuantes, badge +35%
- [x] Usa CSS variables para theming (light/dark mode)

#### 3.2 Onboarding UX Melhorado
- [x] AnimatePresence para transições suaves entre steps
- [x] Ícones visuais para tipos de MEI (Store, Wrench, Layers, Truck)
- [x] Valores do DAS exibidos por tipo (R$ 76,90 - R$ 183,16)
- [x] Progress indicator com labels dos steps
- [x] Opções de faturamento com cores indicando % do limite
- [x] Animações staggered nos form fields

#### 3.3 Schema.org Expandido
- [x] `BreadcrumbSchema` - componente reutilizável
- [x] `ReviewSchema` - para depoimentos
- [x] `PremiumReviewsSchema` - 3 reviews pré-definidos
- [x] `PremiumProductSchema` - produto com preço e aggregateRating
- [x] `BlogPostSchema` aprimorado com breadcrumbs
- [x] `BlogListingSchema` (CollectionPage)
- [x] Breadcrumbs adicionados: Premium, Blog listing, Blog posts

#### 3.4 Loading Skeletons
- [x] `components/calculadoras/calculator-skeleton.tsx`
- [x] `CalculatorSkeleton` - skeleton do form
- [x] `CalculatorNavSkeleton` - skeleton da navegação
- [x] `app/calculadoras/loading.tsx` - loading de rota

---

## Semana 4 ✅ COMPLETA

### Tarefas Realizadas:

#### 4.1 SVGs de Identidade Visual ✅
- [x] `AlertasIllustration` - Sino + calendário animado
- [x] `PremiumIllustration` - Coroa dourada com sparkles
- [x] `SegurancaIllustration` - Escudo + cadeado
- [x] `HistoricoIllustration` - Gráfico + relógio
- [x] `CalculadoraIcon` - Ícones específicos por tipo (margem, hora, preco, faturamento, fluxo, das)
- [x] Todos em `components/illustrations/index.tsx`
- [x] Animações Framer Motion, CSS variables para theming

#### 4.2 Alertas DAS (Email/WhatsApp) ✅
- [x] Template HTML de email para alerta DAS (`lib/email/templates/das-alert.ts`)
- [x] Integração com Resend (`lib/email/send.ts`)
- [x] Estrutura WhatsApp com Twilio (`lib/whatsapp/send.ts`)
- [x] Template de mensagem WhatsApp
- [x] Cron job configurado em `vercel.json` (9h diário)
- [x] Lógica de envio por plano:
  - FREE: alerta 5 dias antes
  - PREMIUM: alertas 5, 3 e 1 dia antes + WhatsApp
- [x] Rota `/api/alertas/send` com suporte multi-canal

**Variáveis de ambiente necessárias:**
```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=Calcula MEI <noreply@calculamei.com.br>
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
CRON_SECRET=
```

#### 4.3 Testes E2E ✅
- [x] Playwright configurado (`playwright.config.ts`)
- [x] Testes da home page (`e2e/home.spec.ts`)
- [x] Testes das calculadoras (`e2e/calculadoras.spec.ts`)
- [x] Testes de autenticação (`e2e/auth.spec.ts`)
- [x] Scripts npm: `test:e2e`, `test:e2e:ui`, `test:e2e:report`

---

## Semana 5 ✅ COMPLETA

### Tarefas Realizadas:

#### 5.1 Performance & Core Web Vitals ✅
- [x] Preconnect para Google Fonts e Analytics
- [x] DNS prefetch para recursos externos
- [x] Font display: swap configurado
- [x] Otimização de bundle com optimizePackageImports

#### 5.2 PWA ✅
- [x] Manifest.json aprimorado com:
  - Shortcuts para Calculadoras e Dashboard
  - Screenshots configurados
  - Categories e orientation
  - Lang e dir definidos
- [x] Página offline (`/offline`)
- [x] Install prompt component (`components/pwa/install-prompt.tsx`)
  - Detecção iOS vs Android
  - Controle de exibição (30s delay)
  - Persistência de dismissal (7 dias)

#### 5.3 Cache Strategies ✅
- [x] Utilitários de cache (`lib/cache/local-storage.ts`)
  - setCache/getCache com TTL
  - cleanExpiredCache
  - saveCalculationLocally para offline
- [x] Hooks React (`lib/cache/use-cache.ts`)
  - useCache - cache reativo
  - useCacheWithTTL - com expiração
  - useOnlineStatus - detecta conexão
  - usePreferences - preferências do usuário

---

## Semana 6 ✅ COMPLETA

### Tarefas Realizadas:

#### 6.1 Polish Final - Microcopy & Acessibilidade ✅
- [x] Skip-to-content link (`components/skip-to-content.tsx`)
- [x] Aria-labels na navegação principal (header.tsx)
- [x] Aria-labels no menu do usuário (header.tsx)
- [x] Role="contentinfo" no footer (footer.tsx)
- [x] Aria-hidden em ícones decorativos (footer.tsx)

#### 6.2 Monitoramento - Sentry ✅
- [x] `sentry.client.config.ts` - Config do browser
- [x] `sentry.server.config.ts` - Config do servidor
- [x] `sentry.edge.config.ts` - Config do edge runtime
- [x] `instrumentation.ts` - Next.js instrumentation hook
- [x] `app/global-error.tsx` - Captura erros globais para Sentry
- [x] Replay de sessão habilitado (1% sample)
- [x] Integração com App Router completa

**Variáveis de ambiente necessárias:**
```env
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

#### 6.3 Documentação ✅
- [x] README.md completamente reescrito
  - Tech stack detalhado
  - Instruções de instalação
  - Variáveis de ambiente documentadas
  - Estrutura de diretórios
  - Scripts npm
- [x] `docs/LAUNCH-CHECKLIST.md` criado
  - Checklist de infraestrutura (Vercel, DNS, Supabase)
  - Checklist de variáveis de ambiente
  - Checklist de integrações (GA4, Stripe, Sentry, Resend, Twilio)
  - Checklist de SEO e performance
  - Checklist de segurança
  - Checklist de funcionalidades
  - Checklist de testes finais
  - Procedimentos pós-launch

---

## Checklist AdSense ✅

### Requisitos Cumpridos:
- [x] Conteúdo original e de qualidade (11 posts)
- [x] Páginas obrigatórias (Termos, Privacidade, Cookies, Contato)
- [x] Navegação clara
- [x] Design responsivo
- [x] ads.txt configurado (aguardando Publisher ID)
- [x] Posicionamento de anúncios definido
- [x] UX preservada (Premium remove ads)

### Para Ativar:
1. Obter Publisher ID do Google AdSense
2. Atualizar `public/ads.txt` com o ID real
3. Atualizar `NEXT_PUBLIC_ADSENSE_CLIENT` no .env
4. Criar slots de anúncio no painel AdSense
5. Atualizar slot IDs nos componentes

---

## Arquivos Criados/Modificados

### Semana 2:
```
components/paywall/
├── index.ts
├── paywall-modal.tsx
├── use-paywall.ts
└── blurred-result.tsx

components/ads/
├── ad-banner.tsx
└── ad-wrapper.tsx

public/ads.txt

lib/blog/posts.ts (5 novos posts)
```

### Semana 3:
```
components/hero-illustration.tsx (NOVO)
components/calculadoras/calculator-skeleton.tsx (NOVO)
components/calculator-schema.tsx (BreadcrumbSchema adicionado)
components/blog-post-schema.tsx (breadcrumbs adicionados)

app/structured-data.tsx (ReviewSchema, PremiumProductSchema)
app/onboarding/page.tsx (UX melhorado)
app/calculadoras/loading.tsx (NOVO)
app/calculadoras/page.tsx (skeletons integrados)
app/premium/page.tsx (schemas adicionados)
app/blog/page.tsx (schemas adicionados)
```

### Semana 4:
```
components/illustrations/index.tsx (NOVO)
lib/whatsapp/send.ts (NOVO)
app/api/alertas/send/route.ts (ATUALIZADO - multi-canal)
playwright.config.ts (NOVO)
e2e/home.spec.ts (NOVO)
e2e/calculadoras.spec.ts (NOVO)
e2e/auth.spec.ts (NOVO)
```

### Semana 5:
```
app/manifest.ts (ATUALIZADO - shortcuts, screenshots)
app/offline/page.tsx (NOVO)
components/pwa/install-prompt.tsx (NOVO)
lib/cache/local-storage.ts (NOVO)
lib/cache/use-cache.ts (NOVO)
```

### Semana 6:
```
components/skip-to-content.tsx (NOVO)
components/header.tsx (ATUALIZADO - aria-labels)
components/footer.tsx (ATUALIZADO - aria-labels)
sentry.client.config.ts (NOVO)
sentry.server.config.ts (NOVO)
sentry.edge.config.ts (NOVO)
instrumentation.ts (NOVO)
app/global-error.tsx (ATUALIZADO - Sentry)
README.md (REESCRITO)
docs/LAUNCH-CHECKLIST.md (NOVO)
```

---

## Decisões de Produto

### Preço Premium
- **Escolhido:** R$ 14,90/mês ou R$ 149/ano
- **Razão:** Mais acessível que R$ 19,90, psicologicamente "menos que um almoço"
- **Economia anual:** R$ 29,80 (2 meses grátis)

### Limites Free
- **10 cálculos/mês:** Suficiente para experimentar, insuficiente para uso intenso
- **Resultado borrado:** Mostra que calculou mas não revela o valor exato
- **DAS liberado:** Utilidade pública, gera confiança e tráfego orgânico

### Hero Image
- **Decisão:** SVG animado em vez de screenshot
- **Razão:** Mais leve, escalável, themeable, profissional
- **Elementos:** Calculadora + gráfico de crescimento + moedas = prosperidade financeira

---

## Próximos Passos - LAUNCH

O roadmap de 6 semanas está **100% concluído**. Para o go-live:

1. **Revisar `docs/LAUNCH-CHECKLIST.md`** e completar cada item
2. **Configurar variáveis de ambiente** na Vercel
3. **Deploy para produção** via Vercel
4. **Monitorar primeiras 24h** (Sentry, GA4, Logs)
5. **Marketing** - Post de lançamento nas redes sociais

---

## Métricas de Sucesso (KPIs)

| Métrica | Meta | Status |
|---------|------|--------|
| Lighthouse Performance | > 90 | A verificar em prod |
| Calculadoras funcionais | 6/6 | ✅ 100% |
| Posts no blog | > 10 | ✅ 11 posts |
| Páginas de compliance | 4/4 | ✅ 100% |
| Schema.org | Completo | ✅ 100% |
| Paywall implementado | Sim | ✅ |
| AdSense pronto | Estrutura | ✅ (falta Publisher ID) |
| E2E Tests | Cobertura crítica | ✅ |
| PWA | Instalável | ✅ |
| Sentry | Configurado | ✅ |
| Alertas DAS | Email + WhatsApp | ✅ |
| Documentação | Completa | ✅ |

---

*Documento gerado e mantido durante desenvolvimento do Calcula MEI.*
