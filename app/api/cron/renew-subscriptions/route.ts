import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { billingPayment, generateOrderId, TOSS_PRICING, TossPlanType } from "@/lib/toss-payments";

// Vercel Cron 또는 외부 Cron 서비스에서 호출
// 매일 00:00 UTC에 실행 권장
export async function GET(req: Request) {
    try {
        // Vercel Cron 인증 확인
        const authHeader = req.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        // 개발 환경이 아닌 경우 인증 필수
        if (process.env.NODE_ENV === "production" && cronSecret) {
            if (authHeader !== `Bearer ${cronSecret}`) {
                return new NextResponse("Unauthorized", { status: 401 });
            }
        }

        // 오늘 만료되는 구독 조회
        const today = new Date();
        const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const todayEnd = new Date(today.setHours(23, 59, 59, 999)).toISOString();

        const { data: expiringSubscriptions, error: fetchError } = await supabaseAdmin
            .from("subscriptions")
            .select("*")
            .eq("status", "active")
            .eq("cancel_at_period_end", false)
            .gte("current_period_end", todayStart)
            .lte("current_period_end", todayEnd)
            .not("toss_billing_key", "is", null);

        if (fetchError) {
            console.error("[CRON_FETCH_ERROR]", fetchError);
            return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
        }

        if (!expiringSubscriptions || expiringSubscriptions.length === 0) {
            console.log("[CRON] No subscriptions to renew today");
            return NextResponse.json({ renewed: 0, failed: 0, total: 0 });
        }

        console.log(`[CRON] Found ${expiringSubscriptions.length} subscriptions to renew`);

        let renewed = 0;
        let failed = 0;
        const results: { userId: string; success: boolean; error?: string }[] = [];

        for (const subscription of expiringSubscriptions) {
            try {
                const plan = subscription.plan_type as TossPlanType;
                const pricing = TOSS_PRICING[plan];
                const orderId = generateOrderId();

                // 정기결제 실행
                const paymentResult = await billingPayment(
                    subscription.toss_billing_key,
                    subscription.toss_customer_key,
                    pricing.amount,
                    orderId,
                    `${pricing.name} 정기구독 갱신`
                );

                if (paymentResult.status === "DONE") {
                    // 성공: 기간 갱신
                    const nextMonth = new Date();
                    nextMonth.setMonth(nextMonth.getMonth() + 1);

                    await supabaseAdmin
                        .from("subscriptions")
                        .update({
                            toss_payment_key: paymentResult.paymentKey,
                            toss_order_id: orderId,
                            current_period_start: new Date().toISOString(),
                            current_period_end: nextMonth.toISOString(),
                            updated_at: new Date().toISOString(),
                        })
                        .eq("id", subscription.id);

                    renewed++;
                    results.push({ userId: subscription.user_id, success: true });
                    console.log(`[CRON_RENEW_SUCCESS] subscription=${subscription.id}`);
                } else {
                    throw new Error(`Payment status: ${paymentResult.status}`);
                }
            } catch (err) {
                // 실패: past_due 상태로 변경
                await supabaseAdmin
                    .from("subscriptions")
                    .update({
                        status: "past_due",
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", subscription.id);

                failed++;
                const errorMessage = err instanceof Error ? err.message : "Unknown error";
                results.push({ userId: subscription.user_id, success: false, error: errorMessage });
                console.error(`[CRON_RENEW_FAILED] subscription=${subscription.id}`, err);
            }
        }

        console.log(`[CRON] Completed: renewed=${renewed}, failed=${failed}`);

        return NextResponse.json({
            renewed,
            failed,
            total: expiringSubscriptions.length,
            results,
        });
    } catch (error) {
        console.error("[CRON_ERROR]", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Error" },
            { status: 500 }
        );
    }
}
