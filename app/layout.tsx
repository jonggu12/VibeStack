import type { Metadata } from "next";
import { ClerkClientProvider } from "@/components/providers/clerk-provider";
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
        <ClerkClientProvider>{children}</ClerkClientProvider>
      </body>
    </html>
  );
}
