import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true })
    }

    // Check if user uses OAuth (no password to reset)
    if (user.provider !== 'email' && !user.passwordHash) {
      return NextResponse.json({ success: true })
    }

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: email.toLowerCase() },
    })

    // Generate token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Save token
    await prisma.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        expiresAt,
      },
    })

    // Send email
    const resetUrl = process.env.NODE_ENV === 'production'
      ? `https://calculamei.com.br/reset-password?token=${token}`
      : `http://localhost:3000/reset-password?token=${token}`

    const resendApiKey = process.env.RESEND_API_KEY
    const emailFrom = process.env.RESEND_FROM_EMAIL || 'Calcula MEI <noreply@calculamei.com.br>'

    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: emailFrom,
            to: email,
            subject: 'Redefinir sua senha - Calcula MEI',
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #00d084; margin: 0;">Calcula MEI</h1>
                </div>

                <h2 style="color: #333;">Redefinir sua senha</h2>

                <p>Olá${user.name ? `, ${user.name.split(' ')[0]}` : ''}!</p>

                <p>Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:</p>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" style="background-color: #00d084; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                    Redefinir Senha
                  </a>
                </div>

                <p style="color: #666; font-size: 14px;">
                  Este link expira em <strong>1 hora</strong>.
                </p>

                <p style="color: #666; font-size: 14px;">
                  Se você não solicitou esta redefinição, pode ignorar este email. Sua senha permanecerá a mesma.
                </p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                <p style="color: #999; font-size: 12px; text-align: center;">
                  Calcula MEI - Calculadoras financeiras para MEI crescer
                </p>
              </body>
              </html>
            `,
          }),
        })
      } catch (emailError) {
        console.error('Error sending email:', emailError)
        // Don't fail the request, just log the error
      }
    } else {
      // Log for development
      console.log('Password reset link:', resetUrl)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
