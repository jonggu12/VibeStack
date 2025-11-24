'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, Eye, FileText, BookOpen, Code } from 'lucide-react'
import type { DBContent } from '@/app/actions/content'

interface ContentEditorProps {
    initialContent?: DBContent
}

type ContentType = 'doc' | 'tutorial' | 'snippet'
type ContentStatus = 'draft' | 'published' | 'archived'
type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export function ContentEditor({ initialContent }: ContentEditorProps) {
    const [title, setTitle] = useState(initialContent?.title || '')
    const [slug, setSlug] = useState(initialContent?.slug || '')
    const [description, setDescription] = useState(initialContent?.description || '')
    const [type, setType] = useState<ContentType>(initialContent?.type as ContentType || 'doc')
    const [status, setStatus] = useState<ContentStatus>(initialContent?.status as ContentStatus || 'draft')
    const [difficulty, setDifficulty] = useState<Difficulty>(initialContent?.difficulty || 'beginner')
    const [isPremium, setIsPremium] = useState(initialContent?.is_premium || false)
    const [content, setContent] = useState(initialContent?.content || defaultMDXTemplate)
    const [saving, setSaving] = useState(false)
    const [showPreview, setShowPreview] = useState(false)

    // 제목에서 slug 자동 생성
    const generateSlug = () => {
        const newSlug = title
            .toLowerCase()
            .replace(/[^a-z0-9가-힣\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
        setSlug(newSlug)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            // TODO: API 호출로 저장
            console.log('Saving:', { title, slug, description, type, status, difficulty, isPremium, content })
            alert('저장 기능은 아직 구현 중입니다.')
        } catch (error) {
            console.error('Save error:', error)
            alert('저장 중 오류가 발생했습니다.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* 메타데이터 섹션 */}
            <div className="bg-white p-6 rounded-lg border space-y-4">
                <h2 className="font-semibold text-gray-900">기본 정보</h2>

                <div className="grid grid-cols-2 gap-4">
                    {/* 제목 */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={generateSlug}
                            placeholder="콘텐츠 제목"
                        />
                    </div>

                    {/* Slug */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                        <div className="flex gap-2">
                            <Input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="url-friendly-slug"
                            />
                            <Button variant="outline" onClick={generateSlug}>
                                자동 생성
                            </Button>
                        </div>
                    </div>

                    {/* 설명 */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="콘텐츠에 대한 짧은 설명"
                            rows={2}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* 타입 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">타입</label>
                        <div className="flex gap-2">
                            {(['doc', 'tutorial', 'snippet'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setType(t)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                                        type === t
                                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                                >
                                    {t === 'doc' && <FileText className="w-4 h-4" />}
                                    {t === 'tutorial' && <BookOpen className="w-4 h-4" />}
                                    {t === 'snippet' && <Code className="w-4 h-4" />}
                                    {t === 'doc' ? '문서' : t === 'tutorial' ? '튜토리얼' : '스니펫'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 난이도 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">난이도</label>
                        <div className="flex gap-2">
                            {(['beginner', 'intermediate', 'advanced'] as const).map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDifficulty(d)}
                                    className={`px-3 py-2 rounded-lg border transition-colors ${
                                        difficulty === d
                                            ? d === 'beginner' ? 'bg-green-50 border-green-500 text-green-700'
                                            : d === 'intermediate' ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                                            : 'bg-red-50 border-red-500 text-red-700'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                                >
                                    {d === 'beginner' ? '초급' : d === 'intermediate' ? '중급' : '고급'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 상태 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ContentStatus)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="draft">초안</option>
                            <option value="published">발행</option>
                            <option value="archived">보관</option>
                        </select>
                    </div>

                    {/* 프리미엄 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">접근 권한</label>
                        <button
                            onClick={() => setIsPremium(!isPremium)}
                            className={`px-4 py-2 rounded-lg border transition-colors ${
                                isPremium
                                    ? 'bg-purple-50 border-purple-500 text-purple-700'
                                    : 'bg-white border-gray-200 text-gray-600'
                            }`}
                        >
                            {isPremium ? '🔒 Pro 전용' : '🌐 무료 공개'}
                        </button>
                    </div>
                </div>
            </div>

            {/* MDX 에디터 */}
            <div className="bg-white p-6 rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-gray-900">콘텐츠 (MDX)</h2>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        {showPreview ? '편집' : '미리보기'}
                    </Button>
                </div>

                {showPreview ? (
                    <div className="prose max-w-none p-4 bg-gray-50 rounded-lg min-h-[400px]">
                        <p className="text-gray-500">미리보기는 저장 후 확인할 수 있습니다.</p>
                        <pre className="text-sm">{content}</pre>
                    </div>
                ) : (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-[500px] px-4 py-3 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="MDX 콘텐츠를 작성하세요..."
                    />
                )}
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-end gap-4">
                <Button variant="outline">취소</Button>
                <Button onClick={handleSave} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? '저장 중...' : '저장'}
                </Button>
            </div>
        </div>
    )
}

// 기본 MDX 템플릿
const defaultMDXTemplate = `---
title: 제목을 입력하세요
description: 설명을 입력하세요
---

# 시작하기

여기에 콘텐츠를 작성하세요.

## 코드 예제

\`\`\`typescript
// 코드 예제
console.log('Hello, World!')
\`\`\`

<Callout type="tip">
유용한 팁을 여기에 작성하세요.
</Callout>

<Checkpoint id="step-1" title="첫 번째 단계 완료">
이 단계를 완료했다면 체크하세요.
</Checkpoint>
`
