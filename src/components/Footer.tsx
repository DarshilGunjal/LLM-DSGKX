"use client";

import Image from "next/image";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0B0B0C] border-t border-[#F2EFE9]/15 py-16 px-4 md:px-8 font-mono text-xs select-none relative">
      {/* Corner crosshairs */}
      <span className="absolute top-4 left-4 text-[#FF3B00] font-mono">+</span>
      <span className="absolute top-4 right-4 text-[#FF3B00] font-mono">+</span>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Strip */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-[#F2EFE9]/10 pb-12">
          {/* Colophon Title with DSGKX Logo (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 border border-[#FF3B00] bg-black overflow-hidden flex items-center justify-center">
                <Image
                  src="/dsgkx-logo.jpg"
                  alt="DSGKX"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-[#FF3B00] font-bold tracking-wider uppercase">
                [COLOPHON // DSGKX RESEARCH]
              </span>
            </div>

            <h4 className="font-instrument italic text-3xl md:text-4xl text-[#F2EFE9]">
              The Mathematical Architecture of Transformers
            </h4>
            <p className="text-[#F2EFE9]/60 leading-relaxed text-xs">
              Built by DSGKX as an executable creative technologist specification following Swiss Neo-Brutalist principles: pure typography, high-contrast mathematical telemetry, and real-time GPU tensor intuition.
            </p>
          </div>

          {/* Citations & Bibliography (4 cols) */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-[#F2EFE9]/40 text-[10px] uppercase tracking-wider mb-2">
              PRIMARY LITERATURE
            </div>
            <div className="text-[11px] text-[#F2EFE9]/70 space-y-1.5">
              <div>
                <strong className="text-[#F2EFE9]">Vaswani et al. (2017)</strong>
                <br />
                <span className="text-[#F2EFE9]/50">Attention Is All You Need — NeurIPS</span>
              </div>
              <div>
                <strong className="text-[#F2EFE9]">Sennrich et al. (2015)</strong>
                <br />
                <span className="text-[#F2EFE9]/50">Subword Units for Neural MT (BPE) — ACL</span>
              </div>
              <div>
                <strong className="text-[#F2EFE9]">Radford et al. (2019)</strong>
                <br />
                <span className="text-[#F2EFE9]/50">Language Models are Unsupervised Multitask Learners</span>
              </div>
            </div>
          </div>

          {/* Type & Palette Specifications (3 cols) */}
          <div className="md:col-span-3 space-y-2 border-l border-[#F2EFE9]/10 pl-4 md:pl-6">
            <div className="text-[#F2EFE9]/40 text-[10px] uppercase tracking-wider mb-2">
              SWISS DESIGN TOKENS
            </div>
            <div className="space-y-1 text-[11px] text-[#F2EFE9]/70">
              <div className="flex justify-between">
                <span>BRAND:</span>
                <span className="text-[#FF3B00] font-bold">DSGKX</span>
              </div>
              <div className="flex justify-between">
                <span>OBSIDIAN:</span>
                <span className="text-[#F2EFE9] font-bold">#0B0B0C</span>
              </div>
              <div className="flex justify-between">
                <span>PRIMARY INK:</span>
                <span className="text-[#F2EFE9] font-bold">#F2EFE9</span>
              </div>
              <div className="flex justify-between">
                <span>SWISS ACCENT:</span>
                <span className="text-[#FF3B00] font-bold">#FF3B00</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>SERIF:</span>
                <span className="text-[#F2EFE9] italic font-instrument">Instrument Serif</span>
              </div>
              <div className="flex justify-between">
                <span>MONOSPACE:</span>
                <span className="text-[#F2EFE9]">JetBrains Mono</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Utility Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[#F2EFE9]/40 text-[11px]">
          <div>
            © 2026 DSGKX // FIRST-PRINCIPLES NEURAL EXPLORER. ALL RIGHTS RESERVED.
          </div>
          <button
            onClick={scrollToTop}
            data-cursor="TOP"
            className="px-4 py-2 border border-[#F2EFE9]/30 text-[#F2EFE9] hover:border-[#FF3B00] hover:text-[#FF3B00] transition-colors flex items-center gap-2"
          >
            <span>RETURN TO SUMMIT</span>
            <span>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
