'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveTestResult } from '@/actions/test'
import LikertScale from '@/components/test/LikertScale'
import { QUESTIONS } from '@/features/mbti/questions'

export default function TestPage() {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const lastPick = useRef(0)

  const total = QUESTIONS.length
  const question = QUESTIONS[index]
  if (!question) return null

  const selected = answers[index] ?? null
  const progress = Math.round((index / total) * 100)

  async function handlePick(value: number) {
    if (saving) return
    // 더블클릭으로 다음 문항까지 답해 버리는 것을 막습니다.
    const now = Date.now()
    if (now - lastPick.current < 250) return
    lastPick.current = now

    const next = [...answers]
    next[index] = value
    setAnswers(next)

    if (index < total - 1) {
      setIndex(index + 1)
      return
    }

    setSaving(true)
    try {
      const id = await saveTestResult(next)
      router.push(`/result/${id}`)
    } catch {
      setSaving(false)
      alert('결과 저장에 실패했습니다. 마지막 문항을 다시 선택해 주세요.')
    }
  }

  function handleBack() {
    if (saving || index === 0) return
    setIndex(index - 1)
  }

  return (
    <main className="test-wrap">
      <div className="progress-meta">
        <span>
          {index + 1} / {total}
        </span>
        <span>{progress}%</span>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <h1 key={index} className="statement">
        {question.text}
      </h1>

      <LikertScale value={selected} onPick={handlePick} disabled={saving} />

      <div className="test-actions">
        <button type="button" className="btn-text" onClick={handleBack} disabled={saving || index === 0}>
          이전 문항
        </button>
        {saving && <span className="saving">결과를 만드는 중…</span>}
      </div>
    </main>
  )
}