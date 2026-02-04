# Análise UX - Perspectiva do MEI Brasileiro

> Análise completa da experiência do usuário assumindo a persona de um MEI real.
> Data: 2026-02-03

---

## Persona: João, o MEI

**Perfil:**
- 35 anos, designer freelancer
- Fatura ~R$ 4.000/mês
- Usa mais o celular que computador
- Não é bom com números
- Tem pouco tempo (trabalha sozinho)
- Já esqueceu de pagar DAS 2x no ano passado
- Não sabe se está cobrando certo pelos serviços

**O que ele busca:**
- Saber se está lucrando
- Não esquecer do DAS
- Saber se vai estourar o limite MEI
- Ferramenta simples, sem complicação

---

## Problemas Identificados

### 1. 🔴 CRÍTICO: Dashboard Incompreensível

**Problema:**
O dashboard mostra dados bonitos mas o MEI não entende:
- "Faturamento R$ 54.200" - De onde veio esse número? Eu digitei isso?
- "Margem Média 42,5%" - O que é margem? Média de quê?
- "Evolução Mensal" - Gráfico de barras sem explicação
- "Lucro Estimado" - Estimado como? Baseado em quê?

**Impacto:**
- Usuário não confia nos dados
- Não sabe de onde vem as informações
- Dashboard vira "enfeite" sem utilidade real

**Solução Proposta:**
- Dashboard deve ser **alimentado ativamente pelo usuário**
- Mostrar claramente: "Você ainda não registrou faturamento deste mês"
- Guiar: "Registre seu faturamento de Janeiro para ver suas métricas"
- Cada métrica deve ter explicação ao clicar (tooltip ou modal)

---

### 2. 🔴 CRÍTICO: Excesso de Funcionalidades na Home

**Problema:**
A home page tem:
- Hero com dashboard (confuso - o que é isso?)
- 6 calculadoras
- Seção "Como funciona"
- Tabela de preços
- Blog no menu

**Impacto:**
- Usuário não sabe por onde começar
- Muita informação causa paralisia
- MEI quer resolver UM problema, não ver 6 opções

**Solução Proposta:**
- Home focada em **UMA ação principal**
- Perguntar: "O que você quer resolver hoje?"
  - "Quero saber se estou lucrando"
  - "Quero definir meu preço"
  - "Quero ver quando pagar o DAS"
- Reduzir visual para o essencial

---

### 3. 🟡 IMPORTANTE: Calculadoras Desconectadas

**Problema:**
- As 6 calculadoras funcionam isoladamente
- Usuário faz cálculo de margem, depois faz cálculo de preço
- Os cálculos não "conversam" entre si
- Não existe fluxo guiado

**Exemplo real:**
João quer saber se está cobrando certo:
1. Vai em "Margem de Lucro" → descobre que margem é 20% (baixa)
2. Vai em "Preço por Hora" → descobre que deveria cobrar R$ 50/hora
3. Vai em "Faturamento" → vê que está em 60% do limite
4. **Mas esses dados não se conectam!**

**Solução Proposta:**
- Criar um **"Check-up Financeiro"** guiado
- Wizard que pergunta passo a passo e gera relatório completo
- Ou conectar calculadoras: "Você calculou margem de 20%. Quer ajustar seu preço?"

---

### 4. 🟡 IMPORTANTE: Falta de Contexto nas Métricas

**Problema:**
- "Margem 42,5%" → Isso é bom ou ruim?
- "66,9% do limite" → Devo me preocupar?
- Usuário não tem referência

**Solução Proposta:**
- Sempre contextualizar:
  - "Margem de 42,5% - **Excelente!** Acima da média do mercado (30%)"
  - "66,9% do limite - **Tranquilo.** Você pode faturar mais R$ 26.800 este ano"
- Usar cores: verde (bom), amarelo (atenção), vermelho (urgente)
- Adicionar benchmarks do setor

---

### 5. 🟡 IMPORTANTE: Onboarding Não Explica o Valor

