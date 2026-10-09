import type { Metadata } from 'next'
import 'pretendard/dist/web/static/pretendard.css'
import Footer from '@/components/ui/Footer'
import Header from '@/components/ui/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'MindMatch',
  description: '무료 성격 테스트로 나의 유형을 알고, 닮은 동식물 카드를 받아 보세요.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}