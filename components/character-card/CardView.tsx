'use client'

import { useEffect, useRef, useState } from 'react'
import ResultCard, { CARD_HEIGHT, CARD_WIDTH, type ResultCardProps } from './ResultCard'

export default function CardView(props: ResultCardProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const captureRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.3)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const update = () => setScale(el.clientWidth / CARD_WIDTH)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  async function handleSave() {
    const target = captureRef.current
    if (!target || busy) return
    setBusy(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      await document.fonts.ready
      const canvas = await html2canvas(target, {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        scale: 1,
        useCORS: true,
        backgroundColor: null,
        scrollX: 0,
        scrollY: 0,
      })
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (!blob) throw new Error('이미지 생성 실패')

      const file = new File([blob], `mindmatch-${props.type}.png`, { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file] })
          return
        } catch (e) {
          if (e instanceof DOMException && e.name === 'AbortError') return
        }
      }

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('이미지 저장에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
      {/* 화면용 미리보기 (축소) */}
      <div
        ref={frameRef}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '9 / 16',
          overflow: 'hidden',
          borderRadius: 16,
          boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
          }}
        >
          <ResultCard {...props} />
        </div>
      </div>

      {/* 캡처 전용 원본 크기 복사본 (화면 밖) */}
      <div aria-hidden style={{ position: 'absolute', left: -10000, top: 0, pointerEvents: 'none' }}>
        <ResultCard ref={captureRef} {...props} />
      </div>

      <button
        onClick={handleSave}
        disabled={busy}
        style={{
          width: '100%',
          marginTop: 20,
          padding: 16,
          fontSize: 16,
          fontWeight: 700,
          color: '#fff',
          background: props.palette.accent,
          border: 'none',
          borderRadius: 12,
          cursor: busy ? 'default' : 'pointer',
        }}
      >
        {busy ? '이미지 만드는 중…' : '인스타 스토리용 이미지 저장'}
      </button>
    </div>
  )
}