import { headers } from 'next/headers'
import crypto from 'crypto'

export async function getRequestId(): Promise<string> {
  const headerList = await headers()
  const headerId = headerList.get('x-request-id')
  if (headerId) return headerId
  return crypto.randomUUID()
}

export async function getClientIp(): Promise<string> {
  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return headerList.get('x-real-ip') || 'unknown'
}
