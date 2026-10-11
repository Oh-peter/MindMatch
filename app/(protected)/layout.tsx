// 로그인 확인은 각 페이지에서 requireUser(next)로 합니다.
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}