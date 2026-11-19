"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

interface Candidate {
  token: string;
  logit: number;
  prob: number; // base at T=1.0
  meaning: string;
}

interface Scenario {
  id: string;
  context: string;
  category: string;
  candidates: Candidate[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "sc-1",
    context: "The astrophysicist pointed the high-resolution space",
    category: "ASTRONOMY & PHYSICS",
    candidates: [
      { token: " telescope", logit: 8.4, prob: 0.81, meaning: "High semantic cohesion with astrophysicist + space" },
      { token: " observatory", logit: 6.2, prob: 0.11, meaning: "Plausible noun, slightly lower context probability" },
      { token: " station", logit: 5.1, prob: 0.05, meaning: "Valid compound noun ('space station')" },
      { token: " shuttle", logit: 3.8, prob: 0.025, meaning: "Historical aeronautic term" },
      { token: " sandwich", logit: -2.0, prob: 0.005, meaning: "High cross-entropy hallucination" },
    ],
  },
  {
    id: "sc-2",
    context: "In modern deep learning, attention is all you",
    category: "MACHINE LEARNING PAPERS",
    candidates: [
      { token: " need", logit: 9.8, prob: 0.965, meaning: "Famous 2017 Vaswani paper title: 96.5% certainty" },
      { token: " require", logit: 5.1, prob: 0.02, meaning: "Synonym but non-idiomatic" },
      { token: " want", logit: 4.2, prob: 0.01, meaning: "Colloquial variation" },
      { token: " calculate", logit: 2.1, prob: 0.004, meaning: "Technical action verb" },
      { token: " banana", logit: -3.5, prob: 0.001, meaning: "Completely anomalous token" },
    ],
  },
  {
    id: "sc-3",
    context: "def calculate_cross_entropy(logits, targets):\n    return -torch.mean(torch.sum(",
    category: "PYTHON / PYTORCH",
    candidates: [
      { token: "targets", logit: 7.9, prob: 0.68, meaning: "First parameter of standard categorical cross-entropy" },
      { token: "F.log_softmax", logit: 6.8, prob: 0.22, meaning: "Log-softmax formulation" },
      { token: "logits", logit: 5.4, prob: 0.07, meaning: "Valid tensor variable" },
      { token: "loss", logit: 3.8, prob: 0.025, meaning: "Premature return token" },
      { token: "print", logit: 1.1, prob: 0.005, meaning: "Debugging statement" },
    ],
  },
  {
    id: "sc-4",
    context: "The quick brown fox jumps over the lazy",
    category: "CLASSIC PANGRAM",
    candidates: [
      { token: " dog", logit: 9.2, prob: 0.94, meaning: "Historic 1885 pangram ending" },
      { token: " hound", logit: 5.5, prob: 0.04, meaning: "Canine synonym" },
      { token: " cat", logit: 3.9, prob: 0.012, meaning: "Feline distractor" },
      { token: " fence", logit: 2.8, prob: 0.006, meaning: "Plausible obstacle" },
      { token: " kangaroo", logit: 0.2, prob: 0.002, meaning: "Marsupial anomaly" },
    ],
  },
];

