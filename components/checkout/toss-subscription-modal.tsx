'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
import { Loader2, CreditCard, Sparkles, Users, Check, Calendar } from 'lucide-react'

// 가격 정보
const PRICING = {
    pro: { amount: 15000, name: 'Pro', period: '/월' },
    team: { amount: 65000, name: 'Team', period: '/월' },
} as const

type SubscriptionPlan = 'pro' | 'team'

interface TossSubscriptionModalProps {
    isOpen: boolean
    onClose: () => void
    defaultPlan?: SubscriptionPlan
}

export function TossSubscriptionModal({
    isOpen,
    onClose,
    defaultPlan = 'pro',
}: TossSubscriptionModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(defaultPlan)
    const [error, setError] = useState<string | null>(null)
    const widgetRef = useRef<any>(null)

    const handleSubscription = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)

            // 1. 서버에서 빌링키 발급 정보 가져오기
            const response = await fetch('/api/toss/billing/issue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: selectedPlan }),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(errorText || '결제 정보를 가져오는데 실패했습니다')
            }

            const billingData = await response.json()

            // 2. 토스페이먼츠 SDK 로드
            const tossPayments = await loadTossPayments(billingData.clientKey)

            // 3. 빌링키 발급을 위한 카드 등록 창 열기
            const payment = tossPayments.payment({ customerKey: billingData.customerKey })

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (payment as any).requestBillingAuth({
                method: 'CARD',
                successUrl: billingData.successUrl,
                failUrl: billingData.failUrl,
                customerEmail: billingData.customerEmail,
                customerName: billingData.customerName,
            })
        } catch (err) {
            console.error('Subscription error:', err)
            setError(err instanceof Error ? err.message : '구독 설정 중 오류가 발생했습니다')
        } finally {
            setIsLoading(false)
        }
    }, [selectedPlan])

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
        }).format(amount)
    }

    const plans = [
        {
            id: 'pro' as SubscriptionPlan,
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
            id: 'team' as SubscriptionPlan,
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        정기 구독 시작
                    </DialogTitle>
                    <DialogDescription>
                        매월 자동으로 결제되며, 언제든지 취소할 수 있습니다.
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

                    {/* 정기결제 안내 */}
                    <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                        <h4 className="font-medium">정기 구독 안내</h4>
                        <ul className="space-y-1 text-muted-foreground">
                            <li>• 첫 결제 후 매월 같은 날에 자동으로 결제됩니다</li>
                            <li>• 언제든지 구독을 취소할 수 있습니다</li>
                            <li>• 취소 시 현재 결제 기간까지는 서비스를 이용할 수 있습니다</li>
                            <li>• 단건 구매 금액은 Pro 전환 시 크레딧으로 적용됩니다</li>
                        </ul>
                    </div>

                    {error && (
                        <div className="text-sm text-red-500 text-center">{error}</div>
                    )}

                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleSubscription}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <CreditCard className="h-4 w-4 mr-2" />
                        )}
                        {isLoading ? '처리 중...' : `${PRICING[selectedPlan].name} 구독 시작하기`}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                        토스페이먼츠를 통한 안전한 정기결제 • 카드 정보는 안전하게 암호화됩니다
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
