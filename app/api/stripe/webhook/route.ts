import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error("[STRIPE_WEBHOOK_ERROR]", message);
        return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
    }

    try {
        switch (event.type) {
            // 결제 성공 (구독 또는 단건)
            case "checkout.session.completed":
                await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
                break;

            // 구독 갱신 결제 성공
            case "invoice.payment_succeeded":
                await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
                break;

            // 구독 갱신 결제 실패
            case "invoice.payment_failed":
                await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
                break;

            // 구독 상태 변경
            case "customer.subscription.updated":
                await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
                break;

            // 구독 취소
            case "customer.subscription.deleted":
                await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                break;

            // 환불 처리
            case "charge.refunded":
                await handleChargeRefunded(event.data.object as Stripe.Charge);
                break;

            default:
                console.log(`[STRIPE_WEBHOOK] Unhandled event type: ${event.type}`);
        }

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("[STRIPE_WEBHOOK_HANDLER_ERROR]", error);
        return new NextResponse("Webhook handler error", { status: 500 });
    }
}

// 체크아웃 완료 핸들러
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    const purchaseType = session.metadata?.purchaseType;
    const contentId = session.metadata?.contentId;
    const plan = session.metadata?.plan;
    const currency = session.metadata?.currency || 'USD';

    if (!userId) {
        console.error("[CHECKOUT_COMPLETED] Missing userId in metadata");
        return;
    }

    console.log(`[CHECKOUT_COMPLETED] User: ${userId}, Type: ${purchaseType || 'subscription'}`);

    // 단건 구매
    if (purchaseType === "single" && contentId) {
        await handleSinglePurchase(session, userId, contentId, currency);
        return;
    }

    // 구독 구매
    if (session.subscription) {
        await handleSubscriptionPurchase(session, userId, plan || 'pro', currency);
    }
}

// 단건 구매 처리
async function handleSinglePurchase(
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
        console.error("[SINGLE_PURCHASE] Error saving purchase:", purchaseError);
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
        console.error("[SINGLE_PURCHASE] Error granting access:", accessError);
        throw accessError;
    }

    // 3. 사용자 크레딧 업데이트 (Pro 전환 시 사용)
    const amountInDollars = (session.amount_total || 0) / 100;
    await updateUserCredits(userId, amountInDollars);

    console.log(`[SINGLE_PURCHASE] Completed for user ${userId}, content ${contentId}`);
}

// 구독 구매 처리
async function handleSubscriptionPurchase(
    session: Stripe.Checkout.Session,
    userId: string,
    plan: string,
    currency: string
) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as any;

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
            current_period_end: new Date((subscription.current_period_end || subscription.ended_at || Date.now() / 1000 + 30 * 24 * 60 * 60) * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end ?? false,
            currency: currency.toLowerCase(),
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id',
        });

    if (subscriptionError) {
        console.error("[SUBSCRIPTION_PURCHASE] Error saving subscription:", subscriptionError);
        throw subscriptionError;
    }

    // 2. 사용자에게 모든 프리미엄 콘텐츠 액세스 권한 부여
    // (실제로는 콘텐츠 접근 시 구독 상태를 확인하는 방식이 더 효율적)

    console.log(`[SUBSCRIPTION_PURCHASE] Completed for user ${userId}, plan ${plan}`);
}

// 인보이스 결제 성공 (구독 갱신)
async function handleInvoicePaymentSucceeded(invoice: any) {
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

        await updateSubscriptionPeriod(subData.user_id, subscription);
        return;
    }

    await updateSubscriptionPeriod(userId, subscription);
}

// 구독 기간 업데이트
async function updateSubscriptionPeriod(userId: string, subscription: any) {
    const { error } = await supabaseAdmin
        .from('subscriptions')
        .update({
            status: subscription.status,
            current_period_start: new Date((subscription.current_period_start || subscription.start_date) * 1000).toISOString(),
            current_period_end: new Date((subscription.current_period_end || subscription.ended_at || Date.now() / 1000 + 30 * 24 * 60 * 60) * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end ?? false,
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

    if (error) {
        console.error("[UPDATE_SUBSCRIPTION_PERIOD] Error:", error);
    }

    console.log(`[INVOICE_PAYMENT_SUCCEEDED] Subscription renewed for user ${userId}`);
}

// 인보이스 결제 실패
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
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

    console.log(`[INVOICE_PAYMENT_FAILED] Payment failed for user ${subData.user_id}`);

    // TODO: 이메일 알림 발송
}

// 구독 업데이트
async function handleSubscriptionUpdated(subscription: any) {
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
            current_period_end: new Date((subscription.current_period_end || subscription.ended_at || Date.now() / 1000 + 30 * 24 * 60 * 60) * 1000).toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', subData.user_id);

    console.log(`[SUBSCRIPTION_UPDATED] User ${subData.user_id}, status: ${subscription.status}`);
}

// 구독 취소
async function handleSubscriptionDeleted(subscription: any) {
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

    console.log(`[SUBSCRIPTION_DELETED] Subscription canceled for user ${subData.user_id}`);
}

// 환불 처리
async function handleChargeRefunded(charge: Stripe.Charge) {
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

    console.log(`[CHARGE_REFUNDED] Refund processed for purchase ${purchase.id}`);
}

// 사용자 크레딧 업데이트 (단건 구매 금액을 Pro 크레딧으로 적립)
async function updateUserCredits(userId: string, amountInDollars: number) {
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

    console.log(`[UPDATE_CREDITS] User ${userId} credits: ${currentCredits} -> ${newCredits}`);
}
