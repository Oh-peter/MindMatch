export type Character = {
  name: string
  kind: '동물' | '식물'
  emoji: string // 일러스트가 없을 때 대신 보여줄 이모지
  tagline: string
}

export type Palette = {
  bg: [string, string]
  accent: string
  ink: string
}

const CHARACTERS: Record<string, Character> = {
  INTJ: { name: '올빼미', kind: '동물', emoji: '🦉', tagline: '조용히 멀리 내다보는 전략가' },
  INTP: { name: '문어', kind: '동물', emoji: '🐙', tagline: '호기심으로 가득한 탐구가' },
  ENTJ: { name: '사자', kind: '동물', emoji: '🦁', tagline: '앞장서서 길을 여는 리더' },
  ENTP: { name: '여우', kind: '동물', emoji: '🦊', tagline: '재치로 판을 뒤집는 발명가' },
  INFJ: { name: '사슴', kind: '동물', emoji: '🦌', tagline: '깊은 마음을 품은 안내자' },
  INFP: { name: '연꽃', kind: '식물', emoji: '🪷', tagline: '고요 속에서 피어나는 이상가' },
  ENFJ: { name: '해바라기', kind: '식물', emoji: '🌻', tagline: '사람을 향해 환하게 피는 사람' },
  ENFP: { name: '나비', kind: '동물', emoji: '🦋', tagline: '가능성을 따라 날아다니는 자유인' },
  ISTJ: { name: '거북이', kind: '동물', emoji: '🐢', tagline: '묵묵히 끝까지 가는 성실가' },
  ISFJ: { name: '클로버', kind: '식물', emoji: '☘️', tagline: '곁에서 행운이 되어 주는 수호자' },
  ESTJ: { name: '꿀벌', kind: '동물', emoji: '🐝', tagline: '체계로 움직이는 실행가' },
  ESFJ: { name: '강아지', kind: '동물', emoji: '🐶', tagline: '모두를 챙기는 따뜻한 친구' },
  ISTP: { name: '고양이', kind: '동물', emoji: '🐱', tagline: '유연하고 독립적인 해결사' },
  ISFP: { name: '벚꽃', kind: '식물', emoji: '🌸', tagline: '섬세한 감성의 예술가' },
  ESTP: { name: '치타', kind: '동물', emoji: '🐆', tagline: '지금 이 순간에 뛰어드는 모험가' },
  ESFP: { name: '돌고래', kind: '동물', emoji: '🐬', tagline: '어디서나 분위기를 띄우는 연예인' },
}

const FALLBACK: Character = {
  name: '미지의 생명체',
  kind: '동물',
  emoji: '✨',
  tagline: '아직 이름이 없는 특별한 유형',
}

const PALETTES = {
  NF: { bg: ['#FDE7F0', '#E8DDFB'], accent: '#7C3AED', ink: '#2B1A4F' },
  NT: { bg: ['#DCEBFF', '#D9F3EE'], accent: '#2563EB', ink: '#0F2A4A' },
  SJ: { bg: ['#FFF1D6', '#FFE0CC'], accent: '#D97706', ink: '#4A2A0B' },
  SP: { bg: ['#DDF7E3', '#FFF6C9'], accent: '#16A34A', ink: '#143B22' },
} satisfies Record<string, Palette>

export function getCharacter(type: string): Character {
  return CHARACTERS[type] ?? FALLBACK
}

// 기질 그룹(NF, NT, SJ, SP)으로 색 팔레트를 정합니다.
export function getPalette(type: string): Palette {
  const mid = type.slice(1, 3)
  if (mid === 'NF') return PALETTES.NF
  if (mid === 'NT') return PALETTES.NT
  return type.charAt(3) === 'J' ? PALETTES.SJ : PALETTES.SP
}

export function getImageSrc(type: string): string {
  return `/assets/images/characters/${type.toLowerCase()}.png`
}