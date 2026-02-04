import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

// JWT_SECRET é obrigatório - sem fallback para evitar tokens fracos
const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET é obrigatório em produção')
}

const JWT_SECRET = new TextEncoder().encode(
  jwtSecret || 'dev-only-secret-do-not-use-in-production'
)

const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY = '7d'

export interface TokenPayload extends JWTPayload {
  userId: string
  email: string
  type: 'access' | 'refresh'
}

export async function generateAccessToken(
  userId: string,
  email: string
): Promise<string> {
  return new SignJWT({ userId, email, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

export async function generateRefreshToken(
  userId: string,
  email: string
): Promise<string> {
  return new SignJWT({ userId, email, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as TokenPayload
  } catch {
    return null
  }
}

export function getRefreshTokenExpiry(): Date {
  const now = new Date()
  now.setDate(now.getDate() + 7)
  return now
}
