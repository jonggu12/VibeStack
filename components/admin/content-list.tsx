'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Plus, Eye, Check, Pencil, Trash2 } from 'lucide-react'

type Content = {
  id: string
  title: string
  slug: string
  type: 'doc' | 'tutorial' | 'snippet' | 'bundle' | 'glossary'
  status: 'draft' | 'published' | 'archived'
  views?: number
  updated_at?: string
}

type ContentListProps = {
  contents: Content[]
}

const typeColors = {
  snippet: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  doc: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  tutorial: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  bundle: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  glossary: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

const statusColors = {
  published: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  draft: 'bg-zinc-700/30 text-zinc-400 border-zinc-600/30',
  archived: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
}

const statusLabels = {
  published: 'Published',
  draft: 'Draft',
  archived: 'Archived',
}

export function ContentList({ contents }: ContentListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredContents = useMemo(() => {
    return contents.filter((content) => {
      const matchSearch =
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.slug.toLowerCase().includes(searchTerm.toLowerCase())
      const matchType = filterType === 'all' || content.type === filterType
      const matchStatus = filterStatus === 'all' || content.status === filterStatus
      return matchSearch && matchType && matchStatus
    })
  }, [contents, searchTerm, filterType, filterStatus])

  return (
    <div className="p-8">
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative group w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-zinc-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500 text-white transition-colors"
              placeholder="제목, 슬러그 검색..."
            />
          </div>

          {/* Filter: Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
          >
            <option value="all">모든 타입</option>
            <option value="snippet">Snippet</option>
            <option value="doc">Doc</option>
            <option value="tutorial">Tutorial</option>
            <option value="bundle">Bundle</option>
            <option value="glossary">Glossary</option>
          </select>

          {/* Filter: Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
          >
            <option value="all">모든 상태</option>
            <option value="published">발행됨</option>
            <option value="draft">임시저장</option>
          </select>
        </div>

        <Link
          href="/admin/content/new"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          새 콘텐츠
        </Link>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left text-zinc-400">
          <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50 border-b border-zinc-800">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium">
                제목 / Slug
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                타입
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                상태
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-center">
                통계 (뷰/완료)
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                수정일
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-right">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredContents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                    ? '검색 결과가 없습니다.'
                    : '등록된 콘텐츠가 없습니다.'}
                </td>
              </tr>
            ) : (
              filteredContents.map((content) => {
                // 타입별 URL 경로 생성
                const getContentPath = () => {
                  if (content.status !== 'published') return null
                  switch (content.type) {
                    case 'doc':
                      return `/docs/${content.slug}`
                    case 'tutorial':
                      return `/tutorials/${content.slug}`
                    case 'snippet':
                      return `/snippets/${content.slug}`
                    case 'bundle':
                      return `/bundles/${content.slug}`
                    case 'glossary':
                      return `/docs/glossary/${content.slug}`
                    default:
                      return null
                  }
                }
                const contentPath = getContentPath()

                return (
                  <tr key={content.id} className="hover:bg-zinc-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      {contentPath ? (
                        <Link
                          href={contentPath}
                          target="_blank"
                          className="font-bold text-white text-base mb-0.5 hover:text-indigo-400 transition-colors"
                        >
                          {content.title}
                        </Link>
                      ) : (
                        <div className="font-bold text-white text-base mb-0.5">{content.title}</div>
                      )}
                      <div className="font-mono text-xs text-zinc-500">{content.slug}</div>
                    </td>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        typeColors[content.type]
                      } text-xs font-medium px-2.5 py-0.5 rounded border capitalize`}
                    >
                      {content.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        statusColors[content.status]
                      } text-xs font-medium px-2.5 py-0.5 rounded border capitalize`}
                    >
                      {statusLabels[content.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span title="Views">
                        <Eye className="w-3 h-3 inline mr-1" /> {content.views ?? 0}
                      </span>
                      <span title="Completions">
                        <Check className="w-3 h-3 inline mr-1" /> 0
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {content.updated_at
                      ? new Date(content.updated_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                        })
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/content/${content.id}`}
                        className="text-zinc-400 hover:text-indigo-400"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button className="text-zinc-400 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-950/30">
          <span className="text-xs text-zinc-500">
            Showing <span className="text-white font-bold">1-{filteredContents.length}</span> of{' '}
            <span className="text-white font-bold">{contents.length}</span>
          </span>
          <div className="flex gap-2">
            <button
              disabled
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-zinc-300 disabled:opacity-50"
            >
              이전
            </button>
            <button className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-zinc-300">
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
