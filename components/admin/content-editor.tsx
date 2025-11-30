'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, Pencil, Trash2 } from 'lucide-react'
import { createContent, updateContent, deleteContent } from '@/app/actions/content'
import type { DBContent } from '@/app/actions/content'
import { MDXPreview } from './mdx-preview'

interface ContentEditorProps {
  initialContent?: DBContent
}

type ContentType = 'doc' | 'tutorial' | 'snippet' | 'bundle'
type ContentStatus = 'draft' | 'published' | 'archived'
type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export function ContentEditor({ initialContent }: ContentEditorProps) {
  const router = useRouter()
  const isEditing = !!initialContent?.id

  // Form State
  const [title, setTitle] = useState(initialContent?.title || '')
  const [slug, setSlug] = useState(initialContent?.slug || '')
  const [description, setDescription] = useState(initialContent?.description || '')
  const [type, setType] = useState<ContentType>((initialContent?.type as ContentType) || 'doc')
  const [status, setStatus] = useState<ContentStatus>(
    (initialContent?.status as ContentStatus) || 'draft'
  )
  const [difficulty, setDifficulty] = useState<Difficulty>(initialContent?.difficulty || 'beginner')
  const [isPremium, setIsPremium] = useState(initialContent?.is_premium || false)
  const [priceCents, setPriceCents] = useState(initialContent?.price_cents?.toString() || '0')
  const [estimatedTime, setEstimatedTime] = useState(
    initialContent?.estimated_time_mins?.toString() || ''
  )
  const [stackJson, setStackJson] = useState(
    initialContent?.stack ? JSON.stringify(initialContent.stack, null, 2) : '{"framework": "Next.js"}'
  )
  const [metaTitle, setMetaTitle] = useState(initialContent?.meta_title || '')
  const [metaDescription, setMetaDescription] = useState(initialContent?.meta_description || '')
  const [content, setContent] = useState(initialContent?.content || defaultMDXTemplate)

  // UI State
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  // 고유 ID 생성
  const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 6).toLowerCase()
  }

  // Slug 자동 생성
  const generateSlug = () => {
    if (!title.trim()) return

    const baseSlug = title
      .toLowerCase()
      .replace(/[가-힣]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim()

    const uniqueId = generateUniqueId()
    setSlug(baseSlug ? `${baseSlug}-${uniqueId}` : `content-${uniqueId}`)
    setUnsavedChanges(true)
  }

  // 저장 핸들러
  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      alert('제목과 Slug는 필수입니다.')
      return
    }

    // Stack JSON 파싱
    let parsedStack
    try {
      parsedStack = stackJson.trim() ? JSON.parse(stackJson) : undefined
    } catch (error) {
      alert('Stack JSON 형식이 올바르지 않습니다.')
      return
    }

    setSaving(true)
    try {
      const contentData = {
        title,
        slug,
        description: description || undefined,
        type,
        difficulty,
        status,
        is_premium: isPremium,
        price_cents: priceCents ? parseInt(priceCents) : 0,
        estimated_time_mins: estimatedTime ? parseInt(estimatedTime) : undefined,
        stack: parsedStack,
        meta_title: metaTitle || undefined,
        meta_description: metaDescription || undefined,
        content,
      }

      let result
      if (isEditing) {
        result = await updateContent(initialContent.id, contentData)
      } else {
        result = await createContent(contentData)
      }

      if (result.success) {
        setUnsavedChanges(false)
        alert('✅ 저장되었습니다.')

        if (!isEditing && 'id' in result && result.id) {
          router.push(`/admin/content/${result.id}`)
        }
        router.refresh()
      } else {
        if (result.error?.includes('duplicate key') || result.error?.includes('slug_key')) {
          alert('⚠️ 중복된 Slug입니다.\n\n이미 사용 중인 Slug입니다.')
        } else {
          alert(`저장 실패\n\n${result.error}`)
        }
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!isEditing) return

    setDeleting(true)
    try {
      const result = await deleteContent(initialContent.id)
      if (result.success) {
        alert('삭제되었습니다.')
        router.push('/admin/content')
      } else {
        alert(`오류: ${result.error}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('삭제 중 오류가 발생했습니다.')
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  // 미리보기 토글
  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      {/* Editor Toolbar */}
      <div className="h-14 border-b border-zinc-800 bg-zinc-900 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/content')}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-zinc-800"></div>
          <span className="text-sm font-mono text-zinc-400" id="editor-id-display">
            {isEditing ? initialContent.id : 'New Content'}
          </span>
          {unsavedChanges && (
            <span className="bg-yellow-500/10 text-yellow-500 text-[10px] px-2 py-0.5 rounded border border-yellow-500/20">
              Unsaved
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isEditing && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs font-bold text-zinc-400 hover:text-red-400 px-3 py-1.5 rounded border border-zinc-700 hover:bg-zinc-800 transition-colors"
              disabled={deleting}
            >
              <Trash2 className="w-3 h-3 inline mr-1" />
              삭제
            </button>
          )}
          <button
            onClick={togglePreview}
            className={`text-xs font-bold px-3 py-1.5 rounded border transition-colors ${
              showPreview
                ? 'bg-zinc-800 text-white border-zinc-700'
                : 'text-zinc-400 hover:text-white border-zinc-700 hover:bg-zinc-800'
            }`}
          >
            {showPreview ? (
              <>
                <Pencil className="w-3 h-3 inline mr-1" /> 편집하기
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 inline mr-1" /> 미리보기
              </>
            )}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-white text-black text-xs font-bold px-4 py-2 rounded hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>

      {/* Editor Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Metadata Form (Scrollable) */}
        <div className="w-80 shrink-0 border-r border-zinc-800 bg-zinc-900/50 p-6 overflow-y-auto">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
            기본 정보
          </h3>

          <div className="space-y-4">
            {/* Type */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value as ContentType)
                  setUnsavedChanges(true)
                }}
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="snippet">Snippet</option>
                <option value="doc">Doc</option>
                <option value="tutorial">Tutorial</option>
                <option value="bundle">Bundle</option>
              </select>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value)
                  setUnsavedChanges(true)
                }}
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white focus:border-indigo-500 focus:outline-none font-mono"
                placeholder="my-content-slug"
              />
              <button
                onClick={generateSlug}
                className="mt-1 text-xs text-indigo-400 hover:text-indigo-300"
              >
                자동 생성
              </button>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as ContentStatus)
                  setUnsavedChanges(true)
                }}
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="draft">Draft (임시)</option>
                <option value="published">Published (발행)</option>
                <option value="archived">Archived (보관)</option>
              </select>
            </div>

            <div className="h-px bg-zinc-800 my-4"></div>

            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
              상세 설정
            </h3>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value as Difficulty)
                  setUnsavedChanges(true)
                }}
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="beginner">Beginner (초급)</option>
                <option value="intermediate">Intermediate (중급)</option>
                <option value="advanced">Advanced (고급)</option>
              </select>
            </div>

            {/* Estimated Time */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Estimated Time (mins)
              </label>
              <input
                type="number"
                value={estimatedTime}
                onChange={(e) => {
                  setEstimatedTime(e.target.value)
                  setUnsavedChanges(true)
                }}
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                placeholder="30"
              />
            </div>

            {/* Stack (JSONB) */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Stack (JSON)</label>
              <textarea
                value={stackJson}
                onChange={(e) => {
                  setStackJson(e.target.value)
                  setUnsavedChanges(true)
                }}
                className="w-full h-24 bg-zinc-950 border border-zinc-700 rounded p-2 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none font-mono"
                placeholder='{"framework": "Next.js"}'
              />
            </div>

            {/* Premium & Price */}
            <div className="flex items-center justify-between py-2">
              <label className="text-xs font-medium text-zinc-400">Premium Content</label>
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => {
                  setIsPremium(e.target.checked)
                  setUnsavedChanges(true)
                }}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Price (Cents)
              </label>
              <input
                type="number"
                value={priceCents}
                onChange={(e) => {
                  setPriceCents(e.target.value)
                  setUnsavedChanges(true)
                }}
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div className="h-px bg-zinc-800 my-4"></div>

            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">SEO</h3>

            {/* Meta Title */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Meta Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => {
                  setMetaTitle(e.target.value)
                  setUnsavedChanges(true)
                }}
                className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                placeholder="SEO 제목"
              />
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Meta Description
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => {
                  setMetaDescription(e.target.value)
                  setUnsavedChanges(true)
                }}
                className="w-full h-20 bg-zinc-950 border border-zinc-700 rounded p-2 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
                placeholder="SEO 설명"
              />
            </div>
          </div>
        </div>

        {/* Center: MDX Editor & Preview */}
        <div className="flex-1 flex flex-col h-full relative">
          {/* Title Input (Top of Editor) */}
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/30">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setUnsavedChanges(true)
              }}
              onBlur={generateSlug}
              className="w-full bg-transparent text-2xl font-bold text-white placeholder-zinc-600 focus:outline-none"
              placeholder="여기에 제목 입력..."
            />
            <input
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                setUnsavedChanges(true)
              }}
              className="w-full bg-transparent text-sm text-zinc-400 placeholder-zinc-600 mt-2 focus:outline-none"
              placeholder="간단한 설명 (Description) 입력..."
            />
          </div>

          {/* WRITE MODE (Textarea) */}
          {!showPreview && (
            <div className="flex-1 bg-zinc-950 relative">
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value)
                  setUnsavedChanges(true)
                }}
                className="w-full h-full p-6 bg-transparent text-zinc-200 font-mono text-sm leading-relaxed resize-none focus:outline-none"
                placeholder="# 여기에 MDX 작성

MDX 형식을 지원합니다.

```tsx
const code = 'hello';
```"
              />
            </div>
          )}

          {/* PREVIEW MODE (Div) */}
          {showPreview && (
            <div className="flex-1 bg-zinc-950 p-8 overflow-y-auto prose-preview">
              <MDXPreview content={content} />
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2 text-white">콘텐츠 삭제</h3>
            <p className="text-zinc-400 mb-4">
              &quot;{title}&quot;을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 기본 MDX 템플릿
const defaultMDXTemplate = `# 시작하기

여기에 콘텐츠를 작성하세요.

## 코드 예제

\`\`\`typescript
// 코드 예제
console.log('Hello, World!')
\`\`\`

<Callout type="tip">
유용한 팁을 여기에 작성하세요.
</Callout>
`
