"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import confetti from "canvas-confetti";

interface TokenRow {
  index: number;
  token: string;
  probability: number;
  inverseProb: number;
  surprisalBits: number;
  explanation?: string;
}

interface NextTokenCandidate {
  id: number;
  token: string;
  logit: number;
  probability: number;
}

// Preset Sentences with realistic GPT-2 conditional probability distributions
const SENTENCE_PRESETS: {
  label: string;
  sentence: string;
  tag: string;
  tokens: { token: string; p: number; note: string }[];
  nextCandidates: { token: string; logit: number }[];
}[] = [
  {
    label: "Natural Syntax",
    sentence: "I love Python",
    tag: "LOW PERPLEXITY (~2.3)",
    tokens: [
      { token: "I", p: 0.185, note: "Common sentence opener" },
      { token: "␣love", p: 0.428, note: "High verb affinity after personal pronoun" },
      { token: "␣Python", p: 0.284, note: "Predictable technical noun in software contexts" },
    ],
    nextCandidates: [
      { token: "␣programming", logit: 4.8 },
      { token: "␣code", logit: 3.9 },
      { token: "␣because", logit: 3.6 },
      { token: "␣so", logit: 2.9 },
      { token: "!", logit: 2.7 },
      { token: "␣for", logit: 2.3 },
      { token: ".", logit: 2.1 },
      { token: "␣syntax", logit: 1.8 },
    ],
  },
  {
    label: "Scrambled Syntax",
    sentence: "Python love I",
    tag: "EXPLODING PERPLEXITY (~142.8)",
    tokens: [
      { token: "Python", p: 0.042, note: "Uncommon start without article or context" },
      { token: "␣love", p: 0.008, note: "Grammatically invalid verb agreement after singular noun" },
      { token: "␣I", p: 0.003, note: "Severe structural anomaly: subject pronoun at clause tail" },
    ],
    nextCandidates: [
      { token: "␣you", logit: 4.2 },
      { token: "␣am", logit: 3.1 },
      { token: "?", logit: 2.8 },
      { token: "␣swear", logit: 2.4 },
      { token: "␣think", logit: 2.1 },
      { token: "␣mean", logit: 1.9 },
      { token: ".", logit: 1.6 },
      { token: "␣guess", logit: 1.4 },
    ],
  },
  {
    label: "High Factual Certainty",
    sentence: "The capital of France is Paris",
    tag: "MINIMAL SURPRISE (~1.6)",
    tokens: [
      { token: "The", p: 0.312, note: "Definite article: standard opener" },
      { token: "␣capital", p: 0.495, note: "Common entity subject" },
      { token: "␣of", p: 0.884, note: "Syntactically bound relational preposition" },
      { token: "␣France", p: 0.612, note: "High geographic colocation" },
      { token: "␣is", p: 0.941, note: "Near-certain copula link" },
      { token: "␣Paris", p: 0.965, note: "Dominant world knowledge association" },
    ],
    nextCandidates: [
      { token: ".", logit: 5.4 },
      { token: ",", logit: 3.8 },
      { token: "␣and", logit: 3.2 },
      { token: "␣which", logit: 2.6 },
      { token: "␣with", logit: 2.1 },
      { token: "—", logit: 1.8 },
      { token: "␣located", logit: 1.5 },
      { token: "␣in", logit: 1.2 },
    ],
  },
  {
    label: "Semantically Absurd (Chomsky)",
    sentence: "Colorless green ideas sleep furiously",
    tag: "SEMANTIC PARADOX (~86.4)",
    tokens: [
      { token: "Color", p: 0.045, note: "Uncommon sentence head" },
      { token: "less", p: 0.720, note: "Morphological suffix completion" },
      { token: "␣green", p: 0.012, note: "Oxymoronic adjective juxtaposition" },
      { token: "␣ideas", p: 0.009, note: "Abstract plural noun following color modifier" },
      { token: "␣sleep", p: 0.014, note: "Incompatible verb predicate for inanimate concept" },
      { token: "␣furiously", p: 0.018, note: "Manner adverb in semantic contradiction" },
    ],
    nextCandidates: [
      { token: ".", logit: 4.6 },
      { token: ",", logit: 3.4 },
      { token: "␣and", logit: 2.9 },
      { token: "␣in", logit: 2.2 },
      { token: "␣while", logit: 1.9 },
      { token: "—", logit: 1.7 },
      { token: "␣without", logit: 1.4 },
      { token: "␣awaiting", logit: 1.1 },
    ],
  },
  {
    label: "Technical Machine Learning",
    sentence: "Deep learning models minimize cross entropy",
    tag: "SPECIALIZED DOMAIN (~3.8)",
    tokens: [
      { token: "Deep", p: 0.165, note: "Standard domain prefix" },
      { token: "␣learning", p: 0.912, note: "Collocation lock: 'Deep' + 'learning'" },
      { token: "␣models", p: 0.542, note: "Typical subject noun" },
      { token: "␣minimize", p: 0.380, note: "Primary optimization verb" },
      { token: "␣cross", p: 0.620, note: "Loss function modifier" },
      { token: "␣entropy", p: 0.945, note: "Tight terminology pair" },
    ],
    nextCandidates: [
      { token: "␣loss", logit: 5.1 },
      { token: ".", logit: 3.9 },
      { token: "␣during", logit: 3.3 },
      { token: "␣using", logit: 2.8 },
      { token: "␣to", logit: 2.4 },
      { token: "␣via", logit: 2.0 },
      { token: "␣error", logit: 1.7 },
      { token: ",", logit: 1.4 },
    ],
  },
];

