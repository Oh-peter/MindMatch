'use client'

import type { CSSProperties } from 'react'

const SIZES = [64, 52, 42, 34, 42, 52, 64]
const LABELS = ['매우 그렇다', '그렇다', '약간 그렇다', '보통이다', '약간 그렇지 않다', '그렇지 않다', '전혀 그렇지 않다']

function sideOf(i: number) {
  if (i < 3) return 'agree'
  if (i === 3) return 'neutral'
  return 'disagree'
}

type Props = {
  value: number | null
  onPick: (value: number) => void
  disabled?: boolean
}

export default function LikertScale({ value, onPick, disabled }: Props) {
  return (
    <div>
      <div className="likert" role="radiogroup" aria-label="응답 선택">
        {SIZES.map((size, i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === i}
            aria-label={LABELS[i]}
            className="likert-dot"
            data-side={sideOf(i)}
            data-selected={value === i}
            disabled={disabled}
            onClick={() => onPick(i)}
            style={{ '--s': `${size}px` } as CSSProperties}
          />
        ))}
      </div>
      <div className="likert-ends">
        <span className="agree">그렇다</span>
        <span className="disagree">그렇지 않다</span>
      </div>
    </div>
  )
}