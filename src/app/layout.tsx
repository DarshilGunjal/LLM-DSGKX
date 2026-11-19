import type { Metadata } from "next";
import "./globals.css";
import MagneticCursor from "@/components/MagneticCursor";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "DSGKX // The Mechanics of Synthetic Cognition — Swiss Neo-Brutalist LLM Explorer",
  description:
    "An interactive, first-principles exploration of Large Language Models by DSGKX: BPE tokenization, high-dimensional vector embeddings, multi-head attention matrices, and temperature sampling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/dsgkx-logo.jpg" />
      </head>
      <body className="bg-[#0B0B0C] text-[#F2EFE9] antialiased min-h-screen selection:bg-[#FF3B00] selection:text-[#0B0B0C]">
        <div className="noise-overlay" />
        <MagneticCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
