import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// 정기결제 취소 (구독 해지)
export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { reason, immediately = false } = body;

        // 사용자의 활성 구독 조회
        const { data: subscription, error: fetchError } = await supabaseAdmin
            .from("subscriptions")
            .select("*")
            .eq("user_id", userId)
            .eq("status", "active")
            .single();

        if (fetchError || !subscription) {
            return new NextResponse("Active subscription not found", { status: 404 });
        }

        if (immediately) {
            // 즉시 해지: 빌링키 삭제 및 상태 변경
            if (subscription.toss_billing_key) {
                const secretKey = process.env.TOSS_SECRET_KEY;
                if (secretKey) {
                    const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64');

                    // 토스페이먼츠 빌링키 삭제 API 호출
                    await fetch(
                        `https://api.tosspayments.com/v1/billing/authorizations/${subscription.toss_billing_key}`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: `Basic ${encryptedSecretKey}`,
                            },
                        }
                    );
                }
            }

            await supabaseAdmin
                .from("subscriptions")
                .update({
                    status: "canceled",
                    toss_billing_key: null,
                    canceled_at: new Date().toISOString(),
                    cancel_reason: reason || "사용자 요청",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", subscription.id);

            console.log(`[SUBSCRIPTION_CANCELED] user=${userId}, immediately=true`);
        } else {
            // 기간 만료 후 해지: cancel_at_period_end 설정
            await supabaseAdmin
                .from("subscriptions")
                .update({
                    cancel_at_period_end: true,
                    cancel_reason: reason || "사용자 요청",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", subscription.id);

            console.log(`[SUBSCRIPTION_CANCEL_SCHEDULED] user=${userId}, endDate=${subscription.current_period_end}`);
        }

        return NextResponse.json({
            success: true,
            canceledImmediately: immediately,
            periodEnd: subscription.current_period_end,
        });
    } catch (error) {
        console.error("[BILLING_CANCEL_ERROR]", error);
        return new NextResponse(
            error instanceof Error ? error.message : "Internal Error",
            { status: 500 }
        );
    }
}
