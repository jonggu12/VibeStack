import { notFound, redirect } from 'next/navigation'
import { getContent } from '@/app/actions/content'
import { ContentEditor } from '@/components/admin/content-editor'
import { currentUser } from '@clerk/nextjs/server'

// 빌드 시 정적 생성 방지 (DB 의존성)
export const dynamic = 'force-dynamic'

interface EditContentPageProps {
    params: Promise<{ id: string }>
}

export default async function EditContentPage({ params }: EditContentPageProps) {
    // 관리자 권한 체크
    const user = await currentUser()
    if (!user || user.publicMetadata?.role !== 'admin') {
        redirect('/')
    }

    const { id } = await params

    // 새 콘텐츠 생성
    if (id === 'new') {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">새 콘텐츠 작성</h1>
                <ContentEditor />
            </div>
        )
    }

    // 기존 콘텐츠 편집 (RLS 우회 - Admin은 모든 상태 접근 가능)
    const content = await getContent(id, true)

    if (!content) {
        notFound()
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">콘텐츠 편집</h1>
            <ContentEditor initialContent={content} />
        </div>
    )
}
