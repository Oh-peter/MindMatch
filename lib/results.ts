import 'server-only'
import { adminDb } from '@/lib/firebaseAdmin'
import { getGuestId } from '@/lib/guest'
import type { SessionUser } from '@/lib/session'

// 로그인 상태면 계정의 결과, 아니면 게스트 쿠키의 결과 중 가장 최근 것의 ID
export async function getLatestResultId(user: SessionUser | null): Promise<string | null> {
  const field = user ? 'userId' : 'guestId'
  const value = user ? user.uid : await getGuestId()
  if (!value) return null

  const snap = await adminDb.collection('results').where(field, '==', value).select('createdAt').get()

  let latest: { id: string; at: number } | null = null
  for (const doc of snap.docs) {
    const at = Number(doc.get('createdAt') ?? 0)
    if (!latest || at > latest.at) latest = { id: doc.id, at }
  }
  return latest?.id ?? null
}