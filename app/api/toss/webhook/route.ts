import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { TossPaymentStatus } from "@/lib/toss-payments";

// 토스페이먼츠 웹훅 이벤트 타입
interface TossWebhookEvent {
    eventType: string;
    createdAt: string;
    data: {
        paymentKey: string;
        orderId: string;
        status: TossPaymentStatus;
        totalAmount?: number;
        method?: string;
        canceledAt?: string;
        cancelAmount?: number;
        cancelReason?: string;
    };
}

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const event: TossWebhookEvent = JSON.parse(body);

        console.log(`[TOSS_WEBHOOK] Event: ${event.eventType}, Order: ${event.data.orderId}`);

        switch (event.eventType) {
            // 결제 완료
            case "PAYMENT_STATUS_CHANGED":
                await handlePaymentStatusChanged(event.data);
                break;

            // 가상계좌 입금 완료
            case "DEPOSIT_CALLBACK":
                await handleDepositCallback(event.data);
                break;

            // 기타 이벤트
            default:
                console.log(`[TOSS_WEBHOOK] Unhandled event: ${event.eventType}`);
        }

        return new NextResponse("OK", { status: 200 });
    } catch (error) {
        console.error("[TOSS_WEBHOOK_ERROR]", error);
        return new NextResponse("Webhook Error", { status: 500 });
    }
}

// 결제 상태 변경 핸들러
async function handlePaymentStatusChanged(data: TossWebhookEvent["data"]) {
    const { paymentKey, orderId, status } = data;

    switch (status) {
        case "DONE":
            // 결제 완료 - confirm API에서 이미 처리됨
            console.log(`[WEBHOOK] Payment completed: ${orderId}`);
            break;

        case "CANCELED":
            await handlePaymentCanceled(paymentKey, orderId, data.cancelReason);
            break;

        case "PARTIAL_CANCELED":
            await handlePartialCanceled(paymentKey, orderId, data.cancelAmount);
            break;

        case "ABORTED":
            await handlePaymentAborted(paymentKey, orderId);
            break;

        case "EXPIRED":
            await handlePaymentExpired(paymentKey, orderId);
            break;

        default:
            console.log(`[WEBHOOK] Status: ${status} for order: ${orderId}`);
    }
}

// 가상계좌 입금 완료 핸들러
async function handleDepositCallback(data: TossWebhookEvent["data"]) {
    const { paymentKey, orderId, status } = data;

    if (status === "DONE") {
        // 구매 상태 업데이트
        await supabaseAdmin
            .from("purchases")
            .update({
                status: "completed",
                updated_at: new Date().toISOString(),
            })
            .eq("toss_order_id", orderId);

        console.log(`[WEBHOOK] Virtual account deposit completed: ${orderId}`);
    }
}

// 결제 취소 처리
async function handlePaymentCanceled(
    paymentKey: string,
    orderId: string,
    cancelReason?: string
) {
    // 구매 기록에서 찾기
    const { data: purchase } = await supabaseAdmin
        .from("purchases")
        .select("*")
        .eq("toss_payment_key", paymentKey)
        .single();

    if (purchase) {
        // 구매 상태 업데이트
        await supabaseAdmin
            .from("purchases")
            .update({
                status: "refunded",
                updated_at: new Date().toISOString(),
            })
            .eq("id", purchase.id);

        // 콘텐츠 접근 권한 취소
        await supabaseAdmin
            .from("user_contents")
            .delete()
            .eq("user_id", purchase.user_id)
            .eq("content_id", purchase.content_id)
            .eq("access_type", "purchased");

        console.log(`[WEBHOOK] Purchase canceled: ${orderId}, reason: ${cancelReason}`);
        return;
    }

    // 구독 취소 확인
    const { data: subscription } = await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq("toss_payment_key", paymentKey)
        .single();

    if (subscription) {
        await supabaseAdmin
            .from("subscriptions")
            .update({
                status: "canceled",
                updated_at: new Date().toISOString(),
            })
            .eq("id", subscription.id);

        console.log(`[WEBHOOK] Subscription canceled: ${orderId}`);
    }
}

// 부분 취소 처리
async function handlePartialCanceled(
    paymentKey: string,
    orderId: string,
    cancelAmount?: number
) {
    await supabaseAdmin
        .from("purchases")
        .update({
            status: "partially_refunded",
            updated_at: new Date().toISOString(),
        })
        .eq("toss_payment_key", paymentKey);

    console.log(`[WEBHOOK] Partial cancel: ${orderId}, amount: ${cancelAmount}`);
}

// 결제 중단 처리
async function handlePaymentAborted(paymentKey: string, orderId: string) {
    await supabaseAdmin
        .from("purchases")
        .update({
            status: "aborted",
            updated_at: new Date().toISOString(),
        })
        .eq("toss_payment_key", paymentKey);

    console.log(`[WEBHOOK] Payment aborted: ${orderId}`);
}

// 결제 만료 처리
async function handlePaymentExpired(paymentKey: string, orderId: string) {
    await supabaseAdmin
        .from("purchases")
        .update({
            status: "expired",
            updated_at: new Date().toISOString(),
        })
        .eq("toss_payment_key", paymentKey);

    console.log(`[WEBHOOK] Payment expired: ${orderId}`);
}
