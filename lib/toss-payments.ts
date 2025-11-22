// Toss Payments Client Configuration
// https://developers.tosspayments.com

// 가격 정보 (KRW)
export const TOSS_PRICING = {
    pro: {
        amount: 15000,
        name: 'Pro 플랜',
        description: '개인 개발자를 위한 무제한 액세스',
    },
    team: {
        amount: 65000,
        name: 'Team 플랜',
        description: '팀을 위한 협업 플랜 (5석)',
    },
    single: {
        amount: 15000,
        name: '단건 구매',
        description: '선택한 콘텐츠 영구 액세스',
    },
} as const

export type TossPlanType = keyof typeof TOSS_PRICING

// 결제 수단 타입
export type TossPaymentMethod =
    | 'CARD'           // 카드
    | 'VIRTUAL_ACCOUNT' // 가상계좌
    | 'TRANSFER'       // 계좌이체
    | 'MOBILE_PHONE'   // 휴대폰
    | 'CULTURE_GIFT'   // 문화상품권
    | 'TOSS_PAY'       // 토스페이
    | 'KAKAO_PAY'      // 카카오페이
    | 'NAVER_PAY'      // 네이버페이
    | 'SAMSUNG_PAY'    // 삼성페이

// 결제 상태
export type TossPaymentStatus =
    | 'READY'           // 결제 준비
    | 'IN_PROGRESS'     // 결제 진행 중
    | 'WAITING_FOR_DEPOSIT' // 입금 대기
    | 'DONE'            // 결제 완료
    | 'CANCELED'        // 결제 취소
    | 'PARTIAL_CANCELED' // 부분 취소
    | 'ABORTED'         // 결제 중단
    | 'EXPIRED'         // 결제 만료

// 결제 요청 인터페이스
export interface TossPaymentRequest {
    orderId: string
    orderName: string
    amount: number
    customerName?: string
    customerEmail?: string
    successUrl: string
    failUrl: string
    // 정기결제용
    customerKey?: string
}

// 결제 승인 응답 인터페이스
export interface TossPaymentResponse {
    paymentKey: string
    orderId: string
    orderName: string
    status: TossPaymentStatus
    requestedAt: string
    approvedAt?: string
    totalAmount: number
    balanceAmount: number
    method: string
    card?: {
        issuerCode: string
        acquirerCode: string
        number: string
        installmentPlanMonths: number
        isInterestFree: boolean
        approveNo: string
        cardType: string
        ownerType: string
    }
    easyPay?: {
        provider: string
        amount: number
        discountAmount: number
    }
}

// 빌링 키 발급 응답
export interface TossBillingKeyResponse {
    billingKey: string
    customerKey: string
    authenticatedAt: string
    method: string
    card?: {
        issuerCode: string
        acquirerCode: string
        number: string
        cardType: string
        ownerType: string
    }
}

// 서버 사이드 결제 승인 함수
export async function confirmPayment(
    paymentKey: string,
    orderId: string,
    amount: number
): Promise<TossPaymentResponse> {
    const secretKey = process.env.TOSS_SECRET_KEY

    if (!secretKey) {
        throw new Error('TOSS_SECRET_KEY is not configured')
    }

    // Base64 인코딩 (secretKey:빈문자열)
    const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64')

    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${encryptedSecretKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            paymentKey,
            orderId,
            amount,
        }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Payment confirmation failed')
    }

    return response.json()
}

// 결제 조회 함수
export async function getPayment(paymentKey: string): Promise<TossPaymentResponse> {
    const secretKey = process.env.TOSS_SECRET_KEY

    if (!secretKey) {
        throw new Error('TOSS_SECRET_KEY is not configured')
    }

    const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64')

    const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${encryptedSecretKey}`,
        },
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to get payment')
    }

    return response.json()
}

// 결제 취소 함수
export async function cancelPayment(
    paymentKey: string,
    cancelReason: string,
    cancelAmount?: number
): Promise<TossPaymentResponse> {
    const secretKey = process.env.TOSS_SECRET_KEY

    if (!secretKey) {
        throw new Error('TOSS_SECRET_KEY is not configured')
    }

    const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64')

    const body: Record<string, unknown> = { cancelReason }
    if (cancelAmount) {
        body.cancelAmount = cancelAmount
    }

    const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${encryptedSecretKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Payment cancellation failed')
    }

    return response.json()
}

// 빌링 키로 자동 결제 (정기결제)
export async function billingPayment(
    billingKey: string,
    customerKey: string,
    amount: number,
    orderId: string,
    orderName: string
): Promise<TossPaymentResponse> {
    const secretKey = process.env.TOSS_SECRET_KEY

    if (!secretKey) {
        throw new Error('TOSS_SECRET_KEY is not configured')
    }

    const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64')

    const response = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${encryptedSecretKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            customerKey,
            amount,
            orderId,
            orderName,
        }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Billing payment failed')
    }

    return response.json()
}

// 주문 ID 생성 (유니크)
export function generateOrderId(): string {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 8)
    return `order_${timestamp}_${randomStr}`
}

// 고객 키 생성 (유저별 유니크)
export function generateCustomerKey(userId: string): string {
    return `customer_${userId}`
}

// 금액 포맷팅
export function formatKRW(amount: number): string {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
    }).format(amount)
}
