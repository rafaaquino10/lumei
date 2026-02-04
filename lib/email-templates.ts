// Templates de email para o Calcula MEI

export interface EmailData {
  subject: string
  html: string
  text: string
}

// Template base HTML
const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calcula MEI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #00D084; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Calcula MEI</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
                Controle seu MEI em 1 minuto/mes
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="https://calculamei.com.br" style="color: #00D084; text-decoration: none;">calculamei.com.br</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

// Email de reengajamento (7 dias sem usar)
export function reengagementEmail(userName: string): EmailData {
  const name = userName || 'empreendedor'

  return {
    subject: `${name}, sentimos sua falta!`,
    html: baseTemplate(`
      <h2 style="color: #18181b; margin: 0 0 16px; font-size: 20px;">Ola, ${name}!</h2>
      <p style="color: #52525b; margin: 0 0 16px; line-height: 1.6;">
        Notamos que voce nao registrou seu faturamento recentemente. Manter o controle em dia e essencial para nao ter surpresas no final do ano!
      </p>
      <p style="color: #52525b; margin: 0 0 24px; line-height: 1.6;">
        Leva menos de 1 minuto para atualizar seus dados. Que tal fazer isso agora?
      </p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <a href="https://calculamei.com.br/registrar" style="display: inline-block; background-color: #00D084; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Registrar Faturamento
            </a>
          </td>
        </tr>
      </table>
      <p style="color: #9ca3af; margin: 24px 0 0; font-size: 13px; text-align: center;">
        Se voce nao deseja mais receber esses emails, pode desativar nas <a href="https://calculamei.com.br/dashboard/configuracoes" style="color: #00D084;">configuracoes</a>.
      </p>
    `),
    text: `Ola, ${name}!\n\nNotamos que voce nao registrou seu faturamento recentemente. Leva menos de 1 minuto!\n\nAcesse: https://calculamei.com.br/registrar`,
  }
}

// Resumo mensal
export interface MonthlySummaryData {
  userName: string
  mes: string
  ano: number
  faturamentoMes: number
  totalAcumulado: number
  percentualLimite: number
  mesesRestantes: number
  mediaMensal: number
  proximoDAS: {
    data: string
    valor: number
  }
}

export function monthlySummaryEmail(data: MonthlySummaryData): EmailData {
  const name = data.userName || 'empreendedor'
  const formatCurrency = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  const statusColor = data.percentualLimite >= 80 ? '#ef4444' : data.percentualLimite >= 50 ? '#f59e0b' : '#22c55e'
  const statusText = data.percentualLimite >= 80 ? 'Atencao!' : data.percentualLimite >= 50 ? 'No caminho certo' : 'Tudo sob controle'

  return {
    subject: `Resumo de ${data.mes}/${data.ano} - Calcula MEI`,
    html: baseTemplate(`
      <h2 style="color: #18181b; margin: 0 0 8px; font-size: 20px;">Ola, ${name}!</h2>
      <p style="color: #52525b; margin: 0 0 24px; line-height: 1.6;">
        Aqui esta o resumo do seu MEI em ${data.mes}/${data.ano}:
      </p>

      <!-- Metricas -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
        <tr>
          <td width="50%" style="padding: 16px; background-color: #f0fdf4; border-radius: 8px 0 0 8px;">
            <p style="color: #6b7280; margin: 0 0 4px; font-size: 12px; text-transform: uppercase;">Faturamento ${data.mes}</p>
            <p style="color: #18181b; margin: 0; font-size: 24px; font-weight: bold;">${formatCurrency(data.faturamentoMes)}</p>
          </td>
          <td width="50%" style="padding: 16px; background-color: #f9fafb; border-radius: 0 8px 8px 0;">
            <p style="color: #6b7280; margin: 0 0 4px; font-size: 12px; text-transform: uppercase;">Total no Ano</p>
            <p style="color: #18181b; margin: 0; font-size: 24px; font-weight: bold;">${formatCurrency(data.totalAcumulado)}</p>
          </td>
        </tr>
      </table>

      <!-- Status do Limite -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #f9fafb; border-radius: 8px; overflow: hidden;">
        <tr>
          <td style="padding: 16px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="color: #6b7280; margin: 0 0 8px; font-size: 12px; text-transform: uppercase;">Limite MEI (R$ 81.000)</p>
                  <div style="background-color: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background-color: ${statusColor}; height: 100%; width: ${Math.min(data.percentualLimite, 100)}%;"></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding-top: 8px;">
                  <span style="color: ${statusColor}; font-weight: bold;">${data.percentualLimite.toFixed(1)}%</span>
                  <span style="color: #6b7280;"> - ${statusText}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Proximo DAS -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #eff6ff; border-radius: 8px; padding: 16px;">
        <tr>
          <td style="padding: 16px;">
            <p style="color: #1e40af; margin: 0 0 4px; font-size: 14px; font-weight: bold;">Proximo DAS</p>
            <p style="color: #3b82f6; margin: 0; font-size: 16px;">
              ${data.proximoDAS.data} - ${formatCurrency(data.proximoDAS.valor)}
            </p>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <a href="https://calculamei.com.br/dashboard" style="display: inline-block; background-color: #00D084; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Ver Dashboard Completo
            </a>
          </td>
        </tr>
      </table>
    `),
    text: `Resumo de ${data.mes}/${data.ano}\n\nFaturamento do mes: ${formatCurrency(data.faturamentoMes)}\nTotal acumulado: ${formatCurrency(data.totalAcumulado)}\nLimite MEI: ${data.percentualLimite.toFixed(1)}%\n\nProximo DAS: ${data.proximoDAS.data} - ${formatCurrency(data.proximoDAS.valor)}\n\nAcesse: https://calculamei.com.br/dashboard`,
  }
}