// Sandbox Presets
const SANDBOX_PRESETS = [
  {
    name: "I love Python (0.5, 0.8, 0.2)",
    data: [
      { token: "I", p: 0.5 },
      { token: "love", p: 0.8 },
      { token: "Python", p: 0.2 },
    ],
  },
  {
    name: "All 1/8 (Uniform Branching: PPL = 8.0)",
    data: [
      { token: "t1", p: 0.125 },
      { token: "t2", p: 0.125 },
      { token: "t3", p: 0.125 },
      { token: "t4", p: 0.125 },
      { token: "t5", p: 0.125 },
      { token: "t6", p: 0.125 },
      { token: "t7", p: 0.125 },
      { token: "t8", p: 0.125 },
    ],
  },
  {
    name: "One Surprising Word (Shock Spike)",
    data: [
      { token: "The", p: 0.95 },
      { token: "cat", p: 0.95 },
      { token: "sat", p: 0.95 },
      { token: "quantum", p: 0.005 },
    ],
  },
  {
    name: "Coin Flip (PPL = 2.0)",
    data: [
      { token: "heads", p: 0.5 },
      { token: "tails", p: 0.5 },
      { token: "heads", p: 0.5 },
      { token: "tails", p: 0.5 },
    ],
  },
  {
    name: "Absolute Certainty (PPL = 1.0)",
    data: [
      { token: "Paris", p: 1.0 },
      { token: "France", p: 1.0 },
      { token: "Europe", p: 1.0 },
    ],
  },
];

const QUIZ_QUESTIONS = [
  {
    q: "If a language model predicts each token with probability P = 0.10, what is its exact perplexity?",
    options: ["10.0", "1.0", "100.0", "0.10"],
    correct: "10.0",
    expl: "Because PPL = ( (1/0.10)^N )^(1/N) = (10^N)^(1/N) = 10. The model is as uncertain as choosing uniformly among 10 options.",
  },
  {
    q: "Which of the following scenarios will cause perplexity to explode dramatically?",
    options: [
      "A sentence with one single token of P = 0.0001",
      "A very long sentence with all P = 0.5",
      "A sentence ending in a period",
      "Using lower temperature sampling",
    ],
    correct: "A sentence with one single token of P = 0.0001",
    expl: "Because 1/0.0001 = 10,000! Even after the geometric mean root, a single near-zero probability drastically spikes perplexity.",
  },
  {
    q: "How is Perplexity mathematically connected to Cross-Entropy Loss (L)?",
    options: [
      "Perplexity = exp(Loss)",
      "Perplexity = Loss / N",
      "Perplexity = 1 / Loss",
      "Perplexity = log(Loss)",
    ],
    correct: "Perplexity = exp(Loss)",
    expl: "PPL = exp( -1/N * sum(ln P) ) = exp(Cross-Entropy Loss). Lower loss directly corresponds to lower perplexity.",
  },
];

