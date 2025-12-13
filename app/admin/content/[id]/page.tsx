import { notFound, redirect } from 'next/navigation'
import { getContent } from '@/app/actions/content'
import { ContentEditor } from '@/components/admin/content-editor'
import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Bell } from 'lucide-react'

// 빌드 시 정적 생성 방지 (DB 의존성)
export const dynamic = 'force-dynamic'

interface EditContentPageProps {
  params: Promise<{ id: string }>
}

export default async function EditContentPage({ params }: EditContentPageProps) {
  // 관리자 권한 체크 (Clerk metadata 또는 Supabase DB)
  const user = await currentUser()
  if (!user) {
    redirect('/')
  }

  // Check 1: Clerk metadata
  const isClerkAdmin = user.publicMetadata?.role === 'admin'

  // Check 2: Supabase database
  const { data: dbUser } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('clerk_user_id', user.id)
    .single()

  const isSupabaseAdmin = dbUser?.role === 'admin'

  // Redirect if neither method confirms admin
  if (!isClerkAdmin && !isSupabaseAdmin) {
    redirect('/')
  }

  const { id } = await params

  // 새 콘텐츠 생성
  if (id === 'new') {
    return (
      <>
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-white">새 콘텐츠 작성</h1>
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
          </div>
        </header>

        <ContentEditor />
      </>
    )
  }

  // 기존 콘텐츠 편집 (RLS 우회 - Admin은 모든 상태 접근 가능)
  const content = await getContent(id, true)

  if (!content) {
    notFound()
  }

  return (
    <>
      {/* Header */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-white">콘텐츠 편집</h1>
        <div className="flex items-center gap-4">
          <button className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
        </div>
      </header>

      <ContentEditor initialContent={content} />
    </>
  )
}
