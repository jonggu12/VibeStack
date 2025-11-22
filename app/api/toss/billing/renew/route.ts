import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { billingPayment, generateOrderId, TOSS_PRICING, TossPlanType } from "@/lib/toss-payments";

// 정기결제 갱신 (Cron Job 또는 내부 호출용)
// 이 API는 서버에서만 호출되어야 함 (API Key 인증 필요)
export async function POST(req: Request) {
    try {
        // API Key 인증 (내부 서비스 호출용)
        const authHeader = req.headers.get("authorization");
        const expectedKey = process.env.INTERNAL_API_KEY;

        if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { userId, subscriptionId } = body;

        // 구독 정보 조회
        let query = supabaseAdmin
            .from("subscriptions")
            .select("*")
            .eq("status", "active");

        if (subscriptionId) {
            query = query.eq("id", subscriptionId);
        } else if (userId) {
            query = query.eq("user_id", userId);
        } else {
            return new NextResponse("userId or subscriptionId required", { status: 400 });
        }

        const { data: subscription, error: fetchError } = await query.single();

        if (fetchError || !subscription) {
            return new NextResponse("Subscription not found", { status: 404 });
        }

        if (!subscription.toss_billing_key || !subscription.toss_customer_key) {
            return new NextResponse("No billing key found", { status: 400 });
        }

        // 정기결제 실행
        const plan = subscription.plan_type as TossPlanType;
        const pricing = TOSS_PRICING[plan];
        const orderId = generateOrderId();

        const paymentResult = await billingPayment(
            subscription.toss_billing_key,
            subscription.toss_customer_key,
            pricing.amount,
            orderId,
            `${pricing.name} 정기구독 갱신`
        );

        if (paymentResult.status !== "DONE") {
            // 결제 실패 시 상태 업데이트
            await supabaseAdmin
                .from("subscriptions")
                .update({
                    status: "past_due",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", subscription.id);

            console.error(`[RENEWAL_FAILED] subscription=${subscription.id}, status=${paymentResult.status}`);
            return NextResponse.json({ success: false, status: paymentResult.status }, { status: 400 });
        }

        // 결제 성공 시 기간 갱신
        const now = new Date();
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        await supabaseAdmin
            .from("subscriptions")
            .update({
                toss_payment_key: paymentResult.paymentKey,
                toss_order_id: orderId,
                status: "active",
                current_period_start: now.toISOString(),
                current_period_end: nextMonth.toISOString(),
                updated_at: now.toISOString(),
            })
            .eq("id", subscription.id);

        console.log(`[RENEWAL_SUCCESS] subscription=${subscription.id}, orderId=${orderId}`);

        return NextResponse.json({
            success: true,
            orderId,
            paymentKey: paymentResult.paymentKey,
            nextPeriodEnd: nextMonth.toISOString(),
        });
    } catch (error) {
        console.error("[BILLING_RENEW_ERROR]", error);
        return new NextResponse(
            error instanceof Error ? error.message : "Internal Error",
            { status: 500 }
        );
    }
}
