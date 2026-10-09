import type { CSSProperties } from 'react'
import { getCharacter, getPalette } from '@/features/characters'

type Props = { type: string; className?: string }

export default function SampleCard({ type, className }: Props) {
  const c = getCharacter(type)
  const p = getPalette(type)
  const style = {
    '--bg1': p.bg[0],
    '--bg2': p.bg[1],
    '--accent': p.accent,
    '--ink': p.ink,
  } as CSSProperties

  return (
    <div className={`sample-card ${className ?? ''}`} style={style} aria-hidden>
      <div className="sample-arch">{c.emoji}</div>
      <p className="sample-name">{c.name}</p>
      <p className="sample-type">{type}</p>
      <p className="sample-tag">{c.tagline}</p>
    </div>
  )
}