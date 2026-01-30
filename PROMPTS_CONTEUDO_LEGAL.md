# PROMPTS DE EXECUÇÃO - CONTEÚDO LEGAL (FAQ + PRIVACIDADE + TERMOS + COOKIES)

Este documento contém todos os prompts necessários para criar as páginas de conteúdo legal do Lumei.

---

## ÍNDICE

1. [PROMPT 1: FAQ - Implementação Completa](#prompt-1-faq)
2. [PROMPT 2: Política de Privacidade](#prompt-2-privacidade)
3. [PROMPT 3: Termos de Uso](#prompt-3-termos)
4. [PROMPT 4: Política de Cookies](#prompt-4-cookies)

---

# PROMPT 1: FAQ

## Arquivos Criados
- `lib/data/faq-content.ts` - Dados das perguntas e respostas
- `components/ui/accordion.tsx` - Componente Accordion reutilizável
- `components/faq-schema.tsx` - Schema JSON-LD para SEO
- `app/faq/page.tsx` - Página FAQ completa

## Dependências
```bash
npm install @radix-ui/react-accordion
```

## Modificações em Arquivos Existentes
**`tailwind.config.ts`** - Adicionar em `theme.extend`:

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

**Verificar cores lumei** - Se não existir, adicionar:
```typescript
lumei: {
  50: "#e6fbf4",
  100: "#ccf7e9",
  200: "#99efd3",
  300: "#66e7bd",
  400: "#33dfa7",
  500: "#00d084",
  600: "#00a86b",
  700: "#007d50",
  800: "#005336",
  900: "#002a1b",
},
```

## Validação
```bash
npm run build
npm run dev
# Acessar http://localhost:3000/faq
```

**Critérios:**
- ✅ 5 categorias visíveis
- ✅ 19 perguntas funcionando
- ✅ Múltiplos itens podem abrir
- ✅ Responsivo mobile/desktop
- ✅ Schema JSON-LD presente

---

# PROMPT 2: PRIVACIDADE

## Arquivo Criado
- `app/privacidade/page.tsx` - Política de Privacidade completa LGPD

## Características
- 12 seções obrigatórias
- Linguagem clara e acessível
- Links internos para `/cookies`
- Email de contato: contato@lumei.com.br
- Data de atualização visível
- Conformidade LGPD (Art. 18)

## Seções Incluídas
1. Quem Somos
2. Dados que Coletamos (4 subcategorias)
3. Como Usamos Seus Dados
4. Base Legal (LGPD)
5. Compartilhamento com Terceiros
6. Cookies e Tecnologias
7. Seus Direitos (Art. 18)
8. Retenção de Dados
9. Segurança
10. Dados de Menores
11. Alterações
12. Contato

## Validação
```bash
npm run build
# Acessar /privacidade
```

**Critérios:**
- ✅ Todas as 12 seções presentes
- ✅ Links para /cookies funcionando
- ✅ Email clicável
- ✅ Design responsivo

---

# PROMPT 3: TERMOS

## Arquivo Criado
- `app/termos/page.tsx` - Termos de Uso completos

## Características
- 15 seções obrigatórias
- Cláusulas de isenção para calculadoras
- Regras de planos FREE/PREMIUM
- Política de cancelamento e reembolso
- Foro e legislação brasileira

## Seções Incluídas
1. Aceitação dos Termos
2. Descrição do Serviço
3. Cadastro e Conta
4. Uso Aceitável
5. Uso Proibido
6. Propriedade Intelectual
7. **Isenção de Responsabilidade** (CRÍTICO)
8. Limitação de Responsabilidade
9. Planos e Pagamento (5 subsections)
10. Cancelamento e Reembolso
11. Modificações nos Termos
12. Rescisão
13. Disposições Gerais
14. Foro e Legislação
15. Contato

## Cláusulas Críticas
- ⚠️ Calculadoras NÃO substituem contador
- ⚠️ Resultados baseados em dados do usuário
- ⚠️ Valores DAS são informativos
- ⚠️ Sem responsabilidade por decisões financeiras

## Validação
```bash
npm run build
# Acessar /termos
```

**Critérios:**
- ✅ Todas as 15 seções presentes
- ✅ Cláusula de isenção destacada
- ✅ Links para /privacidade funcionando
- ✅ Informações de planos corretas

---

# PROMPT 4: COOKIES

## Arquivo Criado
- `app/cookies/page.tsx` - Política de Cookies com tabela

## Características
- Tabela responsiva de cookies
- 3 categorias: Essenciais, Analytics, Preferências
- Instruções para 4 navegadores principais
- Links para políticas de terceiros

## Cookies Documentados
**Essenciais:**
- __client_uat (Clerk)
- __session (Clerk)
- __clerk_db_jwt (Clerk)

**Analytics:**
- _ga (Google Analytics)
- _gid (Google Analytics)
- _ga_* (Google Analytics 4)

**Preferências:**
- lumei_cookie_consent (Lumei)

## Validação
```bash
npm run build
# Acessar /cookies
```

**Critérios:**
- ✅ Tabela com 5 colunas
- ✅ Responsiva em mobile
- ✅ Instruções dos 4 navegadores
- ✅ Links externos funcionando

---

## ORDEM DE EXECUÇÃO RECOMENDADA

1. **FAQ** (depende de accordion)
2. **Privacidade** (referenciado por Termos)
3. **Cookies** (referenciado por Privacidade)
4. **Termos** (referencia Privacidade)

---

## VALIDAÇÃO FINAL COMPLETA

Após criar todos os 4 arquivos:

```bash
# Build
npm run build

# Dev
npm run dev

# Testar páginas
# http://localhost:3000/faq
# http://localhost:3000/privacidade
# http://localhost:3000/termos
# http://localhost:3000/cookies
```

**Checklist Final:**
- [ ] 4 páginas acessíveis
- [ ] Links entre páginas funcionando
- [ ] Todas responsivas
- [ ] Zero erros no build
- [ ] Schema JSON-LD em FAQ
- [ ] Metadata SEO em todas

---

## ARQUIVOS DE CÓDIGO COMPLETO

Os códigos TypeScript/TSX completos estão disponíveis em:

- `CODIGO_FAQ.tsx` (se criado)
- `CODIGO_PRIVACIDADE.tsx` (se criado)
- `CODIGO_TERMOS.tsx` (se criado)
- `CODIGO_COOKIES.tsx` (se criado)

Ou consulte a conversa original onde os códigos completos foram fornecidos.

---

**FIM DOS PROMPTS DE CONTEÚDO LEGAL**
