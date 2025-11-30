'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'

type FeedbackProps = {
  contentId: string
}

export function Feedback({ contentId }: FeedbackProps) {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null)
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type)
    if (type === 'not-helpful') {
      setShowComment(true)
    } else {
      setSubmitted(true)
    }
  }

  const handleSubmitComment = () => {
    // TODO: Send feedback to server
    console.log('Feedback:', { contentId, feedback, comment })
    setSubmitted(true)
    setShowComment(false)
  }

  if (submitted) {
    return (
      <div className="my-8 p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-center">
        <p className="text-sm text-emerald-300 font-medium">
          피드백을 주셔서 감사합니다! 더 나은 콘텐츠를 만드는데 큰 도움이 됩니다.
        </p>
      </div>
    )
  }

  return (
    <div className="my-8 p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <h3 className="text-base font-bold text-white mb-4">이 문서가 도움이 되었나요?</h3>

      <div className="flex items-center gap-3">
        <button
          onClick={() => handleFeedback('helpful')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
            feedback === 'helpful'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm font-medium">도움됨</span>
        </button>

        <button
          onClick={() => handleFeedback('not-helpful')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
            feedback === 'not-helpful'
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white'
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          <span className="text-sm font-medium">도움 안됨</span>
        </button>
      </div>

      {showComment && (
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-zinc-500 mt-1" />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="어떤 점이 부족했나요? (선택사항)"
              className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
              rows={3}
            />
          </div>
          <button
            onClick={handleSubmitComment}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            피드백 제출
          </button>
        </div>
      )}
    </div>
  )
}
