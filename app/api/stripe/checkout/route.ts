import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// 지원하는 통화 및 가격 ID 매핑
const PRICE_IDS: Record<string, { pro: string; team: string }> = {
    USD: {
        pro: process.env.STRIPE_PRICE_ID_PRO_USD!,
        team: process.env.STRIPE_PRICE_ID_TEAM_USD!,
    },
    KRW: {
        pro: process.env.STRIPE_PRICE_ID_PRO_KRW!,
        team: process.env.STRIPE_PRICE_ID_TEAM_KRW!,
    },
    EUR: {
        pro: process.env.STRIPE_PRICE_ID_PRO_EUR!,
        team: process.env.STRIPE_PRICE_ID_TEAM_EUR!,
    },
    JPY: {
        pro: process.env.STRIPE_PRICE_ID_PRO_JPY!,
        team: process.env.STRIPE_PRICE_ID_TEAM_JPY!,
    },
};

// 국가별 결제 수단 매핑
const PAYMENT_METHODS_BY_COUNTRY: Record<string, Stripe.Checkout.SessionCreateParams.PaymentMethodType[]> = {
    KR: ["card", "kakao_pay", "naver_pay", "samsung_pay"],
    US: ["card", "us_bank_account"],
    JP: ["card", "konbini"],
    DE: ["card", "giropay", "sofort"],
    NL: ["card", "ideal"],
    DEFAULT: ["card"],
};

// 기본 결제 수단 (자동 결제 수단 선택 사용 시)
const DEFAULT_PAYMENT_METHODS: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = [
    "card",
    "link", // Stripe Link (원클릭 결제)
];

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const {
            plan = "pro",           // "pro" | "team" | "single"
            currency = "USD",       // "USD" | "KRW" | "EUR" | "JPY"
            country,                // 사용자 국가 코드 (예: "KR", "US")
            contentId,              // 단건 구매 시 콘텐츠 ID
            returnUrl,              // 커스텀 리턴 URL
        } = body;

        const settingsUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const successUrl = returnUrl ? `${settingsUrl}${returnUrl}` : `${settingsUrl}/checkout/success`;
        const cancelUrl = `${settingsUrl}/checkout/canceled`;

        // 단건 구매 모드
        if (plan === "single" && contentId) {
            const singlePurchaseSession = await stripe.checkout.sessions.create({
                success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&content_id=${contentId}`,
                cancel_url: cancelUrl,
                mode: "payment",
                payment_method_types: getPaymentMethods(country),
                billing_address_collection: "auto",
                customer_email: user.emailAddresses[0]!.emailAddress,
                line_items: [
                    {
                        price: process.env.STRIPE_PRICE_ID_SINGLE_CONTENT!,
                        quantity: 1,
                    },
                ],
                metadata: {
                    userId,
                    contentId,
                    purchaseType: "single",
                },
                // Apple Pay, Google Pay 자동 활성화
                payment_method_options: {
                    card: {
                        request_three_d_secure: "automatic",
                    },
                },
                // 자동 세금 계산 (필요 시 활성화)
                // automatic_tax: { enabled: true },
            });

            return NextResponse.json({ url: singlePurchaseSession.url });
        }

        // 구독 모드 (Pro/Team)
        const priceId = getPriceId(plan, currency);

        if (!priceId) {
            return new NextResponse("Invalid plan or currency", { status: 400 });
        }

        // 기존 고객인지 확인
        const existingCustomers = await stripe.customers.list({
            email: user.emailAddresses[0]!.emailAddress,
            limit: 1,
        });

        const customerId = existingCustomers.data[0]?.id;

        const sessionConfig: Stripe.Checkout.SessionCreateParams = {
            success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
            mode: "subscription",
            billing_address_collection: "auto",
            line_items: [
                {
                    price: priceId,
                    quantity: plan === "team" ? 5 : 1, // Team은 5석 기본
                },
            ],
            metadata: {
                userId,
                plan,
                currency,
            },
            // 구독 메타데이터
            subscription_data: {
                metadata: {
                    userId,
                    plan,
                },
            },
            // 무료 체험 (선택사항)
            // subscription_data: {
            //     trial_period_days: 7,
            // },
            // 자동 세금 계산
            // automatic_tax: { enabled: true },
            // 할인 코드 허용
            allow_promotion_codes: true,
            // 청구 주소에서 국가 추론하여 결제 수단 자동 선택
            payment_method_collection: "always",
        };

        // 기존 고객이면 customer ID 사용, 아니면 이메일로 새 고객 생성
        if (customerId) {
            sessionConfig.customer = customerId;
        } else {
            sessionConfig.customer_email = user.emailAddresses[0]!.emailAddress;
        }

        // 국가가 지정된 경우 해당 국가의 결제 수단 사용
        // 지정되지 않은 경우 Stripe가 자동으로 적절한 결제 수단 표시
        if (country && PAYMENT_METHODS_BY_COUNTRY[country]) {
            sessionConfig.payment_method_types = PAYMENT_METHODS_BY_COUNTRY[country];
        }

        const stripeSession = await stripe.checkout.sessions.create(sessionConfig);

        return NextResponse.json({ url: stripeSession.url });
    } catch (error) {
        console.error("[STRIPE_CHECKOUT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

function getPriceId(plan: string, currency: string): string | null {
    const currencyPrices = PRICE_IDS[currency] || PRICE_IDS.USD!;

    if (plan === "pro") return currencyPrices.pro;
    if (plan === "team") return currencyPrices.team;

    return null;
}

function getPaymentMethods(country?: string): Stripe.Checkout.SessionCreateParams.PaymentMethodType[] {
    if (!country) return DEFAULT_PAYMENT_METHODS;
    return PAYMENT_METHODS_BY_COUNTRY[country] || DEFAULT_PAYMENT_METHODS;
}
