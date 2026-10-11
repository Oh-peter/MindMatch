import 'server-only'
import { redirect } from 'next/navigation'
import { getSessionUser, type SessionUser } from '@/lib/session'

// 로그인하지 않았으면 로그인 후 돌아올 주소(next)와 함께 로그인 화면으로 보냅니다.
export async function requireUser(next: string): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`)
  return user
}