export default function PerplexityPage() {
  // Module 1 State: Sentence Explorer
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number>(0);
  const [customSentence, setCustomSentence] = useState<string>("I love Python");
  const [temperature, setTemperature] = useState<number>(1.0);

  // Module 4 State: Interactive "Try It By Hand" Sandbox
  const [sandboxRows, setSandboxRows] = useState<{ id: string; token: string; p: number }[]>([
    { id: "1", token: "I", p: 0.5 },
    { id: "2", token: "love", p: 0.8 },
    { id: "3", token: "Python", p: 0.2 },
  ]);

  // Quiz State
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [quizChoice, setQuizChoice] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);

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

  // Active Sentence Data
  const activePreset = SENTENCE_PRESETS[selectedPresetIdx];

  // Token breakdown calculations for Active Sentence
  const sentenceTokens: TokenRow[] = useMemo(() => {
    return activePreset.tokens.map((t, i) => {
      const p = Math.max(0.0001, Math.min(1.0, t.p));
      const invP = 1 / p;
      const surprisal = -Math.log2(p);
      return {
        index: i + 1,
        token: t.token,
        probability: p,
        inverseProb: invP,
        surprisalBits: surprisal,
        explanation: t.note,
      };
    });
  }, [activePreset]);

  // Sentence Perplexity Math
  const sentenceMetrics = useMemo(() => {
    const N = sentenceTokens.length;
    if (N === 0) return { product: 0, crossEntropyLoss: 0, perplexity: 0 };

    let sumLog = 0;
    sentenceTokens.forEach((row) => {
      sumLog += -Math.log(row.probability);
    });

    const crossEntropyLoss = sumLog / N;
    const perplexity = Math.exp(crossEntropyLoss);
    const product = Math.exp(sumLog);

    return {
      product,
      crossEntropyLoss,
      perplexity,
      tokenCount: N,
    };
  }, [sentenceTokens]);

  // Next Token Candidates with Softmax Temperature Adjustment
  const shiftedCandidates: NextTokenCandidate[] = useMemo(() => {
    const base = activePreset.nextCandidates;
    const temp = Math.max(0.1, temperature);

    // Apply temperature scaling: logits / T
    const scaledLogits = base.map((c) => c.logit / temp);
    const maxLogit = Math.max(...scaledLogits);
    const expValues = scaledLogits.map((l) => Math.exp(l - maxLogit));
    const sumExp = expValues.reduce((a, b) => a + b, 0);

    return base.map((c, i) => ({
      id: i + 1,
      token: c.token,
      logit: c.logit,
      probability: expValues[i] / sumExp,
    }));
  }, [activePreset, temperature]);

  // Sandbox Perplexity Math
  const sandboxMetrics = useMemo(() => {
    const N = sandboxRows.length;
    if (N === 0) return { product: 0, ppl: 0, isValid: false };

    let sumLog = 0;
    let isValid = true;

    for (const r of sandboxRows) {
      if (r.p <= 0 || r.p > 1 || isNaN(r.p)) {
        isValid = false;
        break;
      }
      sumLog += -Math.log(r.p);
    }

    if (!isValid) return { product: 0, ppl: 0, isValid: false };

    const ppl = Math.exp(sumLog / N);
    const product = Math.exp(sumLog);

    return { product, ppl, isValid: true, N };
  }, [sandboxRows]);

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIdx(idx);
    setCustomSentence(SENTENCE_PRESETS[idx].sentence);
    playChirp(680, 0.05);
  };

  const handleAddSandboxRow = () => {
    setSandboxRows((prev) => [
      ...prev,
      { id: `tok-${Date.now()}`, token: "word", p: 0.5 },
    ]);
    playChirp(540, 0.04);
  };

  const handleRemoveSandboxRow = (id: string) => {
    setSandboxRows((prev) => prev.filter((r) => r.id !== id));
    playChirp(380, 0.04);
  };

  const handleUpdateSandboxRow = (id: string, field: "token" | "p", val: string | number) => {
    setSandboxRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const handleApplySandboxPreset = (preset: (typeof SANDBOX_PRESETS)[0]) => {
    setSandboxRows(
      preset.data.map((d, i) => ({
        id: `preset-${i}-${Date.now()}`,
        token: d.token,
        p: d.p,
      }))
    );
    playChirp(720, 0.06);
  };

  const handleQuizAnswer = (option: string) => {
    setQuizChoice(option);
    const isCorrect = option === QUIZ_QUESTIONS[quizIdx].correct;
    if (isCorrect) {
      setQuizScore((s) => s + 100);
      playChirp(880, 0.15);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#FF3B00", "#F2EFE9"],
      });
    } else {
      playChirp(240, 0.15);
    }
  };

  const handleNextQuiz = () => {
    setQuizChoice(null);
    setQuizIdx((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F2EFE9] font-mono selection:bg-[#FF3B00] selection:text-[#0B0B0C]">
      {/* Top Technical Navbar */}
      <header className="h-14 border-b border-[#F2EFE9]/15 bg-[#0B0B0C] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group" data-cursor="HOME">
            <div className="relative w-7 h-7 border border-[#FF3B00] bg-black overflow-hidden flex items-center justify-center">
              <Image
                src="/dsgkx-logo.jpg"
                alt="DSGKX Logo"
                width={28}
                height={28}
                className="object-contain"
                priority
              />
            </div>
            <span className="font-bold text-sm tracking-wider text-[#F2EFE9] group-hover:text-[#FF3B00] transition-colors">
              DSGKX // PERPLEXITY_ENGINE
            </span>
          </Link>

          <span className="text-[#F2EFE9]/30 text-xs hidden sm:inline">/</span>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#F2EFE9]/60">
            <span>Evaluation</span>
            <span>/</span>
            <span className="text-[#F2EFE9] font-bold">Information Theory</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/"
            className="px-3 py-1.5 border border-[#F2EFE9]/20 hover:border-[#FF3B00] text-[#F2EFE9]/70 hover:text-white transition-colors"
          >
            ← 8-Stage Architecture
          </Link>
          <Link
            href="/playground"
            className="px-3 py-1.5 border border-[#FF3B00] bg-[#FF3B00] text-[#0B0B0C] font-bold hover:bg-[#F2EFE9] transition-colors"
          >
            Groq LPU Playground ↗
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Hero Header */}
        <div className="border-b border-[#F2EFE9]/15 pb-8 space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#FF3B00] font-bold tracking-wider uppercase">
            <span className="w-2 h-2 bg-[#FF3B00] animate-pulse" />
            <span>[METRIC SPECIFICATION // PERPLEXITY (PPL) EXPLORER]</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-6xl font-instrument italic text-[#F2EFE9] leading-tight">
                The Geometry of Surprise: Deconstructing Perplexity
              </h1>
              <p className="font-mono text-xs sm:text-sm text-[#F2EFE9]/70 max-w-2xl mt-3 leading-relaxed">
                How a language model evaluates every token with conditional probability P(wᵢ | w&lt;ᵢ), and how those probabilities collapse into a single mathematical measurement of model certainty and branching factor.
              </p>
            </div>

            {/* Mathematical Formula Badge */}
            <div className="border border-[#FF3B00] bg-[#FF3B00]/5 p-4 font-mono text-xs text-[#F2EFE9] space-y-1 min-w-[320px]">
              <div className="text-[10px] text-[#FF3B00] font-bold uppercase tracking-wider">
                CORE MATHEMATICAL FORMULATION:
              </div>
              <div className="text-sm font-bold text-[#FF3B00]">
                PPL(W) = exp( − 1/N · ∑ ln P(wᵢ) )
              </div>
              <div className="text-[11px] text-[#F2EFE9]/60">
                = ( ∏ 1/P(wᵢ) )^(1/N) = 2^(Cross-Entropy)
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: Interactive Sentence Perplexity Laboratory */}
        <section className="border border-[#F2EFE9]/20 bg-[#0B0B0C] p-6 sm:p-8 swiss-grid space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F2EFE9]/10 pb-4 gap-2">
            <div>
              <div className="text-xs text-[#FF3B00] font-bold uppercase">
                [SECTION 01 // SENTENCE PROBABILITY EVALUATOR]
              </div>
              <div className="text-lg font-instrument italic text-[#F2EFE9]">
                Measure How Surprised the Model Is by Different Sequences
              </div>
            </div>
            <span className="px-2.5 py-1 text-[11px] border border-[#FF3B00] bg-[#FF3B00]/10 text-[#FF3B00] font-bold">
              {activePreset.tag}
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="text-[11px] text-[#F2EFE9]/50 uppercase tracking-wider block">
              SELECT PRESET OR TYPE YOUR OWN SENTENCE:
            </label>
            <div className="flex flex-wrap gap-2">
              {SENTENCE_PRESETS.map((p, idx) => (
                <button
                  key={p.label}
                  onClick={() => handleSelectPreset(idx)}
                  className={`px-3 py-1.5 text-xs font-mono border transition-all ${
                    selectedPresetIdx === idx
                      ? "border-[#FF3B00] bg-[#FF3B00] text-[#0B0B0C] font-bold"
                      : "border-[#F2EFE9]/20 text-[#F2EFE9]/80 hover:border-[#FF3B00] hover:text-white"
                  }`}
                >
                  &quot;{p.sentence}&quot;
                </button>
              ))}
            </div>
          </div>

          {/* Active Input Bar */}
          <div className="space-y-1">
            <input
              type="text"
              value={customSentence}
              onChange={(e) => setCustomSentence(e.target.value)}
              className="w-full bg-[#F2EFE9]/5 border-2 border-[#F2EFE9]/20 p-4 text-sm sm:text-base text-[#F2EFE9] font-mono focus:outline-none focus:border-[#FF3B00] transition-colors"
            />
            <div className="text-[11px] text-[#F2EFE9]/40 flex justify-between pt-1">
              <span>Notice how scrambled syntax (&quot;Python love I&quot;) destroys model confidence.</span>
              <span>Sequence Length: {sentenceMetrics.tokenCount} tokens</span>
            </div>
          </div>

          {/* Token-by-Token Surprisal Heatmap Ribbon */}
          <div className="border border-[#F2EFE9]/15 bg-[#0B0B0C]/80 p-4 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono text-[#F2EFE9]/60 border-b border-[#F2EFE9]/10 pb-2">
              <span className="text-[#FF3B00] font-bold uppercase">
                TOKEN SURPRISAL HEATMAP (SURPRISAL = −log₂ P IN BITS)
              </span>
              <span className="text-[10px]">
                GREEN = EXPECTED (LOW SURPRISE) | ORANGE = HIGH SHOCK
              </span>
            </div>

            <div className="flex flex-wrap gap-2 py-2">
              {sentenceTokens.map((t) => {
                const isHighShock = t.probability < 0.05;
                const isModerate = t.probability >= 0.05 && t.probability < 0.4;
                return (
                  <div
                    key={t.index}
                    className={`border p-2.5 space-y-1 min-w-[100px] transition-transform hover:scale-105 ${
                      isHighShock
                        ? "border-[#FF3B00] bg-[#FF3B00]/15"
                        : isModerate
                        ? "border-amber-500/40 bg-amber-500/10"
                        : "border-emerald-500/40 bg-emerald-500/10"
                    }`}
                  >
                    <div className="flex justify-between text-[10px] text-[#F2EFE9]/50">
                      <span>#{t.index}</span>
                      <span>{(t.probability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="font-bold text-sm text-[#F2EFE9]">
                      &quot;{t.token.replace(/ /g, "␣")}&quot;
                    </div>
                    <div className="text-[10px] text-[#FF3B00] font-bold">
                      {t.surprisalBits.toFixed(2)} bits
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Mathematical Decomposition Table */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#F2EFE9] border-b border-[#F2EFE9]/10 pb-2 flex justify-between">
              <span>STEP-BY-STEP PROBABILITY BREAKDOWN TABLE</span>
              <span className="text-[#F2EFE9]/40 text-[11px]">AUTOREGRESSIVE CHAIN RULE</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse font-mono">
                <thead>
                  <tr className="border-b border-[#F2EFE9]/20 text-[#F2EFE9]/60 text-[11px] bg-[#F2EFE9]/5">
                    <th className="p-3">#</th>
                    <th className="p-3">TOKEN wᵢ</th>
                    <th className="p-3">PROBABILITY P(wᵢ)</th>
                    <th className="p-3">INVERSE (1 / P)</th>
                    <th className="p-3">SURPRISAL (−log₂ P)</th>
                    <th className="p-3">LINGUISTIC REASONING</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EFE9]/10">
                  {sentenceTokens.map((r) => (
                    <tr key={r.index} className="hover:bg-[#F2EFE9]/5 transition-colors">
                      <td className="p-3 text-[#F2EFE9]/40">{r.index}</td>
                      <td className="p-3 font-bold text-[#F2EFE9]">
                        <span className="px-2 py-0.5 bg-[#F2EFE9]/10 border border-[#F2EFE9]/20">
                          {r.token.replace(/ /g, "␣")}
                        </span>
                      </td>
                      <td className="p-3 text-emerald-400 font-bold">
                        {r.probability.toFixed(4)}
                      </td>
                      <td className="p-3 text-[#FF3B00] font-bold">
                        {r.inverseProb.toFixed(2)}
                      </td>
                      <td className="p-3 text-[#F2EFE9]/70">
                        {r.surprisalBits.toFixed(2)} bits
                      </td>
                      <td className="p-3 text-[#F2EFE9]/60 text-[11px]">
                        {r.explanation || "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 3-Step Mathematical Calculation Callout */}
            <div className="p-5 bg-[#FF3B00]/5 border-2 border-[#FF3B00] space-y-3">
              <div className="text-xs text-[#FF3B00] font-bold uppercase tracking-wider">
                HOW PERPLEXITY WAS CALCULATED FOR THIS SEQUENCE:
              </div>

              <div className="space-y-1 text-xs text-[#F2EFE9] leading-relaxed">
                <div>
                  <strong className="text-[#FF3B00]">Step 1 (Inverse Product):</strong> Multiply all (1/P) values:{" "}
                  {sentenceTokens.slice(0, 4).map((r) => r.inverseProb.toFixed(1)).join(" × ")}
                  {sentenceTokens.length > 4 ? " × …" : ""} ={" "}
                  <span className="font-bold text-[#FF3B00]">{sentenceMetrics.product.toExponential(2)}</span>
                </div>
                <div>
                  <strong className="text-[#FF3B00]">Step 2 (Sequence Cardinality):</strong> Count tokens:{" "}
                  <span className="font-bold text-[#F2EFE9]">N = {sentenceMetrics.tokenCount}</span>
                </div>
                <div>
                  <strong className="text-[#FF3B00]">Step 3 (N-th Geometric Root):</strong> (Product)^(1/{sentenceMetrics.tokenCount}) ={" "}
                  <span className="text-xl font-bold text-[#FF3B00] bg-[#FF3B00]/10 px-2 py-0.5">
                    {sentenceMetrics.perplexity.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="text-xs text-[#F2EFE9]/80 border-t border-[#FF3B00]/30 pt-3">
                <span className="text-[#FF3B00] font-bold">BRANCHING FACTOR INTUITION: </span>
                A perplexity of <strong>{sentenceMetrics.perplexity.toFixed(2)}</strong> means that at each token step, the model was as uncertain as if it had to choose uniformly among{" "}
                <span className="text-[#FF3B00] font-bold">
                  {Math.round(sentenceMetrics.perplexity)} equally probable words
                </span>.
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Next-Token Horizon & Temperature Shifter */}
        <section className="border border-[#F2EFE9]/20 bg-[#0B0B0C] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F2EFE9]/10 pb-4 gap-2">
            <div>
              <div className="text-xs text-[#FF3B00] font-bold uppercase">
                [SECTION 02 // NEXT-TOKEN SOFTMAX HORIZON]
              </div>
              <div className="text-lg font-instrument italic text-[#F2EFE9]">
                What Does the Model Predict Immediately Following This Sentence?
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="flex items-center gap-3 font-mono text-xs border border-[#F2EFE9]/20 px-3 py-1.5 bg-[#0B0B0C]">
              <span className="text-[#F2EFE9]/60">TEMPERATURE T:</span>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-24 accent-[#FF3B00] cursor-pointer"
              />
              <span className="text-[#FF3B00] font-bold w-8">{temperature.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-xs font-mono text-[#F2EFE9]/70 leading-relaxed">
            The model computes raw unnormalized logits for all 50,257 vocabulary tokens. Notice how lower temperature ($T \to 0.1$) sharpens probability onto the top token (reducing surprise), whereas higher temperature ($T \to 2.0$) flattens the distribution towards maximum entropy.
          </p>

          {/* Top 8 Candidate Bar Visualizer */}
          <div className="space-y-2 pt-2">
            {shiftedCandidates.map((c, rank) => {
              const maxP = shiftedCandidates[0].probability || 1;
              const fillPct = (c.probability / maxP) * 100;
              return (
                <div
                  key={c.id}
                  className={`grid grid-cols-12 gap-3 items-center p-2 border font-mono text-xs transition-colors ${
                    rank === 0
                      ? "border-[#FF3B00] bg-[#FF3B00]/10 text-[#F2EFE9]"
                      : "border-[#F2EFE9]/10 bg-[#0B0B0C] text-[#F2EFE9]/80"
                  }`}
                >
                  <div className="col-span-1 text-[#F2EFE9]/40 font-bold">
                    #{rank + 1}
                  </div>
                  <div className="col-span-3 font-bold truncate">
                    &quot;{c.token.replace(/ /g, "␣")}&quot;
                  </div>
                  <div className="col-span-6 h-3 bg-[#F2EFE9]/10 overflow-hidden relative">
                    <div
                      className={`h-full transition-all duration-300 ${
                        rank === 0 ? "bg-[#FF3B00]" : "bg-[#F2EFE9]/60"
                      }`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                  <div className="col-span-2 text-right font-bold text-[#FF3B00]">
                    {(c.probability * 100).toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: "Try It By Hand" Mathematical Sandbox */}
        <section className="border border-[#F2EFE9]/20 bg-[#0B0B0C] p-6 sm:p-8 swiss-grid space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F2EFE9]/10 pb-4 gap-2">
            <div>
              <div className="text-xs text-[#FF3B00] font-bold uppercase">
                [SECTION 03 // SIMULATOR SANDBOX: TRY IT BY HAND]
              </div>
              <div className="text-lg font-instrument italic text-[#F2EFE9]">
                Manual Probability Injection &amp; Geometric Mean Lab
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 border border-[#F2EFE9]/20 text-[#F2EFE9]/60">
              CUSTOM PROBABILITY VECTORS
            </span>
          </div>

          <p className="text-xs font-mono text-[#F2EFE9]/70 leading-relaxed">
            Configure custom token sequences and assign arbitrary probabilities between $0.0001$ and $1.00$. Notice how if every token has probability $1/8 = 0.125$, the perplexity is <strong>exactly 8.0</strong>!
          </p>

          {/* Sandbox Presets */}
          <div className="space-y-2">
            <span className="text-[10px] text-[#F2EFE9]/50 uppercase tracking-wider block">
              QUICK EXPERIMENT PRESETS:
            </span>
            <div className="flex flex-wrap gap-2">
              {SANDBOX_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => handleApplySandboxPreset(p)}
                  className="px-3 py-1.5 text-xs font-mono border border-[#F2EFE9]/20 hover:border-[#FF3B00] text-[#F2EFE9]/80 hover:text-white transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Row Inputs */}
          <div className="space-y-2.5 pt-2">
            {sandboxRows.map((r, i) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center gap-3 p-3 border border-[#F2EFE9]/15 bg-[#0B0B0C]"
              >
                <span className="text-xs text-[#F2EFE9]/40 w-6">#{i + 1}</span>

                <input
                  type="text"
                  value={r.token}
                  onChange={(e) => handleUpdateSandboxRow(r.id, "token", e.target.value)}
                  placeholder="Token"
                  className="w-28 bg-[#F2EFE9]/5 border border-[#F2EFE9]/20 p-2 text-xs font-mono text-[#F2EFE9] focus:outline-none focus:border-[#FF3B00]"
                />

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#F2EFE9]/50">P =</span>
                  <input
                    type="number"
                    min="0.0001"
                    max="1.0"
                    step="0.05"
                    value={r.p}
                    onChange={(e) =>
                      handleUpdateSandboxRow(r.id, "p", parseFloat(e.target.value) || 0)
                    }
                    className="w-24 bg-[#F2EFE9]/5 border border-[#F2EFE9]/20 p-2 text-xs font-mono text-[#FF3B00] font-bold focus:outline-none focus:border-[#FF3B00]"
                  />
                </div>

                <div className="text-[11px] text-[#F2EFE9]/60 font-mono">
                  1/P = <span className="text-[#F2EFE9] font-bold">{r.p > 0 ? (1 / r.p).toFixed(2) : "∞"}</span>
                </div>

                {sandboxRows.length > 1 && (
                  <button
                    onClick={() => handleRemoveSandboxRow(r.id)}
                    className="ml-auto text-xs px-2.5 py-1 border border-red-500/30 text-red-400 hover:bg-red-950/30 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={handleAddSandboxRow}
              className="px-4 py-2 border border-[#FF3B00] text-xs font-bold text-[#FF3B00] hover:bg-[#FF3B00] hover:text-[#0B0B0C] transition-colors flex items-center gap-1.5"
            >
              <span>+ Add Token</span>
            </button>
          </div>

          {/* Sandbox Live Math Output */}
          {sandboxMetrics.isValid ? (
            <div className="p-5 bg-[#F2EFE9]/5 border border-[#F2EFE9]/20 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#F2EFE9]/10 pb-2">
                <span className="text-[#FF3B00] font-bold uppercase">
                  SANDBOX CALCULATION RESULT
                </span>
                <span className="text-[#F2EFE9]/40">{sandboxMetrics.N} TOKENS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div>
                  <span className="text-[10px] text-[#F2EFE9]/50 block">INVERSE PRODUCT ∏(1/P)</span>
                  <span className="text-base font-bold text-[#F2EFE9]">
                    {sandboxMetrics.product.toExponential(3)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#F2EFE9]/50 block">GEOMETRIC ROOT EXPONENT</span>
                  <span className="text-base font-bold text-[#F2EFE9]">
                    1 / {sandboxMetrics.N}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#FF3B00] font-bold block">PERPLEXITY SCORE</span>
                  <span className="text-2xl font-bold text-[#FF3B00]">
                    {sandboxMetrics.ppl.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border border-red-500 bg-red-950/20 text-red-400 text-xs font-mono">
              ⚠ Invalid probabilities detected. Every probability P must satisfy 0 &lt; P ≤ 1.
            </div>
          )}
        </section>

        {/* SECTION 4: Interactive Branching Tree Visualizer */}
        <section className="border border-[#F2EFE9]/20 bg-[#0B0B0C] p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-[#F2EFE9]/10 pb-4">
            <div>
              <div className="text-xs text-[#FF3B00] font-bold uppercase">
                [SECTION 04 // THE BRANCHING FACTOR PARADIGM]
              </div>
              <div className="text-lg font-instrument italic text-[#F2EFE9]">
                Visualizing Language as an N-Sided Decision Die
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Tree 1: Deterministic */}
            <div className="border border-[#F2EFE9]/15 p-5 bg-[#0B0B0C] space-y-3">
              <div className="flex justify-between text-[11px] text-[#FF3B00] font-bold border-b border-[#F2EFE9]/10 pb-2">
                <span>PPL = 1.0</span>
                <span>ZERO ENTROPY</span>
              </div>
              <p className="text-[#F2EFE9]/70 text-[11px]">
                Deterministic execution. Exactly 1 path exists with 100% probability. The model acts like a 1-sided coin.
              </p>
              <div className="p-3 bg-[#F2EFE9]/5 border border-[#F2EFE9]/10 text-center font-bold text-emerald-400">
                Token A ──(100%)──&gt; Token B
              </div>
            </div>

            {/* Tree 2: Human Language Normal */}
            <div className="border border-[#FF3B00] p-5 bg-[#FF3B00]/5 space-y-3">
              <div className="flex justify-between text-[11px] text-[#FF3B00] font-bold border-b border-[#FF3B00]/20 pb-2">
                <span>PPL ≈ 4.0 – 12.0</span>
                <span>NATURAL FLUENCY</span>
              </div>
              <p className="text-[#F2EFE9]/70 text-[11px]">
                Rich, coherent expression. At each point, 4 to 12 viable words make syntactic sense. High coherence with stylistic freedom.
              </p>
              <div className="p-3 bg-[#0B0B0C] border border-[#FF3B00]/30 text-center text-xs space-y-1">
                <div className="text-[#FF3B00] font-bold">Branching: ~4 to 8 choices</div>
                <div className="text-[10px] text-[#F2EFE9]/50">PPL = 2^(Shannon Entropy)</div>
              </div>
            </div>

            {/* Tree 3: Pure Randomness */}
            <div className="border border-[#F2EFE9]/15 p-5 bg-[#0B0B0C] space-y-3">
              <div className="flex justify-between text-[11px] text-red-400 font-bold border-b border-[#F2EFE9]/10 pb-2">
                <span>PPL = 50,257</span>
                <span>MAXIMUM CHAOS</span>
              </div>
              <p className="text-[#F2EFE9]/70 text-[11px]">
                Uniform random noise over vocabulary. Complete hallucinations with zero semantic or syntactic correlation.
              </p>
              <div className="p-3 bg-[#F2EFE9]/5 border border-[#F2EFE9]/10 text-center font-bold text-red-400">
                50,257 Equally Likely Tokens
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Knowledge Check & Intuition Arena */}
        <section className="border border-[#F2EFE9]/20 bg-[#0B0B0C] p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-[#F2EFE9]/10 pb-4">
            <div>
              <div className="text-xs text-[#FF3B00] font-bold uppercase">
                [SECTION 05 // KNOWLEDGE CHECK &amp; EVALUATION]
              </div>
              <div className="text-lg font-instrument italic text-[#F2EFE9]">
                Test Your Intuition on Language Model Evaluation
              </div>
            </div>
            <span className="text-xs font-mono text-[#F2EFE9]/60">
              SCORE: <strong className="text-[#FF3B00]">{quizScore} PTS</strong>
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs max-w-2xl">
            <div className="text-sm font-bold text-[#F2EFE9]">
              {QUIZ_QUESTIONS[quizIdx].q}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {QUIZ_QUESTIONS[quizIdx].options.map((opt) => {
                const isPicked = quizChoice === opt;
                const isCorrect = opt === QUIZ_QUESTIONS[quizIdx].correct;

                return (
                  <button
                    key={opt}
                    onClick={() => handleQuizAnswer(opt)}
                    disabled={quizChoice !== null}
                    className={`p-3 border text-left transition-all font-mono text-xs ${
                      quizChoice
                        ? isCorrect
                          ? "border-[#FF3B00] bg-[#FF3B00] text-[#0B0B0C] font-bold"
                          : isPicked
                          ? "border-red-500 bg-red-950/40 text-red-300"
                          : "border-[#F2EFE9]/10 text-[#F2EFE9]/30"
                        : "border-[#F2EFE9]/20 hover:border-[#FF3B00] text-[#F2EFE9] hover:bg-[#F2EFE9]/5"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {quizChoice && (
              <div className="p-4 bg-[#F2EFE9]/5 border border-[#F2EFE9]/15 space-y-3 pt-3">
                <p className="text-[#F2EFE9]/80 text-[11px] leading-relaxed">
                  {QUIZ_QUESTIONS[quizIdx].expl}
                </p>
                <button
                  onClick={handleNextQuiz}
                  className="px-4 py-2 bg-[#FF3B00] text-[#0B0B0C] font-bold uppercase text-xs hover:bg-[#F2EFE9] transition-colors"
                >
                  Next Question →
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#F2EFE9]/15 bg-[#0B0B0C] py-10 px-4 sm:px-6 lg:px-8 text-xs font-mono text-[#F2EFE9]/50 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[#FF3B00] font-bold">DSGKX // METRICS</span>
            <span>PERPLEXITY MATHEMATICAL SPECIFICATION</span>
          </div>
          <div>
            CITATION: <span className="text-[#F2EFE9]">Shannon (1948), Jelinek (1977), Xenova (2023)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
