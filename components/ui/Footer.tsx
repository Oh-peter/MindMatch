import Link from 'next/link'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Logo size={28} />
        <nav aria-label="바로가기">
          <Link href="/test">성격 검사</Link>
          <Link href="/community">커뮤니티</Link>
          <Link href="/login">로그인</Link>
          <Link href="/signup">회원가입</Link>
        </nav>
        <small>© {new Date().getFullYear()} MindMatch</small>
      </div>
    </footer>
  )
}