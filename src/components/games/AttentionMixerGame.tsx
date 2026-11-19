"use client";

import { useState } from "react";

interface AttentionHead {
  name: string;
  focus: string;
  weights: number[][]; // N x N
}

interface AttentionSentence {
  tokens: string[];
  heads: AttentionHead[];
  puzzleQuestion: string;
  targetTokenIndex: number;
  correctAnswerToken: string;
}

const ATTENTION_DATA: AttentionSentence[] = [
  {
    tokens: ["The", "trophy", "didn't", "fit", "in", "suitcase", "because", "it", "was", "large"],
    puzzleQuestion: "In '...because IT was LARGE', which noun does 'it' strongly attend to?",
    targetTokenIndex: 7, // "it"
    correctAnswerToken: "trophy",
    heads: [
      {
        name: "Head 02: Coreference Resolver",
        focus: "Binds pronouns ('it') to their semantic antecedents based on adjectives",
        weights: [
          // The, trophy, didn't, fit, in, suitcase, because, it, was, large
          [0.8, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1],
          [0.1, 0.7, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1],
          [0.0, 0.2, 0.6, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
          [0.0, 0.1, 0.3, 0.4, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0],
          [0.0, 0.0, 0.0, 0.2, 0.2, 0.6, 0.0, 0.0, 0.0, 0.0],
          [0.1, 0.1, 0.0, 0.1, 0.2, 0.5, 0.0, 0.0, 0.0, 0.0],
          [0.0, 0.1, 0.1, 0.2, 0.0, 0.1, 0.3, 0.1, 0.0, 0.1],
          // "it" attends 78% to "trophy" because it's too large!
          [0.02, 0.78, 0.01, 0.02, 0.01, 0.08, 0.01, 0.02, 0.01, 0.04],
          [0.0, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.3, 0.1],
          [0.01, 0.64, 0.0, 0.05, 0.0, 0.12, 0.0, 0.1, 0.03, 0.05],
        ],
      },
      {
        name: "Head 01: Positional Predecessor",
        focus: "Attends to immediate left neighbor (local n-gram syntactic dependency)",
        weights: [
          [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
          [0.7, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
          [0.1, 0.7, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
          [0.0, 0.1, 0.7, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
          [0.0, 0.0, 0.1, 0.8, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0],
          [0.0, 0.0, 0.0, 0.1, 0.8, 0.1, 0.0, 0.0, 0.0, 0.0],
          [0.0, 0.0, 0.0, 0.0, 0.1, 0.7, 0.2, 0.0, 0.0, 0.0],
          [0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.8, 0.1, 0.0, 0.0],
          [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.7, 0.2, 0.0],
          [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.8, 0.1],
        ],
      },
    ],
  },
];

export default function AttentionMixerGame() {
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(7); // Default "it"
  const [activeHeadIdx, setActiveHeadIdx] = useState<number>(0);
  const [isCausalMaskActive, setIsCausalMaskActive] = useState<boolean>(true);
  const [userGuessResult, setUserGuessResult] = useState<string | null>(null);

  const currentSentence = ATTENTION_DATA[0];
  const activeHead = currentSentence.heads[activeHeadIdx];
  const tokens = currentSentence.tokens;

  // Compute cell value applying causal mask if toggled
  const getWeight = (row: number, col: number) => {
    if (isCausalMaskActive && col > row) {
      return 0.0; // Masked out with -inf in decoder
    }
    return activeHead.weights[row]?.[col] ?? 0.0;
  };

  const handleTokenSelect = (idx: number) => {
    setSelectedTokenIdx(idx);
    if (tokens[idx] === currentSentence.correctAnswerToken) {
      setUserGuessResult("CORRECT! 'it' strongly attends to 'trophy' (78%) because 'large' impedes fitting!");
    } else if (idx === 5) {
      setUserGuessResult("INCORRECT: 'suitcase' only receives 8% attention in this head. If the adjective were 'small', it would flip to suitcase!");
    } else {
      setUserGuessResult(null);
    }
  };

  return (
    <section
      id="game-attention"
      className="py-20 px-4 md:px-8 border-b border-[#F2EFE9]/15 bg-[#0B0B0C] select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F2EFE9]/15 pb-6 mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF3B00] mb-2">
              <span className="w-2 h-2 bg-[#FF3B00]"></span>
              <span>[GAME 04 // QUERY-KEY MATRIX TACTILE MIXER]</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-instrument italic text-[#F2EFE9]">
              The Attention Matrix &amp; Coreference Lab
            </h2>
          </div>
          <div className="font-mono text-xs text-[#F2EFE9]/60">
            HEADS: <span className="text-[#FF3B00] font-bold">32</span> PARALLEL PROJECTIONS
          </div>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Sentence Strip & Attention Rays (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-[#F2EFE9]/20 p-6 bg-[#0B0B0C]">
              <div className="text-xs font-mono text-[#FF3B00] mb-3 border-b border-[#F2EFE9]/10 pb-2">
                [INPUT SEQUENCE // CLICK TO SET QUERY TOKEN (Q)]
              </div>

              {/* Tokens Ribbon */}
              <div className="flex flex-wrap gap-2 mb-6">
                {tokens.map((tok, i) => {
                  const isQuery = i === selectedTokenIdx;
                  const weightFromQuery = getWeight(selectedTokenIdx, i);
                  return (
                    <button
                      key={i}
                      onClick={() => handleTokenSelect(i)}
                      data-cursor="INSPECT"
                      className={`font-mono text-sm px-3 py-2 border transition-all ${
                        isQuery
                          ? "border-[#FF3B00] bg-[#FF3B00] text-[#0B0B0C] font-bold"
                          : "border-[#F2EFE9]/20 bg-[#F2EFE9]/5 text-[#F2EFE9] hover:border-[#FF3B00]"
                      }`}
                    >
                      {tok}
                      {isQuery && <span className="text-[9px] block text-[#0B0B0C]/80">QUERY (Q)</span>}
                    </button>
                  );
                })}
              </div>

              {/* Attention Distribution for selected token */}
              <div className="space-y-2 border-t border-[#F2EFE9]/10 pt-4">
                <div className="text-[11px] font-mono text-[#F2EFE9]/50 flex justify-between">
                  <span>KEY TOKENS (K) ATTENDED BY &quot;{tokens[selectedTokenIdx]}&quot;:</span>
                  <span className="text-[#FF3B00]">WEIGHT</span>
                </div>

                {tokens.map((t, idx) => {
                  const w = getWeight(selectedTokenIdx, idx);
                  const pct = (w * 100).toFixed(1);
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs font-mono">
                      <span className="w-24 text-[#F2EFE9]/70">{t}</span>
                      <div className="flex-1 mx-3 h-2 bg-[#F2EFE9]/10 overflow-hidden">
                        <div
                          className="h-full bg-[#FF3B00] transition-all duration-200"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-[#FF3B00] font-bold">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Puzzle Insight Banner */}
            <div className="border border-[#F2EFE9]/20 p-5 bg-[#0B0B0C] font-mono text-xs space-y-2">
              <div className="text-[#FF3B00] font-bold">[THE WINOGRAD SCHEMA PUZZLE]</div>
              <p className="text-[#F2EFE9]/80 leading-relaxed">
                {currentSentence.puzzleQuestion}
              </p>
              {userGuessResult && (
                <div className="p-3 bg-[#FF3B00]/10 border-l-2 border-[#FF3B00] text-[#F2EFE9] mt-2">
                  {userGuessResult}
                </div>
              )}
            </div>
          </div>

          {/* Right: Full N x N Scaled Dot-Product Heatmap (7 cols) */}
          <div className="lg:col-span-7 border border-[#F2EFE9]/20 p-6 bg-[#0B0B0C]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F2EFE9]/10 pb-3 mb-6 gap-3">
              <div>
                <span className="text-xs font-mono text-[#FF3B00] font-bold">
                  [SCALED DOT PRODUCT MATRIX: SOFTMAX(Q·Kᵀ / √dₖ)]
                </span>
                <div className="text-[11px] font-mono text-[#F2EFE9]/50 mt-0.5">
                  {activeHead.focus}
                </div>
              </div>

              {/* Head Selector & Causal Mask Toggle */}
              <div className="flex items-center gap-3 font-mono text-xs">
                <button
                  onClick={() => setIsCausalMaskActive((c) => !c)}
                  className={`px-2.5 py-1 border text-[11px] transition-colors ${
                    isCausalMaskActive
                      ? "border-[#FF3B00] text-[#FF3B00] bg-[#FF3B00]/10"
                      : "border-[#F2EFE9]/30 text-[#F2EFE9]"
                  }`}
                  title="Toggle autoregressive future token masking"
                >
                  CAUSAL MASK: {isCausalMaskActive ? "ON [GPT]" : "OFF [BERT]"}
                </button>

                <button
                  onClick={() => setActiveHeadIdx((h) => (h + 1) % currentSentence.heads.length)}
                  className="px-2.5 py-1 border border-[#F2EFE9]/30 text-[#F2EFE9] hover:border-[#FF3B00] hover:text-[#FF3B00] transition-colors text-[11px]"
                >
                  SWITCH HEAD →
                </button>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <div className="min-w-[480px]">
                {/* Column Headers (Keys) */}
                <div className="grid grid-cols-11 gap-1 text-[10px] font-mono text-center text-[#F2EFE9]/50 mb-1">
                  <div>Q \ K</div>
                  {tokens.map((tok, kIdx) => (
                    <div key={kIdx} className="truncate" title={tok}>
                      {tok.slice(0, 4)}
                    </div>
                  ))}
                </div>

                {/* Rows (Queries) */}
                {tokens.map((rowTok, rIdx) => {
                  const isCurrentQuery = rIdx === selectedTokenIdx;
                  return (
                    <div key={rIdx} className="grid grid-cols-11 gap-1 items-center mb-1">
                      {/* Row Label */}
                      <div
                        className={`text-[10px] font-mono truncate text-right pr-2 ${
                          isCurrentQuery ? "text-[#FF3B00] font-bold" : "text-[#F2EFE9]/50"
                        }`}
                      >
                        {rowTok.slice(0, 4)}
                      </div>

                      {/* Matrix Cells */}
                      {tokens.map((_, cIdx) => {
                        const weight = getWeight(rIdx, cIdx);
                        const isMasked = isCausalMaskActive && cIdx > rIdx;

                        return (
                          <div
                            key={cIdx}
                            onClick={() => setSelectedTokenIdx(rIdx)}
                            data-cursor="CELL"
                            className={`h-8 flex items-center justify-center font-mono text-[9px] border transition-all cursor-pointer ${
                              isMasked
                                ? "border-transparent bg-transparent text-[#F2EFE9]/10"
                                : isCurrentQuery
                                ? "border-[#FF3B00] text-[#0B0B0C] font-bold"
                                : "border-[#F2EFE9]/10 text-[#F2EFE9]/70 hover:border-[#FF3B00]"
                            }`}
                            style={{
                              backgroundColor: isMasked
                                ? "transparent"
                                : `rgba(255, 59, 0, ${Math.max(0.05, weight)})`,
                              color: isMasked
                                ? "rgba(242, 239, 233, 0.1)"
                                : weight > 0.4
                                ? "#0B0B0C"
                                : "#F2EFE9",
                            }}
                            title={`Q(${rowTok}) -> K(${tokens[cIdx]}): ${(weight * 100).toFixed(1)}%`}
                          >
                            {isMasked ? "-∞" : (weight * 100).toFixed(0)}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F2EFE9]/10 flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40">
              <span>COLOR INTENSITY = ATTENTION MAGNITUDE (Q·Kᵀ)</span>
              <span>-∞ = CAUSAL TRIANGULAR MASK</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
