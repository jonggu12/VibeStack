import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { TOSS_PRICING, generateOrderId, generateCustomerKey, TossPlanType } from "@/lib/toss-payments";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const {
            plan = "pro" as TossPlanType,  // "pro" | "team" | "single"
            contentId,                      // 단건 구매 시 콘텐츠 ID
            contentTitle,                   // 단건 구매 시 콘텐츠 이름
        } = body;

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

        if (!clientKey) {
            return new NextResponse("Toss Payments not configured", { status: 500 });
        }

        // 주문 정보 생성
        const orderId = generateOrderId();
        const customerKey = generateCustomerKey(userId);

        // 단건 구매
        if (plan === "single" && contentId) {
            const paymentData = {
                clientKey,
                orderId,
                orderName: contentTitle || "콘텐츠 단건 구매",
                amount: TOSS_PRICING.single.amount,
                customerKey,
                customerName: user.firstName || user.emailAddresses[0].emailAddress.split('@')[0],
                customerEmail: user.emailAddresses[0].emailAddress,
                successUrl: `${baseUrl}/api/toss/confirm?orderId=${orderId}&contentId=${contentId}&plan=single&userId=${userId}`,
                failUrl: `${baseUrl}/checkout/fail?orderId=${orderId}`,
                metadata: {
                    userId,
                    contentId,
                    plan: "single",
                },
            };

            return NextResponse.json(paymentData);
        }

        // 구독 결제 (Pro/Team)
        const pricing = TOSS_PRICING[plan as keyof typeof TOSS_PRICING];

        if (!pricing) {
            return new NextResponse("Invalid plan", { status: 400 });
        }

        const paymentData = {
            clientKey,
            orderId,
            orderName: pricing.name,
            amount: pricing.amount,
            customerKey,
            customerName: user.firstName || user.emailAddresses[0].emailAddress.split('@')[0],
            customerEmail: user.emailAddresses[0].emailAddress,
            successUrl: `${baseUrl}/api/toss/confirm?orderId=${orderId}&plan=${plan}&userId=${userId}`,
            failUrl: `${baseUrl}/checkout/fail?orderId=${orderId}`,
            // 정기결제를 위한 빌링 설정
            flowMode: "DIRECT",
            easyPay: "토스페이",
            metadata: {
                userId,
                plan,
            },
        };

        return NextResponse.json(paymentData);
    } catch (error) {
        console.error("[TOSS_CHECKOUT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
