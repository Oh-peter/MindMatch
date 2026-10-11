import { getCharacter } from '@/features/characters'
import { getCompatibility } from '@/features/mbti/compatibility'
import styles from './match.module.css'

type Props = { mine: string; other: string; otherLabel: string }

export default function PairResult({ mine, other, otherLabel }: Props) {
  const r = getCompatibility(mine, other)
  const a = getCharacter(mine)
  const b = getCharacter(other)

  return (
    <>
      <div className={styles.pair}>
        <div className={styles.pairSide}>
          <span className={styles.emoji} aria-hidden>
            {a.emoji}
          </span>
          <div className={styles.pairType}>{mine}</div>
          <div className={styles.pairWho}>나 · {a.name}</div>
        </div>
        <div>
          <div className={styles.pairScore}>{r.score}</div>
          <div className={styles.pairLabel}>{r.label}</div>
        </div>
        <div className={styles.pairSide}>
          <span className={styles.emoji} aria-hidden>
            {b.emoji}
          </span>
          <div className={styles.pairType}>{other}</div>
          <div className={styles.pairWho}>
            {otherLabel} · {b.name}
          </div>
        </div>
      </div>

      <ul className={styles.reasons}>
        {r.reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
      <p className={styles.tip}>{r.tip}</p>
      <p className={styles.note}>재미로 보는 궁합이에요. 실제 관계는 성격 유형만으로 정해지지 않아요.</p>
    </>
  )
}