export default function NextTokenRoulette() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(1.0);
  const [topK, setTopK] = useState<number>(5);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [lastSurprisal, setLastSurprisal] = useState<number | null>(null);

  const scenario = SCENARIOS[activeScenarioIdx];

  // Re-calculate Softmax Probabilities with Temperature T
  const computeAdjustedProbabilities = () => {
    // T must be strictly positive
    const T = Math.max(0.05, temperature);
    // Exponentiate logits scaled by temperature
    const exps = scenario.candidates.map((c) => Math.exp(c.logit / T));
    const sumExp = exps.reduce((acc, val) => acc + val, 0);
    return scenario.candidates.map((c, i) => {
      const adjusted = exps[i] / sumExp;
      return {
        ...c,
        adjustedProb: adjusted,
      };
    });
  };

  const adjustedCandidates = computeAdjustedProbabilities();

  // Top candidate under current temperature
  const topCandidate = [...adjustedCandidates].sort(
    (a, b) => b.adjustedProb - a.adjustedProb
  )[0];

  const handleGuess = (candidate: (typeof adjustedCandidates)[0]) => {
    if (isRevealed) return;
    setSelectedGuess(candidate.token);
    setIsRevealed(true);

    const isTop = candidate.token === topCandidate.token;
    // Surprisal in bits: -log2(P)
    const surprisal = -Math.log2(Math.max(0.0001, candidate.adjustedProb));
    setLastSurprisal(parseFloat(surprisal.toFixed(2)));

    if (isTop) {
      setScore((s) => s + 100);
      setStreak((st) => st + 1);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#FF3B00", "#F2EFE9", "#ffffff"],
      });
    } else {
      setStreak(0);
    }
  };

  const sampleAndAppendToken = () => {
    // Filter by Top-K
    const sorted = [...adjustedCandidates].sort(
      (a, b) => b.adjustedProb - a.adjustedProb
    );
    const validCandidates = sorted.slice(0, Math.min(topK, sorted.length));
    const validSum = validCandidates.reduce((acc, c) => acc + c.adjustedProb, 0);

    // Random roll
    const roll = Math.random() * validSum;
    let accumulated = 0;
    let chosen = validCandidates[0];

    for (const c of validCandidates) {
      accumulated += c.adjustedProb;
      if (roll <= accumulated) {
        chosen = c;
        break;
      }
    }

    setGeneratedText((prev) => (prev ? prev + chosen.token : chosen.token));
  };

  const nextScenario = () => {
    setActiveScenarioIdx((prev) => (prev + 1) % SCENARIOS.length);
    setSelectedGuess(null);
    setIsRevealed(false);
    setGeneratedText("");
    setLastSurprisal(null);
  };

  return (
    <section
      id="game-next-token"
      className="py-20 px-4 md:px-8 border-b border-[#F2EFE9]/15 bg-[#0B0B0C] relative select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F2EFE9]/15 pb-6 mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF3B00] mb-2">
              <span className="w-2 h-2 bg-[#FF3B00]"></span>
              <span>[GAME 02 // AUTOREGRESSIVE PROBABILITY ARENA]</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-instrument italic text-[#F2EFE9]">
              The Next-Token Roulette
            </h2>
          </div>
          <div className="flex items-center gap-6 font-mono text-xs text-[#F2EFE9]/60">
            <div>
              SCORE: <span className="text-[#FF3B00] font-bold">{score}</span> PTS
            </div>
            <div>
              STREAK: <span className="text-[#F2EFE9] font-bold">{streak}</span>x
            </div>
            <button
              onClick={nextScenario}
              data-cursor="SKIP"
              className="px-3 py-1 bg-[#F2EFE9]/10 text-[#F2EFE9] border border-[#F2EFE9]/30 hover:border-[#FF3B00] hover:text-[#FF3B00] transition-colors"
            >
              NEXT PROMPT →
            </button>
          </div>
        </div>

        {/* Game Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Prompt & Candidate Buttons (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* The Prompt Display */}
            <div className="border border-[#F2EFE9]/20 p-6 bg-[#0B0B0C] relative swiss-grid">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 border-b border-[#F2EFE9]/10 pb-2 mb-4">
                <span>INPUT_CONTEXT // {scenario.category}</span>
                <span>TOKEN_COUNT: 8</span>
              </div>

              <div className="font-mono text-base md:text-lg text-[#F2EFE9] leading-relaxed">
                {scenario.context}
                <span className="bg-[#FF3B00] text-[#0B0B0C] px-2 py-0.5 ml-1 animate-pulse font-bold">
                  [ ? ]
                </span>
                {generatedText && (
                  <span className="text-[#FF3B00] font-bold underline ml-1">
                    {generatedText}
                  </span>
                )}
              </div>
            </div>

            {/* Instruction Banner */}
            <div className="font-mono text-xs text-[#F2EFE9]/60 flex items-center justify-between border-l-2 border-[#FF3B00] pl-3 py-1">
              <span>
                {isRevealed
                  ? "PROBABILITY DISTRIBUTION REVEALED // INSPECT BARS BELOW"
                  : "GUESS: Which token does the neural network assign the highest probability to?"}
              </span>
              {lastSurprisal !== null && (
                <span className="text-[#FF3B00] font-bold">
                  SURPRISAL: {lastSurprisal} BITS
                </span>
              )}
            </div>

            {/* The 5 Candidate Options */}
            <div className="space-y-3">
              {adjustedCandidates.map((candidate) => {
                const isSelected = selectedGuess === candidate.token;
                const isWinner = candidate.token === topCandidate.token;
                const percent = (candidate.adjustedProb * 100).toFixed(1);

                return (
                  <div
                    key={candidate.token}
                    onClick={() => handleGuess(candidate)}
                    data-cursor="GUESS"
                    className={`border p-4 transition-all duration-150 cursor-pointer relative overflow-hidden ${
                      isRevealed
                        ? isWinner
                          ? "border-[#FF3B00] bg-[#FF3B00]/10"
                          : isSelected
                          ? "border-[#F2EFE9] bg-[#F2EFE9]/5"
                          : "border-[#F2EFE9]/10 bg-transparent opacity-60"
                        : "border-[#F2EFE9]/20 hover:border-[#FF3B00] hover:bg-[#F2EFE9]/5"
                    }`}
                  >
                    {/* Background Progress Bar when revealed */}
                    {isRevealed && (
                      <div
                        className={`absolute top-0 bottom-0 left-0 opacity-20 pointer-events-none transition-all duration-500 ${
                          isWinner ? "bg-[#FF3B00]" : "bg-[#F2EFE9]"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    )}

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[#F2EFE9]/40">
                          {isWinner && isRevealed ? "[★]" : "[•]"}
                        </span>
                        <span className="font-mono text-sm md:text-base font-bold text-[#F2EFE9]">
                          &quot;{candidate.token}&quot;
                        </span>
                        {isRevealed && (
                          <span className="hidden sm:inline text-[11px] font-mono text-[#F2EFE9]/50">
                            // {candidate.meaning}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 font-mono text-xs">
                        {isRevealed ? (
                          <span
                            className={`font-bold ${
                              isWinner ? "text-[#FF3B00]" : "text-[#F2EFE9]/60"
                            }`}
                          >
                            {percent}%
                          </span>
                        ) : (
                          <span className="text-[#F2EFE9]/30 hover:text-[#FF3B00]">
                            SELECT →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Neural Sampling Controls (Temperature / Top-K / Top-P) (5 cols) */}
          <div className="lg:col-span-5 border border-[#F2EFE9]/20 p-6 bg-[#0B0B0C] space-y-6">
            <div className="border-b border-[#F2EFE9]/10 pb-3 flex justify-between items-center text-xs font-mono">
              <span className="text-[#FF3B00] font-bold">[SAMPLING HYPERPARAMETERS]</span>
              <span className="text-[#F2EFE9]/40">INFERENCE ENGINE</span>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-[#F2EFE9]">TEMPERATURE (T)</span>
                <span className="text-[#FF3B00] font-bold">{temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#FF3B00] bg-[#F2EFE9]/10 h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#F2EFE9]/40 mt-1">
                <span>0.1 (Greedy / Cold)</span>
                <span>1.0 (Standard)</span>
                <span>2.0 (Chaos / Hallucination)</span>
              </div>
            </div>

            {/* Top-K Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-[#F2EFE9]">TOP-K FILTER</span>
                <span className="text-[#FF3B00] font-bold">{topK}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value))}
                className="w-full accent-[#FF3B00] bg-[#F2EFE9]/10 h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#F2EFE9]/40 mt-1">
                <span>1 (ArgMax only)</span>
                <span>Truncates to top K candidates</span>
                <span>5 (All)</span>
              </div>
            </div>

            {/* Live Autoregressive Append Action */}
            <div className="border-t border-[#F2EFE9]/10 pt-4 space-y-3">
              <button
                onClick={sampleAndAppendToken}
                data-cursor="SAMPLE"
                className="w-full py-3 bg-[#FF3B00] text-[#0B0B0C] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#0B0B0C] hover:text-[#FF3B00] border border-[#FF3B00] transition-colors"
              >
                ⚡ SAMPLE &amp; APPEND NEXT TOKEN
              </button>

              <div className="text-[11px] font-mono text-[#F2EFE9]/50 leading-relaxed">
                Notice: Raising Temperature flattens the distribution curve, increasing the probability of rare, surprising words. Low temperatures freeze into repetitive loops.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
