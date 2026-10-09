// 로그인 후 이동할 경로가 같은 사이트 내부 경로일 때만 허용합니다.
export function safeNext(value: string | undefined): string {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/'
}