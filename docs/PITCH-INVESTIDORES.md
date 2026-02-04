# Calcula MEI

## Plataforma Financeira para Microempreendedores Individuais

---

# Sumário Executivo

O **Calcula MEI** é uma plataforma SaaS que simplifica a gestão financeira dos 15+ milhões de Microempreendedores Individuais (MEI) no Brasil, oferecendo calculadoras inteligentes, controle de faturamento e alertas automatizados para evitar multas e desenquadramento.

**Problema**: MEIs enfrentam dificuldades para controlar faturamento, calcular preços corretamente e lembrar de pagar o DAS em dia, resultando em multas, prejuízos e até perda do CNPJ.

**Solução**: Ferramentas simples e intuitivas que automatizam o controle financeiro, com alertas inteligentes e insights acionáveis.

**Modelo de Negócio**: Freemium com plano Premium a R$ 14,90/mês.

**Mercado**: 15,7 milhões de MEIs ativos no Brasil (2024), crescendo 8% ao ano.

---

# O Problema

## Dores do MEI Brasileiro

### 1. Controle de Faturamento
- **81% dos MEIs** não sabem exatamente quanto faturam por mês
- Risco de ultrapassar o limite de R$ 81.000/ano e ser desenquadrado
- Desenquadramento gera impostos retroativos de até 27,5%

### 2. Precificação Incorreta
- **67% dos MEIs** não sabem calcular o preço correto dos serviços
- Muitos trabalham no prejuízo sem perceber
- Falta de conhecimento sobre margem de lucro e custos reais

### 3. Esquecimento do DAS
- Guia DAS vence todo dia 20
- Atraso gera multa de 0,33% ao dia + juros SELIC
- **23% dos MEIs** já pagaram multa por atraso

### 4. Falta de Ferramentas Adequadas
- Planilhas são complexas e propensas a erros
- Contadores são caros para a realidade do MEI
- Apps existentes são genéricos ou complicados

---

# A Solução

## Calcula MEI: Gestão Financeira Simplificada

### Calculadoras Inteligentes

| Calculadora | Função | Benefício |
|-------------|--------|-----------|
| **Margem de Lucro** | Calcula margem e markup | Saber se está tendo lucro real |
| **Preço por Hora** | Define valor mínimo da hora | Não trabalhar no prejuízo |
| **Precificação** | Calcula preço ideal | Cobrar o valor correto |
| **Simulador de Faturamento** | Projeta faturamento anual | Evitar desenquadramento |
| **Fluxo de Caixa** | Controla entradas/saídas | Visualizar saúde financeira |
| **Calendário DAS** | Mostra valores e vencimentos | Nunca esquecer de pagar |

### Dashboard de Controle

- **Faturamento acumulado** no ano em tempo real
- **Percentual do limite** de R$ 81.000 utilizado
- **Projeção anual** baseada na média
- **Alertas visuais** quando próximo do limite
- **Gráfico de evolução** mensal

### Sistema de Alertas

- **Email**: Lembretes de vencimento do DAS
- **WhatsApp**: Alertas direto no celular (Premium)
- **3 lembretes**: 5, 3 e 1 dia antes do vencimento

### Exportação Profissional

- **PDFs personalizados** com dados do usuário
- Documentos podem ser usados para comprovação de renda
- Branding profissional

---

# Produto

## Stack Tecnológico

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Estilização** | Tailwind CSS 4, Radix UI |
| **Backend** | Next.js API Routes |
| **Banco de Dados** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **Autenticação** | JWT + Google OAuth |
| **Pagamentos** | Stripe |
| **Email** | Resend |
| **Hospedagem** | Vercel |
| **PDF** | React-PDF |
| **Animações** | Framer Motion |

## Funcionalidades Implementadas

### Core (100% funcional)
- [x] 6 calculadoras financeiras completas
- [x] Dashboard com métricas em tempo real
- [x] Registro de faturamento mensal
- [x] Histórico de cálculos
- [x] Sistema de alertas por email
- [x] Exportação em PDF

### Autenticação & Segurança
- [x] Login com email/senha
- [x] Login com Google (OAuth 2.0)
- [x] Recuperação de senha
- [x] Tokens JWT seguros
- [x] Cookies httpOnly
- [x] Rate limiting

### Monetização
- [x] Plano FREE funcional
- [x] Plano PREMIUM com Stripe
- [x] Checkout integrado
- [x] Portal de gerenciamento de assinatura
- [x] Webhooks para sincronização
- [x] Google AdSense integrado

### SEO & Marketing
- [x] Schema.org completo
- [x] Sitemap dinâmico
- [x] Meta tags otimizadas
- [x] Open Graph images
- [x] Blog com categorias
- [x] FAQ estruturada

### PWA & Mobile
- [x] Progressive Web App
- [x] Instalável no celular
- [x] Modo offline
- [x] Design responsivo
- [x] Dark mode

