"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const PricingCard = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onSubscribe = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            const data = await response.json();
            window.location.href = data.url;
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Pro Plan</CardTitle>
                <CardDescription>Unlock all premium features</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold mb-4">$12<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <ul className="space-y-2">
                    <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        <span>Unlimited Projects</span>
                    </li>
                    <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        <span>Premium Tutorials</span>
                    </li>
                    <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        <span>Priority Support</span>
                    </li>
                </ul>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={onSubscribe} disabled={isLoading}>
                    {isLoading ? "Processing..." : "Upgrade to Pro"}
                </Button>
            </CardFooter>
        </Card>
    );
};
