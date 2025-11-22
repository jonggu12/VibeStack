"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useState } from "react";
import { TossPaymentModal } from "@/components/checkout/toss-payment-modal";

export const PricingCard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Pro Plan</CardTitle>
                    <CardDescription>개인 개발자를 위한 무제한 액세스</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold mb-4">₩15,000<span className="text-sm font-normal text-muted-foreground">/월</span></div>
                    <ul className="space-y-2">
                        <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-primary" />
                            <span>모든 문서, 튜토리얼, 스니펫 접근</span>
                        </li>
                        <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-primary" />
                            <span>새로운 콘텐츠 우선 접근</span>
                        </li>
                        <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-primary" />
                            <span>AI 에러 클리닉 무제한</span>
                        </li>
                        <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-primary" />
                            <span>프로젝트 맵 기능</span>
                        </li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => setIsModalOpen(true)}>
                        Upgrade to Pro
                    </Button>
                </CardFooter>
            </Card>

            <TossPaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultPlan="pro"
            />
        </>
    );
};