### Conformidade
- [x] LGPD: Exportação de dados
- [x] LGPD: Exclusão de conta
- [x] Termos de serviço
- [x] Política de privacidade
- [x] Política de cookies

---

# Modelo de Negócio

## Planos e Preços

| Recurso | FREE | PREMIUM |
|---------|------|---------|
| **Preço** | R$ 0 | R$ 14,90/mês |
| Calculadoras | Todas | Todas |
| Cálculos/mês | 10 | Ilimitados |
| Histórico | 6 meses | 5 anos |
| Alertas DAS | 1 (email) | 3 (email + WhatsApp) |
| PDF/mês | 1 | Ilimitados |
| Anúncios | Sim | Não |

## Fontes de Receita

```
┌─────────────────────────────────────────────────────────┐
│                    RECEITA TOTAL                        │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │   ASSINATURAS   │  │    ANÚNCIOS     │              │
│  │    PREMIUM      │  │   (AdSense)     │              │
│  │                 │  │                 │              │
│  │   R$ 14,90/mês  │  │  Usuários FREE  │              │
│  │   R$ 149/ano    │  │                 │              │
│  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

## Projeção de Receita

### Cenário Conservador (1% conversão FREE→PREMIUM)

| Métrica | Ano 1 | Ano 2 | Ano 3 |
|---------|-------|-------|-------|
| Usuários FREE | 10.000 | 50.000 | 150.000 |
| Usuários PREMIUM | 100 | 500 | 1.500 |
| MRR | R$ 1.490 | R$ 7.450 | R$ 22.350 |
| ARR | R$ 17.880 | R$ 89.400 | R$ 268.200 |

### Cenário Otimista (3% conversão)

| Métrica | Ano 1 | Ano 2 | Ano 3 |
|---------|-------|-------|-------|
| Usuários FREE | 10.000 | 50.000 | 150.000 |
| Usuários PREMIUM | 300 | 1.500 | 4.500 |
| MRR | R$ 4.470 | R$ 22.350 | R$ 67.050 |
| ARR | R$ 53.640 | R$ 268.200 | R$ 804.600 |

---

# Mercado

## TAM - SAM - SOM

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│    ┌────────────────────────────────────────────────────┐     │
│    │                      TAM                            │     │
│    │              15,7 milhões de MEIs                   │     │
│    │              R$ 2,8 bilhões/ano                     │     │
│    │    ┌────────────────────────────────────────┐      │     │
│    │    │               SAM                       │      │     │
│    │    │        5 milhões (digitais)            │      │     │
│    │    │        R$ 894 milhões/ano              │      │     │
│    │    │    ┌────────────────────────────┐     │      │     │
│    │    │    │           SOM              │     │      │     │
│    │    │    │    150 mil usuários        │     │      │     │
│    │    │    │    R$ 26,8 milhões/ano     │     │      │     │
│    │    │    └────────────────────────────┘     │      │     │
│    │    └────────────────────────────────────────┘      │     │
│    └────────────────────────────────────────────────────┘     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### TAM (Total Addressable Market)
- **15,7 milhões** de MEIs ativos no Brasil
- Se 100% pagassem R$ 14,90/mês = **R$ 2,8 bilhões/ano**

### SAM (Serviceable Addressable Market)
- **~5 milhões** de MEIs com acesso digital e dispostos a usar ferramentas online
- Potencial de **R$ 894 milhões/ano**

### SOM (Serviceable Obtainable Market)
- Meta de **150 mil usuários** em 3 anos (1% do SAM)
- Com 3% de conversão = **4.500 assinantes Premium**
- Receita de **R$ 804 mil/ano**

## Crescimento do Mercado

| Ano | MEIs Ativos | Crescimento |
|-----|-------------|-------------|
| 2020 | 11,3 milhões | - |
| 2021 | 12,4 milhões | +9,7% |
| 2022 | 13,5 milhões | +8,9% |
| 2023 | 14,6 milhões | +8,1% |
| 2024 | 15,7 milhões | +7,5% |

**Fonte**: Portal do Empreendedor / Sebrae

---

# Competição

## Análise Competitiva

| Aspecto | Calcula MEI | Contabilizei | MEI Fácil | Planilhas |
|---------|-------------|--------------|-----------|-----------|
| **Preço** | R$ 14,90/mês | R$ 89/mês | R$ 29,90/mês | Grátis |
| **Foco** | Apenas MEI | Todas empresas | MEI + ME | Genérico |
| **Calculadoras** | 6 específicas | Não tem | 2 básicas | Manual |
| **Alertas WhatsApp** | Sim | Não | Não | Não |
| **Facilidade** | Muito fácil | Complexo | Médio | Difícil |
| **Dashboard** | Sim | Sim | Básico | Não |

## Diferenciais Competitivos

### 1. Foco Total no MEI
- Produto 100% desenhado para MEI
- Linguagem simples, sem jargões contábeis
- Limite de R$ 81.000 sempre visível

### 2. Preço Acessível
- R$ 14,90/mês (5x mais barato que concorrentes)
- Plano grátis generoso
- ROI imediato (evitar uma multa já paga o ano)

### 3. Alertas Inteligentes
- WhatsApp direto no celular
- 3 lembretes antes do vencimento
- Nunca mais pagar multa

### 4. Calculadoras Específicas
- Precificação para serviços
- Valor da hora de trabalho
- Simulador de faturamento

---

# Tração

## Métricas Atuais

| Métrica | Valor |
|---------|-------|
| **Status** | MVP Completo |
| **Funcionalidades** | 100% core features |
| **Calculadoras** | 6 implementadas |
| **Integrações** | Stripe, Google OAuth, Resend |

## Roadmap de Lançamento

### Q1 2026 - Lançamento
- [x] MVP completo
- [x] Integração Stripe
- [x] SEO otimizado
- [ ] Campanha de lançamento
- [ ] Primeiros 1.000 usuários

### Q2 2026 - Crescimento
- [ ] Integração WhatsApp Business
- [ ] App mobile (React Native)
- [ ] Parcerias com contadores
- [ ] Meta: 5.000 usuários

### Q3 2026 - Expansão
- [ ] Emissão de NFS-e integrada
- [ ] Relatórios avançados
- [ ] API para integrações
- [ ] Meta: 15.000 usuários

### Q4 2026 - Escala
- [ ] Marketplace de serviços
- [ ] Crédito para MEI (parceria)
- [ ] Expansão para ME
- [ ] Meta: 30.000 usuários

---

# Equipe

## Fundador

**[Nome do Fundador]**
- Experiência em [área relevante]
- Background em [tecnologia/negócios]
- Motivação: [história pessoal com MEI]

## Necessidades de Equipe

| Função | Prioridade | Perfil |
|--------|------------|--------|
| **Growth Marketing** | Alta | Performance + conteúdo |
| **Customer Success** | Alta | Atendimento + onboarding |
| **Full-stack Dev** | Média | Next.js + Node.js |
| **Designer** | Média | UI/UX + branding |

---

# Investimento

## Uso dos Recursos

### Rodada Seed: R$ 300.000

```
┌─────────────────────────────────────────────────────────┐
│                    ALOCAÇÃO                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Marketing & Aquisição          40%    R$ 120.000     │
│   ████████████████████                                  │
│                                                         │
│   Produto & Tecnologia           30%    R$ 90.000      │
│   ███████████████                                       │
│                                                         │
│   Equipe & Operações             20%    R$ 60.000      │
│   ██████████                                            │
│                                                         │
│   Reserva & Contingência         10%    R$ 30.000      │
│   █████                                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Detalhamento

