import { PricingCard } from "@/components/checkout/pricing-card";

export default function PricingPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    Simple Pricing
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                    Choose the plan that fits your needs.
                </p>
            </div>
            <PricingCard />
        </div>
    );
}
