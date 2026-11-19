"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

interface VectorWord {
  id: string;
  label: string;
  x: number; // 2D projection coordinates
  y: number;
  category: string;
}

const WORDS: VectorWord[] = [
  { id: "king", label: "King", x: 190, y: 70, category: "ROYALTY" },
  { id: "queen", label: "Queen", x: 195, y: 190, category: "ROYALTY" },
  { id: "man", label: "Man", x: 70, y: 75, category: "GENDER" },
  { id: "woman", label: "Woman", x: 75, y: 195, category: "GENDER" },
  { id: "paris", label: "Paris", x: 330, y: 70, category: "GEOGRAPHY" },
  { id: "france", label: "France", x: 270, y: 80, category: "GEOGRAPHY" },
  { id: "tokyo", label: "Tokyo", x: 340, y: 210, category: "GEOGRAPHY" },
  { id: "japan", label: "Japan", x: 280, y: 220, category: "GEOGRAPHY" },
  { id: "puppy", label: "Puppy", x: 140, y: 290, category: "ANIMALS" },
  { id: "dog", label: "Dog", x: 75, y: 285, category: "ANIMALS" },
  { id: "kitten", label: "Kitten", x: 230, y: 290, category: "ANIMALS" },
  { id: "cat", label: "Cat", x: 170, y: 285, category: "ANIMALS" },
];

