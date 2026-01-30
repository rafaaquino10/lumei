# Google Search Console Setup Checklist

## Passo a Passo

### 1. Adicionar Propriedade no Search Console
- [ ] Acesse [Google Search Console](https://search.google.com/search-console)
- [ ] Clique em "Adicionar propriedade"
- [ ] Escolha "Prefixo de URL"
- [ ] Digite: `https://lumei.com.br`

### 2. Verificar Propriedade
Escolha um dos métodos:

**Opção A: Arquivo HTML (Recomendado)**
- [ ] Baixe o arquivo `google[código].html`
- [ ] Substitua `/public/google-site-verification.html` pelo arquivo baixado
- [ ] Faça deploy (`git add`, `git commit`, `git push`)
- [ ] Aguarde deploy completar no Vercel
- [ ] Clique em "Verificar" no Search Console

**Opção B: Meta tag HTML**
- [ ] Copie a meta tag fornecida
- [ ] Adicione no `<head>` do `app/layout.tsx`
- [ ] Faça deploy
- [ ] Clique em "Verificar"

**Opção C: Registro DNS (se tiver domínio próprio)**
- [ ] Copie o registro TXT
- [ ] Adicione no seu provedor DNS (Vercel, Cloudflare, etc.)
- [ ] Aguarde propagação (pode levar até 48h)
- [ ] Clique em "Verificar"

### 3. Submeter Sitemap
- [ ] Vá em "Sitemaps" no menu lateral
- [ ] Digite: `sitemap.xml`
- [ ] Clique em "Enviar"
- [ ] Aguarde processamento (pode levar algumas horas)

### 4. Solicitar Indexação das Páginas Principais
Vá em "Inspeção de URL" e solicite indexação para:

- [ ] `https://lumei.com.br/`
- [ ] `https://lumei.com.br/calcular/margem-lucro`
- [ ] `https://lumei.com.br/calcular/preco-hora`
- [ ] `https://lumei.com.br/calcular/precificacao`
- [ ] `https://lumei.com.br/calcular/faturamento`
- [ ] `https://lumei.com.br/calcular/fluxo-caixa`
- [ ] `https://lumei.com.br/calcular/das`
- [ ] `https://lumei.com.br/premium`
- [ ] `https://lumei.com.br/blog`

### 5. Verificar Compatibilidade Mobile
- [ ] Vá em "Experiência" → "Usabilidade em dispositivos móveis"
- [ ] Aguarde análise automática
- [ ] Corrija quaisquer problemas encontrados

### 6. Verificar Core Web Vitals
- [ ] Vá em "Experiência" → "Core Web Vitals"
- [ ] Verifique métricas:
  - [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] FID (First Input Delay) < 100ms
  - [ ] CLS (Cumulative Layout Shift) < 0.1

### 7. Configurar Relatórios por Email
- [ ] Vá em "Configurações" (⚙️ no topo)
- [ ] Clique em "Usuários e permissões"
- [ ] Adicione seu email
- [ ] Marque "Relatórios semanais por email"

### 8. Configurar Integração com Google Analytics
- [ ] Vá em "Configurações" → "Associações"
- [ ] Clique em "Associar" ao lado do Google Analytics
- [ ] Selecione a propriedade GA4 (G-8MDSD4ND7Y)
- [ ] Confirme associação

## Monitoramento Contínuo

### Semanalmente
- [ ] Verificar novos erros de indexação
- [ ] Verificar queries de pesquisa (Search Console → Desempenho)
- [ ] Identificar páginas com baixo CTR
- [ ] Verificar Core Web Vitals

### Mensalmente
- [ ] Analisar tendências de tráfego orgânico
- [ ] Identificar novas palavras-chave
- [ ] Otimizar páginas com maior impressões mas baixo CTR
- [ ] Adicionar novas páginas ao sitemap

## Metas SEO

### Curto Prazo (1-3 meses)
- [ ] Indexar todas as 9 páginas principais
- [ ] Aparecer para "calculadora MEI" (posição < 50)
- [ ] Aparecer para "margem de lucro MEI" (posição < 30)
- [ ] Conseguir primeiros 100 cliques orgânicos/mês

### Médio Prazo (3-6 meses)
- [ ] Top 10 para "calculadora margem de lucro"
- [ ] Top 10 para "calculadora preço hora"
- [ ] Top 20 para "DAS MEI 2025"
- [ ] 1.000 cliques orgânicos/mês

### Longo Prazo (6-12 meses)
- [ ] Top 3 para "calculadora MEI"
- [ ] Top 5 para múltiplas palavras-chave relacionadas
- [ ] 10.000 cliques orgânicos/mês
- [ ] Featured snippets para cálculos

## Recursos Úteis

- [Google Search Console Help](https://support.google.com/webmasters)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

## Notas

- **Indexação leva tempo**: Pode levar de 1 semana a 1 mês para páginas novas aparecerem
- **Rich results**: Com structured data implementado, pode aparecer como rich snippet
- **Sitemap auto-atualiza**: Next.js gera sitemap.xml dinamicamente
- **Mobile-first**: Google prioriza versão mobile para indexação
