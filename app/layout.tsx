import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeStack",
  description: "AI-era developer learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
