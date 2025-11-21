"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
    id: number;
    title: string;
}

interface OnboardingStepperProps {
    steps: Step[];
    currentStep: number;
}

export function OnboardingStepper({ steps, currentStep }: OnboardingStepperProps) {
    return (
        <div className="relative flex justify-between w-full max-w-2xl mx-auto mb-8">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -z-10 -translate-y-1/2" />
            <div
                className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-300"
                style={{
                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
            />

            {steps.map((step) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;

                return (
                    <div key={step.id} className="flex flex-col items-center bg-background px-2">
                        <div
                            className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-300",
                                isCompleted
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : isCurrent
                                        ? "border-primary text-primary"
                                        : "border-muted text-muted-foreground bg-background"
                            )}
                        >
                            {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-sm font-medium">{step.id}</span>}
                        </div>
                        <span
                            className={cn(
                                "mt-2 text-xs font-medium transition-colors duration-300",
                                isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {step.title}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
