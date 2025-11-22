'use client'

import { useState, useEffect } from 'react'
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, Sparkles, Users, Check } from 'lucide-react'

// 가격 정보
const PRICING = {
    pro: { amount: 15000, name: 'Pro', period: '/월' },
    team: { amount: 65000, name: 'Team', period: '/월' },
    single: { amount: 15000, name: '단건 구매', period: '' },
} as const

type PlanType = 'pro' | 'team' | 'single'

interface TossPaymentModalProps {
    isOpen: boolean
    onClose: () => void
    defaultPlan?: PlanType
    contentId?: string
    contentTitle?: string
}

export function TossPaymentModal({
    isOpen,
    onClose,
    defaultPlan = 'pro',
    contentId,
    contentTitle,
}: TossPaymentModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<PlanType>(contentId ? 'single' : defaultPlan)
    const [error, setError] = useState<string | null>(null)

    // contentId가 변경되면 plan 업데이트
    useEffect(() => {
        if (contentId) {
            setSelectedPlan('single')
        }
    }, [contentId])

    const handlePayment = async () => {
        try {
            setIsLoading(true)
            setError(null)

            // 1. 서버에서 결제 정보 가져오기
            const response = await fetch('/api/toss/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan: selectedPlan,
                    contentId: selectedPlan === 'single' ? contentId : undefined,
                    contentTitle,
                }),
            })

            if (!response.ok) {
                throw new Error('결제 정보를 가져오는데 실패했습니다')
            }

            const paymentData = await response.json()

            // 2. 토스페이먼츠 SDK 로드
            const tossPayments = await loadTossPayments(paymentData.clientKey)

            // 3. 결제창 열기
            const payment = tossPayments.payment({ customerKey: paymentData.customerKey })

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (payment as any).requestPayment({
                method: 'CARD',
                amount: {
                    value: paymentData.amount,
                    currency: 'KRW',
                },
                orderId: paymentData.orderId,
                orderName: paymentData.orderName,
                customerEmail: paymentData.customerEmail,
                customerName: paymentData.customerName,
                successUrl: paymentData.successUrl,
                failUrl: paymentData.failUrl,
            })
        } catch (err) {
            console.error('Payment error:', err)
            setError(err instanceof Error ? err.message : '결제 중 오류가 발생했습니다')
        } finally {
            setIsLoading(false)
        }
    }

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
        }).format(amount)
    }

    const plans = [
        {
            id: 'pro' as PlanType,
            name: 'Pro',
            description: '개인 개발자를 위한 무제한 액세스',
            icon: Sparkles,
            features: [
                '모든 문서, 튜토리얼, 스니펫 접근',
                '새로운 콘텐츠 우선 접근',
                'AI 에러 클리닉 무제한',
                '프로젝트 맵 기능',
            ],
            popular: true,
        },
        {
            id: 'team' as PlanType,
            name: 'Team',
            description: '팀을 위한 협업 플랜 (5석)',
            icon: Users,
            features: [
                'Pro의 모든 기능',
                '5명 팀원 액세스',
                '팀 관리 대시보드',
                '우선 지원',
            ],
            popular: false,
        },
    ]

    // 단건 구매 모달
    if (contentId) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>콘텐츠 구매</DialogTitle>
                        <DialogDescription>
                            {contentTitle || '이 콘텐츠'}에 대한 영구 액세스 권한을 얻으세요.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* 가격 표시 */}
                        <div className="text-center py-6 bg-muted rounded-lg">
                            <div className="text-4xl font-bold">
                                {formatPrice(PRICING.single.amount)}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">일회성 결제</div>
                        </div>

                        {/* 포함 사항 */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium">포함 사항:</p>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    영구 액세스
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    모든 업데이트 포함
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    Pro 전환 시 크레딧으로 적용
                                </li>
                            </ul>
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 text-center">{error}</div>
                        )}

                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handlePayment}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <CreditCard className="h-4 w-4 mr-2" />
                            )}
                            {isLoading ? '처리 중...' : '결제하기'}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">
                            토스페이먼츠를 통한 안전한 결제
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    // 구독 플랜 선택 모달
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>플랜 선택</DialogTitle>
                    <DialogDescription>
                        프로젝트 완성에 필요한 모든 리소스에 액세스하세요.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* 플랜 카드 */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {plans.map((plan) => {
                            const Icon = plan.icon
                            const isSelected = selectedPlan === plan.id
                            const pricing = PRICING[plan.id]

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                                        isSelected
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                    }`}
                                    onClick={() => setSelectedPlan(plan.id)}
                                >
                                    {plan.popular && (
                                        <Badge className="absolute -top-2 right-4" variant="default">
                                            인기
                                        </Badge>
                                    )}

                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon className="h-5 w-5" />
                                        <h3 className="font-semibold">{plan.name}</h3>
                                    </div>

                                    <div className="mb-2">
                                        <span className="text-2xl font-bold">
                                            {formatPrice(pricing.amount)}
                                        </span>
                                        <span className="text-muted-foreground">{pricing.period}</span>
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-4">
                                        {plan.description}
                                    </p>

                                    <ul className="space-y-2">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2 text-sm">
                                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>

                    {error && (
                        <div className="text-sm text-red-500 text-center">{error}</div>
                    )}

                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handlePayment}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <CreditCard className="h-4 w-4 mr-2" />
                        )}
                        {isLoading ? '처리 중...' : `${PRICING[selectedPlan].name} 시작하기`}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                        언제든 취소 가능 • 토스페이먼츠를 통한 안전한 결제
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