// Insight semanal
export interface WeeklyInsightData {
  userName: string
  insight: string
  tip: string
  ctaText: string
  ctaUrl: string
}

export function weeklyInsightEmail(data: WeeklyInsightData): EmailData {
  const name = data.userName || 'empreendedor'

  return {
    subject: `Dica da semana para seu MEI`,
    html: baseTemplate(`
      <h2 style="color: #18181b; margin: 0 0 16px; font-size: 20px;">Ola, ${name}!</h2>
      <p style="color: #52525b; margin: 0 0 24px; line-height: 1.6;">
        ${data.insight}
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <tr>
          <td style="padding: 16px;">
            <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
              <strong>Dica:</strong> ${data.tip}
            </p>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <a href="${data.ctaUrl}" style="display: inline-block; background-color: #00D084; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              ${data.ctaText}
            </a>
          </td>
        </tr>
      </table>
    `),
    text: `${data.insight}\n\nDica: ${data.tip}\n\n${data.ctaText}: ${data.ctaUrl}`,
  }
}

// Trial terminando
export function trialEndingEmail(userName: string, daysRemaining: number): EmailData {
  const name = userName || 'empreendedor'

  return {
    subject: `Seu trial Premium termina em ${daysRemaining} dia${daysRemaining > 1 ? 's' : ''}!`,
    html: baseTemplate(`
      <h2 style="color: #18181b; margin: 0 0 16px; font-size: 20px;">Ola, ${name}!</h2>
      <p style="color: #52525b; margin: 0 0 16px; line-height: 1.6;">
        Seu periodo de teste Premium termina em <strong>${daysRemaining} dia${daysRemaining > 1 ? 's' : ''}</strong>.
      </p>
      <p style="color: #52525b; margin: 0 0 24px; line-height: 1.6;">
        Nao perca acesso aos recursos exclusivos:
      </p>
      <ul style="color: #52525b; margin: 0 0 24px; padding-left: 20px; line-height: 1.8;">
        <li>Relatorios PDF profissionais</li>
        <li>Exportacao ilimitada</li>
        <li>Historico de 5 anos</li>
        <li>Sem anuncios</li>
        <li>Alertas por WhatsApp</li>
      </ul>

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <a href="https://calculamei.com.br/premium" style="display: inline-block; background-color: #8b5cf6; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Assinar Premium - R$ 14,90/mes
            </a>
          </td>
        </tr>
      </table>
    `),
    text: `Seu trial Premium termina em ${daysRemaining} dia${daysRemaining > 1 ? 's' : ''}!\n\nAssine agora para nao perder os beneficios: https://calculamei.com.br/premium`,
  }
}
