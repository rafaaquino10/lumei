# COMO EXECUTAR OS PROMPTS DE CONTEÚDO LEGAL

## Arquivos Criados

Na raiz do projeto você encontrará:

1. ✅ `PROMPT_FAQ_IMPLEMENTACAO.md` - Prompt completo para FAQ
2. ✅ `CODIGO_FAQ_COMPLETO.txt` - Código completo dos 4 arquivos FAQ
3. ✅ `PROMPTS_CONTEUDO_LEGAL.md` - Índice e resumo de todos os prompts

## Arquivos Necessários (Consultar Conversa)

Os códigos completos para as páginas legais são muito extensos. Você tem duas opções:

### OPÇÃO 1: Copiar da Conversa (Recomendado)

Na conversa anterior, foram fornecidos os códigos TSX completos para:
- `app/privacidade/page.tsx` (~450 linhas)
- `app/termos/page.tsx` (~550 linhas)
- `app/cookies/page.tsx` (~350 linhas)

**Procure na conversa por:**
- "PROMPT DE EXECUÇÃO COMPLETO - POLÍTICA DE PRIVACIDADE"
- "PROMPT DE EXECUÇÃO COMPLETO - TERMOS DE USO"
- "PROMPT DE EXECUÇÃO COMPLETO - POLÍTICA DE COOKIES"

Copie o conteúdo do bloco de código TypeScript de cada um.

### OPÇÃO 2: Pedir ao Assistente para Gerar Arquivos

Execute este comando exato:

```
Crie os arquivos app/privacidade/page.tsx, app/termos/page.tsx e app/cookies/page.tsx
usando os códigos completos que você forneceu anteriormente nos prompts.
```

---

## ORDEM DE EXECUÇÃO

### 1. FAQ (PRIMEIRO)
```bash
# Instalar dependência
npm install @radix-ui/react-accordion

# Seguir instruções do arquivo CODIGO_FAQ_COMPLETO.txt
# Criar 4 arquivos:
# - lib/data/faq-content.ts
# - components/ui/accordion.tsx
# - components/faq-schema.tsx
# - app/faq/page.tsx

# Editar tailwind.config.ts (adicionar animações)

# Validar
npm run build
```

### 2. PRIVACIDADE
```bash
# Criar arquivo app/privacidade/page.tsx
# (Copiar código da conversa)

# Validar
npm run build
```

### 3. COOKIES
```bash
# Criar arquivo app/cookies/page.tsx
# (Copiar código da conversa)

# Validar
npm run build
```

### 4. TERMOS
```bash
# Criar arquivo app/termos/page.tsx
# (Copiar código da conversa)

# Validar
npm run build
```

---

## CHECKLIST FINAL

Após executar todos:

```bash
npm run build
npm run dev
```

Testar:
- [ ] http://localhost:3000/faq
- [ ] http://localhost:3000/privacidade
- [ ] http://localhost:3000/termos
- [ ] http://localhost:3000/cookies

**Verificar:**
- [ ] Todas as páginas carregam
- [ ] Links entre páginas funcionam
- [ ] Design responsivo em mobile
- [ ] Zero erros no build
- [ ] FAQ tem accordion funcionando
- [ ] Tabela de cookies é responsiva

---

## ESTRUTURA FINAL DE ARQUIVOS

```
app/
  faq/page.tsx                ← FAQ
  privacidade/page.tsx        ← Privacidade
  termos/page.tsx             ← Termos
  cookies/page.tsx            ← Cookies

components/
  ui/accordion.tsx            ← Accordion component
  faq-schema.tsx              ← Schema JSON-LD

lib/
  data/faq-content.ts         ← Dados FAQ
```

---

## PROBLEMAS COMUNS

### Erro: "Cannot find module @radix-ui/react-accordion"
**Solução:** `npm install @radix-ui/react-accordion`

### Erro: "animate-accordion-down is not a valid Tailwind class"
**Solução:** Adicionar animações no tailwind.config.ts (ver CODIGO_FAQ_COMPLETO.txt)

### Erro: "lumei-500 is not defined"
**Solução:** Adicionar cores lumei no tailwind.config.ts (ver CODIGO_FAQ_COMPLETO.txt)

### Build passa mas página não carrega
**Solução:** Verificar se todas as pastas foram criadas (lib/data, components/ui, etc)

---

## SUPORTE

Se tiver problemas, forneça o erro exato e o comando que estava executando.

**Arquivos de referência:**
- PROMPT_FAQ_IMPLEMENTACAO.md (instruções detalhadas)
- CODIGO_FAQ_COMPLETO.txt (código completo FAQ)
- PROMPTS_CONTEUDO_LEGAL.md (visão geral)
