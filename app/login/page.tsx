import { redirect } from 'next/navigation'
import AuthForm from '@/components/auth/AuthForm'
import { safeNext } from '@/lib/redirect'
import { getSessionUser } from '@/lib/session'

type Props = { searchParams: Promise<{ next?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams
  const target = safeNext(next)
  if (await getSessionUser()) redirect(target)
  return <AuthForm mode="login" next={target} />
}