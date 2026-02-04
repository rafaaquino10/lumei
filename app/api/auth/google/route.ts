import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const OAUTH_STATE_COOKIE = 'oauth_state'

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID

  if (!clientId) {
    return NextResponse.json(
      { error: 'Google OAuth não configurado' },
      { status: 503 }
    )
  }

  const redirectUri = process.env.NODE_ENV === 'production'
    ? 'https://calculamei.com.br/api/auth/google/callback'
    : 'http://localhost:3000/api/auth/google/callback'

  const scope = encodeURIComponent('openid email profile')
  const state = crypto.randomUUID()

  // Armazena state em cookie httpOnly para validação no callback
  const cookieStore = await cookies()
  cookieStore.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 10 * 60, // 10 minutos - tempo para completar OAuth
    path: '/',
  })

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', scope)
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('access_type', 'offline')
  authUrl.searchParams.set('prompt', 'consent')

  return NextResponse.redirect(authUrl.toString())
}
