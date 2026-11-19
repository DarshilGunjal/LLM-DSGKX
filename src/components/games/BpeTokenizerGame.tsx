"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

interface TokenSlice {
  text: string;
  id: number;
  bytes: number;
}

// Deterministic mock BPE hash for arbitrary strings
function simulateBpeTokenize(input: string): TokenSlice[] {
  if (!input) return [];

  // Common subwords / word pieces simulation
  const vocabDict: Record<string, number> = {
    "The": 464,
    "the": 262,
    " quick": 2068,
    " brown": 7586,
    " fox": 21831,
    " jumps": 18045,
    " over": 625,
    " lazy": 16931,
    " dog": 3290,
    "LLM": 32114,
    "Large": 7892,
    " Language": 12844,
    " Models": 6294,
    "trans": 1402,
    "former": 2407,
    "attention": 2812,
    "is": 318,
    "all": 477,
    "you": 345,
    "need": 761,
    "def": 756,
    " forward": 2130,
    "self": 2011,
    "return": 671,
    " ": 220,
    "ing": 278,
    "tion": 290,
  };

  const tokens: TokenSlice[] = [];
  let remaining = input;

  while (remaining.length > 0) {
    let matched = false;
    // Check known words / subwords longest first
    for (const key of Object.keys(vocabDict).sort((a, b) => b.length - a.length)) {
      if (remaining.startsWith(key)) {
        tokens.push({
          text: key,
          id: vocabDict[key],
          bytes: new TextEncoder().encode(key).length,
        });
        remaining = remaining.slice(key.length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Chunk 1-3 characters
      const len = Math.min(remaining.length, Math.random() > 0.4 ? 3 : 2);
      const piece = remaining.slice(0, len);
      // Generate deterministic pseudo-token ID from string hash
      let hash = 0;
      for (let i = 0; i < piece.length; i++) {
        hash = (hash << 5) - hash + piece.charCodeAt(i);
        hash |= 0;
      }
      tokens.push({
        text: piece,
        id: Math.abs(hash % 50000) + 1000,
        bytes: new TextEncoder().encode(piece).length,
      });
      remaining = remaining.slice(len);
    }
  }

  return tokens;
}

// Merge Battle initial state
const INITIAL_BATTLE_TOKENS = ["l", "o", "w", " ", "l", "o", "w", "e", "r", " ", "n", "e", "w", "e", "s", "t"];

export default function BpeTokenizerGame() {
  const [inputText, setInputText] = useState<string>("Large Language Models understand tokens, not words.");
  const [battleTokens, setBattleTokens] = useState<string[]>(INITIAL_BATTLE_TOKENS);
  const [mergeCount, setMergeCount] = useState<number>(0);
  const [message, setMessage] = useState<string>("Click two adjacent tokens to merge the most frequent subword pair!");

  const tokenized = simulateBpeTokenize(inputText);
  const totalBytes = new TextEncoder().encode(inputText).length;
  const compressionRatio = tokenized.length > 0 ? (totalBytes / tokenized.length).toFixed(2) : "0.00";

  // Merge battle logic
  const handleMergeClick = (index: number) => {
    if (index >= battleTokens.length - 1) return;

    const t1 = battleTokens[index];
    const t2 = battleTokens[index + 1];
    const merged = t1 + t2;

    // Check frequency of pair (t1, t2)
    let freq = 0;
    for (let i = 0; i < battleTokens.length - 1; i++) {
      if (battleTokens[i] === t1 && battleTokens[i + 1] === t2) {
        freq++;
      }
    }

    if (freq >= 2) {
      // Valid high-frequency BPE merge!
      const newTokens: string[] = [];
      let i = 0;
      while (i < battleTokens.length) {
        if (i < battleTokens.length - 1 && battleTokens[i] === t1 && battleTokens[i + 1] === t2) {
          newTokens.push(merged);
          i += 2;
        } else {
          newTokens.push(battleTokens[i]);
          i += 1;
        }
      }

      setBattleTokens(newTokens);
      setMergeCount((c) => c + 1);
      setMessage(`MERGE SUCCESS! Combined '${t1}' + '${t2}' → '${merged}' across ${freq} positions.`);

      if (newTokens.length <= 8) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.8 },
          colors: ["#FF3B00", "#F2EFE9"],
        });
      }
    } else {
      setMessage(`Pair ('${t1}', '${t2}') appears only ${freq} time(s). Find a pair that appears 2+ times!`);
    }
  };

  const resetBattle = () => {
    setBattleTokens(INITIAL_BATTLE_TOKENS);
    setMergeCount(0);
    setMessage("Battle reset. Find repeating adjacent character pairs!");
  };

  return (
    <section
      id="game-bpe"
      className="py-20 px-4 md:px-8 border-b border-[#F2EFE9]/15 bg-[#0B0B0C] select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F2EFE9]/15 pb-6 mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF3B00] mb-2">
              <span className="w-2 h-2 bg-[#FF3B00]"></span>
              <span>[GAME 03 // DISCRETIZATION LAB]</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-instrument italic text-[#F2EFE9]">
              BPE Tokenizer Slicer &amp; Merge Battle
            </h2>
          </div>
          <div className="font-mono text-xs text-[#F2EFE9]/60">
            VOCAB CAPACITY: <span className="text-[#F2EFE9] font-bold">50,257</span> TOKENS
          </div>
        </div>

        {/* Part A: Live Tokenizer Slicer */}
        <div className="border border-[#F2EFE9]/20 p-6 md:p-8 bg-[#0B0B0C] mb-12 swiss-grid">
          <div className="flex justify-between items-center text-xs font-mono text-[#FF3B00] border-b border-[#F2EFE9]/10 pb-3 mb-6">
            <span>[PART A: REAL-TIME TEXT DECOMPOSITION]</span>
            <span className="text-[#F2EFE9]/40">TYPE ANY PROMPT BELOW</span>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type anything here..."
              className="w-full bg-[#0B0B0C] border-2 border-[#F2EFE9]/30 p-4 font-mono text-base md:text-lg text-[#F2EFE9] focus:outline-none focus:border-[#FF3B00] transition-colors"
            />
          </div>

          {/* Sliced Tokens Grid */}
          <div className="flex flex-wrap gap-2 mb-6 min-h-[60px] p-4 bg-[#F2EFE9]/5 border border-[#F2EFE9]/10">
            {tokenized.map((tok, i) => (
              <div
                key={i}
                className="border border-[#FF3B00] bg-[#FF3B00]/10 px-3 py-1.5 flex flex-col items-center hover:bg-[#FF3B00] hover:text-[#0B0B0C] transition-all group"
              >
                <span className="font-mono font-bold text-sm text-[#F2EFE9] group-hover:text-[#0B0B0C]">
                  {tok.text === " " ? "␣" : tok.text}
                </span>
                <span className="font-mono text-[9px] text-[#FF3B00] group-hover:text-[#0B0B0C]/80 mt-0.5">
                  ID: {tok.id}
                </span>
              </div>
            ))}
          </div>

          {/* Telemetry Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#F2EFE9]/10 font-mono text-xs">
            <div>
              <span className="text-[#F2EFE9]/40 block text-[10px]">TOTAL CHARACTERS</span>
              <span className="text-lg font-bold text-[#F2EFE9]">{inputText.length}</span>
            </div>
            <div>
              <span className="text-[#F2EFE9]/40 block text-[10px]">TOTAL TOKENS</span>
              <span className="text-lg font-bold text-[#FF3B00]">{tokenized.length}</span>
            </div>
            <div>
              <span className="text-[#F2EFE9]/40 block text-[10px]">RAW UTF-8 BYTES</span>
              <span className="text-lg font-bold text-[#F2EFE9]">{totalBytes}B</span>
            </div>
            <div>
              <span className="text-[#F2EFE9]/40 block text-[10px]">BYTES / TOKEN RATIO</span>
              <span className="text-lg font-bold text-[#FF3B00]">{compressionRatio}x</span>
            </div>
          </div>
        </div>

        {/* Part B: Interactive Merge Battle Game */}
        <div className="border border-[#F2EFE9]/20 p-6 md:p-8 bg-[#0B0B0C]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F2EFE9]/10 pb-3 mb-6 gap-3">
            <div>
              <span className="text-xs font-mono text-[#FF3B00] font-bold">
                [PART B: THE BPE MERGE BATTLE GAME]
              </span>
              <p className="text-xs font-mono text-[#F2EFE9]/60 mt-1">
                Construct the vocabulary like Sennrich et al. (2015): Click adjacent characters that repeat to fuse them into tokens!
              </p>
            </div>
            <div className="flex items-center gap-4 font-mono text-xs">
              <span className="text-[#F2EFE9]/50">
                MERGES: <strong className="text-[#FF3B00]">{mergeCount}</strong>
              </span>
              <button
                onClick={resetBattle}
                className="px-3 py-1 border border-[#F2EFE9]/30 text-[#F2EFE9] hover:border-[#FF3B00] hover:text-[#FF3B00] transition-colors text-xs"
              >
                RESET BATTLE
              </button>
            </div>
          </div>

          {/* Battle Tokens Array */}
          <div className="flex flex-wrap gap-2 p-6 bg-[#0B0B0C] border border-[#F2EFE9]/15 mb-6 items-center">
            {battleTokens.map((t, idx) => (
              <button
                key={idx}
                onClick={() => handleMergeClick(idx)}
                data-cursor="MERGE"
                className="px-4 py-3 bg-[#F2EFE9]/5 border border-[#F2EFE9]/30 hover:border-[#FF3B00] hover:bg-[#FF3B00]/20 font-mono text-base md:text-lg font-bold text-[#F2EFE9] transition-all"
                title={`Click to try merging with next token`}
              >
                {t === " " ? "␣" : t}
              </button>
            ))}
          </div>

          <div className="font-mono text-xs text-[#FF3B00] bg-[#FF3B00]/10 border-l-2 border-[#FF3B00] p-3">
            {message}
          </div>
        </div>
      </div>
    </section>
  );
}
