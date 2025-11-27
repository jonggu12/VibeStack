'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Copy, Zap, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'

interface Doc {
  id: string
  slug: string
  title: string
  description: string
  estimatedTimeMins: number
  views: number
  icon: string
}

interface QuickStartDocsProps {
  docs: Doc[]
}

const iconMap: Record<string, JSX.Element> = {
  cursor: <MessageSquare className="w-6 h-6" />,
  prompt: <Copy className="w-6 h-6" />,
  error: <Zap className="w-6 h-6" />,
  default: <BookOpen className="w-6 h-6" />,
}

export function QuickStartDocs({ docs }: QuickStartDocsProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
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
              📚 코딩 없이 시작하기
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cursor가 뭔지 몰라도 OK! 5분이면 이해 완료
            </p>
          </motion.div>
        </div>

        {/* Docs grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/docs/${doc.slug}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-blue-400 cursor-pointer h-full">
                  <div className="p-6">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                      {iconMap[doc.icon] || iconMap.default}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {doc.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {doc.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <BookOpen className="w-4 h-4" />
                        <span>{doc.estimatedTimeMins}분 읽기</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 font-medium">
                        <span>{doc.views.toLocaleString()}명</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
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
          <Link href="/docs">
            <Button size="lg" variant="outline" className="border-2">
              모든 문서 보기
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
