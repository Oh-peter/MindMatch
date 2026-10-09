import Link from 'next/link'
import { notFound } from 'next/navigation'
import { adminDb } from '@/lib/firebaseAdmin'
import { PAIRS } from '@/features/mbti/scoring'
import type { TestResult, TypeProfile } from '@/features/mbti/types'

type Props = { params: Promise<{ id: string }> }

const ID_PATTERN = /^[A-Za-z0-9]{20}$/

// 개발 중에는 원인을 화면에 보여 주고, 배포 환경에서는 일반 404로 처리합니다.
function Missing({ reason }: { reason: string }) {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: 24 }}>
      <h1>결과를 찾을 수 없어요</h1>
      <p style={{ marginTop: 12, color: '#5b6b80' }}>{reason}</p>
    </main>
  )
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params
  if (!ID_PATTERN.test(id)) {
    return <Missing reason={`주소의 ID 형식이 맞지 않습니다: ${id}`} />
  }

  const resultSnap = await adminDb.collection('results').doc(id).get()
  if (!resultSnap.exists) {
    return <Missing reason={`Firestore의 results 컬렉션에 ${id} 문서가 없습니다.`} />
  }
  const result = resultSnap.data() as TestResult

  const results = adminDb.collection('results')
  const [profileSnap, sameTypeCount, totalCount] = await Promise.all([
    adminDb.collection('mbtiTypes').doc(result.type).get(),
    results.where('type', '==', result.type).count().get(),
    results.count().get(),
  ])

  const profile = profileSnap.exists ? (profileSnap.data() as TypeProfile) : null
  const same = sameTypeCount.data().count
  const total = totalCount.data().count
  const ratio = total > 0 ? Math.round((same / total) * 100) : 0

  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: 24 }}>
      <p style={{ color: '#666' }}>나의 MBTI</p>
      <h1 style={{ fontSize: 48, margin: '4px 0' }}>{result.type}</h1>
      {profile && <h2 style={{ margin: '0 0 12px' }}>{profile.title}</h2>}
      {profile ? <p>{profile.summary}</p> : <p>이 유형의 상세 설명을 준비 중입니다.</p>}

      <section style={{ margin: '32px 0' }}>
        <h3>성향 비율</h3>
        {PAIRS.map(([a, b]) => {
          const sum = result.scores[a] + result.scores[b]
          const pctA = sum > 0 ? Math.round((result.scores[a] / sum) * 100) : 50
          return (
            <div key={a + b} style={{ margin: '12px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  {a} {pctA}%
                </span>
                <span>
                  {100 - pctA}% {b}
                </span>
              </div>
              <div style={{ height: 8, background: '#eee', borderRadius: 4 }}>
                <div style={{ width: `${pctA}%`, height: '100%', background: '#052e58', borderRadius: 4 }} />
              </div>
            </div>
          )
        })}
      </section>

      {profile && (
        <section style={{ display: 'grid', gap: 16 }}>
          <div>
            <h3>강점</h3>
            <ul>
              {profile.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>주의할 점</h3>
            <ul>
              {profile.cautions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <p style={{ margin: '24px 0', color: '#666' }}>
        지금까지 검사한 사람 중 {ratio}%가 {result.type}입니다.
      </p>

      <Link href={`/result/${id}/card`}>동식물 카드 보기</Link>
    </main>
  )
}