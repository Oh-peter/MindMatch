import Link from 'next/link'
import MatchList from '@/components/match/MatchList'
import ShareLink from '@/components/match/ShareLink'
import styles from '@/components/match/match.module.css'
import { getCharacter } from '@/features/characters'
import { requireUser } from '@/lib/auth'
import { getLatestResult } from '@/lib/results'

export default async function MatchPage() {
  const user = await requireUser('/match')
  const latest = await getLatestResult(user)

  if (!latest) {
    return (
      <main className={styles.wrap}>
        <h1 className={styles.title}>궁합</h1>
        <div className={styles.empty}>
          <h2>먼저 검사를 해 주세요</h2>
          <p>내 MBTI 유형을 알아야 잘 맞는 유형을 보여 드릴 수 있어요.</p>
          <Link href="/test" className={styles.btn}>
            검사하러 가기
          </Link>
        </div>
      </main>
    )
  }

  const me = getCharacter(latest.type)

  return (
    <main className={styles.wrap}>
      <h1 className={styles.title}>궁합</h1>

      <div className={styles.hero}>
        <span className={styles.heroEmoji} aria-hidden>
          {me.emoji}
        </span>
        <div>
          <div className={styles.heroLabel}>{user.name}님의 최근 결과</div>
          <div className={styles.heroType}>{latest.type}</div>
          <div className={styles.heroName}>
            {me.name} · {me.tagline}
          </div>
          <div className={styles.heroLinks}>
            <Link href={`/result/${latest.id}`}>결과 보기</Link>
            <Link href={`/result/${latest.id}/card`}>동식물 카드</Link>
            <Link href="/test">다시 검사하기</Link>
          </div>
        </div>
      </div>

      <MatchList type={latest.type} />

      <section className={styles.section}>
        <h2>친구와 궁합 보기</h2>
        <p className={styles.sub}>링크를 보내면 친구가 자기 유형으로 나와의 궁합을 바로 볼 수 있어요.</p>
        <ShareLink path={`/compare/${latest.id}`} />
      </section>
    </main>
  )
}