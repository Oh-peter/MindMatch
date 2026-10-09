import 'server-only'
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebaseAdmin'

export const SESSION_COOKIE = 'mm_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 5 // 5일(초)

export type SessionUser = { uid: string; email: string | null; name: string }

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies()
  const cookie = store.get(SESSION_COOKIE)?.value
  if (!cookie) return null
  try {
    const d = await adminAuth.verifySessionCookie(cookie)
    const name = typeof d.name === 'string' && d.name ? d.name : (d.email?.split('@')[0] ?? '회원')
    return { uid: d.uid, email: d.email ?? null, name }
  } catch {
    return null
  }
}