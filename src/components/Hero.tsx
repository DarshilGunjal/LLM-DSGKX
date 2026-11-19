"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import TensorCore3D from "./TensorCore3D";

const LIVE_STREAM_TOKENS = [
  { text: "In", p: "99.2%" },
  { text: " the", p: "98.4%" },
  { text: " latent", p: "91.8%" },
  { text: " geometry", p: "89.4%" },
  { text: " of", p: "99.1%" },
  { text: " high", p: "95.6%" },
  { text: " dimensions,", p: "88.2%" },
  { text: " attention", p: "97.5%" },
  { text: " synthesizes", p: "84.3%" },
  { text: " human", p: "92.0%" },
  { text: " intelligence.", p: "96.7%" },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [activeTokenIdx, setActiveTokenIdx] = useState<number>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.0, ease: "power3.out", delay: 0.1 }
        );
      }

      gsap.fromTo(
        ".hero-fade",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.3 }
      );
    }, containerRef);

    // Dynamic streaming ticker
    const interval = setInterval(() => {
      setActiveTokenIdx((prev) => (prev + 1) % LIVE_STREAM_TOKENS.length);
    }, 1200);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col justify-between pt-8 pb-16 px-4 md:px-8 border-b border-[#F2EFE9]/15 swiss-grid select-none"
    >
      {/* Top Swiss Metadata Strip with DSGKX Branding */}
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs text-[#F2EFE9]/50 border-b border-[#F2EFE9]/15 pb-4 mb-8 hero-fade">
        <div className="flex items-center gap-3">
          <div className="relative w-6 h-6 border border-[#FF3B00] overflow-hidden bg-black flex-shrink-0">
            <Image
              src="/dsgkx-logo.jpg"
              alt="DSGKX"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <span className="text-[#FF3B00] font-bold">[DSGKX_RESEARCH]</span>
          <span>// VOL. 01 — FIRST-PRINCIPLES NEURAL EXPLORER</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px]">
          <span>CONTEXT_LEN: 128K</span>
          <span>VOCAB: 50,257 BPE</span>
          <span>LATENT_DIM: 4096</span>
          <span className="text-[#FF3B00] font-bold">DSGKX // DECODER_ONLY</span>
        </div>
      </div>

      {/* Main Hero Grid */}
      <div className="max-w-7xl mx-auto w-full mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          {/* Headline & Overview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF3B00] tracking-widest uppercase hero-fade">
              <span className="w-2 h-2 bg-[#FF3B00] animate-pulse" />
              <span>[ AN EXECUTABLE SYSTEM SPECIFICATION BY DSGKX ]</span>
            </div>

            <h1
              ref={headlineRef}
              className="text-5xl sm:text-7xl lg:text-8xl text-[#F2EFE9] font-instrument leading-[0.92] tracking-tight italic"
            >
              The Mechanics of{" "}
              <span className="text-[#FF3B00] block sm:inline">
                Synthetic Cognition.
              </span>
            </h1>

            <p className="pt-2 max-w-2xl font-mono text-sm sm:text-base text-[#F2EFE9]/75 leading-relaxed hero-fade">
              Large Language Models do not possess conscious intent. They are high-dimensional geometric prediction engines: mapping raw UTF-8 bytes into vector topologies, projecting multi-head attention rays, and sampling probability distributions.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 hero-fade">
              <a
                href="#game-next-token"
                data-cursor="PLAY"
                className="px-5 py-3 text-xs font-mono font-bold tracking-wider uppercase bg-[#FF3B00] text-[#0B0B0C] border border-[#FF3B00] hover:bg-[#0B0B0C] hover:text-[#FF3B00] transition-colors flex items-center gap-2"
              >
                <span>ENTER PREDICTOR ARENA</span>
                <span>↗</span>
              </a>
              <a
                href="#architecture"
                data-cursor="FLOW"
                className="px-5 py-3 text-xs font-mono border border-[#F2EFE9]/30 text-[#F2EFE9] hover:border-[#FF3B00] hover:text-[#FF3B00] transition-colors flex items-center gap-2"
              >
                <span>EXPLORE 8-STAGE PIPELINE</span>
                <span>↓</span>
              </a>
            </div>
          </div>

          {/* Right Column: Equation Card (5 cols) */}
          <div className="lg:col-span-5 border border-[#F2EFE9]/20 bg-[#0B0B0C] p-6 relative hero-fade swiss-grid shadow-[0_0_40px_rgba(255,59,0,0.08)]">
            {/* Corner Crosshairs */}
            <span className="absolute -top-2 -left-2 text-[#FF3B00] font-mono text-xs">+</span>
            <span className="absolute -top-2 -right-2 text-[#FF3B00] font-mono text-xs">+</span>
            <span className="absolute -bottom-2 -left-2 text-[#FF3B00] font-mono text-xs">+</span>
            <span className="absolute -bottom-2 -right-2 text-[#FF3B00] font-mono text-xs">+</span>

            <div className="text-[10px] font-mono uppercase text-[#F2EFE9]/40 tracking-wider mb-2 border-b border-[#F2EFE9]/10 pb-2 flex justify-between">
              <span>CORE_ATTENTION_EQ</span>
              <span className="text-[#FF3B00]">EQUATION (1)</span>
            </div>

            <div className="font-mono text-xs sm:text-sm text-[#F2EFE9] bg-[#F2EFE9]/5 p-3 border-l-2 border-[#FF3B00] my-3">
              Attention(Q, K, V) = softmax(Q·Kᵀ / √dₖ) · V
            </div>

            <div className="space-y-2 text-[11px] font-mono text-[#F2EFE9]/60">
              <div className="flex justify-between">
                <span>QUERY (Q)</span>
                <span className="text-[#F2EFE9]">What this token seeks</span>
              </div>
              <div className="flex justify-between">
                <span>KEY (K)</span>
                <span className="text-[#F2EFE9]">What this token holds</span>
              </div>
              <div className="flex justify-between">
                <span>VALUE (V)</span>
                <span className="text-[#F2EFE9]">Information transmitted</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F2EFE9]/10 text-[10px] font-mono text-[#F2EFE9]/40 flex justify-between items-center">
              <span>LATENCY: 0.14MS</span>
              <span className="text-[#FF3B00] font-bold">DSGKX ENGINE // 70B</span>
            </div>
          </div>
        </div>

        {/* Centerpiece: Interactive 3D Neural Tensor Core */}
        <div className="w-full hero-fade">
          <TensorCore3D />
        </div>
      </div>

      {/* Bottom Live Streaming Ribbon with Active Token Highlighter */}
      <div className="max-w-7xl mx-auto w-full pt-4 border-t border-[#F2EFE9]/15 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#F2EFE9]/60 hero-fade">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="w-2 h-2 bg-[#FF3B00] inline-block animate-ping flex-shrink-0" />
          <span className="text-[#F2EFE9] font-bold flex-shrink-0">AUTOREGRESSIVE_STREAM:</span>
          <div className="flex items-center gap-1 font-mono text-xs">
            {LIVE_STREAM_TOKENS.map((item, idx) => {
              const isCurrent = idx === activeTokenIdx;
              return (
                <span
                  key={idx}
                  className={`px-1.5 py-0.5 border transition-all ${
                    isCurrent
                      ? "border-[#FF3B00] bg-[#FF3B00] text-[#0B0B0C] font-bold"
                      : "border-transparent text-[#F2EFE9]/60"
                  }`}
                >
                  {item.text}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-6 text-[11px]">
          <span>TEMPERATURE: T = 0.70</span>
          <span>P(token|context) = {LIVE_STREAM_TOKENS[activeTokenIdx].p}</span>
          <span className="text-[#FF3B00]">CROSS_ENTROPY: 0.124 NATS</span>
        </div>
      </div>
    </section>
  );
}
