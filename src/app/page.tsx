"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HorizontalGallery from "@/components/HorizontalGallery";
import NextTokenRoulette from "@/components/games/NextTokenRoulette";
import BpeTokenizerGame from "@/components/games/BpeTokenizerGame";
import AttentionMixerGame from "@/components/games/AttentionMixerGame";
import LatentSpaceExplorer from "@/components/games/LatentSpaceExplorer";
import TemperatureThermostat from "@/components/games/TemperatureThermostat";
import Footer from "@/components/Footer";

export default function Home() {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#0B0B0C] text-[#F2EFE9] overflow-hidden">
      {/* 0–100% Curtain Preloader */}
      <Preloader onComplete={() => setIsPreloaderDone(true)} />

      {/* Main Experience */}
      <Navbar />
      <Hero />
      <HorizontalGallery />
      <NextTokenRoulette />
      <BpeTokenizerGame />
      <AttentionMixerGame />
      <LatentSpaceExplorer />
      <TemperatureThermostat />
      <Footer />
    </main>
  );
}
