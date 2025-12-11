'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Ban } from 'lucide-react'

type BanDuration = '1day' | '3days' | '7days' | '30days' | 'permanent'

interface BanUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
  userEmail: string
  onConfirm: (reason: string, duration: BanDuration) => void
}

const DURATION_OPTIONS: { value: BanDuration; label: string; days: number | null }[] = [
  { value: '1day', label: '1일', days: 1 },
  { value: '3days', label: '3일', days: 3 },
  { value: '7days', label: '7일', days: 7 },
  { value: '30days', label: '30일', days: 30 },
  { value: 'permanent', label: '영구 정지', days: null },
]

export function BanUserDialog({
  open,
  onOpenChange,
  userName,
  userEmail,
  onConfirm,
}: BanUserDialogProps) {
  const [reason, setReason] = useState('')
  const [duration, setDuration] = useState<BanDuration>('7days')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert('정지 사유를 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    await onConfirm(reason.trim(), duration)
    setIsSubmitting(false)

    // Reset form
    setReason('')
    setDuration('7days')
  }

  const handleCancel = () => {
    setReason('')
    setDuration('7days')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center ring-2 ring-red-500/20">
              <Ban className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">계정 정지</DialogTitle>
              <DialogDescription className="text-zinc-400 text-sm">
                사용자의 계정을 정지합니다
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 사용자 정보 */}
          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
            <p className="text-xs text-zinc-500 mb-1">대상 사용자</p>
            <p className="text-sm font-bold text-white">{userName || '이름 없음'}</p>
            <p className="text-xs text-zinc-400">{userEmail}</p>
          </div>

          {/* 정지 기간 선택 */}
          <div>
            <label className="text-sm font-bold text-white mb-2 block">
              정지 기간 <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDuration(option.value)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      duration === option.value
                        ? 'bg-red-600 text-white ring-2 ring-red-500'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {duration === 'permanent' && (
              <p className="text-xs text-red-400 mt-2">
                ⚠️ 영구 정지는 관리자가 수동으로 해제하기 전까지 유지됩니다.
              </p>
            )}
          </div>

          {/* 정지 사유 입력 */}
          <div>
            <label htmlFor="ban-reason" className="text-sm font-bold text-white mb-2 block">
              정지 사유 <span className="text-red-400">*</span>
            </label>
            <textarea
              id="ban-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="정지 사유를 상세히 입력해주세요...&#10;&#10;예시:&#10;- 스팸 행위 반복 (3회 경고 후 조치)&#10;- 부적절한 콘텐츠 업로드&#10;- 다중 계정 악용&#10;- 서비스 약관 위반"
              className="w-full h-32 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-zinc-500 mt-1">
              사용자에게 표시되는 내용입니다. 명확하고 구체적으로 작성해주세요.
            </p>
          </div>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !reason.trim()}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '처리 중...' : '계정 정지'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
