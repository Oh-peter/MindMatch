export type CompatResult = {
  score: number
  label: string
  reasons: string[]
  tip: string
}

export type Ranked = { type: string; score: number; label: string; reason: string }

export const ALL_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
] as const

const TYPE_PATTERN = /^[EI][SN][TF][JP]$/

export function isMbtiType(v: unknown): v is string {
  return typeof v === 'string' && TYPE_PATTERN.test(v)
}

// 흔히 "찰떡 궁합"으로 꼽히는 조합 (어느 한쪽에 적혀 있으면 인정)
const GOLDEN: Record<string, string[]> = {
  INFP: ['ENFJ', 'ENTJ'],
  ENFP: ['INFJ', 'INTJ'],
  INFJ: ['ENFP', 'ENTP'],
  ENFJ: ['INFP', 'ISFP'],
  INTJ: ['ENFP', 'ENTP'],
  ENTJ: ['INFP', 'INTP'],
  INTP: ['ENTJ', 'ESTJ'],
  ENTP: ['INFJ', 'INTJ'],
  ISFP: ['ENFJ', 'ESFJ', 'ESTJ'],
  ESFP: ['ISFJ', 'ISTJ'],
  ISTP: ['ESFJ', 'ESTJ'],
  ESTP: ['ISFJ', 'ISTJ'],
  ISFJ: ['ESFP', 'ESTP'],
  ESFJ: ['ISFP', 'ISTP'],
  ISTJ: ['ESFP', 'ESTP'],
  ESTJ: ['ISFP', 'ISTP', 'INTP'],
}

function isGolden(a: string, b: string): boolean {
  return GOLDEN[a]?.includes(b) === true || GOLDEN[b]?.includes(a) === true
}

function labelOf(score: number): string {
  if (score >= 88) return '찰떡 궁합'
  if (score >= 76) return '잘 맞는 편'
  if (score >= 64) return '서로 배우는 사이'
  return '노력이 필요한 조합'
}

export function getCompatibility(a: string, b: string): CompatResult {
  const sameEI = a.charAt(0) === b.charAt(0)
  const sameSN = a.charAt(1) === b.charAt(1)
  const sameTF = a.charAt(2) === b.charAt(2)
  const sameJP = a.charAt(3) === b.charAt(3)

  let score = 32
  const reasons: string[] = []

  if (sameSN) {
    score += 20
    reasons.push(
      a.charAt(1) === 'N'
        ? '둘 다 의미와 가능성을 먼저 봐서 이야기가 끝없이 이어져요.'
        : '둘 다 현실과 경험을 기준으로 생각해서 말이 잘 통해요.',
    )
  } else {
    reasons.push('세상을 보는 방식이 달라서, 서로의 관점을 설명해 주는 시간이 필요해요.')
  }

  if (!sameEI) {
    score += 10
    reasons.push('한 사람은 이끌고 한 사람은 받쳐 주는 균형이 생겨요.')
  } else {
    score += 6
    reasons.push(
      a.charAt(0) === 'E'
        ? '에너지 수준이 비슷해 함께 있으면 활기가 넘쳐요.'
        : '조용히 함께 있는 시간이 편안한 사이예요.',
    )
  }

  if (!sameTF) {
    score += 10
    reasons.push('판단 기준이 달라 서로의 빈틈을 채워 줘요.')
  } else if (a.charAt(2) === 'F') {
    score += 8
    reasons.push('둘 다 마음을 먼저 살펴서 서로를 잘 이해해요.')
  } else {
    score += 6
    reasons.push('둘 다 논리적으로 소통해서 갈등이 생겨도 풀기 쉬워요.')
  }

  if (sameJP) {
    score += 8
    reasons.push('생활 리듬과 계획 방식이 비슷해 부딪힐 일이 적어요.')
  } else {
    score += 4
    reasons.push('계획형과 즉흥형이 만나 한쪽은 안정감을, 한쪽은 여유를 얻어요.')
  }

  if (isGolden(a, b)) {
    score += 16
    reasons.unshift('흔히 "찰떡 궁합"으로 꼽히는 조합이에요.')
  }
  if (a === b) {
    reasons.unshift('같은 유형이라 말하지 않아도 통하는 부분이 많아요.')
  }

  const final = Math.min(98, Math.max(45, Math.round(score)))

  let tip: string
  if (!sameSN) tip = '"왜?"라고 묻기 전에 상대의 관점을 먼저 들어 보세요.'
  else if (!sameTF) tip = '의견이 갈릴 때는 결론보다 마음을 먼저 확인해 보세요.'
  else if (!sameJP) tip = '약속과 일정은 미리 한 번 더 맞춰 두세요.'
  else tip = '비슷한 만큼 약점도 닮을 수 있어요. 가끔은 다른 시선을 청해 보세요.'

  return { score: final, label: labelOf(final), reasons, tip }
}

// 나를 제외한 15개 유형을 궁합 점수 순으로 정렬
export function rankMatches(type: string): Ranked[] {
  return ALL_TYPES.filter((t) => t !== type)
    .map((t) => {
      const r = getCompatibility(type, t)
      return { type: t as string, score: r.score, label: r.label, reason: r.reasons[0] ?? '' }
    })
    .sort((x, y) => y.score - x.score || x.type.localeCompare(y.type))
}