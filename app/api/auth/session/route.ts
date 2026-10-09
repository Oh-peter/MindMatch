import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { adminAuth, adminDb } from '@/lib/firebaseAdmin'
import { clearGuestId, getGuestId } from '@/lib/guest'
import { SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session'

export async function POST(request: Request) {
  let idToken: unknown
  try {
    const body = (await request.json()) as { idToken?: unknown }
    idToken = body.idToken
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  if (typeof idToken !== 'string' || !idToken) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken)
    // 방금 로그인한 토큰만 세션으로 교환합니다. (5분 이내)
    if (Date.now() / 1000 - decoded.auth_time > 5 * 60) {
      return NextResponse.json({ error: 'stale token' }, { status: 401 })
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE * 1000,
    })
    const store = await cookies()
    store.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    })

    // 게스트 결과를 계정으로 이전
    const guestId = await getGuestId()
    if (guestId) {
      const snap = await adminDb.collection('results').where('guestId', '==', guestId).get()
      if (!snap.empty) {
        const batch = adminDb.batch()
        snap.docs.forEach((doc) => batch.update(doc.ref, { userId: decoded.uid }))
        await batch.commit()
      }
      await clearGuestId()
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
}

export async function DELETE() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  return NextResponse.json({ ok: true })
}