**Problema:**
Onboarding atual pergunta:
- Tipo de MEI
- Ocupação
- Faturamento médio

Mas não explica **por que** essas informações são importantes.

**Solução Proposta:**
- Antes de cada pergunta, mostrar o benefício:
  - "Informe seu tipo de MEI → **Vamos calcular o valor exato do seu DAS**"
  - "Qual seu faturamento médio? → **Vamos te alertar antes de estourar o limite**"
- Mostrar preview do dashboard sendo preenchido em tempo real

---

### 6. 🟢 MENOR: Terminologia Técnica

**Problema:**
- "Margem de Lucro" → O que é margem?
- "Markup" → Hã?
- "Precificação" → Nunca ouvi isso
- "Fluxo de Caixa" → Parece coisa de empresa grande

**Solução Proposta:**
Usar linguagem do MEI:
- "Margem de Lucro" → "Quanto você lucra"
- "Precificação" → "Calcular preço de venda"
- "Fluxo de Caixa" → "Entradas e saídas do mês"
- "Markup" → "Multiplicador do preço"

---

### 7. 🟢 MENOR: Blog Desconectado

**Problema:**
- Blog tem 11 artigos úteis
- Mas está escondido no menu
- Não é sugerido quando relevante

**Solução Proposta:**
- Após cada cálculo, sugerir artigo relacionado
- Ex: Após calcular margem baixa → "Leia: 5 erros de precificação que todo MEI comete"

---

## Jornada Atual vs Jornada Ideal

### Jornada Atual (Confusa)

```
Home → Vê dashboard bonito mas não entende
     → Clica em "Calcular Grátis"
     → Vê 6 calculadoras → "Qual eu uso?"
     → Escolhe uma aleatoriamente
     → Faz cálculo → "E agora?"
     → Sai do site
```

### Jornada Ideal (Guiada)

```
Home → "O que você precisa resolver hoje?"
     → [Quero saber se estou lucrando]

     → "Quanto você cobra por este serviço?"
     → "Quanto você gasta para fazer?"

     → "Sua margem é 35%. Isso é BOM!"
     → "Dica: Para aumentar para 50%, cobre R$ X"

     → "Quer salvar e acompanhar?"
     → [Criar conta grátis]

     → Dashboard mostra: "Seu último cálculo: Margem 35%"
     → "Registre seu faturamento de Janeiro para ver mais métricas"
```

---

## Proposta de Simplificação

### Opção A: Foco Total nas Calculadoras

**Conceito:** Site é uma "caixa de ferramentas" simples

- Home mostra 3-4 calculadoras principais
- Dashboard vira apenas "histórico de cálculos"
- Remove métricas complexas
- Premium = mais cálculos + alertas DAS

**Prós:**
- Muito simples de entender
- Cada visita resolve 1 problema
- Menos desenvolvimento

**Contras:**
- Menos sticky (usuário usa e sai)
- Valor do Premium menos claro

---

### Opção B: Check-up Financeiro Guiado

**Conceito:** Site guia o MEI por um diagnóstico completo

- Home: "Faça seu Check-up Financeiro Grátis"
- Wizard de 5 minutos que coleta todas as infos
- Gera relatório completo com recomendações
- Dashboard mostra evolução mês a mês

**Fluxo:**
1. "Qual seu tipo de negócio?" → Serviços
2. "Quanto você fatura por mês em média?" → R$ 4.000
3. "Quanto gasta com custos fixos?" → R$ 800
4. "Quanto cobra por hora/serviço?" → R$ 80/hora
5. **Resultado:**
   - Margem: 45% ✅
   - Limite MEI: 59% ⚠️
   - Próximo DAS: 15 dias
   - Sugestão: Você pode aumentar seu preço para R$ 95/hora

**Prós:**
- Experiência completa em uma visita
- Usuário entende o valor rapidamente
- Dashboard faz sentido (mostra evolução do check-up)
- Premium = check-ups ilimitados + alertas + histórico

