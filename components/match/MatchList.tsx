import { getCharacter } from '@/features/characters'
import { rankMatches } from '@/features/mbti/compatibility'
import styles from './match.module.css'

type RowProps = { type: string; score: number; label: string; reason: string; warn?: boolean }

function Row({ type, score, label, reason, warn }: RowProps) {
  const c = getCharacter(type)
  return (
    <li className={`${styles.item} ${warn ? styles.warn : ''}`}>
      <span className={styles.emoji} aria-hidden>
        {c.emoji}
      </span>
      <div>
        <div className={styles.name}>
          {type}
          <small>{c.name}</small>
        </div>
        <div className={styles.bar}>
          <span className={styles.barFill} style={{ width: `${score}%` }} />
        </div>
        <p className={styles.why}>{reason}</p>
      </div>
      <div>
        <div className={styles.score}>{score}</div>
        <div className={styles.label}>{label}</div>
      </div>
    </li>
  )
}

export default function MatchList({ type }: { type: string }) {
  const ranked = rankMatches(type)
  const best = ranked.slice(0, 3)
  const hard = ranked.slice(-2).reverse()

  return (
    <>
      <section className={styles.section}>
        <h2>잘 맞는 유형 TOP 3</h2>
        <p className={styles.sub}>나와 비슷한 점과 보완되는 점이 많은 유형이에요.</p>
        <ul className={styles.list}>
          {best.map((r) => (
            <Row key={r.type} {...r} />
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>서로 노력이 필요한 유형</h2>
        <p className={styles.sub}>안 맞는다는 뜻이 아니라, 대화 방식을 조금 맞춰 가면 좋은 유형이에요.</p>
        <ul className={styles.list}>
          {hard.map((r) => (
            <Row key={r.type} {...r} warn />
          ))}
        </ul>
      </section>

      <p className={styles.note}>재미로 보는 궁합이에요. 실제 관계는 성격 유형만으로 정해지지 않아요.</p>
    </>
  )
}