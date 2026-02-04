/**
 * Template de email para alerta de vencimento do DAS
 */

interface DasAlertEmailParams {
  userName: string
  diasRestantes: number
  dataVencimento: string
  valorDas: string
  tipoMei: string
}

export function getDasAlertEmailHtml(params: DasAlertEmailParams): string {
  const { userName, diasRestantes, dataVencimento, valorDas, tipoMei } = params

  const urgencyColor = diasRestantes <= 1 ? '#DC2626' : diasRestantes <= 3 ? '#F59E0B' : '#00D084'
  const urgencyText = diasRestantes === 0
    ? 'VENCE HOJE!'
    : diasRestantes === 1
      ? 'Vence AMANHA!'
      : `Faltam ${diasRestantes} dias`

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lembrete DAS - Calcula MEI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; background-color: #00D084; border-radius: 12px 12px 0 0;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td>
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                      Calcula MEI
                    </h1>
                  </td>
                  <td align="right">
                    <span style="color: #ffffff; font-size: 14px; opacity: 0.9;">
                      Lembrete de DAS
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                Ola, <strong>${userName || 'MEI'}</strong>!
              </p>

              <!-- Alert Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <div style="display: inline-block; padding: 8px 20px; background-color: ${urgencyColor}; color: #ffffff; border-radius: 20px; font-weight: 600; font-size: 14px; margin-bottom: 16px;">
                      ${urgencyText}
                    </div>
                    <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
                      Seu DAS vence em
                    </p>
                    <p style="margin: 0; color: #111827; font-size: 28px; font-weight: 700;">
                      ${dataVencimento}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- DAS Details -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #f0fdf4; border-radius: 8px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Tipo MEI:</span>
                        </td>
                        <td style="padding: 8px 0;" align="right">
                          <span style="color: #111827; font-size: 14px; font-weight: 600;">${tipoMei}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 14px;">Valor a pagar:</span>
                        </td>
                        <td style="padding: 8px 0; border-top: 1px solid #e5e7eb;" align="right">
                          <span style="color: #00D084; font-size: 20px; font-weight: 700;">${valorDas}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao"
                       style="display: inline-block; padding: 14px 32px; background-color: #00D084; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">
                      Gerar Guia DAS
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                Pagar o DAS em dia evita multas e garante seus beneficios do INSS.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      Este email foi enviado pelo Calcula MEI.
                      <br>
                      <a href="https://calculamei.com.br/dashboard/configuracoes" style="color: #00D084;">Gerenciar alertas</a>
                    </p>
                  </td>
                  <td align="right">
                    <a href="https://calculamei.com.br" style="color: #00D084; font-size: 12px; text-decoration: none;">
                      calculamei.com.br
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export function getDasAlertEmailText(params: DasAlertEmailParams): string {
  const { userName, diasRestantes, dataVencimento, valorDas, tipoMei } = params

  const urgencyText = diasRestantes === 0
    ? 'VENCE HOJE!'
    : diasRestantes === 1
      ? 'Vence AMANHA!'
      : `Faltam ${diasRestantes} dias`

  return `
Ola, ${userName || 'MEI'}!

${urgencyText}

Seu DAS vence em ${dataVencimento}

Tipo MEI: ${tipoMei}
Valor a pagar: ${valorDas}

Acesse o portal para gerar a guia:
https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao

Pagar o DAS em dia evita multas e garante seus beneficios do INSS.

---
Calcula MEI
https://calculamei.com.br
  `.trim()
}
