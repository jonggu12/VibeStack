import { getContents } from '@/app/actions/content'
import { requireAdmin } from '@/lib/auth'
import { ContentList } from '@/components/admin/content-list'
import { Bell } from 'lucide-react'

// 빌드 시 정적 생성 방지 (DB 의존성)
export const dynamic = 'force-dynamic'

export default async function AdminContentPage() {
  // Require admin access (redirects if not admin)
  await requireAdmin()

  // 모든 콘텐츠 조회 (모든 상태 포함, RLS 우회, limit 없음)
  const published = await getContents({ status: 'published', limit: 9999, bypassRLS: true })
  const drafts = await getContents({ status: 'draft', limit: 9999, bypassRLS: true })
  const archived = await getContents({ status: 'archived', limit: 9999, bypassRLS: true })

  // term_category가 있는 doc을 glossary 타입으로 변환
  const allContents = [...drafts, ...published, ...archived].map((content: any) => ({
    ...content,
    type: content.type === 'doc' && content.term_category ? 'glossary' : content.type
  }))

  return (
    <>
      {/* Header */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-white">콘텐츠 관리</h1>
        <div className="flex items-center gap-4">
          <button className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
        </div>
      </header>

      {/* Content List */}
      <ContentList contents={allContents} />
    </>
  )
}
