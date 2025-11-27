'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle2, Users, Zap, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const stats = [
  {
    icon: Users,
    value: '1,234',
    label: '활성 사용자',
    description: '지난 30일',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: CheckCircle2,
    value: '94%',
    label: '평균 완성률',
    description: '튜토리얼 기준',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Zap,
    value: '45분',
    label: '평균 시간',
    description: '첫 프로젝트 완성',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    icon: Heart,
    value: '4.8',
    label: '평균 평점',
    description: '562개 리뷰',
    color: 'from-pink-500 to-pink-600',
  },
]

const testimonials = [
  {
    name: '창업자 민준',
    role: '비개발자 · SaaS 창업',
    content: '코딩 1도 몰랐는데 Cursor랑 이 사이트로 2주 만에 MVP 완성했어요. 진짜 프롬프트만 복붙했습니다!',
    avatar: '👨‍💼',
    project: 'Todo SaaS (Next.js + Clerk + Supabase)',
  },
  {
    name: '부업러 수진',
    role: '마케터 · 사이드 프로젝트',
    content: '퇴근 후 1시간씩 따라했는데 3일 만에 웨이팅리스트 사이트 완성! 디자이너도 개발 가능하네요.',
    avatar: '👩‍💻',
    project: 'Waitlist Landing (30분 튜토리얼)',
  },
  {
    name: '주니어 개발자 현우',
    role: '개발 6개월차',
    content: 'Next.js 처음인데 에러 해결 문서 덕분에 막힘 없이 진행됐어요. AI 프롬프트가 진짜 유용합니다!',
    avatar: '🧑‍💻',
    project: 'Blog + MDX (1.5시간 튜토리얼)',
  },
]

export function TrustSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mx-auto mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-gray-700 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.description}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Testimonials section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              💬 실제 사용자 후기
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              코딩 몰라도 프로젝트 완성한 실제 이야기
            </p>
          </motion.div>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-xl transition-shadow border-2 hover:border-blue-400">
                {/* Rating stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Project info */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-700 font-medium">
                    완성한 프로젝트
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {testimonial.project}
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className="text-4xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
