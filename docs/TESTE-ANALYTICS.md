# Como Testar o Google Analytics 4

## 🧪 Teste Rápido no Navegador

### 1. Configure o ID do Google Analytics

No arquivo `.env.local` (crie se não existir):

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Reinicie o servidor

```bash
npm run dev
```

### 3. Abra o Console do Navegador

1. Abra o site em `http://localhost:3000`
2. Pressione `F12` para abrir DevTools
3. Vá para a aba **Console**

### 4. Teste Cada Evento

#### Evento 1: `calculator_used` (Página Carregada)

1. Navegue para `/calcular/margem-lucro`
2. No console, digite:

```javascript
window.gtag
```

Se aparecer `function gtag()`, significa que o Google Analytics está carregado! ✅

#### Evento 2: `calculator_completed` (Cálculo Realizado)

1. Preencha o formulário:
   - Receita Bruta: R$ 10.000,00
   - Custos Diretos: R$ 3.000,00
   - Despesas Operacionais: R$ 2.000,00
2. Clique em **Calcular**
3. Verifique se o resultado aparece

#### Evento 3: `calculator_saved` (Salvou Cálculo)

1. Após calcular, clique no botão **Salvar**
2. Se não estiver logado, verá um toast pedindo para fazer login
3. O evento é disparado somente após sucesso no salvamento

#### Evento 4: `pdf_export` (Exportou PDF)

1. Clique no botão **Exportar PDF**
2. Um arquivo `margem-lucro-[timestamp].pdf` será baixado
3. Evento disparado após o download iniciar

#### Evento 5: `share` (Compartilhou)

1. Clique no botão **Compartilhar**
2. Se no mobile/navegador com Web Share API: abre o diálogo nativo
3. Se no desktop: copia o link para o clipboard
4. Evento disparado em ambos os casos

## 🔍 Verificar Eventos no Google Analytics

### Modo Debug (Tempo Real)

1. Instale a extensão: [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger)
2. Ative a extensão (ícone fica verde)
3. No Google Analytics 4:
   - Admin > DebugView
   - Ou Relatórios > Tempo Real

### Ver Eventos Personalizados

1. Faça as ações nas calculadoras
2. No GA4:
   - **Relatórios > Engajamento > Eventos**
   - Procure por:
     - `calculator_used`
     - `calculator_completed`
     - `calculator_saved`
     - `pdf_export`
     - `share`

## 📊 Console de Teste Manual

Cole este código no console do navegador para testar manualmente:

```javascript
// Verificar se gtag está disponível
if (typeof window.gtag === 'function') {
  console.log('✅ Google Analytics carregado!')
  
  // Simular evento de uso
  window.gtag('event', 'calculator_used', {
    calculator_type: 'margem_lucro'
  })
  console.log('📊 Evento "calculator_used" enviado!')
  
} else {
  console.error('❌ Google Analytics não está carregado')
  console.log('Verifique se NEXT_PUBLIC_GA_MEASUREMENT_ID está configurado')
}
```

## 🐛 Troubleshooting

### Analytics não carrega?

**Problema:** `window.gtag` é `undefined`

**Soluções:**

1. Verifique se `.env.local` tem o ID correto:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. Reinicie o servidor Next.js:
   ```bash
   # Ctrl+C para parar
   npm run dev
   ```

3. Limpe o cache do navegador (`Ctrl+Shift+Delete`)

4. Verifique se há bloqueadores de anúncios/rastreamento (desative temporariamente)

### Eventos não aparecem no GA4?

**Problema:** Eventos disparam mas não aparecem no Google Analytics

**Soluções:**

1. **Aguarde 24-48h**: Eventos podem demorar para aparecer em relatórios (exceto Tempo Real)

2. **Use DebugView**: Eventos aparecem imediatamente em Admin > DebugView

3. **Verifique o ID**: Certifique-se que o `G-XXXXXXXXXX` está correto no GA4

4. **Modo de produção**: Alguns eventos só funcionam em produção (deploy no Vercel)

### Eventos duplicados?

**Problema:** Mesmo evento enviado múltiplas vezes

**Causa:** React Strict Mode em desenvolvimento renderiza componentes 2x

**Solução:** Normal em dev. Em produção (`npm run build && npm start`) não acontece.

## ✅ Checklist de Teste

- [ ] `window.gtag` existe no console
- [ ] Evento `calculator_used` dispara ao carregar página
- [ ] Evento `calculator_completed` dispara ao clicar em Calcular
- [ ] Evento `calculator_saved` dispara ao salvar (com sucesso)
- [ ] Evento `pdf_export` dispara ao baixar PDF
- [ ] Evento `share` dispara ao compartilhar ou copiar link
- [ ] Eventos aparecem no Google Analytics DebugView
- [ ] Parâmetro `calculator_type` está correto em cada evento

## 🚀 Teste em Produção

Depois de fazer deploy no Vercel:

```bash
git add .
git commit -m "feat: adiciona Google Analytics 4 tracking"
git push origin main
```

1. Acesse o site em produção
2. Abra o console (`F12`)
3. Repita os testes acima
4. Verifique no GA4 Tempo Real se eventos estão chegando

---

**Dica:** Use o **Chrome DevTools Network** tab e filtre por `google-analytics` para ver requisições sendo enviadas em tempo real!
