// 결제 및 가격 관련 유틸리티

export type Currency = 'USD' | 'KRW' | 'EUR' | 'JPY'
export type PlanType = 'free' | 'pro' | 'team' | 'single'

// 플랜별 가격 정보
export const PRICING = {
    USD: {
        pro: { amount: 12, period: 'month' },
        team: { amount: 50, period: 'month' },
        single: { amount: 12, period: 'once' },
    },
    KRW: {
        pro: { amount: 15000, period: 'month' },
        team: { amount: 65000, period: 'month' },
        single: { amount: 15000, period: 'once' },
    },
    EUR: {
        pro: { amount: 11, period: 'month' },
        team: { amount: 45, period: 'month' },
        single: { amount: 11, period: 'once' },
    },
    JPY: {
        pro: { amount: 1800, period: 'month' },
        team: { amount: 7500, period: 'month' },
        single: { amount: 1800, period: 'once' },
    },
} as const

// 통화 심볼
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
    USD: '$',
    KRW: '₩',
    EUR: '€',
    JPY: '¥',
}

// 통화 정보
export const CURRENCY_INFO: Record<Currency, {
    symbol: string
    name: string
    locale: string
    decimalPlaces: number
}> = {
    USD: { symbol: '$', name: 'US Dollar', locale: 'en-US', decimalPlaces: 2 },
    KRW: { symbol: '₩', name: 'Korean Won', locale: 'ko-KR', decimalPlaces: 0 },
    EUR: { symbol: '€', name: 'Euro', locale: 'de-DE', decimalPlaces: 2 },
    JPY: { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', decimalPlaces: 0 },
}

// 국가 코드에서 통화 추론
export function getCurrencyFromCountry(countryCode: string): Currency {
    const countryToCurrency: Record<string, Currency> = {
        KR: 'KRW',
        JP: 'JPY',
        US: 'USD',
        CA: 'USD',
        AU: 'USD',
        GB: 'EUR',
        DE: 'EUR',
        FR: 'EUR',
        IT: 'EUR',
        ES: 'EUR',
        NL: 'EUR',
        BE: 'EUR',
        AT: 'EUR',
        IE: 'EUR',
        PT: 'EUR',
        FI: 'EUR',
        GR: 'EUR',
    }
    return countryToCurrency[countryCode] || 'USD'
}

// 브라우저 언어에서 통화 추론
export function getCurrencyFromLanguage(language: string): Currency {
    if (language.startsWith('ko')) return 'KRW'
    if (language.startsWith('ja')) return 'JPY'
    if (language.startsWith('de') || language.startsWith('fr') ||
        language.startsWith('es') || language.startsWith('it') ||
        language.startsWith('nl') || language.startsWith('pt')) return 'EUR'
    return 'USD'
}

// 가격 포맷팅
export function formatPrice(amount: number, currency: Currency): string {
    const info = CURRENCY_INFO[currency]

    return new Intl.NumberFormat(info.locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: info.decimalPlaces,
        maximumFractionDigits: info.decimalPlaces,
    }).format(amount)
}

// 가격 포맷팅 (심볼만)
export function formatPriceSimple(amount: number, currency: Currency): string {
    const symbol = CURRENCY_SYMBOLS[currency]
    const info = CURRENCY_INFO[currency]

    if (info.decimalPlaces === 0) {
        return `${symbol}${amount.toLocaleString(info.locale)}`
    }
    return `${symbol}${amount.toFixed(info.decimalPlaces)}`
}

// 플랜 가격 가져오기
export function getPlanPrice(plan: Exclude<PlanType, 'free'>, currency: Currency): number {
    return PRICING[currency][plan].amount
}

// 플랜 가격 문자열 가져오기
export function getPlanPriceString(plan: Exclude<PlanType, 'free'>, currency: Currency): string {
    const price = PRICING[currency][plan]
    const formattedAmount = formatPrice(price.amount, currency)

    if (price.period === 'once') {
        return formattedAmount
    }

    // 월/년 기간 표시
    const periodText = currency === 'KRW' || currency === 'JPY' ? '/월' : '/mo'
    return `${formattedAmount}${periodText}`
}

// Stripe 금액 변환 (Stripe는 최소 단위를 사용)
export function toStripeAmount(amount: number, currency: Currency): number {
    // KRW와 JPY는 소수점이 없으므로 그대로 사용
    if (currency === 'KRW' || currency === 'JPY') {
        return Math.round(amount)
    }
    // USD, EUR 등은 센트 단위로 변환
    return Math.round(amount * 100)
}

// Stripe 금액을 표시 금액으로 변환
export function fromStripeAmount(amount: number, currency: Currency): number {
    if (currency === 'KRW' || currency === 'JPY') {
        return amount
    }
    return amount / 100
}

// 플랜 특징 정보
export const PLAN_FEATURES = {
    free: {
        name: 'Free',
        nameKo: '무료',
        features: [
            { en: 'Basic documentation access', ko: '기본 문서 접근' },
            { en: '1-2 starter tutorials', ko: '1-2개 스타터 튜토리얼' },
            { en: 'Community support', ko: '커뮤니티 지원' },
        ],
    },
    pro: {
        name: 'Pro',
        nameKo: '프로',
        features: [
            { en: 'All docs, tutorials, and snippets', ko: '모든 문서, 튜토리얼, 스니펫' },
            { en: 'Early access to new content', ko: '새 콘텐츠 우선 접근' },
            { en: 'Unlimited AI Error Clinic', ko: 'AI 에러 클리닉 무제한' },
            { en: 'Project Map feature', ko: '프로젝트 맵 기능' },
            { en: 'Priority support', ko: '우선 지원' },
        ],
    },
    team: {
        name: 'Team',
        nameKo: '팀',
        features: [
            { en: 'Everything in Pro', ko: 'Pro의 모든 기능' },
            { en: '5 team member seats', ko: '5명 팀원 시트' },
            { en: 'Team management dashboard', ko: '팀 관리 대시보드' },
            { en: 'Shared progress tracking', ko: '공유 진행 상황 추적' },
            { en: 'Dedicated support', ko: '전담 지원' },
        ],
    },
} as const

// 지원하는 결제 수단 정보
export const PAYMENT_METHODS = {
    KR: {
        methods: ['card', 'kakao_pay', 'naver_pay', 'samsung_pay'],
        names: {
            card: '신용/체크카드',
            kakao_pay: '카카오페이',
            naver_pay: '네이버페이',
            samsung_pay: '삼성페이',
        },
    },
    US: {
        methods: ['card', 'us_bank_account', 'link'],
        names: {
            card: 'Credit/Debit Card',
            us_bank_account: 'Bank Account (ACH)',
            link: 'Stripe Link',
        },
    },
    JP: {
        methods: ['card', 'konbini'],
        names: {
            card: 'クレジットカード',
            konbini: 'コンビニ払い',
        },
    },
    DEFAULT: {
        methods: ['card', 'link'],
        names: {
            card: 'Credit/Debit Card',
            link: 'Stripe Link',
        },
    },
} as const

// 결제 수단 정보 가져오기
export function getPaymentMethodsForCountry(countryCode: string) {
    return PAYMENT_METHODS[countryCode as keyof typeof PAYMENT_METHODS] || PAYMENT_METHODS.DEFAULT
}
