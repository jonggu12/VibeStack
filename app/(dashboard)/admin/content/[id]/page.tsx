import { notFound } from 'next/navigation'
import { getContent } from '@/app/actions/content'
import { ContentEditor } from '@/components/admin/content-editor'

interface EditContentPageProps {
    params: Promise<{ id: string }>
}

export default async function EditContentPage({ params }: EditContentPageProps) {
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

    // 기존 콘텐츠 편집
    const content = await getContent(id)

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