**Contras:**
- Mais complexo de desenvolver
- Pode assustar usuário que quer só uma coisa

---

### Opção C: Híbrido (Recomendado)

**Conceito:** Calculadoras simples + Check-up opcional

**Home:**
- Hero simplificado: "Calculadoras grátis para MEI"
- 3 cards principais:
  1. "Calcular Lucro" (margem)
  2. "Calcular Preço" (precificação)
  3. "Ver meu DAS" (calendário)
- CTA secundário: "Fazer Check-up Completo"

**Calculadoras:**
- Mantém as 6, mas com entrada única
- Após cálculo, sugere próximo passo
- "Sua margem é 30%. Quer calcular o preço ideal?"

**Dashboard:**
- Simplificado: mostra apenas o que o usuário REGISTROU
- Card vazio = "Registre seu faturamento de Janeiro"
- Evolução só aparece após 2+ meses de dados

**Prós:**
- Atende quem quer algo rápido
- Atende quem quer análise completa
- Dashboard faz sentido progressivamente

---

## Plano de Ação Recomendado

### Fase 1: Simplificar (1-2 semanas)

1. **Simplificar Home**
   - Remover dashboard do hero (confunde)
   - Colocar ilustração simples ou 3 cards de ação
   - Focar em UMA chamada: "Calcule grátis"

2. **Melhorar linguagem**
   - Renomear calculadoras para linguagem simples
   - Adicionar subtítulos explicativos
   - Tooltips em termos técnicos

3. **Dashboard honesto**
   - Mostrar apenas dados que o usuário registrou
   - Cards vazios com CTAs claros
   - Remover métricas "estimadas" sem base real

### Fase 2: Conectar (2-3 semanas)

4. **Criar fluxo entre calculadoras**
   - Após cada cálculo, sugerir próximo
   - "Você calculou margem. Quer ajustar seu preço?"
   - Salvar contexto entre calculadoras

5. **Melhorar onboarding**
   - Mostrar benefício de cada pergunta
   - Preview do dashboard sendo construído
   - Opção de pular e completar depois

6. **Registro de faturamento mensal**
   - Criar tela simples: "Quanto você faturou em Janeiro?"
   - Lembrete mensal (push/email)
   - Dashboard alimentado por dados reais

### Fase 3: Evoluir (3-4 semanas)

7. **Check-up Financeiro**
   - Wizard guiado de 5 minutos
   - Relatório completo com recomendações
   - PDF exportável

8. **Contextualização**
   - Benchmarks por setor
   - "Sua margem está acima da média"
   - Alertas inteligentes

9. **Integração Blog**
   - Sugerir artigos após cálculos
   - Dicas contextuais

---

## Métricas de Sucesso

| Métrica | Atual (estimado) | Meta |
|---------|------------------|------|
| Taxa de conclusão de cálculo | 40% | 70% |
| Usuários que fazem 2+ cálculos | 20% | 50% |
| Onboarding completo | 30% | 60% |
| Retorno em 7 dias | 10% | 30% |
| NPS | ? | > 50 |

---

## Resumo Executivo

### O problema central:
O site tem ótimas funcionalidades mas **falta clareza de propósito**. O MEI entra e não sabe:
- O que o site faz exatamente
- Por onde começar
- O que os números significam
- Por que deveria voltar

### A solução:
1. **Simplificar** a entrada (menos opções, mais foco)
2. **Contextualizar** os resultados (bom/ruim, comparações)
3. **Conectar** as funcionalidades (fluxo guiado)
4. **Alimentar** o dashboard com dados reais do usuário

### Decisão necessária:
Qual caminho seguir?
- **A)** Foco em calculadoras simples (menos trabalho, menos valor percebido)
- **B)** Check-up completo (mais trabalho, mais valor percebido)
- **C)** Híbrido (balanceado, recomendado)

---

*Documento criado para discussão e tomada de decisão.*
