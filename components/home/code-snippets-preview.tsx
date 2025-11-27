'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Copy, Check, Code2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface Snippet {
  id: string
  slug: string
  title: string
  description: string
  codePreview: string
  language: string
  copiedCount: number
  tags: string[]
}

interface CodeSnippetsPreviewProps {
  snippets: Snippet[]
}

export function CodeSnippetsPreview({ snippets }: CodeSnippetsPreviewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (snippet: Snippet) => {
    await navigator.clipboard.writeText(snippet.codePreview)
    setCopiedId(snippet.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🔧 가장 많이 복사된 코드
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              바로 쓸 수 있는 코드 조각. 복붙 한 번으로 끝!
            </p>
          </motion.div>
        </div>

        {/* Snippets grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {snippets.map((snippet, index) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-blue-400">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {snippet.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {snippet.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={copiedId === snippet.id ? 'default' : 'outline'}
                      onClick={() => handleCopy(snippet)}
                      className="ml-4 shrink-0"
                    >
                      {copiedId === snippet.id ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          복사됨!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          복사
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Code preview */}
                  <div className="relative bg-gray-900 rounded-lg p-4 mb-4 overflow-hidden">
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-gray-800 text-gray-300 border-gray-700">
                        {snippet.language}
                      </Badge>
                    </div>
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{snippet.codePreview}</code>
                    </pre>
                  </div>

                  {/* Tags & stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {snippet.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Copy className="w-4 h-4" />
                      <span>{snippet.copiedCount.toLocaleString()}회</span>
                    </div>
                  </div>

                  {/* View detail link */}
                  <Link href={`/snippets/${snippet.slug}`} className="block mt-4">
                    <Button variant="ghost" size="sm" className="w-full">
                      <Code2 className="w-4 h-4 mr-2" />
                      자세히 보기 (커스터마이징 가이드 포함)
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/snippets">
            <Button size="lg" variant="outline" className="border-2">
              모든 코드 스니펫 보기
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
