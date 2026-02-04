import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { createSession, setAuthCookies } from '@/lib/auth/session'

const OAUTH_STATE_COOKIE = 'oauth_state'

interface GoogleTokenResponse {
  access_token: string
  id_token: string
  expires_in: number
  token_type: string
  refresh_token?: string
}

interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const state = searchParams.get('state')

  // Valida state para prevenir CSRF
  const cookieStore = await cookies()
  const storedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value

  // Limpa o cookie de state
  cookieStore.delete(OAUTH_STATE_COOKIE)

  if (!state || !storedState || state !== storedState) {
    console.error('OAuth state mismatch - possível ataque CSRF')
    return NextResponse.redirect(new URL('/sign-in?error=invalid_state', request.url))
  }

  // Handle errors from Google
  if (error) {
    return NextResponse.redirect(new URL('/sign-in?error=google_denied', request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/sign-in?error=no_code', request.url))
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/sign-in?error=not_configured', request.url))
  }

  const redirectUri = process.env.NODE_ENV === 'production'
    ? 'https://calculamei.com.br/api/auth/google/callback'
    : 'http://localhost:3000/api/auth/google/callback'

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text())
      return NextResponse.redirect(new URL('/sign-in?error=token_failed', request.url))
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json()

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    if (!userInfoResponse.ok) {
      return NextResponse.redirect(new URL('/sign-in?error=userinfo_failed', request.url))
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json()

    // Rejeita emails não verificados pelo Google
    if (!googleUser.verified_email) {
      console.error('Google OAuth: email não verificado', googleUser.email)
      return NextResponse.redirect(new URL('/sign-in?error=email_not_verified', request.url))
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    })

    const isNewUser = !user

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          avatarUrl: googleUser.picture,
          provider: 'google',
          providerId: googleUser.id,
          emailVerified: googleUser.verified_email,
          emailVerifiedAt: googleUser.verified_email ? new Date() : null,
        },
      })
    } else if (user.provider === 'email' && !user.providerId) {
      // Link Google account to existing email user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          provider: 'google',
          providerId: googleUser.id,
          avatarUrl: user.avatarUrl || googleUser.picture,
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      })
    }

    // Create session
    const session = await createSession(user.id, user.email)

    // Set cookies
    await setAuthCookies(session.accessToken, session.refreshToken)

    // Redirect to onboarding if new user, otherwise dashboard
    const redirectPath = isNewUser ? '/onboarding' : '/dashboard'
    return NextResponse.redirect(new URL(redirectPath, request.url))

  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(new URL('/sign-in?error=oauth_failed', request.url))
  }
}