**Marketing & Aquisição (R$ 120.000)**
- Google Ads e Meta Ads
- Marketing de conteúdo
- Parcerias com influenciadores MEI
- SEO e link building

**Produto & Tecnologia (R$ 90.000)**
- App mobile
- Integração WhatsApp Business
- Infraestrutura e segurança
- Novas funcionalidades

**Equipe & Operações (R$ 60.000)**
- Contratação inicial
- Ferramentas e softwares
- Jurídico e contábil

**Reserva (R$ 30.000)**
- Capital de giro
- Contingências

## Milestones

| Milestone | Prazo | Entregável |
|-----------|-------|------------|
| **M1** | 3 meses | 5.000 usuários, MRR R$ 1.500 |
| **M2** | 6 meses | 15.000 usuários, MRR R$ 5.000 |
| **M3** | 12 meses | 30.000 usuários, MRR R$ 15.000 |
| **M4** | 18 meses | 50.000 usuários, MRR R$ 30.000 |

---

# Por que Investir

## 1. Mercado Massivo e Crescente
- 15,7 milhões de MEIs (e crescendo 8%/ano)
- Problema real e urgente (multas, desenquadramento)
- Baixa penetração de soluções digitais

## 2. Produto Pronto
- MVP 100% funcional
- Stack moderna e escalável
- Monetização validada (Stripe integrado)

## 3. Unit Economics Favorável
- CAC estimado: R$ 15-30 (via conteúdo/SEO)
- LTV estimado: R$ 150+ (12 meses retenção)
- LTV/CAC: 5-10x

## 4. Timing Perfeito
- Digitalização acelerada pós-pandemia
- MEIs buscando profissionalização
- Governo incentivando formalização

## 5. Expansão Clara
- De MEI para ME (até R$ 360k/ano)
- Serviços adjacentes (NFS-e, crédito)
- Potencial de exit para fintechs/contabilidades

---

# Contato

**Calcula MEI**

- **Website**: https://calculamei.com.br
- **Email**: contato@calculamei.com.br
- **Fundador**: [Nome] - [email pessoal]

---

*Documento atualizado em Fevereiro/2026*

*Este documento é confidencial e destinado apenas a potenciais investidores e parceiros estratégicos.*
