import type { Metadata } from "next";
import { ClerkClientProvider } from "@/components/providers/clerk-provider";
import { OnboardingProvider } from "@/components/providers/onboarding-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeStack",
  description: "AI-era developer learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkClientProvider>
          <OnboardingProvider>
            {children}
          </OnboardingProvider>
        </ClerkClientProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
