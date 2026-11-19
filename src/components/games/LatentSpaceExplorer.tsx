"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

interface VectorWord {
  id: string;
  label: string;
  x: number; // 2D projection coordinates inside 640x440 viewBox
  y: number;
  category: "ROYALTY" | "GENDER" | "GEOGRAPHY" | "ANIMALS" | "GRAMMAR";
  dimensions: number[]; // 8-channel simulated latent embedding slice
}

const WORDS: VectorWord[] = [
  // Royalty
  { id: "king", label: "King", x: 220, y: 120, category: "ROYALTY", dimensions: [0.94, -0.88, 0.12, 0.76, 0.45, -0.21, 0.08, 0.82] },
  { id: "queen", label: "Queen", x: 220, y: 270, category: "ROYALTY", dimensions: [0.92, 0.89, 0.14, 0.74, 0.48, -0.19, 0.07, 0.85] },
  { id: "prince", label: "Prince", x: 170, y: 130, category: "ROYALTY", dimensions: [0.78, -0.75, 0.11, 0.72, 0.38, -0.45, 0.09, 0.76] },
  { id: "princess", label: "Princess", x: 170, y: 260, category: "ROYALTY", dimensions: [0.77, 0.79, 0.13, 0.71, 0.41, -0.42, 0.08, 0.79] },

  // Gender / Humanity
  { id: "man", label: "Man", x: 100, y: 120, category: "GENDER", dimensions: [0.12, -0.91, 0.05, 0.75, 0.12, 0.15, 0.05, 0.42] },
  { id: "woman", label: "Woman", x: 100, y: 270, category: "GENDER", dimensions: [0.11, 0.92, 0.06, 0.73, 0.15, 0.17, 0.04, 0.45] },

  // Geography / Capitals
  { id: "paris", label: "Paris", x: 480, y: 110, category: "GEOGRAPHY", dimensions: [0.05, 0.02, 0.95, -0.65, 0.52, 0.68, 0.01, 0.62] },
  { id: "france", label: "France", x: 400, y: 120, category: "GEOGRAPHY", dimensions: [0.06, 0.01, 0.88, -0.62, 0.48, 0.89, 0.02, 0.58] },
  { id: "tokyo", label: "Tokyo", x: 490, y: 270, category: "GEOGRAPHY", dimensions: [0.04, 0.01, 0.94, -0.68, 0.55, 0.72, 0.03, 0.65] },
  { id: "japan", label: "Japan", x: 410, y: 280, category: "GEOGRAPHY", dimensions: [0.05, 0.02, 0.89, -0.64, 0.51, 0.91, 0.02, 0.61] },
  { id: "rome", label: "Rome", x: 550, y: 120, category: "GEOGRAPHY", dimensions: [0.07, 0.03, 0.91, -0.63, 0.50, 0.65, 0.01, 0.60] },
  { id: "italy", label: "Italy", x: 470, y: 130, category: "GEOGRAPHY", dimensions: [0.08, 0.02, 0.85, -0.60, 0.46, 0.86, 0.02, 0.55] },

  // Animals / Maturation
  { id: "puppy", label: "Puppy", x: 200, y: 380, category: "ANIMALS", dimensions: [-0.45, 0.02, -0.32, 0.92, -0.21, -0.78, 0.01, 0.88] },
  { id: "dog", label: "Dog", x: 120, y: 370, category: "ANIMALS", dimensions: [-0.42, 0.03, -0.30, 0.89, -0.18, 0.35, 0.02, 0.79] },
  { id: "kitten", label: "Kitten", x: 360, y: 380, category: "ANIMALS", dimensions: [-0.48, 0.05, -0.28, 0.91, -0.19, -0.81, 0.01, 0.86] },
  { id: "cat", label: "Cat", x: 280, y: 370, category: "ANIMALS", dimensions: [-0.44, 0.04, -0.25, 0.88, -0.15, 0.32, 0.02, 0.77] },

  // Grammar / Verb Tense
  { id: "walk", label: "Walk", x: 350, y: 60, category: "GRAMMAR", dimensions: [-0.12, 0.01, -0.05, 0.35, -0.05, 0.02, -0.92, 0.31] },
  { id: "walked", label: "Walked", x: 430, y: 60, category: "GRAMMAR", dimensions: [-0.11, 0.02, -0.04, 0.34, -0.04, 0.01, 0.94, 0.29] },
  { id: "swim", label: "Swim", x: 350, y: 170, category: "GRAMMAR", dimensions: [-0.15, 0.01, -0.02, 0.42, -0.02, 0.04, -0.90, 0.35] },
  { id: "swam", label: "Swam", x: 430, y: 170, category: "GRAMMAR", dimensions: [-0.14, 0.01, -0.01, 0.41, -0.01, 0.03, 0.95, 0.33] },
];

