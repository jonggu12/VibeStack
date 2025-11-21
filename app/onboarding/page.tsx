"use client";

import { OnboardingStepper } from "@/components/onboarding/onboarding-stepper";
import { ProjectSelection } from "@/components/onboarding/project-selection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";

const steps = [
    { id: 1, title: "Project Type" },
    { id: 2, title: "Configuration" },
    { id: 3, title: "Review" },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedProject, setSelectedProject] = useState<string | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep((prev) => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create New Project</h1>
                    <p className="mt-2 text-gray-600">Let's get your new project set up in minutes.</p>
                </div>

                <OnboardingStepper steps={steps} currentStep={currentStep} />

                <div className="mt-8">
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-semibold">Select Project Type</h2>
                                <p className="text-sm text-muted-foreground">Choose the foundation for your new application.</p>
                            </div>
                            <ProjectSelection selectedId={selectedProject} onSelect={setSelectedProject} />
                        </div>
                    )}

                    {currentStep === 2 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Configuration</CardTitle>
                                <CardDescription>Configure your project settings.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="p-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                                    Configuration options will go here.
                                    <br />
                                    (Selected: {selectedProject})
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {currentStep === 3 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Review & Create</CardTitle>
                                <CardDescription>Review your choices before creating the project.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-medium">Project Type</span>
                                    <span className="text-muted-foreground capitalize">{selectedProject}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="font-medium">Environment</span>
                                    <span className="text-muted-foreground">Production</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="flex justify-between pt-6">
                    <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}>
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={(currentStep === 1 && !selectedProject) || isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : currentStep === steps.length ? "Create Project" : "Next"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
