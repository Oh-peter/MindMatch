import Link from 'next/link'
import { notFound } from 'next/navigation'
import PairResult from '@/components/match/PairResult'
import styles from '@/components/match/match.module.css'
import { getCharacter } from '@/features/characters'
import { isMbtiType } from '@/features/mbti/compatibility'
import { adminDb } from '@/lib/firebaseAdmin'
import { getLatestResult } from '@/lib/results'
import { getSessionUser } from '@/lib/session'

type Props = { params: Promise<{ id: string }> }

const ID_PATTERN = /^[A-Za-z0-9]{20}$/

export default async function ComparePage({ params }: Props) {
  const { id } = await params
  if (!ID_PATTERN.test(id)) notFound()

  const snap = await adminDb.collection('results').doc(id).get()
  const friendType = snap.get('type')
  if (!snap.exists || !isMbtiType(friendType)) notFound()

  const user = await getSessionUser()
  const mine = await getLatestResult(user)
  const friend = getCharacter(friendType)

  return (
    <main className={styles.wrap}>
      <h1 className={styles.title}>친구와 궁합 보기</h1>
      {mine ? (
        <PairResult mine={mine.type} other={friendType} otherLabel="친구" />
      ) : (
        <div className={styles.empty}>
          <h2>
            친구는 {friendType} · {friend.name}예요
          </h2>
          <p>내 유형을 알아야 궁합을 볼 수 있어요. 검사를 마친 뒤 이 링크를 다시 열어 주세요.</p>
          <Link href="/test" className={styles.btn}>
            검사하러 가기
          </Link>
        </div>
      )}
    </main>
  )
}