import { NextResponse } from 'next/server'
import { getAuthFromCookies, clearAuthCookies, invalidateSession } from '@/lib/auth/session'

export async function POST() {
  try {
    const { refreshToken } = await getAuthFromCookies()

    if (refreshToken) {
      await invalidateSession(refreshToken)
    }

    await clearAuthCookies()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    // Still clear cookies even if there's an error
    await clearAuthCookies()
    return NextResponse.json({ success: true })
  }
}
