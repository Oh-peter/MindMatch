import { createPost } from '@/actions/community'
import { adminDb } from '@/lib/firebaseAdmin'

type Post = { id: string; title: string; content: string; authorName: string; createdAt: number }

const dateFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  dateStyle: 'medium',
  timeStyle: 'short',
})

export default async function CommunityPage() {
  const snap = await adminDb.collection('posts').orderBy('createdAt', 'desc').limit(30).get()
  const posts: Post[] = snap.docs.map((d) => ({
    id: d.id,
    title: String(d.get('title') ?? ''),
    content: String(d.get('content') ?? ''),
    authorName: String(d.get('authorName') ?? '회원'),
    createdAt: Number(d.get('createdAt') ?? 0),
  }))

  return (
    <main className="board">
      <h1>커뮤니티</h1>
      <p className="board-sub">나와 닮은 사람들과 생각을 나눠 보세요.</p>

      <form action={createPost} className="post-form">
        <input className="input" name="title" placeholder="제목" maxLength={80} required />
        <textarea className="input" name="content" placeholder="내용을 입력하세요" rows={4} maxLength={2000} required />
        <button type="submit" className="btn">
          글 올리기
        </button>
      </form>

      {posts.length === 0 ? (
        <p className="board-empty">아직 글이 없어요. 첫 글을 남겨 보세요.</p>
      ) : (
        posts.map((p) => (
          <article key={p.id} className="post">
            <h2>{p.title}</h2>
            <p className="post-meta">
              {p.authorName} · {dateFormat.format(p.createdAt)}
            </p>
            <p className="post-body">{p.content}</p>
          </article>
        ))
      )}
    </main>
  )
}