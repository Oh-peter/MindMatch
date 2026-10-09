'use server'

import { revalidatePath } from 'next/cache'
import { adminDb } from '@/lib/firebaseAdmin'
import { getSessionUser } from '@/lib/session'

export async function createPost(formData: FormData): Promise<void> {
  const user = await getSessionUser()
  if (!user) throw new Error('로그인이 필요합니다.')

  const title = String(formData.get('title') ?? '').trim()
  const content = String(formData.get('content') ?? '').trim()
  if (!title || title.length > 80 || !content || content.length > 2000) return

  await adminDb.collection('posts').add({
    title,
    content,
    authorUid: user.uid,
    authorName: user.name,
    createdAt: Date.now(),
  })
  revalidatePath('/community')
}