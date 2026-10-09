import Link from 'next/link'
import { notFound } from 'next/navigation'
import { adminDb } from '@/lib/firebaseAdmin'
import CardView from '@/components/character-card/CardView'
import { getCharacter, getImageSrc, getPalette } from '@/features/characters'
import type { TestResult, TypeProfile } from '@/features/mbti/types'

type Props = { params: Promise<{ id: string }> }

const ID_PATTERN = /^[A-Za-z0-9]{20}$/

function Missing({ reason }: { reason: string }) {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: 24 }}>
      <h1>카드를 만들 수 없어요</h1>
      <p style={{ marginTop: 12, color: '#5b6b80' }}>{reason}</p>
    </main>
  )
}

export default async function CardPage({ params }: Props) {
  const { id } = await params
  if (!ID_PATTERN.test(id)) {
    return <Missing reason={`주소의 ID 형식이 맞지 않습니다: ${id}`} />
  }

  const resultSnap = await adminDb.collection('results').doc(id).get()
  if (!resultSnap.exists) {
    return <Missing reason={`Firestore의 results 컬렉션에 ${id} 문서가 없습니다.`} />
  }
  const result = resultSnap.data() as TestResult

  const profileSnap = await adminDb.collection('mbtiTypes').doc(result.type).get()
  const profile = profileSnap.exists ? (profileSnap.data() as TypeProfile) : null

  return (
    <main>
      <CardView
        type={result.type}
        title={profile?.title}
        character={getCharacter(result.type)}
        palette={getPalette(result.type)}
        imageSrc={getImageSrc(result.type)}
      />
      <p style={{ textAlign: 'center', paddingBottom: 32 }}>
        <Link href={`/result/${id}`}>결과로 돌아가기</Link>
      </p>
    </main>
  )
}