const PRESET_ANALOGIES = [
  {
    label: "👑 Royalty: King - Man + Woman = Queen",
    a: "king",
    b: "man",
    c: "woman",
    target: "Queen",
  },
  {
    label: "🗼 Capitals: Paris - France + Japan = Tokyo",
    a: "paris",
    b: "france",
    c: "japan",
    target: "Tokyo",
  },
  {
    label: "🐶 Species: Puppy - Dog + Cat = Kitten",
    a: "puppy",
    b: "dog",
    c: "cat",
    target: "Kitten",
  },
  {
    label: "⚡ Tense: Walked - Walk + Swim = Swam",
    a: "walked",
    b: "walk",
    c: "swim",
    target: "Swam",
  },
  {
    label: "🏛️ Geography: Rome - Italy + France = Paris",
    a: "rome",
    b: "italy",
    c: "france",
    target: "Paris",
  },
];

const DIMENSION_NAMES = [
  "dim_042 [Royalty]",
  "dim_118 [Gender]",
  "dim_304 [Geography]",
  "dim_512 [Animacy]",
  "dim_768 [Politeness]",
  "dim_1024 [Scale/Size]",
  "dim_2048 [Tense]",
  "dim_4096 [Sentiment]",
];

export default function LatentSpaceExplorer() {
  const [wordA, setWordA] = useState<string>("king");
  const [wordB, setWordB] = useState<string>("man");
  const [wordC, setWordC] = useState<string>("woman");
  const [hoveredWord, setHoveredWord] = useState<VectorWord | null>(null);

  const [calculatedTarget, setCalculatedTarget] = useState<{ x: number; y: number }>({
    x: 220,
    y: 270,
  });
  const [closestWord, setClosestWord] = useState<string>("Queen");
  const [cosineScore, setCosineScore] = useState<number>(0.96);

  // Challenge Mode State
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [userChallengeChoice, setUserChallengeChoice] = useState<string | null>(null);
  const [challengeScore, setChallengeScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const CHALLENGES = [
    {
      equation: "Vector(Paris) - Vector(France) + Vector(Japan) ≈ ?",
      options: ["Tokyo", "London", "River", "Computer"],
      correct: "Tokyo",
      explanation: "Capital relationship: France is to Paris as Japan is to Tokyo.",
    },
    {
      equation: "Vector(Puppy) - Vector(Dog) + Vector(Cat) ≈ ?",
      options: ["Kitten", "Lion", "Bone", "Fish"],
      correct: "Kitten",
      explanation: "Age-maturity relation: Dog is to Puppy as Cat is to Kitten.",
    },
    {
      equation: "Vector(Walked) - Vector(Walk) + Vector(Swim) ≈ ?",
      options: ["Swam", "Ocean", "Runner", "Fast"],
      correct: "Swam",
      explanation: "Grammatical inflection: Past-tense transformation preserves semantic direction.",
    },
    {
      equation: "Vector(King) - Vector(Man) + Vector(Woman) ≈ ?",
      options: ["Queen", "Princess", "Castle", "Crown"],
      correct: "Queen",
      explanation: "Classic Mikolov (2013) Word2Vec relation: Royal vector + Feminine gender axis = Queen.",
    },
  ];

  const playChirp = (frequency = 600, duration = 0.08) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  };

  const handleComputeArithmetic = (aId: string, bId: string, cId: string) => {
    const a = WORDS.find((w) => w.id === aId);
    const b = WORDS.find((w) => w.id === bId);
    const c = WORDS.find((w) => w.id === cId);
    if (!a || !b || !c) return;

    // Vector arithmetic in 2D projection: Target = A - B + C
    const tx = a.x - b.x + c.x;
    const ty = a.y - b.y + c.y;
    setCalculatedTarget({ x: tx, y: ty });

    // Nearest neighbor search
    let bestDist = Infinity;
    let bestWord = "";
    WORDS.forEach((w) => {
      if (w.id === aId || w.id === bId) return;
      const dist = Math.hypot(w.x - tx, w.y - ty);
      if (dist < bestDist) {
        bestDist = dist;
        bestWord = w.label;
      }
    });

    setClosestWord(bestWord);
    const mockCos = Math.max(0.72, 1 - bestDist / 240).toFixed(2);
    setCosineScore(parseFloat(mockCos));
    playChirp(720, 0.06);
  };

  const applyPreset = (preset: (typeof PRESET_ANALOGIES)[0]) => {
    setWordA(preset.a);
    setWordB(preset.b);
    setWordC(preset.c);
    handleComputeArithmetic(preset.a, preset.b, preset.c);
  };

  const handleChallengePick = (choice: string) => {
    setUserChallengeChoice(choice);
    const current = CHALLENGES[challengeIdx];
    if (choice === current.correct) {
      setChallengeScore((s) => s + 100);
      setStreak((st) => st + 1);
      playChirp(880, 0.15);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.8 },
        colors: ["#FF3B00", "#F2EFE9"],
      });
    } else {
      setStreak(0);
      playChirp(240, 0.15);
    }
  };

  const nextChallenge = () => {
    setUserChallengeChoice(null);
    setChallengeIdx((prev) => (prev + 1) % CHALLENGES.length);
  };

  const objA = WORDS.find((w) => w.id === wordA);
  const objB = WORDS.find((w) => w.id === wordB);
  const objC = WORDS.find((w) => w.id === wordC);

  // Compute simulated interpolated 8-dim latent vector
  const targetDims =
    objA && objB && objC
      ? objA.dimensions.map((val, i) =>
          parseFloat((val - objB.dimensions[i] + objC.dimensions[i]).toFixed(2))
        )
      : [0.92, 0.89, 0.14, 0.74, 0.48, -0.19, 0.07, 0.85];

  return (
    <section
      id="game-vector"
      className="py-20 px-4 md:px-8 border-b border-[#F2EFE9]/15 bg-[#0B0B0C] select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F2EFE9]/15 pb-6 mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF3B00] mb-2">
              <span className="w-2 h-2 bg-[#FF3B00]" />
              <span>[GAME 05 // HIGH-DIMENSIONAL SEMANTIC TOPOLOGY]</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-instrument italic text-[#F2EFE9]">
              Latent Vector Space &amp; Arithmetic
            </h2>
          </div>
          <div className="font-mono text-xs text-[#F2EFE9]/60 space-y-1 text-right">
            <div>
              EMBEDDING DIMENSION: <span className="text-[#FF3B00] font-bold">4096</span> (PROJECTED VIA PCA)
            </div>
            <div className="text-[11px] text-[#F2EFE9]/40">
              EQUATION: <span className="text-[#F2EFE9]">v(Target) = v(A) − v(B) + v(C)</span>
            </div>
          </div>
        </div>

        {/* 1-Click Analogy Quick Presets */}
        <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-[#F2EFE9]/40 uppercase text-[10px] tracking-wider mr-1">
            PRESETS:
          </span>
          {PRESET_ANALOGIES.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset)}
              className={`px-3 py-1.5 border text-xs transition-colors ${
                wordA === preset.a && wordB === preset.b && wordC === preset.c
                  ? "border-[#FF3B00] bg-[#FF3B00] text-[#0B0B0C] font-bold"
                  : "border-[#F2EFE9]/20 hover:border-[#FF3B00] text-[#F2EFE9]/80 hover:text-white"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Main Grid: Left 2D Interactive Vector Plane (7 cols) + Right Operators (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 2D Interactive Vector SVG Plane */}
          <div className="lg:col-span-7 border border-[#F2EFE9]/20 p-4 sm:p-6 bg-[#0B0B0C] swiss-grid relative">
            <div className="flex justify-between items-center text-xs font-mono text-[#FF3B00] border-b border-[#F2EFE9]/10 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#FF3B00] animate-ping" />
                <span>[2D TOPOLOGICAL PROJECTION PLANE // PCA REDUCTION]</span>
              </div>
              <span className="text-[#F2EFE9]/40 text-[10px]">640px × 440px VIEWPORT</span>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="relative w-full aspect-[640/440] bg-[#0B0B0C]/90 border border-[#F2EFE9]/15 overflow-hidden">
              <svg
                viewBox="0 0 640 440"
                className="w-full h-full select-none"
                style={{ background: "radial-gradient(circle at 50% 50%, #151518 0%, #0B0B0C 100%)" }}
              >
                <defs>
                  {/* Arrow marker for vector arrows */}
                  <marker
                    id="arrow-orange"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#FF3B00" />
                  </marker>
                  <marker
                    id="arrow-white"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="rgba(242, 239, 233, 0.6)" />
                  </marker>
                </defs>

                {/* Grid Lines */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 45}
                    y1={0}
                    x2={i * 45}
                    y2={440}
                    stroke="rgba(242, 239, 233, 0.04)"
                    strokeWidth="1"
                  />
                ))}
                {Array.from({ length: 11 }).map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1={0}
                    y1={i * 44}
                    x2={640}
                    y2={i * 44}
                    stroke="rgba(242, 239, 233, 0.04)"
                    strokeWidth="1"
                  />
                ))}

                {/* Central Cartesian Axes */}
                <line x1={0} y1={220} x2={640} y2={220} stroke="rgba(242, 239, 233, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1={320} y1={0} x2={320} y2={440} stroke="rgba(242, 239, 233, 0.15)" strokeWidth="1" strokeDasharray="3 3" />

                {/* Axis Labels */}
                <text x="630" y="215" fill="rgba(242, 239, 233, 0.3)" fontSize="9" textAnchor="end" fontFamily="monospace">
                  SEMANTIC AXIS 1 (PCA_01) →
                </text>
                <text x="325" y="15" fill="rgba(242, 239, 233, 0.3)" fontSize="9" textAnchor="start" fontFamily="monospace">
                  ↑ SEMANTIC AXIS 2 (PCA_02)
                </text>

                {/* Semantic Cluster Regions */}
                <rect x="70" y="90" width="180" height="210" fill="none" stroke="rgba(255, 59, 0, 0.12)" strokeDasharray="4 4" />
                <text x="75" y="105" fill="rgba(255, 59, 0, 0.4)" fontSize="9" fontFamily="monospace">
                  // REGION: ROYALTY &amp; GENDER
                </text>

                <rect x="380" y="90" width="220" height="210" fill="none" stroke="rgba(255, 59, 0, 0.12)" strokeDasharray="4 4" />
                <text x="385" y="105" fill="rgba(255, 59, 0, 0.4)" fontSize="9" fontFamily="monospace">
                  // REGION: CAPITALS &amp; NATIONS
                </text>

                <rect x="90" y="340" width="300" height="70" fill="none" stroke="rgba(255, 59, 0, 0.12)" strokeDasharray="4 4" />
                <text x="95" y="355" fill="rgba(255, 59, 0, 0.4)" fontSize="9" fontFamily="monospace">
                  // REGION: FAUNA MATURATION
                </text>

                <rect x="330" y="30" width="130" height="160" fill="none" stroke="rgba(255, 59, 0, 0.12)" strokeDasharray="4 4" />
                <text x="335" y="45" fill="rgba(255, 59, 0, 0.4)" fontSize="8" fontFamily="monospace">
                  // GRAMMAR
                </text>

                {/* 1. Vector Difference Line: B -> A (represents A - B) */}
                {objA && objB && (
                  <>
                    <line
                      x1={objB.x}
                      y1={objB.y}
                      x2={objA.x}
                      y2={objA.y}
                      stroke="#FF3B00"
                      strokeWidth="2"
                      markerEnd="url(#arrow-orange)"
                    />
                    <text
                      x={(objA.x + objB.x) / 2 - 10}
                      y={(objA.y + objB.y) / 2 - 8}
                      fill="#FF3B00"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      Δ = [{objA.label} − {objB.label}]
                    </text>
                  </>
                )}

                {/* 2. Vector Addition Line: C -> Target (represents C + Δ) */}
                {objC && calculatedTarget && (
                  <>
                    <line
                      x1={objC.x}
                      y1={objC.y}
                      x2={calculatedTarget.x}
                      y2={calculatedTarget.y}
                      stroke="#FF3B00"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      markerEnd="url(#arrow-orange)"
                    />
                    <text
                      x={(objC.x + calculatedTarget.x) / 2 + 10}
                      y={(objC.y + calculatedTarget.y) / 2}
                      fill="#FF3B00"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      + [{objC.label}]
                    </text>
                  </>
                )}

                {/* 3. Parallelogram Closure: B -> C (dotted guidance) */}
                {objB && objC && (
                  <line
                    x1={objB.x}
                    y1={objB.y}
                    x2={objC.x}
                    y2={objC.y}
                    stroke="rgba(242, 239, 233, 0.25)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    markerEnd="url(#arrow-white)"
                  />
                )}

                {/* 4. Target Projection Pulse Concentric Rings */}
                {calculatedTarget && (
                  <g transform={`translate(${calculatedTarget.x}, ${calculatedTarget.y})`}>
                    <circle r="16" fill="rgba(255, 59, 0, 0.12)" stroke="#FF3B00" strokeWidth="1" opacity="0.8">
                      <animate attributeName="r" values="8;24;8" dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                    <circle r="6" fill="#FF3B00" />
                    <line x1="-12" y1="0" x2="12" y2="0" stroke="#FF3B00" strokeWidth="1.5" />
                    <line x1="0" y1="-12" x2="0" y2="12" stroke="#FF3B00" strokeWidth="1.5" />
                  </g>
                )}

                {/* Plotted Word Nodes */}
                {WORDS.map((w) => {
                  const isA = w.id === wordA;
                  const isB = w.id === wordB;
                  const isC = w.id === wordC;
                  const isMatch = w.label.toLowerCase() === closestWord.toLowerCase();

                  return (
                    <g
                      key={w.id}
                      transform={`translate(${w.x}, ${w.y})`}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredWord(w)}
                      onMouseLeave={() => setHoveredWord(null)}
                      onClick={() => {
                        setWordA(w.id);
                        handleComputeArithmetic(w.id, wordB, wordC);
                      }}
                    >
                      {/* Node point */}
                      <rect
                        x="-4"
                        y="-4"
                        width="8"
                        height="8"
                        fill={isMatch ? "#FF3B00" : isA || isB || isC ? "#F2EFE9" : "rgba(242, 239, 233, 0.4)"}
                        stroke={isMatch ? "#F2EFE9" : isA ? "#FF3B00" : "none"}
                        strokeWidth="1.5"
                      />

                      {/* Label badge */}
                      <rect
                        x="8"
                        y="-10"
                        width={w.label.length * 7.5 + 8}
                        height="18"
                        fill={
                          isMatch
                            ? "#FF3B00"
                            : isA
                            ? "#F2EFE9"
                            : isB || isC
                            ? "rgba(242, 239, 233, 0.2)"
                            : "#0B0B0C"
                        }
                        stroke={isMatch ? "#FF3B00" : "rgba(242, 239, 233, 0.3)"}
                        strokeWidth="1"
                      />
                      <text
                        x="12"
                        y="3"
                        fill={isMatch ? "#0B0B0C" : isA ? "#0B0B0C" : "#F2EFE9"}
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight={isMatch || isA ? "bold" : "normal"}
                      >
                        {w.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredWord && (
                <div
                  className="absolute z-30 pointer-events-none p-2 bg-[#0B0B0C] border border-[#FF3B00] font-mono text-[10px] text-[#F2EFE9] space-y-0.5"
                  style={{
                    left: `${Math.min(hoveredWord.x + 10, 480)}px`,
                    top: `${Math.min(hoveredWord.y + 10, 360)}px`,
                  }}
                >
                  <div className="text-[#FF3B00] font-bold uppercase">{hoveredWord.label}</div>
                  <div>COORD: [{hoveredWord.x}, {hoveredWord.y}]</div>
                  <div className="text-[#F2EFE9]/60">CATEGORY: {hoveredWord.category}</div>
                </div>
              )}
            </div>

            {/* Bottom Real-time Equation Bar */}
            <div className="mt-4 p-3 bg-[#F2EFE9]/5 border border-[#F2EFE9]/10 font-mono text-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[#FF3B00] font-bold">TOPOLOGICAL EQUATION:</span>
                <span className="text-[#F2EFE9]">
                  [{objA?.label}] − [{objB?.label}] + [{objC?.label}]
                </span>
                <span className="text-[#FF3B00] font-bold text-sm">≈ [{closestWord}]</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#F2EFE9]/50 text-[11px]">COSINE SIMILARITY:</span>
                <span className="px-2 py-0.5 bg-[#FF3B00] text-[#0B0B0C] font-bold text-xs">
                  {cosineScore} ({(cosineScore * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Controls, Latent Spectrum & Challenge Mode */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Vector Arithmetic Selector Console */}
            <div className="border border-[#F2EFE9]/20 p-5 bg-[#0B0B0C] space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-[#FF3B00] font-bold border-b border-[#F2EFE9]/10 pb-2">
                <span>[VECTOR ARITHMETIC OPERATOR]</span>
                <span className="text-[10px] text-[#F2EFE9]/40">LINEAR SEPARABILITY</span>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div>
                  <label className="text-[10px] text-[#FF3B00] font-bold block mb-1">
                    VECTOR A (+)
                  </label>
                  <select
                    value={wordA}
                    onChange={(e) => {
                      setWordA(e.target.value);
                      handleComputeArithmetic(e.target.value, wordB, wordC);
                    }}
                    className="w-full bg-[#0B0B0C] border border-[#F2EFE9]/30 p-2 text-[#F2EFE9] text-xs font-bold focus:border-[#FF3B00] outline-none"
                  >
                    {WORDS.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-red-400 font-bold block mb-1">
                    VECTOR B (−)
                  </label>
                  <select
                    value={wordB}
                    onChange={(e) => {
                      setWordB(e.target.value);
                      handleComputeArithmetic(wordA, e.target.value, wordC);
                    }}
                    className="w-full bg-[#0B0B0C] border border-[#F2EFE9]/30 p-2 text-[#F2EFE9] text-xs font-bold focus:border-[#FF3B00] outline-none"
                  >
                    {WORDS.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-emerald-400 font-bold block mb-1">
                    VECTOR C (+)
                  </label>
                  <select
                    value={wordC}
                    onChange={(e) => {
                      setWordC(e.target.value);
                      handleComputeArithmetic(wordA, wordB, e.target.value);
                    }}
                    className="w-full bg-[#0B0B0C] border border-[#F2EFE9]/30 p-2 text-[#F2EFE9] text-xs font-bold focus:border-[#FF3B00] outline-none"
                  >
                    {WORDS.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-[11px] font-mono text-[#F2EFE9]/70 leading-relaxed border-t border-[#F2EFE9]/10 pt-3">
                In multi-dimensional latent space (ℝ⁴⁰⁹⁶), semantic concepts correspond to directional vectors. Subtracting Vector B strips that concept axis, and adding Vector C shifts the point along a new conceptual dimension.
              </p>
            </div>

            {/* 2. Simulated 8-Channel Latent Dimension Spectrum */}
            <div className="border border-[#F2EFE9]/20 p-5 bg-[#0B0B0C] space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#F2EFE9]/10 pb-2">
                <span className="text-[#FF3B00] font-bold text-[11px]">
                  [4096-D LATENT EMBEDDING SPECTRUM]
                </span>
                <span className="text-[#F2EFE9]/40 text-[10px]">PROJECTION SLICES</span>
              </div>

              <div className="space-y-1.5 pt-1">
                {DIMENSION_NAMES.map((name, i) => {
                  const val = targetDims[i] || 0;
                  const pct = Math.min(100, Math.max(0, (val + 1) * 50));
                  return (
                    <div key={name} className="flex items-center gap-2 text-[10px]">
                      <span className="w-32 text-[#F2EFE9]/60 truncate">{name}</span>
                      <div className="flex-1 h-2 bg-[#F2EFE9]/10 overflow-hidden relative">
                        <div
                          className={`h-full transition-all duration-300 ${
                            val >= 0 ? "bg-[#FF3B00]" : "bg-blue-400"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-bold text-[#F2EFE9]">
                        {val > 0 ? `+${val}` : val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Interactive Quiz Challenge */}
            <div className="border border-[#F2EFE9]/20 p-5 bg-[#0B0B0C] space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#F2EFE9]/10 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#FF3B00] font-bold">[CHALLENGE: PREDICT THE TARGET]</span>
                  {streak > 1 && (
                    <span className="px-1.5 py-0.2 bg-[#FF3B00] text-[#0B0B0C] font-bold text-[9px]">
                      {streak}x STREAK🔥
                    </span>
                  )}
                </div>
                <span className="text-[#F2EFE9]/60">SCORE: {challengeScore} PTS</span>
              </div>

              <div className="text-[#F2EFE9] font-bold py-1 text-xs">
                {CHALLENGES[challengeIdx].equation}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {CHALLENGES[challengeIdx].options.map((opt) => {
                  const isPicked = userChallengeChoice === opt;
                  const isCorrect = opt === CHALLENGES[challengeIdx].correct;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleChallengePick(opt)}
                      disabled={userChallengeChoice !== null}
                      data-cursor="ANSWER"
                      className={`p-2 border text-center transition-all ${
                        userChallengeChoice
                          ? isCorrect
                            ? "border-[#FF3B00] bg-[#FF3B00] text-[#0B0B0C] font-bold"
                            : isPicked
                            ? "border-red-500 bg-red-950/40 text-red-300"
                            : "border-[#F2EFE9]/10 text-[#F2EFE9]/30"
                          : "border-[#F2EFE9]/30 hover:border-[#FF3B00] hover:text-[#FF3B00] text-[#F2EFE9]"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {userChallengeChoice && (
                <div className="pt-2 text-[11px] text-[#F2EFE9]/80 border-t border-[#F2EFE9]/10 space-y-2">
                  <p>{CHALLENGES[challengeIdx].explanation}</p>
                  <button
                    onClick={nextChallenge}
                    className="w-full py-1.5 bg-[#FF3B00] text-[#0B0B0C] font-bold uppercase text-[11px] hover:bg-[#F2EFE9] transition-colors"
                  >
                    Next Question →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
