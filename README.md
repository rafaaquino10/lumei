# 💚 Calcula MEI - Lucre mais. Sempre.

Calculadoras financeiras feitas para MEI crescer. Modelo freemium com plano gratuito generoso.

🚀 **Status:** Pronto para produção | **Live:** [calculamei.com.br](https://calculamei.com.br)

---

## 📊 Funcionalidades

### Calculadoras (6 disponíveis)
- **Margem de Lucro** - Calcule sua margem real
- **Preço por Hora** - Descubra quanto cobrar
- **Precificação** - Preço ideal para produtos/serviços
- **Simulador de Faturamento** - Acompanhe vs limite MEI
- **Fluxo de Caixa** - Gerencie entradas e saídas
- **Calendário DAS** - Valores e vencimentos

### Planos
| Recurso | Free | Premium (R$ 14,90/mês) |
|---------|------|------------------------|
| Cálculos/mês | 10 | Ilimitado |
| Histórico | 6 meses | 5 anos |
| Alertas DAS | 1 (email) | 3 (email + WhatsApp) |
| Export PDF | 1/mês | Ilimitado |
| Export Excel | ❌ | ✅ |
| Anúncios | Sim | Não |

### Outros Recursos
- 📱 **PWA** - Instalável no celular
- 📧 **Alertas DAS** - Email e WhatsApp (Premium)
- 📝 **Blog** - 11 artigos sobre MEI
- 🌙 **Dark Mode** - Tema claro/escuro
- ♿ **Acessível** - Skip-to-content, aria-labels

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16.1.5 (App Router)
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui + Radix UI
- Framer Motion

**Backend:**
- Prisma 5.22 + Supabase PostgreSQL
- API Routes (Next.js)
- JWT Authentication (custom)

**Integrações:**
- Google Analytics 4
- Stripe (pagamentos)
- Resend (emails)
- Twilio (WhatsApp)
- Sentry (monitoramento)

**Qualidade:**
- Playwright (E2E tests)
- ESLint + TypeScript
- Vercel (deploy)

---

## 🚀 Getting Started

### Pré-requisitos
- Node.js 20+
- npm ou pnpm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/rafaaquino10/lumei.git
cd lumei

# Instale as dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local

# Gere o Prisma Client
npx prisma generate

# Execute o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente

```env
# Database (Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Auth
JWT_SECRET="your-secret-key"

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Stripe
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...

# AdSense (opcional)
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-...

# Cron
CRON_SECRET=your-cron-secret
```

---

## 📦 Scripts

```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run start        # Servidor produção
npm run lint         # ESLint
npm run test:e2e     # Testes E2E
npm run test:e2e:ui  # Testes com UI
npx prisma studio    # Visualizar DB
npx prisma db push   # Aplicar schema
```

---

## 🗂️ Estrutura

```
lumei/
├── app/
│   ├── api/              # API Routes
│   ├── blog/             # Blog pages
│   ├── calculadoras/     # Calculadoras
│   ├── dashboard/        # Área logada
│   └── ...
├── components/
│   ├── calculadoras/     # Componentes calculadoras
│   ├── illustrations/    # SVGs animados
│   ├── paywall/          # Paywall contextual
│   ├── pwa/              # PWA install prompt
│   └── ui/               # shadcn/ui
├── lib/
│   ├── auth/             # Autenticação JWT
│   ├── billing/          # Stripe
│   ├── blog/             # Posts do blog
│   ├── cache/            # Cache localStorage
│   ├── calculos/         # Lógica de cálculo
│   ├── email/            # Templates email
│   └── whatsapp/         # WhatsApp API
├── e2e/                  # Testes Playwright
└── prisma/               # Schema DB
```

---

## 📈 SEO

- **Sitemap.xml** automático
- **Robots.txt** otimizado
- **Schema.org:**
  - Organization
  - SoftwareApplication
  - BreadcrumbList
  - FAQPage
  - Product (Premium)
  - Review
- **OpenGraph + Twitter Cards**

---

## 🔒 Segurança

- HTTPS obrigatório
- JWT com refresh tokens
- Rate limiting
- CORS configurado
- Headers de segurança
- Validação Zod em todas as APIs

---

## 📝 Roadmap

### v1.0.0 (Atual) ✅
- [x] 6 calculadoras funcionais
- [x] Sistema de autenticação
- [x] Dashboard do usuário
- [x] Plano Premium com Stripe
- [x] Alertas DAS (Email + WhatsApp)
- [x] Blog com 11 artigos
- [x] PWA completo
- [x] Testes E2E
- [x] Sentry monitoramento

### v1.1.0 (Próximo)
- [ ] Relatórios mensais automáticos
- [ ] Integração com NFe
- [ ] App mobile nativo

---

## 📄 Licença

Este projeto é privado. Todos os direitos reservados © 2026 Calcula MEI.

---

## 📞 Contato

- Website: [calculamei.com.br](https://calculamei.com.br)
- Email: contato@calculamei.com.br

---

**Feito com 💚 para MEIs brasileiros**
