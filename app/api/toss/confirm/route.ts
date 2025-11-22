import { NextResponse } from "next/server";
import { confirmPayment, TossPlanType } from "@/lib/toss-payments";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const userId = searchParams.get("userId");
    const plan = searchParams.get("plan") as TossPlanType;
    const contentId = searchParams.get("contentId");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount || !userId) {
        return NextResponse.redirect(`${baseUrl}/checkout/fail?message=missing_parameters`);
    }

    try {
        // 토스페이먼츠 결제 승인 API 호출
        const payment = await confirmPayment(
            paymentKey,
            orderId,
            parseInt(amount)
        );

        console.log("[TOSS_CONFIRM] Payment confirmed:", payment.orderId);

        // 결제 성공 시 DB 처리
        if (payment.status === "DONE") {
            if (plan === "single" && contentId) {
                // 단건 구매 처리
                await handleSinglePurchase(userId, contentId, payment);
            } else if (plan === "pro" || plan === "team") {
                // 구독 결제 처리
                await handleSubscription(userId, plan, payment);
            }

            // 성공 페이지로 리다이렉트
            return NextResponse.redirect(
                `${baseUrl}/checkout/success?orderId=${orderId}&plan=${plan}`
            );
        }

        // 결제 실패
        return NextResponse.redirect(
            `${baseUrl}/checkout/fail?orderId=${orderId}&status=${payment.status}`
        );
    } catch (error) {
        console.error("[TOSS_CONFIRM_ERROR]", error);
        const message = error instanceof Error ? error.message : "unknown_error";
        return NextResponse.redirect(
            `${baseUrl}/checkout/fail?orderId=${orderId}&message=${encodeURIComponent(message)}`
        );
    }
}

// 단건 구매 처리
async function handleSinglePurchase(
    userId: string,
    contentId: string,
    payment: { paymentKey: string; orderId: string; totalAmount: number; method: string }
) {
    // 1. 구매 기록 저장
    const { error: purchaseError } = await supabaseAdmin
        .from("purchases")
        .insert({
            user_id: userId,
            content_id: contentId,
            toss_payment_key: payment.paymentKey,
            toss_order_id: payment.orderId,
            amount: payment.totalAmount,
            currency: "krw",
            payment_provider: "toss",
            payment_method: payment.method,
            status: "completed",
        });

    if (purchaseError) {
        console.error("[SINGLE_PURCHASE] Error saving purchase:", purchaseError);
        throw purchaseError;
    }

    // 2. 콘텐츠 접근 권한 부여
    const { error: accessError } = await supabaseAdmin
        .from("user_contents")
        .upsert({
            user_id: userId,
            content_id: contentId,
            access_type: "purchased",
            granted_at: new Date().toISOString(),
        }, {
            onConflict: "user_id,content_id",
        });

    if (accessError) {
        console.error("[SINGLE_PURCHASE] Error granting access:", accessError);
        throw accessError;
    }

    // 3. 크레딧 적립 (Pro 전환 시 사용)
    await updateUserCredits(userId, payment.totalAmount);

    console.log(`[SINGLE_PURCHASE] Completed: user=${userId}, content=${contentId}`);
}

// 구독 결제 처리
async function handleSubscription(
    userId: string,
    plan: "pro" | "team",
    payment: { paymentKey: string; orderId: string; totalAmount: number; method: string }
) {
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // 구독 정보 저장/업데이트
    const { error: subscriptionError } = await supabaseAdmin
        .from("subscriptions")
        .upsert({
            user_id: userId,
            toss_payment_key: payment.paymentKey,
            toss_order_id: payment.orderId,
            plan_type: plan,
            status: "active",
            payment_provider: "toss",
            currency: "krw",
            current_period_start: now.toISOString(),
            current_period_end: nextMonth.toISOString(),
            updated_at: now.toISOString(),
        }, {
            onConflict: "user_id",
        });

    if (subscriptionError) {
        console.error("[SUBSCRIPTION] Error saving subscription:", subscriptionError);
        throw subscriptionError;
    }

    console.log(`[SUBSCRIPTION] Activated: user=${userId}, plan=${plan}`);
}

// 크레딧 적립 함수
async function updateUserCredits(userId: string, amountInKRW: number) {
    const { data: user } = await supabaseAdmin
        .from("users")
        .select("purchase_credits")
        .eq("clerk_user_id", userId)
        .single();

    const currentCredits = user?.purchase_credits || 0;
    const newCredits = currentCredits + amountInKRW;

    await supabaseAdmin
        .from("users")
        .update({
            purchase_credits: newCredits,
            updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", userId);

    console.log(`[CREDITS] Updated: user=${userId}, ${currentCredits} -> ${newCredits} KRW`);
}
