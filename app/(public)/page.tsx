import Image from 'next/image'
import Link from 'next/link'
import { getCharacter } from '@/features/characters'
import { QUESTIONS } from '@/features/mbti/questions'
import { getLatestResultId } from '@/lib/results'
import { getSessionUser } from '@/lib/session'
import styles from './landing.module.css'

const TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
]

// 히어로의 예시 카드 (실제 결과가 아니라 화면 구성을 보여 주는 샘플)
const SAMPLE = getCharacter('ENFP')
const SAMPLE_BARS = [
  { letter: 'E', pct: 72 },
  { letter: 'N', pct: 65 },
  { letter: 'F', pct: 80 },
  { letter: 'P', pct: 58 },
]

export default async function Home() {
  const user = await getSessionUser()
  // 결과 조회가 실패해도 첫 화면은 열리도록 합니다.
  const latestId = await getLatestResultId(user).catch(() => null)

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <section className={styles.hero}>
          <div className={styles.copy}>
            <h1>나를 알고, 마음이 맞는 사람을 만나요</h1>
            <p>
              {QUESTIONS.length}개 문장에 답하면 나의 MBTI와 닮은 동식물 카드를 받아요. 카드는 이미지로 저장해서
              인스타그램 스토리에 바로 올릴 수 있어요.
            </p>
            <div className={styles.actions}>
              <Link href="/test" className={`${styles.btn} ${styles.btnLight}`}>
                검사 시작하기
              </Link>
              {user ? (
                <Link href="/community" className={`${styles.btn} ${styles.btnGhost}`}>
                  커뮤니티 가기
                </Link>
              ) : (
                <Link href="/signup" className={`${styles.btn} ${styles.btnGhost}`}>
                  회원가입
                </Link>
              )}
            </div>
            <small className={styles.note}>회원가입 없이 3분이면 끝나요.</small>
          </div>

          <div className={styles.cardWrap} aria-hidden>
            <span className={`${styles.orb} ${styles.orbA}`} />
            <span className={`${styles.orb} ${styles.orbB}`} />
            <div className={`${styles.glass} ${styles.card}`}>
              <div className={styles.cardHead}>
                <span className={styles.cardBrand}>
                  <Image className={styles.miniLogo} src="/assets/logo-symbol.png" alt="" width={22} height={22} />
                  MindMatch
                </span>
                <span className={styles.badge}>예시</span>
              </div>
              <div className={styles.cardEmoji}>{SAMPLE.emoji}</div>
              <div className={styles.cardType}>ENFP</div>
              <div className={styles.cardName}>
                {SAMPLE.name} · {SAMPLE.kind}
              </div>
              <p className={styles.cardTag}>{SAMPLE.tagline}</p>
              <div className={styles.bars}>
                {SAMPLE_BARS.map((b) => (
                  <div key={b.letter} className={styles.bar}>
                    <span>{b.letter}</span>
                    <span className={styles.barTrack}>
                      <span className={styles.barFill} style={{ width: `${b.pct}%` }} />
                    </span>
                    <span>{b.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.steps} aria-label="이용 순서">
          <Link href="/test" className={`${styles.glass} ${styles.step}`} data-step="1">
            <span className={styles.pill}>1단계</span>
            <h2>검사하기</h2>
            <p>{QUESTIONS.length}개 문장에 직감대로 답해요.</p>
            <span className={styles.foot}>회원가입 없이 시작</span>
          </Link>

          <Link
            href={latestId ? `/result/${latestId}` : '/test'}
            className={`${styles.glass} ${styles.step}`}
            data-step="2"
            data-disabled={!latestId}
          >
            <span className={styles.pill}>2단계</span>
            <h2>결과 보기</h2>
            <p>성향 비율, 유형 설명, 동식물 카드를 확인해요.</p>
            <span className={styles.foot}>{latestId ? '최근 결과 열기' : '검사를 마치면 열려요'}</span>
          </Link>

          <Link href="/community" className={`${styles.glass} ${styles.step}`} data-step="3">
            <span className={styles.pill}>3단계</span>
            <h2>커뮤니티</h2>
            <p>같은 유형의 사람들과 이야기를 나눠요.</p>
            <span className={styles.foot}>{user ? '입장하기' : '로그인 후 이용해요'}</span>
          </Link>
        </section>

        <section className={styles.types} aria-labelledby="types-title">
          <h2 id="types-title">16가지 유형, 16가지 동식물</h2>
          <p className={styles.typesSub}>내 유형은 어떤 모습일까요? 검사를 마치면 나만의 카드로 받아요.</p>
          <ul className={styles.grid}>
            {TYPES.map((t) => {
              const c = getCharacter(t)
              return (
                <li key={t} className={`${styles.glass} ${styles.tile}`}>
                  <span className={styles.tileEmoji} aria-hidden>
                    {c.emoji}
                  </span>
                  <span className={styles.tileCode}>{t}</span>
                  <span className={styles.tileName}>{c.name}</span>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </main>
  )
}