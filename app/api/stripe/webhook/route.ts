import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Generate unique request ID for logging
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Generic error responses (safe for external clients)
const ERROR_MESSAGES = {
  INVALID_SIGNATURE: 'Invalid webhook signature',
  PROCESSING_FAILED: 'Webhook processing failed',
  INTERNAL_ERROR: 'An unexpected error occurred',
} as const

// Time constants
const SECONDS_IN_DAY = 24 * 60 * 60
const DEFAULT_SUBSCRIPTION_PERIOD_DAYS = 30
const DEFAULT_SUBSCRIPTION_PERIOD_SECONDS = DEFAULT_SUBSCRIPTION_PERIOD_DAYS * SECONDS_IN_DAY

/**
 * Type for checkout session metadata
 */
type CheckoutMetadata = {
  userId: string
  purchaseType?: 'single' | 'subscription'
  contentId?: string
  plan?: string
  currency: string
}

/**
 * Extract and validate metadata from Stripe checkout session
 * Returns null if required fields are missing
 */
function extractCheckoutMetadata(
  metadata: Record<string, string> | null | undefined
): CheckoutMetadata | null {
  if (!metadata?.userId) {
    return null
  }

  return {
    userId: metadata.userId,
    purchaseType: metadata.purchaseType as 'single' | 'subscription' | undefined,
    contentId: metadata.contentId,
    plan: metadata.plan,
    currency: metadata.currency || 'USD',
  }
}

export async function POST(req: Request) {
    const requestId = generateRequestId();
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            env.payment.stripe.webhookSecret!
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[${requestId}] Webhook signature verification failed:`, message);
        return NextResponse.json(
            { error: ERROR_MESSAGES.INVALID_SIGNATURE },
            { status: 400 }
        );
    }

    const eventType = event.type;

    try {
        switch (eventType) {
            // 결제 성공 (구독 또는 단건)
            case "checkout.session.completed":
                await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, requestId);
                break;

            // 구독 갱신 결제 성공
            case "invoice.payment_succeeded":
                await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, requestId);
                break;

            // 구독 갱신 결제 실패
            case "invoice.payment_failed":
                await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, requestId);
                break;

            // 구독 상태 변경
            case "customer.subscription.updated":
                await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, requestId);
                break;

            // 구독 취소
            case "customer.subscription.deleted":
                await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, requestId);
                break;

            // 환불 처리
            case "charge.refunded":
                await handleChargeRefunded(event.data.object as Stripe.Charge, requestId);
                break;

            default:
                console.log(`[${requestId}] Unhandled event type: ${eventType}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error(`[${requestId}] ${eventType}: Unexpected error:`, error);
        return NextResponse.json(
            { error: ERROR_MESSAGES.INTERNAL_ERROR },
            { status: 500 }
        );
    }
}

// 체크아웃 완료 핸들러
async function handleCheckoutCompleted(session: Stripe.Checkout.Session, requestId: string) {
    const metadata = extractCheckoutMetadata(session.metadata);

    if (!metadata) {
        console.error(`[${requestId}] checkout.session.completed: Missing userId in metadata`);
        return;
    }

    const { userId, purchaseType, contentId, plan, currency } = metadata;

    console.log(`[${requestId}] checkout.session.completed: User ${userId}, Type: ${purchaseType || 'subscription'}`);

    // 단건 구매
    if (purchaseType === "single" && contentId) {
        await handleSinglePurchase(requestId, session, userId, contentId, currency);
        return;
    }

    // 구독 구매
    if (session.subscription) {
        await handleSubscriptionPurchase(requestId, session, userId, plan || 'pro', currency);
    }
}

