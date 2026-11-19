"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [timeStr, setTimeStr] = useState<string>("00:00:00 UTC");
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toISOString().substring(11, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio procedural futuristic click sound
  const playClickSound = () => {
    if (!sfxEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // AudioContext policy fallback
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B0C]/90 backdrop-blur-md border-b border-[#F2EFE9]/15 select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Brand Label with DSGKX Official Logo */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            data-cursor="DSGKX"
            onClick={playClickSound}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-8 h-8 border border-[#FF3B00] bg-black overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src="/dsgkx-logo.jpg"
                alt="DSGKX Logo"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <span className="font-mono text-sm font-bold text-[#F2EFE9] tracking-wider uppercase group-hover:text-[#FF3B00] transition-colors">
              DSGKX // LLM_MECHANICS
            </span>
          </a>

          <span className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-mono border border-[#F2EFE9]/20 text-[#F2EFE9]/60">
            VASWANI_2017
          </span>
        </div>

        {/* Technical Nav Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-mono text-[#F2EFE9]/70">
          <a
            href="#architecture"
            data-cursor="READ"
            onClick={playClickSound}
            className="hover:text-[#FF3B00] transition-colors"
          >
            [01] ARCHITECTURE
          </a>
          <a
            href="#game-next-token"
            data-cursor="PLAY"
            onClick={playClickSound}
            className="hover:text-[#FF3B00] transition-colors"
          >
            [02] TOKEN ARENA
          </a>
          <a
            href="#game-bpe"
            data-cursor="TRY"
            onClick={playClickSound}
            className="hover:text-[#FF3B00] transition-colors"
          >
            [03] BPE SLICER
          </a>
          <a
            href="#game-attention"
            data-cursor="EXPLORE"
            onClick={playClickSound}
            className="hover:text-[#FF3B00] transition-colors"
          >
            [04] ATTENTION MATRIX
          </a>
          <a
            href="#game-vector"
            data-cursor="VECTOR"
            onClick={playClickSound}
            className="hover:text-[#FF3B00] transition-colors"
          >
            [05] 3D LATENT
          </a>
          <a
            href="#game-thermostat"
            data-cursor="TUNE"
            onClick={playClickSound}
            className="hover:text-[#FF3B00] transition-colors"
          >
            [06] THERMOSTAT
          </a>
        </nav>

        {/* Telemetry Clock & Audio & CTA */}
        <div className="flex items-center gap-3">
          {/* SFX Toggle */}
          <button
            onClick={() => setSfxEnabled((s) => !s)}
            data-cursor="SFX"
            className="px-2 py-1 text-[10px] font-mono border border-[#F2EFE9]/20 text-[#F2EFE9]/60 hover:border-[#FF3B00] hover:text-[#FF3B00] transition-colors hidden sm:block"
            title="Toggle procedural audio feedback"
          >
            {sfxEnabled ? "♫ SFX: ON" : "♫ SFX: OFF"}
          </button>

          <div className="hidden lg:flex flex-col text-right font-mono text-[10px] text-[#F2EFE9]/40 leading-tight">
            <span>SYS_TIME</span>
            <span className="text-[#F2EFE9]">{timeStr}</span>
          </div>

          <a
            href="#game-next-token"
            data-cursor="PLAY"
            onClick={playClickSound}
            className="px-3.5 py-1.5 text-xs font-mono font-bold tracking-wider uppercase bg-[#FF3B00] text-[#0B0B0C] border border-[#FF3B00] hover:bg-[#0B0B0C] hover:text-[#FF3B00] transition-all duration-150 flex items-center gap-1.5"
          >
            <span>PLAY ARENA</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}
