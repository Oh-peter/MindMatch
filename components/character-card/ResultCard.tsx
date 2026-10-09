'use client'

import { forwardRef, useState } from 'react'
import type { Character, Palette } from '@/features/characters'

export const CARD_WIDTH = 1080
export const CARD_HEIGHT = 1920

export type ResultCardProps = {
  type: string
  title?: string
  character: Character
  palette: Palette
  imageSrc: string
}

const FONT = `'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`

const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(function ResultCard(
  { type, title, character, palette, imageSrc },
  ref,
) {
  const [imageFailed, setImageFailed] = useState(false)
  const { bg, accent, ink } = palette

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        overflow: 'hidden',
        background: `linear-gradient(160deg, ${bg[0]} 0%, ${bg[1]} 100%)`,
        fontFamily: FONT,
        color: ink,
      }}
    >
      {/* 배경 장식: html2canvas는 blur 필터를 지원하지 않아 radial-gradient를 씁니다 */}
      <div
        style={{
          position: 'absolute',
          top: -220,
          right: -260,
          width: 820,
          height: 820,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -260,
          left: -280,
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)',
        }}
      />

      {/* 스토리 UI에 가려지는 상단 250px, 하단 340px을 비워 둔 안전 영역 */}
      <div
        style={{
          position: 'absolute',
          top: 250,
          bottom: 340,
          left: 80,
          right: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 10, color: accent }}>MINDMATCH</div>

        {/* 일러스트 프레임: 아치 형태 */}
        <div
          style={{
            width: 680,
            height: 780,
            padding: 18,
            boxSizing: 'border-box',
            borderRadius: '340px 340px 56px 56px',
            background: 'rgba(255,255,255,0.88)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.12)',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
              border: `4px solid ${accent}`,
              borderRadius: '322px 322px 40px 40px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(180deg, ${bg[1]} 0%, #FFFFFF 100%)`,
            }}
          >
            {imageFailed ? (
              <span style={{ fontSize: 340, lineHeight: 1 }}>{character.emoji}</span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt={character.name}
                onError={() => setImageFailed(true)}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 40, boxSizing: 'border-box' }}
              />
            )}
          </div>
        </div>

        <div
          style={{
            padding: '14px 40px',
            borderRadius: 999,
            background: accent,
            color: '#FFFFFF',
            fontSize: 38,
            fontWeight: 700,
          }}
        >
          {character.emoji} {character.name} · {character.kind}
        </div>

        <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: 8, lineHeight: 1 }}>{type}</div>

        <div style={{ textAlign: 'center' }}>
          {title && <div style={{ fontSize: 52, fontWeight: 700, marginBottom: 14 }}>{title}</div>}
          <div style={{ fontSize: 36, color: ink, opacity: 0.75 }}>{character.tagline}</div>
        </div>
      </div>
    </div>
  )
})

export default ResultCard