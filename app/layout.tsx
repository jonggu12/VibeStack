import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkClientProvider } from "@/components/providers/clerk-provider";
import { OnboardingProvider } from "@/components/providers/onboarding-provider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

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
    <html lang="ko" className={`${inter.variable} ${jetbrainsMono.variable}`} style={{ backgroundColor: '#09090b' }}>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              background-color: #09090b;
              color: #fafafa;
            }
          `
        }} />
      </head>
      <body className={inter.className} style={{ backgroundColor: '#09090b', color: '#fafafa' }}>
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
