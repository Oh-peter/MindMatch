import 'server-only'
import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'

export const GUEST_COOKIE = 'mm_guest'

const ONE_YEAR = 60 * 60 * 24 * 365

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// 쿠키 값은 사용자가 임의로 바꿀 수 있으므로 항상 형식을 검증합니다.
export function isValidGuestId(value: unknown): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value)
}

/** 게스트 ID를 읽기만 합니다. 쿠키가 없거나 형식이 틀리면 null. */
export async function getGuestId(): Promise<string | null> {
  const store = await cookies()
  const value = store.get(GUEST_COOKIE)?.value
  return isValidGuestId(value) ? value : null
}

/**
 * 게스트 ID를 반환하고, 없으면 새로 만들어 쿠키로 심습니다.
 * 쿠키를 쓰므로 Server Action 또는 Route Handler에서만 호출하세요.
 */
export async function ensureGuestId(): Promise<string> {
  const existing = await getGuestId()
  if (existing) return existing

  const id = randomUUID()
  const store = await cookies()
  store.set(GUEST_COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ONE_YEAR,
  })
  return id
}

/** 로그인 후 게스트 데이터 이전이 끝나면 쿠키를 지웁니다. (Server Action / Route Handler 전용) */
export async function clearGuestId(): Promise<void> {
  const store = await cookies()
  store.delete(GUEST_COOKIE)
}