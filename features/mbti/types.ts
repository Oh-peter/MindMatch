export type MbtiLetter = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'

export type MbtiAxis = 'EI' | 'SN' | 'TF' | 'JP'

// agree: 이 문장에 "그렇다"고 답하면 점수가 쌓이는 글자
export type Question = {
  id: number
  text: string
  axis: MbtiAxis
  agree: MbtiLetter
}

export type MbtiScores = Record<MbtiLetter, number>

export type TestResult = {
  type: string
  scores: MbtiScores
  createdAt: number
  guestId?: string
  userId?: string
}

export type TypeProfile = {
  title: string
  summary: string
  strengths: string[]
  cautions: string[]
}