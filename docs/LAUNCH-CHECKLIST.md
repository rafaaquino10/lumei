# Checklist de Launch - Calcula MEI

> Checklist completo para go-live do Calcula MEI.
> Marque cada item como concluído antes do lançamento.

---

## 1. Infraestrutura

### Vercel
- [ ] Projeto criado no Vercel
- [ ] Domínio `calculamei.com.br` configurado
- [ ] SSL/HTTPS ativo
- [ ] Região: GRU1 (São Paulo)
- [ ] Build passando sem erros

### DNS
- [ ] Registros A configurados
- [ ] Registros CNAME para www
- [ ] Propagação DNS completa (até 48h)

### Database (Supabase)
- [ ] Projeto de produção criado
- [ ] Schema aplicado (`npx prisma db push`)
- [ ] Backups automáticos habilitados
- [ ] Connection pooling configurado

---

## 2. Variáveis de Ambiente (Vercel)

### Obrigatórias
- [ ] `DATABASE_URL` - URL do PostgreSQL
- [ ] `DIRECT_URL` - URL direta (sem pooling)
- [ ] `JWT_SECRET` - Chave secreta para tokens
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics

### Pagamentos (Stripe)
- [ ] `STRIPE_SECRET_KEY` - Chave secreta
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Chave pública
- [ ] `STRIPE_WEBHOOK_SECRET` - Secret do webhook
- [ ] Webhook configurado no Stripe Dashboard
- [ ] Produtos/Preços criados no Stripe

### Alertas
- [ ] `RESEND_API_KEY` - Para envio de emails
- [ ] `RESEND_FROM_EMAIL` - Email remetente verificado
- [ ] `TWILIO_ACCOUNT_SID` - WhatsApp
- [ ] `TWILIO_AUTH_TOKEN` - WhatsApp
- [ ] `TWILIO_WHATSAPP_NUMBER` - Número WhatsApp
- [ ] `CRON_SECRET` - Para proteger cron jobs

### Monitoramento
- [ ] `NEXT_PUBLIC_SENTRY_DSN` - Sentry para erros

### AdSense (quando aprovado)
- [ ] `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` - Publisher ID

---

## 3. Integrações Externas

### Google Analytics
- [ ] Propriedade GA4 criada
- [ ] Measurement ID configurado
- [ ] Eventos personalizados testados
- [ ] Conversões configuradas

### Google Search Console
- [ ] Propriedade verificada
- [ ] Sitemap submetido
- [ ] Erros de cobertura corrigidos

### Stripe
- [ ] Conta ativada (modo live)
- [ ] Webhook endpoint configurado: `/api/billing/webhook`
- [ ] Eventos do webhook: `checkout.session.completed`, `customer.subscription.*`
- [ ] Página de checkout testada
- [ ] Página de portal testada

### Sentry
- [ ] Projeto criado
- [ ] DSN configurado
- [ ] Alertas configurados
- [ ] Source maps habilitados

### Resend (Email)
- [ ] Conta criada
- [ ] Domínio verificado
- [ ] API key gerada
- [ ] Template de DAS testado

### Twilio (WhatsApp)
- [ ] Conta criada
- [ ] WhatsApp Business configurado
- [ ] Número aprovado
- [ ] Templates de mensagem aprovados

---

## 4. SEO

### Meta Tags
- [ ] Title em todas as páginas
- [ ] Description em todas as páginas
- [ ] Open Graph configurado
- [ ] Twitter Cards configurado

### Structured Data
- [ ] Organization schema
- [ ] SoftwareApplication schema
- [ ] BreadcrumbList em páginas internas
- [ ] FAQPage na página de FAQ
- [ ] Product schema na página Premium
- [ ] BlogPosting em posts do blog

### Arquivos
- [ ] `/robots.txt` correto
- [ ] `/sitemap.xml` gerado e acessível
- [ ] `/ads.txt` configurado (quando AdSense aprovado)

---

## 5. Performance

### Lighthouse
- [ ] Performance > 90
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 90

### Core Web Vitals
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

### Otimizações
- [ ] Imagens otimizadas
- [ ] Fonts com display:swap
- [ ] Preconnect configurado
- [ ] JavaScript minificado

---

## 6. Segurança

### Headers
- [ ] Content-Security-Policy
- [ ] X-Frame-Options
- [ ] X-Content-Type-Options
- [ ] Referrer-Policy
- [ ] Permissions-Policy

### Autenticação
- [ ] Tokens JWT seguros
- [ ] Refresh token rotation
- [ ] Rate limiting ativo
- [ ] CORS configurado

### Dados
- [ ] Senhas com hash (bcrypt)
- [ ] Validação em todas as entradas
- [ ] SQL injection prevenido (Prisma)
- [ ] XSS prevenido (React)

---

## 7. Funcionalidades

### Calculadoras
- [ ] Margem de Lucro funcionando
- [ ] Preço por Hora funcionando
- [ ] Precificação funcionando
- [ ] Faturamento funcionando
- [ ] Fluxo de Caixa funcionando
- [ ] DAS funcionando

### Autenticação
- [ ] Cadastro funcionando
- [ ] Login funcionando
- [ ] Logout funcionando
- [ ] Recuperação de senha funcionando
- [ ] OAuth Google funcionando

### Premium
- [ ] Checkout funcionando
- [ ] Portal de assinatura funcionando
- [ ] Cancelamento funcionando
- [ ] Paywall funcionando

### Alertas
- [ ] Cron job configurado (Vercel Cron)
- [ ] Email de alerta DAS testado
- [ ] WhatsApp de alerta DAS testado

---

## 8. Legal

### Páginas
- [ ] `/termos` - Termos de Uso
- [ ] `/privacidade` - Política de Privacidade
- [ ] `/cookies` - Política de Cookies
- [ ] `/contato` - Página de contato

### LGPD
- [ ] Banner de cookies implementado
- [ ] Consentimento de cookies registrado
- [ ] Opt-out de analytics possível
- [ ] Dados podem ser excluídos

---

## 9. Testes Finais

### Fluxos Críticos
- [ ] Usuário anônimo usando calculadora
- [ ] Cadastro de novo usuário
- [ ] Login de usuário existente
- [ ] Upgrade para Premium
- [ ] Downgrade/Cancelamento
- [ ] Recebimento de alerta DAS

### Dispositivos
- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Desktop Safari
- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] Tablet

### PWA
- [ ] Instalação funcionando
- [ ] Ícone correto
- [ ] Splash screen correto
- [ ] Modo offline básico

---

## 10. Pós-Launch

### Monitoramento (Primeiras 24h)
- [ ] Verificar erros no Sentry
- [ ] Verificar logs do Vercel
- [ ] Verificar métricas GA4
- [ ] Verificar transações Stripe

### Marketing
- [ ] Post de lançamento redes sociais
- [ ] Email para lista de espera (se houver)
- [ ] Submissão para diretórios de startups

### Backup
- [ ] Backup do banco de dados
- [ ] Backup do código (git)
- [ ] Documentação de rollback

---

## Contatos de Emergência

- **Vercel:** support@vercel.com
- **Supabase:** support@supabase.io
- **Stripe:** support@stripe.com
- **Sentry:** support@sentry.io

---

## Histórico de Launch

| Data | Versão | Responsável | Status |
|------|--------|-------------|--------|
| DD/MM/AAAA | v1.0.0 | Nome | Pendente |

---

**Boa sorte no lançamento! 🚀**
