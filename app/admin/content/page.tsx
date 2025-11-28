import { getContents } from '@/app/actions/content'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, BookOpen, Code } from 'lucide-react'
import Link from 'next/link'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

// 빌드 시 정적 생성 방지 (DB 의존성)
export const dynamic = 'force-dynamic'

const typeIcons = {
    doc: FileText,
    tutorial: BookOpen,
    snippet: Code,
}

const typeLabels = {
    doc: '문서',
    tutorial: '튜토리얼',
    snippet: '스니펫',
}

const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
}

export default async function AdminContentPage() {
    // 관리자 권한 체크
    const user = await currentUser()
    if (!user || user.publicMetadata?.role !== 'admin') {
        redirect('/')
    }

    // 모든 콘텐츠 조회 (모든 상태 포함, RLS 우회)
    const published = await getContents({ status: 'published', limit: 50, bypassRLS: true })
    const drafts = await getContents({ status: 'draft', limit: 50, bypassRLS: true })
    const archived = await getContents({ status: 'archived', limit: 50, bypassRLS: true })
    const allContents = [...drafts, ...published, ...archived]

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">콘텐츠 관리</h1>
                    <p className="text-gray-600 mt-1">문서, 튜토리얼, 스니펫을 관리합니다.</p>
                </div>
                <Link
                    href="/admin/content/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    새 콘텐츠
                </Link>
            </div>

            {/* 콘텐츠 목록 */}
            <div className="bg-white rounded-lg border">
                {allContents.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        등록된 콘텐츠가 없습니다.
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left p-4 font-medium text-gray-700">제목</th>
                                <th className="text-left p-4 font-medium text-gray-700">타입</th>
                                <th className="text-left p-4 font-medium text-gray-700">상태</th>
                                <th className="text-left p-4 font-medium text-gray-700">조회수</th>
                                <th className="text-left p-4 font-medium text-gray-700">수정일</th>
                                <th className="text-right p-4 font-medium text-gray-700">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allContents.map((content) => {
                                const Icon = typeIcons[content.type as keyof typeof typeIcons] || FileText
                                // 타입별 URL 경로 생성
                                const contentPath = content.type === 'doc'
                                    ? `/docs/${content.slug}`
                                    : content.type === 'tutorial'
                                    ? `/tutorials/${content.slug}`
                                    : `/snippets/${content.slug}`

                                return (
                                    <tr key={content.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    {content.status === 'published' ? (
                                                        <Link
                                                            href={contentPath}
                                                            className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                                            target="_blank"
                                                        >
                                                            {content.title}
                                                        </Link>
                                                    ) : (
                                                        <p className="font-medium text-gray-900">{content.title}</p>
                                                    )}
                                                    <p className="text-sm text-gray-500">{content.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant="outline">
                                                {typeLabels[content.type as keyof typeof typeLabels] || content.type}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <Badge className={statusColors[content.status as keyof typeof statusColors]}>
                                                {content.status === 'draft' ? '초안' : content.status === 'published' ? '발행됨' : '보관됨'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {(content.views ?? 0).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {content.updated_at ? new Date(content.updated_at).toLocaleDateString('ko-KR') : '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link
                                                href={`/admin/content/${content.id}`}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                편집
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
