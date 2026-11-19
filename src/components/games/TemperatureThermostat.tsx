"use client";

import { useState } from "react";

interface LogitItem {
  token: string;
  logit: number;
}

const BASE_LOGITS: LogitItem[] = [
  { token: " intelligent", logit: 6.8 },
  { token: " powerful", logit: 5.4 },
  { token: " dangerous", logit: 4.2 },
  { token: " synthetic", logit: 3.1 },
  { token: " purple", logit: 1.2 },
  { token: " vibrating", logit: 0.1 },
  { token: " toaster", logit: -1.5 },
];

export default function TemperatureThermostat() {
  const [temperature, setTemperature] = useState<number>(0.7);

  // Softmax with temperature: P(w_i) = exp(z_i / T) / sum(exp(z_j / T))
  const T = Math.max(0.02, temperature);
  const exps = BASE_LOGITS.map((item) => Math.exp(item.logit / T));
  const sumExp = exps.reduce((acc, v) => acc + v, 0);

  const probabilities = BASE_LOGITS.map((item, idx) => {
    const prob = exps[idx] / sumExp;
    return {
      ...item,
      prob,
    };
  });

  // Calculate Shannon Entropy: H = - sum(p * log2(p))
  const entropy = probabilities.reduce((acc, item) => {
    if (item.prob <= 0.00001) return acc;
    return acc - item.prob * Math.log2(item.prob);
  }, 0);

  // Regime classification
  let regime = {
    name: "ZONE 02: COHERENT EQUILIBRIUM",
    color: "#F2EFE9",
    desc: "Balanced entropy: fluent conversational prose, natural variety, high factual retention.",
    sampleOutput: "Large language models are intelligent and powerful systems capable of complex reasoning.",
  };

  if (T < 0.3) {
    regime = {
      name: "ZONE 01: CRYOGENIC GREEDY (ARGMAX)",
      color: "#38bdf8",
      desc: "Zero variance. Deterministic greedy choice. Highly prone to looping and rigid repetition.",
      sampleOutput: "Large language models are intelligent intelligent intelligent intelligent systems.",
    };
  } else if (T > 1.3) {
    regime = {
      name: "ZONE 03: HALLUCINATORY INFERNO",
      color: "#FF3B00",
      desc: "Entropy explosion. Logits flatten into uniform noise. Rare, nonsensical tokens dominate.",
      sampleOutput: "Large language models are vibrating toaster purple synthetic quantum metaphysics.",
    };
  }

  return (
    <section
      id="game-thermostat"
      className="py-20 px-4 md:px-8 border-b border-[#F2EFE9]/15 bg-[#0B0B0C] select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F2EFE9]/15 pb-6 mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF3B00] mb-2">
              <span className="w-2 h-2 bg-[#FF3B00]"></span>
              <span>[GAME 06 // ENTROPY &amp; HALLUCINATION THERMOSTAT]</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-instrument italic text-[#F2EFE9]">
              The Temperature Dial &amp; Shannon Entropy
            </h2>
          </div>
          <div className="font-mono text-xs text-[#F2EFE9]/60">
            EQUATION: <span className="text-[#FF3B00] font-bold">P(wᵢ) = e^(zᵢ/T) / ∑e^(zⱼ/T)</span>
          </div>
        </div>

        {/* Console Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Thermostat Dial & Output Preview (5 cols) */}
          <div className="lg:col-span-5 border border-[#F2EFE9]/20 p-6 md:p-8 bg-[#0B0B0C] space-y-6">
            <div className="border-b border-[#F2EFE9]/10 pb-3 flex justify-between items-center text-xs font-mono">
              <span className="text-[#FF3B00] font-bold">[THERMOSTAT CONTROLLER]</span>
              <span className="text-[#F2EFE9]/50">T ∈ [0.01, 2.50]</span>
            </div>

            {/* Massive Numerical Temperature Display */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#F2EFE9]/40 block uppercase">
                  TEMPERATURE CONSTANT
                </span>
                <span className="font-mono text-5xl md:text-6xl font-bold text-[#FF3B00]">
                  T = {temperature.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#F2EFE9]/40 block uppercase">
                  SHANNON ENTROPY
                </span>
                <span className="font-mono text-2xl md:text-3xl font-bold text-[#F2EFE9]">
                  {entropy.toFixed(3)}{" "}
                  <span className="text-xs text-[#F2EFE9]/50">bits</span>
                </span>
              </div>
            </div>

            {/* Range Slider */}
            <div>
              <input
                type="range"
                min="0.05"
                max="2.5"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#FF3B00] bg-[#F2EFE9]/10 h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#F2EFE9]/40 mt-2">
                <span>0.05 (Frozen Argmax)</span>
                <span>0.70 (Default)</span>
                <span>2.50 (Chaos)</span>
              </div>
            </div>

            {/* Regime State Box */}
            <div className="p-4 border border-[#F2EFE9]/20 bg-[#F2EFE9]/5 space-y-2 font-mono text-xs">
              <div className="font-bold flex items-center gap-2" style={{ color: regime.color }}>
                <span className="w-2 h-2 inline-block" style={{ backgroundColor: regime.color }} />
                <span>{regime.name}</span>
              </div>
              <p className="text-[#F2EFE9]/70 leading-relaxed text-[11px]">
                {regime.desc}
              </p>
            </div>

            {/* Live Model Generation Sample */}
            <div className="border border-[#F2EFE9]/15 p-4 bg-[#0B0B0C] font-mono text-xs space-y-2">
              <span className="text-[10px] text-[#F2EFE9]/40 block uppercase">
                SYNTHESIZED COMPLETION PREVIEW
              </span>
              <div className="text-[#F2EFE9] italic font-instrument text-base leading-relaxed">
                &quot;{regime.sampleOutput}&quot;
              </div>
            </div>
          </div>

          {/* Right: Softmax Distribution Probability Bars (7 cols) */}
          <div className="lg:col-span-7 border border-[#F2EFE9]/20 p-6 md:p-8 bg-[#0B0B0C] space-y-4">
            <div className="flex justify-between items-center text-xs font-mono text-[#FF3B00] border-b border-[#F2EFE9]/10 pb-3">
              <span>[RESCALED SOFTMAX PROBABILITIES]</span>
              <span className="text-[#F2EFE9]/40">CONTEXT: &quot;Large language models are...&quot;</span>
            </div>

            {/* Bars List */}
            <div className="space-y-4 pt-2">
              {probabilities.map((item) => {
                const pct = (item.prob * 100).toFixed(1);
                const isDominant = item.prob > 0.4;

                return (
                  <div key={item.token} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <span className="text-[#F2EFE9] font-bold">&quot;{item.token}&quot;</span>
                        <span className="text-[10px] text-[#F2EFE9]/40">
                          Raw logit: {item.logit.toFixed(1)}
                        </span>
                      </div>
                      <span className={`font-bold ${isDominant ? "text-[#FF3B00]" : "text-[#F2EFE9]/70"}`}>
                        {pct}%
                      </span>
                    </div>

                    <div className="w-full h-3 bg-[#F2EFE9]/10 overflow-hidden relative">
                      <div
                        className={`h-full transition-all duration-150 ease-out ${
                          isDominant ? "bg-[#FF3B00]" : "bg-[#F2EFE9]/60"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#F2EFE9]/10 text-[11px] font-mono text-[#F2EFE9]/50 flex justify-between">
              <span>Notice: At high T, low logit tokens like &apos;toaster&apos; gain probability mass.</span>
              <span className="text-[#FF3B00]">SUM = 100.0%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
