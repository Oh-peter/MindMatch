import { QUESTIONS } from './questions'
import type { MbtiLetter, MbtiScores } from './types'

export const PAIRS: [MbtiLetter, MbtiLetter][] = [
  ['E', 'I'],
  ['S', 'N'],
  ['T', 'F'],
  ['J', 'P'],
]

const OPPOSITE: Record<MbtiLetter, MbtiLetter> = {
  E: 'I',
  I: 'E',
  S: 'N',
  N: 'S',
  T: 'F',
  F: 'T',
  J: 'P',
  P: 'J',
}

// 응답값: 0(매우 그렇다) ~ 6(전혀 그렇지 않다), 3은 보통
export const LIKERT_STEPS = 7

export function isValidAnswers(v: unknown): v is number[] {
  return (
    Array.isArray(v) &&
    v.length === QUESTIONS.length &&
    v.every((x) => Number.isInteger(x) && x >= 0 && x < LIKERT_STEPS)
  )
}

export function calcScores(answers: number[]): MbtiScores {
  const scores: MbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
  QUESTIONS.forEach((q, i) => {
    const a = answers[i]
    if (a === undefined) return
    const d = 3 - a // +3(매우 그렇다) ~ -3(전혀 그렇지 않다)
    if (d > 0) scores[q.agree] += d
    else if (d < 0) scores[OPPOSITE[q.agree]] += -d
  })
  return scores
}

// 동점이면 앞 글자(E, S, T, J)를 택합니다.
export function calcType(scores: MbtiScores): string {
  return PAIRS.map(([a, b]) => (scores[b] > scores[a] ? b : a)).join('')
}