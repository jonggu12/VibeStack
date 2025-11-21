import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const settingsUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: `${settingsUrl}/success`,
            cancel_url: `${settingsUrl}/canceled`,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            metadata: {
                userId,
            },
        });

        return NextResponse.json({ url: stripeSession.url });
    } catch (error) {
        console.log("[STRIPE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
