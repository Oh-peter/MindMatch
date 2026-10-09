import Link from 'next/link'
import { logout } from '@/actions/auth'
import { getSessionUser } from '@/lib/session'
import Logo from './Logo'

const NAV = [
  { href: '/test', label: '성격 검사' },
  { href: '/community', label: '커뮤니티' },
]

export default async function Header() {
  const user = await getSessionUser()

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" aria-label="MindMatch 홈">
          <Logo />
        </Link>
        <nav className="site-nav" aria-label="주요 메뉴">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          {user ? (
            <>
              <span className="header-user">{user.name}님</span>
              <form action={logout}>
                <button type="submit" className="header-link">
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="header-link">
                로그인
              </Link>
              <Link href="/signup" className="header-signup">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}