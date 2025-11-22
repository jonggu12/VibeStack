import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { TOSS_PRICING, TossPlanType, billingPayment, generateOrderId } from "@/lib/toss-payments";

// 빌링키 발급 성공 후 콜백 처리
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const authKey = searchParams.get("authKey");
    const customerKey = searchParams.get("customerKey");
    const plan = searchParams.get("plan") as TossPlanType;
    const userId = searchParams.get("userId");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!authKey || !customerKey || !plan || !userId || !secretKey) {
        return NextResponse.redirect(
            `${baseUrl}/checkout/fail?message=missing_billing_parameters`
        );
    }

    try {
        // 1. 빌링키 발급 확정 (authKey -> billingKey)
        const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64');

        const billingKeyResponse = await fetch(
            "https://api.tosspayments.com/v1/billing/authorizations/issue",
            {
                method: "POST",
                headers: {
                    Authorization: `Basic ${encryptedSecretKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    authKey,
                    customerKey,
                }),
            }
        );

        if (!billingKeyResponse.ok) {
            const error = await billingKeyResponse.json();
            console.error("[BILLING_KEY_ISSUE_ERROR]", error);
            return NextResponse.redirect(
                `${baseUrl}/checkout/fail?message=${encodeURIComponent(error.message || "billing_key_issue_failed")}`
            );
        }

        const billingKeyData = await billingKeyResponse.json();
        const { billingKey, card } = billingKeyData;

        console.log("[BILLING_KEY_ISSUED]", { billingKey, customerKey });

        // 2. 첫 번째 정기결제 실행
        const pricing = TOSS_PRICING[plan];
        const orderId = generateOrderId();

        const paymentResult = await billingPayment(
            billingKey,
            customerKey,
            pricing.amount,
            orderId,
            `${pricing.name} 정기구독`
        );

        if (paymentResult.status !== "DONE") {
            return NextResponse.redirect(
                `${baseUrl}/checkout/fail?message=initial_payment_failed&status=${paymentResult.status}`
            );
        }

        // 3. 구독 정보 저장
        const now = new Date();
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const { error: subscriptionError } = await supabaseAdmin
            .from("subscriptions")
            .upsert({
                user_id: userId,
                toss_billing_key: billingKey,
                toss_customer_key: customerKey,
                toss_payment_key: paymentResult.paymentKey,
                toss_order_id: orderId,
                plan_type: plan,
                status: "active",
                payment_provider: "toss",
                currency: "krw",
                current_period_start: now.toISOString(),
                current_period_end: nextMonth.toISOString(),
                card_last_four: card?.number?.slice(-4) || null,
                card_brand: card?.cardType || null,
                updated_at: now.toISOString(),
            }, {
                onConflict: "user_id",
            });

        if (subscriptionError) {
            console.error("[SUBSCRIPTION_SAVE_ERROR]", subscriptionError);
            // 결제는 성공했으므로 DB 에러는 로그만 남기고 성공 처리
        }

        console.log(`[SUBSCRIPTION_ACTIVATED] user=${userId}, plan=${plan}, billingKey=${billingKey}`);

        return NextResponse.redirect(
            `${baseUrl}/checkout/success?orderId=${orderId}&plan=${plan}&type=subscription`
        );
    } catch (error) {
        console.error("[BILLING_SUCCESS_ERROR]", error);
        const message = error instanceof Error ? error.message : "unknown_error";
        return NextResponse.redirect(
            `${baseUrl}/checkout/fail?message=${encodeURIComponent(message)}`
        );
    }
}
