import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateOrderId, generateCustomerKey, TOSS_PRICING, TossPlanType } from "@/lib/toss-payments";

// 빌링키 발급을 위한 인증 URL 생성
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { plan = "pro" as TossPlanType } = body;

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

        if (!clientKey) {
            return new NextResponse("Toss Payments not configured", { status: 500 });
        }

        const pricing = TOSS_PRICING[plan as keyof typeof TOSS_PRICING];
        if (!pricing || plan === "single") {
            return new NextResponse("Invalid plan for subscription", { status: 400 });
        }

        const customerKey = generateCustomerKey(userId);
        const orderId = generateOrderId();

        // 빌링키 발급을 위한 결제 정보
        const billingData = {
            clientKey,
            customerKey,
            orderId,
            orderName: `${pricing.name} 정기구독`,
            amount: pricing.amount,
            customerEmail: user.emailAddresses[0].emailAddress,
            customerName: user.firstName || user.emailAddresses[0].emailAddress.split('@')[0],
            // 빌링키 발급 후 성공/실패 URL
            successUrl: `${baseUrl}/api/toss/billing/success?plan=${plan}&userId=${userId}`,
            failUrl: `${baseUrl}/checkout/fail?orderId=${orderId}&type=billing`,
        };

        return NextResponse.json(billingData);
    } catch (error) {
        console.error("[TOSS_BILLING_ISSUE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
