'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Clock, Users, CheckCircle2, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface Tutorial {
  id: string
  slug: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTimeMins: number
  completions: number
  successRate: number
  stack: Record<string, string>
  isPremium: boolean
}

interface PopularTutorialsProps {
  tutorials: Tutorial[]
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  advanced: 'bg-red-100 text-red-700 border-red-200',
}

const difficultyLabels = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
}

export function PopularTutorials({ tutorials }: PopularTutorialsProps) {
  return (
    <section id="popular-tutorials" className="py-24 bg-white">
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
              🔥 코딩 몰라도 완성!
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              1,234명이 이미 만들었어요. 프롬프트만 복붙하면 끝!
            </p>
          </motion.div>
        </div>

        {/* Tutorials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial, index) => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:border-blue-500 relative h-full flex flex-col">
                {/* Premium badge */}
                {tutorial.isPremium && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      ✨ Pro
                    </Badge>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  {/* Difficulty & Time */}
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={`${difficultyColors[tutorial.difficulty]} border`}>
                      {difficultyLabels[tutorial.difficulty]}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{tutorial.estimatedTimeMins}분</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {tutorial.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2 flex-1">
                    {tutorial.description}
                  </p>

                  {/* Stack tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Object.entries(tutorial.stack).slice(0, 3).map(([key, value]) => (
                      <span
                        key={key}
                        className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                      >
                        {value}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{tutorial.completions.toLocaleString()}명 완성</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{tutorial.successRate}% 성공</span>
                    </div>
                  </div>

                  {/* CTA button */}
                  <Link href={`/tutorials/${tutorial.slug}`} className="block">
                    <Button className="w-full group-hover:bg-blue-600 group-hover:scale-105 transition-all">
                      시작하기
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
          <Link href="/tutorials">
            <Button size="lg" variant="outline" className="border-2">
              모든 튜토리얼 보기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
