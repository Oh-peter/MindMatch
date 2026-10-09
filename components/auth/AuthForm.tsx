'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  type User,
} from 'firebase/auth'
import { auth } from '@/lib/firebaseClient'

const ERRORS: Record<string, string> = {
  'auth/invalid-credential': '이메일 또는 비밀번호가 맞지 않아요.',
  'auth/invalid-email': '이메일 형식을 확인해 주세요.',
  'auth/email-already-in-use': '이미 가입된 이메일이에요. 로그인해 주세요.',
  'auth/weak-password': '비밀번호는 6자 이상으로 입력해 주세요.',
  'auth/too-many-requests': '시도가 너무 많아요. 잠시 후 다시 시도해 주세요.',
  'auth/network-request-failed': '네트워크 연결을 확인해 주세요.',
  'auth/operation-not-allowed': 'Firebase 콘솔에서 이 로그인 방법을 사용 설정해 주세요.',
  'auth/configuration-not-found': 'Firebase 콘솔에서 Authentication을 시작하고 로그인 방법을 설정해 주세요.',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
    'Firebase API 키가 올바르지 않아요. NEXT_PUBLIC_FIREBASE_API_KEY를 확인해 주세요.',
}

function messageOf(e: unknown): string | null {
  const code = typeof e === 'object' && e !== null && 'code' in e ? String((e as { code: unknown }).code) : ''
  console.error('[auth]', code, e)

  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null
  if (e instanceof Error && e.message === 'session') {
    return '로그인 세션을 만들지 못했어요. 서버의 Firebase 서비스 계정 설정을 확인해 주세요.'
  }

  const base = ERRORS[code] ?? '문제가 생겼어요. 잠시 후 다시 시도해 주세요.'
  // 개발 중에는 원인 파악을 위해 오류 코드를 함께 보여 줍니다.
  return process.env.NODE_ENV === 'development' && code ? `${base} (${code})` : base
}

type Props = { mode: 'login' | 'signup'; next: string }

export default function AuthForm({ mode, next }: Props) {
  const router = useRouter()
  const isSignup = mode === 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function finish(user: User) {
    const idToken = await user.getIdToken(true)
    const res = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })
    if (!res.ok) throw new Error('session')
    router.replace(next)
    router.refresh()
  }

  async function run(task: () => Promise<User>) {
    setBusy(true)
    setError(null)
    try {
      await finish(await task())
    } catch (e) {
      setError(messageOf(e))
      setBusy(false)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    void run(async () => {
      if (isSignup) {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
        if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() })
        return cred.user
      }
      return (await signInWithEmailAndPassword(auth, email.trim(), password)).user
    })
  }

  function handleGoogle() {
    void run(async () => (await signInWithPopup(auth, new GoogleAuthProvider())).user)
  }

  const other = isSignup ? '/login' : '/signup'
  const otherHref = next === '/' ? other : `${other}?next=${encodeURIComponent(next)}`

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <h1>{isSignup ? '회원가입' : '로그인'}</h1>
        <p className="auth-sub">
          {isSignup ? '가입하면 검사 결과가 계정에 저장돼요.' : '로그인하면 커뮤니티를 이용할 수 있어요.'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="auth-fields">
            {isSignup && (
              <label>
                닉네임
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={20}
                  required
                  autoComplete="nickname"
                />
              </label>
            )}
            <label>
              이메일
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>
            <label>
              비밀번호
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                autoComplete={isSignup ? 'new-password' : 'current-password'}
              />
            </label>
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn" disabled={busy}>
            {busy ? '처리 중…' : isSignup ? '가입하기' : '로그인'}
          </button>
        </form>

        <p className="auth-divider">또는</p>
        <button type="button" className="btn btn-outline" onClick={handleGoogle} disabled={busy}>
          Google로 계속하기
        </button>

        <p className="auth-switch">
          {isSignup ? '이미 계정이 있나요? ' : '처음이신가요? '}
          <Link href={otherHref}>{isSignup ? '로그인' : '회원가입'}</Link>
        </p>
      </div>
    </main>
  )
}