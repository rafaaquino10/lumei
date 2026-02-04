# Plano de Reestruturação UX - Calcula MEI

> Transformar o Calcula MEI em um "Controle Financeiro MEI" - um ERP simplificado para MEI.

---

## Visão do Produto

### Antes
"Calculadoras financeiras para MEI" - ferramentas isoladas

### Depois
"Controle financeiro do seu MEI" - sistema integrado de acompanhamento

### Proposta de Valor
> "Registre seu faturamento todo mês e saiba exatamente como está seu MEI:
> quanto já faturou, quanto pode faturar, quando pagar o DAS."

---

## Arquitetura de Funcionalidades

### 1. NÚCLEO: Registro Mensal de Faturamento
**O coração do sistema.** Usuário registra quanto faturou a cada mês.

```
┌─────────────────────────────────────────────┐
│  📊 Registrar Faturamento de Janeiro/2026   │
├─────────────────────────────────────────────┤
│                                             │
│  Quanto você faturou este mês?              │
│  ┌─────────────────────────────────┐        │
│  │ R$  4.250,00                    │        │
│  └─────────────────────────────────┘        │
│                                             │
│  💡 Dica: Some todos os valores que você    │
│     recebeu de clientes este mês.           │
│                                             │
│  [ Registrar Faturamento ]                  │
│                                             │
└─────────────────────────────────────────────┘
```

### 2. DASHBOARD: Visão Real do MEI
Mostra **apenas dados que o usuário registrou**.

**Métricas principais:**
| Métrica | Fonte | Tooltip |
|---------|-------|---------|
| Faturamento Acumulado | Soma dos registros mensais | "Total que você faturou desde janeiro" |
| % Limite MEI | Acumulado / 81.000 | "Quanto do limite anual você já usou" |
| Média Mensal | Acumulado / meses | "Sua média de faturamento por mês" |
| Projeção Anual | Média × 12 | "Se continuar assim, quanto vai faturar no ano" |
| Próximo DAS | Cálculo automático | "Valor e data do próximo pagamento" |
| Meses até Limite | Cálculo | "Em quantos meses você atinge o limite" |

### 3. FERRAMENTAS DE APOIO: Calculadoras
As calculadoras viram **ferramentas de apoio** para responder perguntas específicas:

| Calculadora | Quando usar | Integração |
|-------------|-------------|------------|
| Margem de Lucro | "Estou lucrando nesse serviço?" | Sugere após registro |
| Preço por Hora | "Quanto devo cobrar?" | Sugere se margem baixa |
| Precificação | "Qual preço ideal?" | Sugere se margem baixa |
| Fluxo de Caixa | "Quanto sobra no mês?" | Opcional, avançado |
| DAS | "Quando e quanto pagar?" | Integrado no dashboard |

### 4. ONBOARDING: Tutorial Interativo
Guia o usuário nos primeiros passos com **storytelling**.

```
Passo 1: "Olá! Sou o Calcula MEI"
         "Vou te ajudar a controlar seu negócio de forma simples."

Passo 2: "Todo mês, você vai me contar quanto faturou"
         [Mostra animação do formulário de registro]

Passo 3: "E eu vou te mostrar como está seu MEI"
         [Mostra preview do dashboard]

Passo 4: "Vou te avisar antes do DAS vencer"
         [Mostra alerta de DAS]

Passo 5: "E te alertar se estiver chegando no limite"
         [Mostra alerta de limite]

Passo 6: "Vamos começar! Quanto você faturou em Janeiro?"
         [Já abre o formulário de registro]
```

---

## Estrutura de Telas

### Mapa do Site (Atualizado)

```
/ (Home)
├── Calculadoras principais em destaque
├── CTA: "Começar a controlar meu MEI"
└── Hero com preview do dashboard

/registrar (NOVO)
├── Formulário de registro mensal
├── Histórico de registros
└── Gráfico de evolução

/dashboard
├── Métricas reais do usuário
├── Alertas (DAS, limite)
├── Atalhos para ferramentas
└── CTA para registrar mês atual

/ferramentas (renomear de /calculadoras)
├── Margem de Lucro
├── Preço por Hora
├── Precificação
├── Fluxo de Caixa
└── Calendário DAS

/onboarding
├── Tutorial interativo (5 passos)
└── Primeiro registro de faturamento

/premium
├── Benefícios
└── Checkout
```

---

## Schema do Banco de Dados (Novo)

```prisma
model RegistroFaturamento {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])

  mes       Int      // 1-12
  ano       Int      // 2026
  valor     Float    // Valor faturado

  notas     String?  // Observações opcionais

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, mes, ano]) // Um registro por mês/ano
  @@index([userId, ano])
}
```

---

## Implementação por Fases

### Fase 1: Fundação (Esta sessão)
- [x] Criar modelo RegistroFaturamento
- [x] API de registro mensal
- [x] Tela de registro mensal (/registrar)
- [x] Atualizar dashboard com dados reais
- [x] Adicionar tooltips explicativos
- [x] Criar onboarding tutorial

### Fase 2: Refinamento
- [ ] Renomear /calculadoras para /ferramentas
- [ ] Atualizar navegação
- [ ] Integrar sugestões entre ferramentas
- [ ] Lembretes mensais de registro

### Fase 3: Polimento
- [ ] Atualizar hero com nova proposta
- [ ] Atualizar SEO e meta tags
- [ ] Configurar eventos de analytics
- [ ] Atualizar blog com novos artigos

---

## Analytics Events (GA4)

| Evento | Trigger | Parâmetros |
|--------|---------|------------|
| `registro_faturamento` | Usuário registra faturamento | mes, ano, valor_faixa |
| `onboarding_step` | Avança no tutorial | step_number, step_name |
| `onboarding_complete` | Conclui tutorial | tempo_total |
| `dashboard_view` | Visualiza dashboard | tem_dados, meses_registrados |
| `ferramenta_uso` | Usa calculadora | tipo_ferramenta |
| `tooltip_view` | Clica em tooltip | metrica |
| `limite_alerta` | Vê alerta de limite | percentual |

---

## SEO Updates

### Meta Tags Atualizadas

**Home:**
- Title: "Calcula MEI - Controle Financeiro para Microempreendedor"
- Description: "Registre seu faturamento mensal, acompanhe o limite MEI e nunca mais esqueça do DAS. Controle financeiro simples e gratuito para MEI."

**Dashboard:**
- Title: "Meu MEI - Dashboard Financeiro | Calcula MEI"
- Description: "Acompanhe seu faturamento, limite MEI e próximo DAS em um só lugar."

**Ferramentas:**
- Title: "Ferramentas MEI - Calculadoras Financeiras Grátis"
- Description: "Calcule margem de lucro, preço por hora e muito mais. Ferramentas gratuitas para MEI."

---

## Arquivos a Criar/Modificar

### Novos Arquivos
```
prisma/schema.prisma (update)
app/api/faturamento/route.ts
app/registrar/page.tsx
components/registro/registro-form.tsx
components/registro/historico-registros.tsx
components/dashboard/metric-tooltip.tsx
components/onboarding/tutorial-steps.tsx
```

### Arquivos a Modificar
```
app/dashboard/page.tsx (usar dados reais)
components/dashboard/financial-dashboard.tsx (tooltips)
components/header.tsx (navegação)
app/layout.tsx (meta tags)
```

---

*Plano aprovado para implementação.*