// 단건 구매 처리
async function handleSinglePurchase(
    requestId: string,
    session: Stripe.Checkout.Session,
    userId: string,
    contentId: string,
    currency: string
) {
    // 1. 구매 기록 저장
    const { error: purchaseError } = await supabaseAdmin
        .from('purchases')
        .insert({
            user_id: userId,
            content_id: contentId,
            stripe_payment_intent_id: session.payment_intent as string,
            stripe_checkout_session_id: session.id,
            amount: session.amount_total || 0,
            currency: currency.toLowerCase(),
            status: 'completed',
        });

    if (purchaseError) {
        console.error(`[${requestId}] single.purchase: Error saving purchase:`, purchaseError);
        throw purchaseError;
    }

    // 2. 사용자 콘텐츠 액세스 권한 부여
    const { error: accessError } = await supabaseAdmin
        .from('user_contents')
        .upsert({
            user_id: userId,
            content_id: contentId,
            access_type: 'purchased',
            granted_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id,content_id',
        });

    if (accessError) {
        console.error(`[${requestId}] single.purchase: Error granting access:`, accessError);
        throw accessError;
    }

    // 3. 사용자 크레딧 업데이트 (Pro 전환 시 사용)
    const amountInDollars = (session.amount_total || 0) / 100;
    await updateUserCredits(requestId, userId, amountInDollars);

    console.log(`[${requestId}] single.purchase: Completed for user ${userId}, content ${contentId}`);
}

// 구독 구매 처리
async function handleSubscriptionPurchase(
    requestId: string,
    session: Stripe.Checkout.Session,
    userId: string,
    plan: string,
    currency: string
) {
    // Retrieve full subscription details with proper typing
    if (typeof session.subscription !== 'string') {
        console.error(`[${requestId}] subscription.purchase: Invalid subscription ID type`);
        throw new Error('Invalid subscription ID');
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription) as any;

    // 1. 구독 정보 저장/업데이트
    const { error: subscriptionError } = await supabaseAdmin
        .from('subscriptions')
        .upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            plan_type: plan as 'pro' | 'team',
            status: subscription.status,
            current_period_start: new Date((subscription.current_period_start || subscription.start_date) * 1000).toISOString(),
            current_period_end: new Date((subscription.current_period_end || subscription.ended_at || Date.now() / 1000 + DEFAULT_SUBSCRIPTION_PERIOD_SECONDS) * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end ?? false,
            currency: currency.toLowerCase(),
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id',
        });

    if (subscriptionError) {
        console.error(`[${requestId}] subscription.purchase: Error saving subscription:`, subscriptionError);
        throw subscriptionError;
    }

    // 2. 사용자에게 모든 프리미엄 콘텐츠 액세스 권한 부여
    // (실제로는 콘텐츠 접근 시 구독 상태를 확인하는 방식이 더 효율적)

    console.log(`[${requestId}] subscription.purchase: Completed for user ${userId}, plan ${plan}`);
}

// 인보이스 결제 성공 (구독 갱신)
async function handleInvoicePaymentSucceeded(invoice: any, requestId: string) {
    if (!invoice.subscription) return;

    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string) as any;
    const userId = subscription.metadata?.userId;

    if (!userId) {
        // 메타데이터가 없으면 customer로 조회
        const customer = await stripe.customers.retrieve(invoice.customer as string);
        if (!customer || (customer as any).deleted) return;

        // Supabase에서 stripe_customer_id로 사용자 조회
        const { data: subData } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', invoice.customer)
            .single();

        if (!subData) return;

        await updateSubscriptionPeriod(subData.user_id, subscription, requestId);
        return;
    }

    await updateSubscriptionPeriod(userId, subscription, requestId);
}

