"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

interface PreloaderProps {
  onComplete?: () => void;
}

const TELEMETRY_MESSAGES = [
  "BOOT_SEQUENCE // MEMORY_ALLOC: 48GB HBM3",
  "PARSING BPE VOCABULARY // 50,257 TOKENS",
  "PROJECTION TENSOR // EMBEDDING_DIM: 4096",
  "MULTI_HEAD_ATTENTION // 32 HEADS * 128 D_K",
  "WEIGHTS_INITIALIZED // FP16 KV_CACHE READY",
  "SYSTEM_STATUS // DSGKX KERNEL ACTIVE",
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [percent, setPercent] = useState<number>(0);
  const [telemetryIndex, setTelemetryIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isReadyToEnter, setIsReadyToEnter] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const centerBarRef = useRef<HTMLDivElement>(null);
  const hasExitedRef = useRef<boolean>(false);

  const triggerCurtainExit = () => {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsFinished(true);
        if (onComplete) onComplete();
      },
    });

    tl.to(centerBarRef.current, {
      opacity: 0,
      scale: 0.96,
      duration: 0.35,
      ease: "power2.out",
    })
      .to(
        topCurtainRef.current,
        {
          yPercent: -100,
          duration: 0.85,
          ease: "expo.inOut",
        },
        "-=0.1"
      )
      .to(
        bottomCurtainRef.current,
        {
          yPercent: 100,
          duration: 0.85,
          ease: "expo.inOut",
        },
        "<"
      );
  };

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const jump = Math.floor(Math.random() * 9) + 3;
      current = Math.min(100, current + jump);
      setPercent(current);

      const msgIdx = Math.min(
        TELEMETRY_MESSAGES.length - 1,
        Math.floor((current / 100) * TELEMETRY_MESSAGES.length)
      );
      setTelemetryIndex(msgIdx);

      if (current >= 100) {
        clearInterval(interval);
        setIsReadyToEnter(true);
        // Automatically open the curtain after a brief pause
        setTimeout(() => {
          triggerCurtainExit();
        }, 350);
      }
    }, 35);

    return () => clearInterval(interval);
  }, []);

  if (isFinished) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99990] select-none flex flex-col justify-between overflow-hidden"
    >
      {/* Top Half Curtain */}
      <div
        ref={topCurtainRef}
        className="w-full h-1/2 bg-[#0B0B0C] border-b border-[#FF3B00] relative overflow-hidden flex flex-col justify-start p-6 md:p-12 pointer-events-auto swiss-grid"
      >
        <div className="w-full flex justify-between items-center text-xs font-mono tracking-widest text-[#F2EFE9]/40 border-b border-[#F2EFE9]/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#FF3B00] animate-pulse"></span>
            <span className="text-[#F2EFE9] font-bold">DSGKX // TENSOR_KERNEL_V4</span>
          </div>
          <div className="hidden sm:block">SWISS MONO-GRID // REF: 2026.04</div>
          <div className="text-[#FF3B00]">STANDBY FOR COGNITIVE FLOW</div>
        </div>

        <div className="mt-8 font-mono text-[10px] text-[#F2EFE9]/30 uppercase space-y-1 hidden md:block">
          <div>[00] ARCH: DECODER-ONLY TRANSFORMER</div>
          <div>[01] ATTENTION: SCALED DOT-PRODUCT (Q * K^T / SQRT(D))</div>
          <div>[02] LATENT GEOMETRY: NON-EUCLIDEAN HIGH-D EMBEDDING</div>
        </div>
      </div>

      {/* Centerpiece: DSGKX Logo & Numerical Counter */}
      <div
        ref={centerBarRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-auto z-10 px-4"
      >
        <div className="w-full max-w-3xl">
          <div className="border-2 border-[#F2EFE9]/20 bg-[#0B0B0C] p-6 md:p-10 relative swiss-grid shadow-[0_0_50px_rgba(255,59,0,0.15)]">
            {/* Corner registration marks */}
            <span className="absolute -top-3 -left-2 text-[#FF3B00] font-mono text-sm font-bold">+</span>
            <span className="absolute -top-3 -right-2 text-[#FF3B00] font-mono text-sm font-bold">+</span>
            <span className="absolute -bottom-3 -left-2 text-[#FF3B00] font-mono text-sm font-bold">+</span>
            <span className="absolute -bottom-3 -right-2 text-[#FF3B00] font-mono text-sm font-bold">+</span>

            {/* Prominent DSGKX Logo Badge */}
            <div className="flex items-center justify-between border-b border-[#F2EFE9]/15 pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 md:w-20 md:h-20 border border-[#FF3B00] bg-black overflow-hidden flex items-center justify-center">
                  <Image
                    src="/dsgkx-logo.jpg"
                    alt="DSGKX Logo"
                    width={80}
                    height={80}
                    className="object-contain"
                    priority
                  />
                  {/* Laser scanline animation across logo */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF3B00]/30 to-transparent animate-pulse pointer-events-none" />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-mono font-bold text-[#F2EFE9] tracking-wider">
                    DSGKX
                  </div>
                  <div className="text-[10px] font-mono text-[#FF3B00] tracking-widest uppercase">
                    COGNITIVE ARCHITECTURE LABS
                  </div>
                </div>
              </div>

              {/* Status pill */}
              <div className="text-right font-mono text-[11px]">
                <span className="px-2.5 py-1 border border-[#FF3B00] text-[#FF3B00] bg-[#FF3B00]/10 font-bold">
                  {isReadyToEnter ? "READY" : "LOADING"}
                </span>
              </div>
            </div>

            {/* Counter & Telemetry Message */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <div className="text-xs font-mono text-[#FF3B00] tracking-widest uppercase mb-1">
                  [ PIPELINE INITIALIZATION ]
                </div>
                <div className="font-mono text-xs md:text-sm text-[#F2EFE9] h-6 flex items-center">
                  <span className="mr-2 text-[#FF3B00]">&gt;</span>
                  {TELEMETRY_MESSAGES[telemetryIndex]}
                </div>
              </div>

              {/* Numerical Counter */}
              <div className="font-mono font-bold text-5xl md:text-7xl text-[#F2EFE9] tracking-tighter flex items-baseline">
                {String(percent).padStart(3, "0")}
                <span className="text-2xl md:text-3xl text-[#FF3B00] ml-1">%</span>
              </div>
            </div>

            {/* Swiss Progress Bar */}
            <div className="w-full h-2.5 bg-[#F2EFE9]/10 relative overflow-hidden mb-4">
              <div
                className="h-full bg-[#FF3B00] transition-all duration-75 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>

            {/* Interactive Quick-Enter Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#F2EFE9]/50 pt-2 border-t border-[#F2EFE9]/10">
              <span>0x00000000 // SYNCHRONIZING TENSORS // 0xFFFFFFFF</span>
              <button
                onClick={triggerCurtainExit}
                className="px-4 py-1.5 bg-[#FF3B00] text-[#0B0B0C] font-bold text-xs uppercase hover:bg-[#F2EFE9] transition-all flex items-center gap-1.5"
              >
                <span>ENTER DSGKX EXPERIENCE</span>
                <span>↗</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Half Curtain */}
      <div
        ref={bottomCurtainRef}
        className="w-full h-1/2 bg-[#0B0B0C] border-t border-[#FF3B00] relative overflow-hidden flex flex-col justify-end p-6 md:p-12 pointer-events-auto swiss-grid"
      >
        <div className="w-full flex justify-between items-center text-xs font-mono text-[#F2EFE9]/40 border-t border-[#F2EFE9]/10 pt-4">
          <div>LATENCY: 0.14MS // CLOCK: 3.8GHZ</div>
          <div className="text-[#FF3B00] font-bold">DSGKX // ATTENTION IS ALL YOU NEED</div>
        </div>
      </div>
    </div>
  );
}
