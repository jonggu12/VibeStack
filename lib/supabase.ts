import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// 빌드 시에는 더미 클라이언트 생성 (환경변수 없을 때)
const isBuildTime = !supabaseUrl || !supabaseAnonKey

// 클라이언트 사이드용 (RLS 적용)
export const supabase: SupabaseClient = isBuildTime
    ? createClient('https://placeholder.supabase.co', 'placeholder-key')
    : createClient(supabaseUrl, supabaseAnonKey)

// 서버 사이드용 (RLS 우회, 관리자 작업용)
export const supabaseAdmin: SupabaseClient = (isBuildTime || !supabaseServiceKey)
    ? createClient('https://placeholder.supabase.co', 'placeholder-key')
    : createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })

// 타입 정의 (types/payment.ts 에서 확장)
export type PaymentProvider = 'stripe' | 'toss'
export type SubscriptionPlan = 'free' | 'pro' | 'team'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'unpaid' | 'incomplete' | 'incomplete_expired'
export type PurchaseStatus = 'pending' | 'completed' | 'refunded' | 'partially_refunded' | 'aborted' | 'expired' | 'failed'
export type PurchaseType = 'single' | 'subscription'

export interface Subscription {
    id: string
    user_id: string
    plan_type: SubscriptionPlan
    status: SubscriptionStatus
    payment_provider: PaymentProvider
    currency: string

    // Stripe fields
    stripe_customer_id?: string
    stripe_subscription_id?: string
    stripe_price_id?: string

    // Toss Payments fields
    toss_payment_key?: string
    toss_order_id?: string
    toss_billing_key?: string
    toss_customer_key?: string
    card_last_four?: string
    card_brand?: string

    // Period tracking
    current_period_start: string
    current_period_end: string

    // Cancellation
    cancel_at_period_end: boolean
    canceled_at?: string
    cancel_reason?: string

    created_at: string
    updated_at: string
}

export interface Purchase {
    id: string
    user_id: string
    content_id: string
    amount: number
    currency: string
    status: PurchaseStatus
    payment_provider: PaymentProvider
    payment_method?: string

    // Stripe fields
    stripe_payment_intent_id?: string
    stripe_checkout_session_id?: string

    // Toss Payments fields
    toss_payment_key?: string
    toss_order_id?: string

    created_at: string
    updated_at?: string
}

export interface UserContent {
    id: string
    user_id: string
    content_id: string
    access_type: 'free' | 'purchased' | 'subscription'
    granted_at: string
    expires_at?: string
}