export default function LatentSpaceExplorer() {
  const [wordA, setWordA] = useState<string>("king");
  const [wordB, setWordB] = useState<string>("man");
  const [wordC, setWordC] = useState<string>("woman");
  const [calculatedTarget, setCalculatedTarget] = useState<{ x: number; y: number } | null>({
    x: 195,
    y: 185,
  });
  const [closestWord, setClosestWord] = useState<string>("Queen");
  const [cosineScore, setCosineScore] = useState<number>(0.96);

  // Challenge Mode State
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [userChallengeChoice, setUserChallengeChoice] = useState<string | null>(null);
  const [challengeScore, setChallengeScore] = useState<number>(0);

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
      explanation: "Infant-to-adult animal relationship: Dog is to Puppy as Cat is to Kitten.",
    },
  ];

  const handleComputeArithmetic = (aId: string, bId: string, cId: string) => {
    const a = WORDS.find((w) => w.id === aId);
    const b = WORDS.find((w) => w.id === bId);
    const c = WORDS.find((w) => w.id === cId);
    if (!a || !b || !c) return;

    // Vector arithmetic: target = A - B + C
    const tx = a.x - b.x + c.x;
    const ty = a.y - b.y + c.y;
    setCalculatedTarget({ x: tx, y: ty });

    // Find nearest neighbor in 2D Euclidean distance (representing high-d cosine proximity)
    let bestDist = Infinity;
    let bestWord = "";
    WORDS.forEach((w) => {
      // Don't compare with the component tokens A, B, C
      if (w.id === aId || w.id === bId) return;
      const dist = Math.hypot(w.x - tx, w.y - ty);
      if (dist < bestDist) {
        bestDist = dist;
        bestWord = w.label;
      }
    });

    setClosestWord(bestWord);
    const mockCos = Math.max(0.75, 1 - bestDist / 200).toFixed(2);
    setCosineScore(parseFloat(mockCos));
  };

  const handleChallengePick = (choice: string) => {
    setUserChallengeChoice(choice);
    const current = CHALLENGES[challengeIdx];
    if (choice === current.correct) {
      setChallengeScore((s) => s + 100);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#FF3B00", "#F2EFE9"],
      });
    }
  };

  return (
    <section
      id="game-vector"
      className="py-20 px-4 md:px-8 border-b border-[#F2EFE9]/15 bg-[#0B0B0C] select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F2EFE9]/15 pb-6 mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF3B00] mb-2">
              <span className="w-2 h-2 bg-[#FF3B00]"></span>
              <span>[GAME 05 // HIGH-DIMENSIONAL SEMANTIC TOPOLOGY]</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-instrument italic text-[#F2EFE9]">
              Latent Vector Space &amp; Arithmetic
            </h2>
          </div>
          <div className="font-mono text-xs text-[#F2EFE9]/60">
            EMBEDDING DIMENSION: <span className="text-[#FF3B00] font-bold">4096</span> (PROJECTED TO 2D PCA)
          </div>
        </div>

        {/* Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 2D Interactive Vector Plane (7 cols) */}
          <div className="lg:col-span-7 border border-[#F2EFE9]/20 p-6 bg-[#0B0B0C] swiss-grid relative">
            <div className="flex justify-between items-center text-xs font-mono text-[#FF3B00] border-b border-[#F2EFE9]/10 pb-2 mb-4">
              <span>[2D TOPOLOGICAL PROJECTION PLANE // PCA REDUCTION]</span>
              <span className="text-[#F2EFE9]/40">400px × 360px</span>
            </div>

            {/* Canvas Simulation Area */}
            <div className="relative w-full h-[360px] bg-[#0B0B0C]/80 border border-[#F2EFE9]/15 overflow-hidden">
              {/* Origin axes */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#F2EFE9]/10" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#F2EFE9]/10" />

              {/* Calculated target vector marker */}
              {calculatedTarget && (
                <div
                  className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                  style={{ left: `${calculatedTarget.x}px`, top: `${calculatedTarget.y}px` }}
                >
                  <div className="w-4 h-4 border-2 border-[#FF3B00] bg-[#FF3B00]/30 animate-ping absolute -top-0 -left-0" />
                  <div className="w-3 h-3 bg-[#FF3B00]" />
                  <span className="font-mono text-[9px] bg-[#FF3B00] text-[#0B0B0C] px-1 py-0.5 font-bold whitespace-nowrap block mt-1">
                    RESULT ≈ {closestWord}
                  </span>
                </div>
              )}

              {/* Plotted Word Tokens */}
              {WORDS.map((w) => {
                const isSelectedA = w.id === wordA;
                const isSelectedB = w.id === wordB;
                const isSelectedC = w.id === wordC;
                const isCalculatedMatch = w.label === closestWord;

                return (
                  <div
                    key={w.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 cursor-pointer transition-transform hover:scale-110"
                    style={{ left: `${w.x}px`, top: `${w.y}px` }}
                    onClick={() => {
                      setWordA(w.id);
                      handleComputeArithmetic(w.id, wordB, wordC);
                    }}
                    title={`Token: ${w.label} (Coord: [${w.x}, ${w.y}])`}
                  >
                    <div
                      className={`w-2 h-2 ${
                        isCalculatedMatch
                          ? "bg-[#FF3B00] ring-2 ring-[#FF3B00]"
                          : isSelectedA || isSelectedB || isSelectedC
                          ? "bg-[#F2EFE9]"
                          : "bg-[#F2EFE9]/40"
                      }`}
                    />
                    <span
                      className={`font-mono text-[11px] px-1 ${
                        isCalculatedMatch
                          ? "bg-[#FF3B00] text-[#0B0B0C] font-bold"
                          : isSelectedA || isSelectedB || isSelectedC
                          ? "bg-[#F2EFE9]/20 text-[#F2EFE9] font-bold"
                          : "text-[#F2EFE9]/70"
                      }`}
                    >
                      {w.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Arithmetic Formula Readout */}
            <div className="mt-4 p-3 bg-[#F2EFE9]/5 border border-[#F2EFE9]/10 font-mono text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[#FF3B00] font-bold">EQUATION:</span>
                <span>
                  [{WORDS.find((w) => w.id === wordA)?.label}] - [
                  {WORDS.find((w) => w.id === wordB)?.label}] + [
                  {WORDS.find((w) => w.id === wordC)?.label}]
                </span>
                <span className="text-[#FF3B00] font-bold">≈ [{closestWord}]</span>
              </div>
              <div className="text-[#FF3B00]">
                COSINE SIMILARITY: <strong>{cosineScore}</strong>
              </div>
            </div>
          </div>

          {/* Right: Arithmetic Controls & Vector Quiz (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Vector Selector Machine */}
            <div className="border border-[#F2EFE9]/20 p-6 bg-[#0B0B0C] space-y-4">
              <div className="text-xs font-mono text-[#FF3B00] font-bold border-b border-[#F2EFE9]/10 pb-2">
                [VECTOR ARITHMETIC OPERATOR]
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div>
                  <label className="text-[10px] text-[#F2EFE9]/40 block mb-1">VECTOR A (+)</label>
                  <select
                    value={wordA}
                    onChange={(e) => {
                      setWordA(e.target.value);
                      handleComputeArithmetic(e.target.value, wordB, wordC);
                    }}
                    className="w-full bg-[#0B0B0C] border border-[#F2EFE9]/30 p-2 text-[#F2EFE9] text-xs"
                  >
                    {WORDS.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-[#F2EFE9]/40 block mb-1">VECTOR B (-)</label>
                  <select
                    value={wordB}
                    onChange={(e) => {
                      setWordB(e.target.value);
                      handleComputeArithmetic(wordA, e.target.value, wordC);
                    }}
                    className="w-full bg-[#0B0B0C] border border-[#F2EFE9]/30 p-2 text-[#F2EFE9] text-xs"
                  >
                    {WORDS.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-[#F2EFE9]/40 block mb-1">VECTOR C (+)</label>
                  <select
                    value={wordC}
                    onChange={(e) => {
                      setWordC(e.target.value);
                      handleComputeArithmetic(wordA, wordB, e.target.value);
                    }}
                    className="w-full bg-[#0B0B0C] border border-[#F2EFE9]/30 p-2 text-[#F2EFE9] text-xs"
                  >
                    {WORDS.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-[11px] font-mono text-[#F2EFE9]/60 leading-relaxed pt-2">
                Semantic concepts are linearly separable. Subtraction strips away a concept (e.g. maleness from royalty), and addition implants a new axis (femaleness), leading directly to &apos;Queen&apos;.
              </p>
            </div>

            {/* Semantic Quiz Challenge */}
            <div className="border border-[#F2EFE9]/20 p-6 bg-[#0B0B0C] space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#F2EFE9]/10 pb-2">
                <span className="text-[#FF3B00] font-bold">[CHALLENGE: PREDICT THE TARGET]</span>
                <span className="text-[#F2EFE9]/50">SCORE: {challengeScore} PTS</span>
              </div>

              <div className="text-[#F2EFE9] font-bold py-1">
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
                      data-cursor="ANSWER"
                      className={`p-2 border text-center transition-all ${
                        userChallengeChoice
                          ? isCorrect
                            ? "border-[#FF3B00] bg-[#FF3B00] text-[#0B0B0C] font-bold"
                            : isPicked
                            ? "border-red-500 bg-red-900/30 text-[#F2EFE9]"
                            : "border-[#F2EFE9]/10 text-[#F2EFE9]/40"
                          : "border-[#F2EFE9]/30 hover:border-[#FF3B00] hover:text-[#FF3B00] text-[#F2EFE9]"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {userChallengeChoice && (
                <div className="pt-2 text-[11px] text-[#F2EFE9]/70 border-t border-[#F2EFE9]/10">
                  {CHALLENGES[challengeIdx].explanation}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
