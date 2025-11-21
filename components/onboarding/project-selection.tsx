"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Code2, Globe, LayoutTemplate, Smartphone } from "lucide-react";

interface ProjectType {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}

const projectTypes: ProjectType[] = [
    {
        id: "nextjs",
        title: "Next.js App",
        description: "Full-stack React framework with App Router",
        icon: <Globe className="h-8 w-8 mb-2 text-primary" />,
    },
    {
        id: "vite",
        title: "Vite React",
        description: "Fast, unopinionated React SPA",
        icon: <Code2 className="h-8 w-8 mb-2 text-primary" />,
    },
    {
        id: "mobile",
        title: "React Native",
        description: "Cross-platform mobile application",
        icon: <Smartphone className="h-8 w-8 mb-2 text-primary" />,
    },
    {
        id: "template",
        title: "Template",
        description: "Start from a pre-built template",
        icon: <LayoutTemplate className="h-8 w-8 mb-2 text-primary" />,
    },
];

interface ProjectSelectionProps {
    selectedId?: string;
    onSelect: (id: string) => void;
}

export function ProjectSelection({ selectedId, onSelect }: ProjectSelectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectTypes.map((type) => (
                <Card
                    key={type.id}
                    className={cn(
                        "cursor-pointer transition-all hover:border-primary hover:shadow-md",
                        selectedId === type.id ? "border-primary ring-2 ring-primary/20" : ""
                    )}
                    onClick={() => onSelect(type.id)}
                >
                    <CardHeader className="flex flex-col items-center text-center pb-2">
                        {type.icon}
                        <CardTitle className="text-lg">{type.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-muted-foreground">
                        {type.description}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
