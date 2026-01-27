# Google Analytics 4 - Implementação

## 📊 Visão Geral

O Lumei está configurado com Google Analytics 4 para rastrear todas as interações dos usuários com as calculadoras. Isso permite medir o engajamento, identificar calculadoras mais populares e entender como os usuários utilizam a plataforma.

## 🔧 Configuração

### 1. Variável de Ambiente

Adicione o ID de medição do Google Analytics no arquivo `.env.local`:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

> **Importante:** Substitua `G-XXXXXXXXXX` pelo ID real da propriedade GA4.

### 2. Obter ID do Google Analytics

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Crie uma nova propriedade GA4 (ou use uma existente)
3. Em **Admin > Fluxos de dados > Web**, copie o ID de medição (formato: G-XXXXXXXXXX)
4. Cole no arquivo `.env.local`

## 📈 Eventos Rastreados

### Eventos Personalizados

Cada calculadora rastreia 5 eventos principais:

| Evento | Descrição | Parâmetros |
|--------|-----------|-----------|
| `calculator_used` | Usuário acessou uma calculadora | `calculator_type` |
| `calculator_completed` | Usuário completou um cálculo | `calculator_type` |
| `calculator_saved` | Usuário salvou um cálculo | `calculator_type` |
| `pdf_export` | Usuário exportou PDF | `calculator_type` |
| `share` | Usuário compartilhou resultado | `calculator_type` |

### Tipos de Calculadoras

- `margem_lucro` - Calculadora de Margem de Lucro
- `preco_hora` - Calculadora de Preço por Hora
- `precificacao` - Calculadora de Precificação (Produtos e Serviços)

## 🎯 Implementação por Calculadora

### ✅ Margem de Lucro (`/calcular/margem-lucro`)

- [x] `calculator_used` - useEffect no mount
- [x] `calculator_completed` - onSubmit
- [x] `calculator_saved` - handleSave (sucesso)
- [x] `pdf_export` - handleExportPDF (após download)
- [x] `share` - handleShare (compartilhar + clipboard)

### ✅ Preço por Hora (`/calcular/preco-hora`)

- [x] `calculator_used` - useEffect no mount
- [x] `calculator_completed` - onSubmit
- [x] `calculator_saved` - handleSave (sucesso)
- [x] `pdf_export` - handleExportPDF (após download)
- [x] `share` - handleShare (compartilhar + clipboard)

### ✅ Precificação (`/calcular/precificacao`)

- [x] `calculator_used` - useEffect no mount
- [x] `calculator_completed` - onSubmitProdutos e onSubmitServicos
- [x] `calculator_saved` - handleSave (sucesso)
- [ ] `pdf_export` - Não implementado (calculadora não tem PDF ainda)
- [x] `share` - handleShare (compartilhar + clipboard)

## 📁 Arquivos Principais

### `lib/analytics.ts`

Contém todas as funções de rastreamento:

```typescript
export function trackCalculatorUsed(calculatorType: CalculatorType)
export function trackCalculatorCompleted(calculatorType: CalculatorType)
export function trackCalculatorSaved(calculatorType: CalculatorType)
export function trackPDFExport(calculatorType: CalculatorType)
export function trackShare(calculatorType: CalculatorType)
```

### `app/layout.tsx`

Componente `GoogleAnalytics` carregado condicionalmente:

```tsx
{process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
  <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
)}
```

### `types/analytics.d.ts`

Declarações TypeScript para `window.gtag`.

## 🧪 Teste de Implementação

### Desenvolvimento Local

1. Adicione o ID no `.env.local`
2. Reinicie o servidor: `npm run dev`
3. Abra o console do navegador
4. Navegue para uma calculadora
5. Verifique se aparecem mensagens `[GA4]` no console

### Google Analytics Debug View

1. Instale a extensão [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger)
2. Ative a extensão
3. Acesse as calculadoras
4. Em GA4, vá para **Admin > DebugView** para ver eventos em tempo real

## 📊 Relatórios Úteis

### No Google Analytics 4

1. **Relatórios > Engajamento > Eventos**
   - Veja todos os eventos personalizados
   - Filtre por `event_name` para eventos específicos

2. **Explorar > Criar exploração personalizada**
   - Dimensão: `event_name`
   - Dimensão: `calculator_type`
   - Métrica: `event_count`

3. **Funil de Conversão**
   - Etapa 1: `calculator_used`
   - Etapa 2: `calculator_completed`
   - Etapa 3: `calculator_saved`
   - Etapa 4: `pdf_export` ou `share`

## 🎯 Métricas Importantes

### KPIs por Calculadora

- **Taxa de Conclusão**: `calculator_completed / calculator_used`
- **Taxa de Salvamento**: `calculator_saved / calculator_completed`
- **Taxa de Compartilhamento**: `share / calculator_completed`
- **Taxa de Export PDF**: `pdf_export / calculator_completed`

### Análise de Engajamento

- Qual calculadora é mais usada?
- Qual tem maior taxa de conclusão?
- Usuários compartilham ou salvam mais?
- Há abandono em alguma etapa específica?

## 🚀 Próximos Passos

1. [ ] Configurar ID real do Google Analytics
2. [ ] Adicionar export PDF na calculadora de Precificação
3. [ ] Implementar eventos adicionais:
   - `calculator_reset` - Usuário limpou o formulário
   - `field_changed` - Alterações em campos específicos
   - `tooltip_viewed` - Usuário clicou em ajuda
4. [ ] Integrar com Google Tag Manager (opcional)
5. [ ] Criar dashboards customizados no GA4

## 📝 Notas Técnicas

- Biblioteca: `@next/third-parties/google` (oficial Next.js)
- Modo de consentimento: Padrão (sem banner de cookies ainda)
- Ambiente: Apenas produção (verificar `NEXT_PUBLIC_GA_MEASUREMENT_ID`)
- TypeScript: Totalmente tipado com `Window.gtag` extension

---

**Última atualização:** $(date)
**Status:** ✅ Implementação completa para 3 calculadoras
