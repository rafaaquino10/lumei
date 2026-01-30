import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
)

const publicRoutes = [
  '/',
  '/calcular',
  '/blog',
  '/premium',
  '/sign-in',
  '/sign-up',
  '/faq',
  '/contato',
  '/termos',
  '/privacidade',
  '/cookies',
  '/calculadoras',
]

const publicApiRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/refresh',
  '/api/webhook',
]

function isPublicRoute(pathname: string): boolean {
  // Check exact matches
  if (publicRoutes.includes(pathname)) return true

  // Check prefix matches
  for (const route of publicRoutes) {
    if (pathname.startsWith(route + '/')) return true
  }

  // Check API routes
  for (const route of publicApiRoutes) {
    if (pathname.startsWith(route)) return true
  }

  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Check for access token
  const accessToken = request.cookies.get('access_token')?.value

  if (!accessToken) {
    // Redirect to sign-in for protected pages
    if (!pathname.startsWith('/api/')) {
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signInUrl)
    }
    // Return 401 for API routes
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    // Verify token
    await jwtVerify(accessToken, JWT_SECRET)
    return NextResponse.next()
  } catch {
    // Token invalid or expired, try refresh
    const refreshToken = request.cookies.get('refresh_token')?.value

    if (!refreshToken) {
      if (!pathname.startsWith('/api/')) {
        const signInUrl = new URL('/sign-in', request.url)
        signInUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(signInUrl)
      }
      return NextResponse.json({ error: 'Sessão expirada' }, { status: 401 })
    }

    // Let the request through, the session helper will handle refresh
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
