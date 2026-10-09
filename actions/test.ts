'use server'

import { adminDb } from '@/lib/firebaseAdmin'
import { ensureGuestId } from '@/lib/guest'
import { getSessionUser } from '@/lib/session'
import { calcScores, calcType, isValidAnswers } from '@/features/mbti/scoring'

export async function saveTestResult(answers: number[]): Promise<string> {
  if (!isValidAnswers(answers)) {
    throw new Error('잘못된 응답입니다.')
  }

  const [guestId, user] = await Promise.all([ensureGuestId(), getSessionUser()])
  const scores = calcScores(answers)

  const ref = await adminDb.collection('results').add({
    type: calcType(scores),
    scores,
    guestId,
    ...(user ? { userId: user.uid } : {}),
    createdAt: Date.now(),
  })
  return ref.id
}