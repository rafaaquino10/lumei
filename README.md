# 💚 Lumei - Lucre mais. Sempre.

Calculadoras financeiras feitas para MEI crescer. 100% grátis.

🚀 **Status:** 3 calculadoras funcionais (de 6 planejadas) | **Live:** [lumei.vercel.app](https://lumei.vercel.app)

---

## 📊 Calculadoras Disponíveis

### ✅ Funcionais
- **Margem de Lucro** - Calcule sua margem real e descubra quanto você ganha em cada venda
- **Preço por Hora** - Descubra quanto cobrar considerando férias, custos e margem
- **Precificação** - Calcule o preço ideal para produtos e serviços

### 🔜 Em Breve
- **Simulador de Faturamento** - Acompanhe seu faturamento vs limite MEI
- **Fluxo de Caixa** - Gerencie entradas e saídas
- **Calendário DAS** - Nunca esqueça de pagar seus impostos

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16.1.5 (App Router + Turbopack)
- TypeScript 5
- Tailwind CSS v4 (CSS-first)
- shadcn/ui components
- Framer Motion (animações)

**Backend:**
- Prisma 5.22.0 (ORM)
- Supabase PostgreSQL
- API Routes (Next.js)

**Integrações:**
- Google Analytics 4 (tracking)
- Clerk Auth (preparado)
- Stripe (preparado)

**Forms & Validation:**
- React Hook Form
- Zod validation
- currency.js (cálculos monetários)

**PDF & Share:**
- @react-pdf/renderer
- Web Share API + Clipboard fallback

---

## 🚀 Getting Started

### Pré-requisitos
- Node.js 20.11.1+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/rafaaquino10/lumei.git
cd lumei

# Instale as dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Gere o Prisma Client
npx prisma generate

# Execute o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Variáveis de Ambiente

```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Database (Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Clerk Auth (quando configurar)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

---

## 📦 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificar linting
npx prisma studio    # Interface visual do banco
npx prisma db push   # Aplicar mudanças no schema
```

---

## 🗂️ Estrutura do Projeto

```
lumei/
├── app/                      # App Router (Next.js 15)
│   ├── calcular/            # Páginas de calculadoras
│   │   ├── margem-lucro/
│   │   ├── preco-hora/
│   │   └── precificacao/
│   ├── api/calculos/        # API de salvamento
│   ├── layout.tsx           # Layout raiz (SEO, Analytics)
│   ├── sitemap.ts           # Sitemap XML
│   ├── robots.ts            # Robots.txt
│   └── structured-data.tsx  # Schema.org Organization
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── pdf/                 # Templates PDF
│   ├── header.tsx
│   ├── footer.tsx
│   ├── calculator-schema.tsx
│   └── outras-calculadoras.tsx
├── lib/
│   ├── calculos/            # Lógica de cálculo (pure functions)
│   ├── analytics.ts         # Google Analytics tracking
│   └── prisma.ts            # Prisma Client singleton
├── prisma/
│   └── schema.prisma        # Database schema
└── public/                  # Assets estáticos
```

---

## 📊 Database Schema

```prisma
model User {
  id              String    @id @default(cuid())
  clerkId         String    @unique
  email           String    @unique
  nome            String?
  statusAssinatura StatusAssinatura @default(GRATUITO)
  calculos        Calculo[]
  alertas         Alerta[]
}

model Calculo {
  id        String   @id @default(cuid())
  userId    String
  tipo      TipoCalculo
  titulo    String?
  inputs    Json     # Flexível para qualquer calculadora
  resultado Json
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

model Alerta {
  id     String      @id @default(cuid())
  userId String
  tipo   TipoAlerta
  status StatusAlerta @default(ATIVO)
  user   User        @relation(fields: [userId], references: [id])
}
```

---

## 🎨 Design System

**Cores:**
- Primary: `#00D084` (Lumei Green)
- Escala: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

**Tipografia:**
- Sans-serif: Manrope (Google Fonts)
- Monospace: Space Mono

**Componentes:**
- shadcn/ui (Button, Input, Card, Label, Select, Sheet, Tabs, etc.)
- Customizados: MoneyInput, NumberInput

---

## 📈 SEO & Analytics

### Google Analytics 4
- Eventos customizados: `calculator_used`, `calculator_completed`, `calculator_saved`, `pdf_export`, `share`
- Parâmetro: `calculator_type` (margem_lucro, preco_hora, precificacao)

### SEO
- Sitemap.xml automático (6 calculadoras + páginas)
- Robots.txt otimizado
- Structured Data: Organization + WebApplication
- OpenGraph + Twitter Cards
- Meta tags completas em todas as páginas

---

## 🚀 Deploy

**Vercel (Automático):**
```bash
git push origin main  # Deploy automático
```

**Variáveis de Ambiente no Vercel:**
1. Acesse: Settings > Environment Variables
2. Adicione as mesmas variáveis do `.env.local`
3. Redeploy

**Região:** GRU1 (São Paulo, Brasil) - Baixa latência para usuários BR

---

## 📝 Roadmap

### v0.2.0 (Atual) ✅
- [x] 3 calculadoras funcionais
- [x] PDF export
- [x] Share functionality
- [x] Google Analytics
- [x] SEO completo

### v0.3.0 (Próximo)
- [ ] Clerk authentication
- [ ] User dashboard
- [ ] 3 calculadoras restantes
- [ ] Histórico de cálculos

### v0.4.0
- [ ] Stripe integration
- [ ] Premium features
- [ ] Email/WhatsApp alerts (DAS)

### v1.0.0
- [ ] Blog
- [ ] Recursos educativos
- [ ] API pública

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é privado. Todos os direitos reservados © 2025 Lumei.

---

## 📞 Contato

- Website: [lumei.vercel.app](https://lumei.vercel.app)
- Email: contato@lumei.com.br
- GitHub: [@rafaaquino10](https://github.com/rafaaquino10)

---

**Feito com 💚 para MEIs brasileiros**
