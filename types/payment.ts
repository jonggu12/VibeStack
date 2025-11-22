// Payment Provider Types
export type PaymentProvider = 'stripe' | 'toss';

// Subscription Status
export type SubscriptionStatus =
    | 'active'
    | 'canceled'
    | 'past_due'
    | 'unpaid'
    | 'trialing'
    | 'incomplete'
    | 'incomplete_expired';

// Purchase Status
export type PurchaseStatus =
    | 'pending'
    | 'completed'
    | 'refunded'
    | 'partially_refunded'
    | 'aborted'
    | 'expired'
    | 'failed';

// Plan Types
export type PlanType = 'pro' | 'team' | 'single';

// Currency
export type Currency = 'krw' | 'usd' | 'eur' | 'jpy';

// Subscription Database Record
export interface Subscription {
    id: string;
    user_id: string;
    plan_type: PlanType;
    status: SubscriptionStatus;
    payment_provider: PaymentProvider;
    currency: Currency;

    // Stripe fields
    stripe_customer_id?: string;
    stripe_subscription_id?: string;
    stripe_price_id?: string;

    // Toss Payments fields
    toss_payment_key?: string;
    toss_order_id?: string;
    toss_billing_key?: string;
    toss_customer_key?: string;
    card_last_four?: string;
    card_brand?: string;

    // Period tracking
    current_period_start: string;
    current_period_end: string;

    // Cancellation
    cancel_at_period_end: boolean;
    canceled_at?: string;
    cancel_reason?: string;

    // Timestamps
    created_at: string;
    updated_at: string;
}

// Purchase Database Record
export interface Purchase {
    id: string;
    user_id: string;
    content_id: string;
    amount: number;
    currency: Currency;
    status: PurchaseStatus;
    payment_provider: PaymentProvider;
    payment_method?: string;

    // Stripe fields
    stripe_payment_intent_id?: string;
    stripe_checkout_session_id?: string;

    // Toss Payments fields
    toss_payment_key?: string;
    toss_order_id?: string;

    // Timestamps
    created_at: string;
    updated_at: string;
}

// User Content Access
export type AccessType = 'free' | 'purchased' | 'subscription';

export interface UserContent {
    id: string;
    user_id: string;
    content_id: string;
    access_type: AccessType;
    granted_at: string;
    expires_at?: string;
}

// User with payment info
export interface UserPaymentInfo {
    id: string;
    clerk_user_id: string;
    email: string;
    purchase_credits: number; // KRW credits from single purchases
    subscription?: Subscription;
    purchases: Purchase[];
}

// Payment Request Types
export interface CreateCheckoutRequest {
    plan: PlanType;
    contentId?: string;
    contentTitle?: string;
}

export interface CreateBillingRequest {
    plan: 'pro' | 'team';
}

export interface CancelSubscriptionRequest {
    reason?: string;
    immediately?: boolean;
}

// Payment Response Types
export interface CheckoutResponse {
    clientKey: string;
    orderId: string;
    orderName: string;
    amount: number;
    customerKey: string;
    customerName: string;
    customerEmail: string;
    successUrl: string;
    failUrl: string;
}

export interface BillingIssueResponse extends CheckoutResponse {}

export interface SubscriptionCancelResponse {
    success: boolean;
    canceledImmediately: boolean;
    periodEnd: string;
}

// Webhook Event Types (Toss)
export interface TossWebhookEvent {
    eventType: string;
    createdAt: string;
    data: {
        paymentKey: string;
        orderId: string;
        status: string;
        totalAmount?: number;
        method?: string;
        canceledAt?: string;
        cancelAmount?: number;
        cancelReason?: string;
    };
}
