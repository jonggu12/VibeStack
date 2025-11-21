import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        // TODO: Update user subscription in database
        // const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        console.log("Payment successful for user:", session.metadata?.userId);
    }

    if (event.type === "invoice.payment_succeeded") {
        // TODO: Handle recurring payment success
        // const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        console.log("Recurring payment successful for user:", session.metadata?.userId);
    }

    return new NextResponse(null, { status: 200 });
}