// 구독 기간 업데이트
async function updateSubscriptionPeriod(userId: string, subscription: any, requestId: string) {
    const { error } = await supabaseAdmin
        .from('subscriptions')
        .update({
            status: subscription.status,
            current_period_start: new Date((subscription.current_period_start || subscription.start_date) * 1000).toISOString(),
            current_period_end: new Date((subscription.current_period_end || subscription.ended_at || Date.now() / 1000 + DEFAULT_SUBSCRIPTION_PERIOD_SECONDS) * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end ?? false,
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

    if (error) {
        console.error(`[${requestId}] subscription.update_period: Error:`, error);
    }

    console.log(`[${requestId}] invoice.payment_succeeded: Subscription renewed for user ${userId}`);
}

// 인보이스 결제 실패
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, requestId: string) {
    const { data: subData } = await supabaseAdmin
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', invoice.customer)
        .single();

    if (!subData) return;

    // 구독 상태를 past_due로 업데이트
    await supabaseAdmin
        .from('subscriptions')
        .update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', subData.user_id);

    console.log(`[${requestId}] invoice.payment_failed: Payment failed for user ${subData.user_id}`);

    // TODO: 이메일 알림 발송
}

// 구독 업데이트
async function handleSubscriptionUpdated(subscription: any, requestId: string) {
    const { data: subData } = await supabaseAdmin
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .single();

    if (!subData) return;

    // 플랜 변경 감지
    const planItem = subscription.items?.data?.[0];
    const priceId = planItem?.price?.id;

    // 가격 ID로 플랜 타입 결정
    let planType: 'pro' | 'team' = 'pro';
    if (priceId?.includes('team') || priceId === process.env.STRIPE_PRICE_ID_TEAM_USD ||
        priceId === process.env.STRIPE_PRICE_ID_TEAM_KRW ||
        priceId === process.env.STRIPE_PRICE_ID_TEAM_EUR ||
        priceId === process.env.STRIPE_PRICE_ID_TEAM_JPY) {
        planType = 'team';
    }

    await supabaseAdmin
        .from('subscriptions')
        .update({
            plan_type: planType,
            status: subscription.status,
            cancel_at_period_end: subscription.cancel_at_period_end ?? false,
            current_period_start: new Date((subscription.current_period_start || subscription.start_date) * 1000).toISOString(),
            current_period_end: new Date((subscription.current_period_end || subscription.ended_at || Date.now() / 1000 + DEFAULT_SUBSCRIPTION_PERIOD_SECONDS) * 1000).toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', subData.user_id);

    console.log(`[${requestId}] customer.subscription.updated: User ${subData.user_id}, status: ${subscription.status}`);
}

// 구독 취소
async function handleSubscriptionDeleted(subscription: any, requestId: string) {
    const { data: subData } = await supabaseAdmin
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .single();

    if (!subData) return;

    await supabaseAdmin
        .from('subscriptions')
        .update({
            status: 'canceled',
            plan_type: 'free',
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', subData.user_id);

    console.log(`[${requestId}] customer.subscription.deleted: Subscription canceled for user ${subData.user_id}`);
}

// 환불 처리
async function handleChargeRefunded(charge: Stripe.Charge, requestId: string) {
    // 관련 구매 기록 찾기
    const paymentIntentId = charge.payment_intent as string;

    const { data: purchase } = await supabaseAdmin
        .from('purchases')
        .select('*')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .single();

    if (!purchase) return;

    // 구매 상태 업데이트
    await supabaseAdmin
        .from('purchases')
        .update({
            status: charge.refunded ? 'refunded' : 'partially_refunded',
            updated_at: new Date().toISOString(),
        })
        .eq('id', purchase.id);

    // 전액 환불인 경우 콘텐츠 접근 권한 취소
    if (charge.refunded) {
        await supabaseAdmin
            .from('user_contents')
            .delete()
            .eq('user_id', purchase.user_id)
            .eq('content_id', purchase.content_id)
            .eq('access_type', 'purchased');
    }

    console.log(`[${requestId}] charge.refunded: Refund processed for purchase ${purchase.id}`);
}

// 사용자 크레딧 업데이트 (단건 구매 금액을 Pro 크레딧으로 적립)
async function updateUserCredits(requestId: string, userId: string, amountInDollars: number) {
    // 기존 크레딧 조회
    const { data: user } = await supabaseAdmin
        .from('users')
        .select('purchase_credits')
        .eq('clerk_user_id', userId)
        .single();

    const currentCredits = user?.purchase_credits || 0;
    const newCredits = currentCredits + amountInDollars;

    // 크레딧 업데이트
    await supabaseAdmin
        .from('users')
        .update({
            purchase_credits: newCredits,
            updated_at: new Date().toISOString(),
        })
        .eq('clerk_user_id', userId);

    console.log(`[${requestId}] credits.update: User ${userId} credits: ${currentCredits} -> ${newCredits}`);
}
