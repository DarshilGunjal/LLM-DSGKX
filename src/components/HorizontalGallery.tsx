"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StageInfo {
  index: string;
  tag: string;
  title: string;
  math: string;
  tensor: string;
  description: string;
  keyInsight: string;
  gameTargetId?: string;
  gameLabel?: string;
  renderVisual: () => JSX.Element;
}

export default function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Interactive state for visual widgets
  const [bpeActivePair, setBpeActivePair] = useState<number>(0);
  const [ropeStep, setRopeStep] = useState<number>(4);

  const STAGES: StageInfo[] = [
    {
      index: "01",
      tag: "DISCRETIZATION",
      title: "Byte-Pair Encoding (BPE)",
      math: "V = {c₁, c₂, ..., c₅₀₂₅₇} ⊂ ∪ₖ Σᵏ",
      tensor: "Text String → Token IDs [Seq_Len]",
      description:
        "Computers cannot parse continuous human thought. The tokenizer decomposes raw UTF-8 byte streams into discrete mathematical tokens using statistical frequency merging. Frequent character pairs like 'th' + 'e' fuse into single vocabulary indices.",
      keyInsight: "Tokens are not words. 1,000 words ≈ 750 tokens.",
      gameTargetId: "#game-bpe",
      gameLabel: "TRY BPE SLICER [GAME 03] ↗",
      renderVisual: () => (
        <div className="w-full h-full border border-[#F2EFE9]/20 bg-[#0B0B0C] p-6 flex flex-col justify-between swiss-grid">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 border-b border-[#F2EFE9]/10 pb-2">
            <span>SUBWORD MERGE TREE HIERARCHY</span>
            <span className="text-[#FF3B00]">FREQ: 142,890 OCCURRENCES</span>
          </div>

          <div className="space-y-4 my-auto py-2">
            <div className="font-mono text-xs text-[#F2EFE9]/60">
              RAW BYTES: <span className="text-[#FF3B00]">0x55 0x6E 0x62 0x65 0x6C 0x69 0x65 0x76 0x65</span>
            </div>

            {/* Tree Merge Diagram */}
            <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
              <div className="p-2 border border-[#F2EFE9]/20 bg-[#F2EFE9]/5">
                <span className="text-[10px] text-[#F2EFE9]/40 block">CHAR</span>
                <span className="font-bold text-[#F2EFE9]">&quot;un&quot;</span>
                <span className="text-[9px] text-[#FF3B00] block">ID: 284</span>
              </div>
              <div className="p-2 border border-[#FF3B00] bg-[#FF3B00]/10">
                <span className="text-[10px] text-[#FF3B00] block">SUBWORD</span>
                <span className="font-bold text-[#F2EFE9]">&quot;believ&quot;</span>
                <span className="text-[9px] text-[#FF3B00] block">ID: 15420</span>
              </div>
              <div className="p-2 border border-[#F2EFE9]/20 bg-[#F2EFE9]/5">
                <span className="text-[10px] text-[#F2EFE9]/40 block">SUFFIX</span>
                <span className="font-bold text-[#F2EFE9]">&quot;able&quot;</span>
                <span className="text-[9px] text-[#FF3B00] block">ID: 481</span>
              </div>
              <div className="p-2 border border-[#F2EFE9]/20 bg-[#F2EFE9]/5">
                <span className="text-[10px] text-[#F2EFE9]/40 block">PUNCT</span>
                <span className="font-bold text-[#F2EFE9]">&quot;!&quot;</span>
                <span className="text-[9px] text-[#FF3B00] block">ID: 0</span>
              </div>
            </div>

            {/* Matrix representation */}
            <div className="p-3 bg-[#F2EFE9]/5 border border-[#F2EFE9]/10 font-mono text-[11px] text-[#F2EFE9]/70 space-y-1">
              <div className="text-[#FF3B00] font-bold">// TENSOR DISCRETIZATION:</div>
              <div>Input: &quot;unbelievable!&quot; (13 characters)</div>
              <div>Output Vector: [284, 15420, 481, 0] (4 tokens)</div>
              <div className="text-[#F2EFE9]">Compression Factor: 3.25x efficiency</div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 pt-2 border-t border-[#F2EFE9]/10">
            <span>VOCABULARY: GPT-4 BPE (100K CL100K_BASE)</span>
            <span className="text-[#FF3B00]">STATUS: DISCRETIZED</span>
          </div>
        </div>
      ),
    },
    {
      index: "02",
      tag: "GEOMETRIZATION",
      title: "Latent Vector Embeddings",
      math: "E(t) = W_e[t] ∈ ℝ⁴⁰⁹⁶",
      tensor: "[Seq_Len] → [Seq_Len, 4096]",
      description:
        "Each discrete token ID is projected into a 4,096-dimensional continuous geometric space. In this non-Euclidean landscape, semantic meaning corresponds to directional orientation: King - Man + Woman lands within epsilon of Queen.",
      keyInsight: "Cosine similarity measures semantic parallelism.",
      gameTargetId: "#game-vector",
      gameLabel: "EXPLORE 3D LATENT SPACE [GAME 05] ↗",
      renderVisual: () => (
        <div className="w-full h-full border border-[#F2EFE9]/20 bg-[#0B0B0C] p-6 flex flex-col justify-between swiss-grid">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 border-b border-[#F2EFE9]/10 pb-2">
            <span>HIGH-DIMENSIONAL COSINE PROJECTION RADAR</span>
            <span className="text-[#FF3B00]">DIM: ℝ⁴⁰⁹⁶</span>
          </div>

          <div className="my-auto py-2 space-y-3">
            {/* Visual Vector Bars */}
            <div className="space-y-2 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-[#F2EFE9]/60 mb-1">
                  <span>VECTOR(KING): [0.82, -0.41, 0.95, ... 4093 more]</span>
                  <span className="text-[#FF3B00]">‖v‖ = 1.0</span>
                </div>
                <div className="w-full h-2 bg-[#F2EFE9]/10 overflow-hidden">
                  <div className="h-full bg-[#FF3B00]" style={{ width: "82%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#F2EFE9]/60 mb-1">
                  <span>VECTOR(QUEEN): [0.81, -0.39, 0.93, ... 4093 more]</span>
                  <span className="text-[#F2EFE9]">COS: 0.962</span>
                </div>
                <div className="w-full h-2 bg-[#F2EFE9]/10 overflow-hidden">
                  <div className="h-full bg-[#F2EFE9]" style={{ width: "80%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#F2EFE9]/60 mb-1">
                  <span>VECTOR(APPLE): [-0.12, 0.65, -0.44, ... 4093 more]</span>
                  <span className="text-[#F2EFE9]/40">COS: 0.081</span>
                </div>
                <div className="w-full h-2 bg-[#F2EFE9]/10 overflow-hidden">
                  <div className="h-full bg-[#F2EFE9]/30" style={{ width: "12%" }} />
                </div>
              </div>
            </div>

            {/* Geometric Analogy Readout */}
            <div className="p-3 bg-[#FF3B00]/10 border-l-2 border-[#FF3B00] font-mono text-xs text-[#F2EFE9]">
              <span className="text-[#FF3B00] font-bold">PARALLEL MANIFOLD:</span>
              <div className="mt-1">
                Vector(&quot;Paris&quot;) - Vector(&quot;France&quot;) + Vector(&quot;Japan&quot;) ≈ Vector(&quot;Tokyo&quot;)
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 pt-2 border-t border-[#F2EFE9]/10">
            <span>METRIC: COSINE SIMILARITY (A·B / ‖A‖‖B‖)</span>
            <span className="text-[#FF3B00]">TOPOLOGY: NORMALIZED</span>
          </div>
        </div>
      ),
    },
    {
      index: "03",
      tag: "TEMPORALITY",
      title: "Positional Encodings (RoPE)",
      math: "R_Θ,m d · x_m = (x_m e^{imθ})",
      tensor: "Positional Bias [Seq_Len, d_k]",
      description:
        "Transformers process all tokens simultaneously (in parallel), having no inherent sense of sequence order. Rotary Position Embeddings (RoPE) rotate Query and Key vector pairs in complex planes by an angle proportional to their token position.",
      keyInsight: "'Dog bites man' ≠ 'Man bites dog'. Order is geometry.",
      renderVisual: () => (
        <div className="w-full h-full border border-[#F2EFE9]/20 bg-[#0B0B0C] p-6 flex flex-col justify-between swiss-grid">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 border-b border-[#F2EFE9]/10 pb-2">
            <span>ROTARY HARMONIC FREQUENCY SPECTRUM</span>
            <span className="text-[#FF3B00]">θ_i = 10000^(-2(i-1)/d)</span>
          </div>

          <div className="my-auto py-2 space-y-3 font-mono text-xs">
            {/* Visual Waveforms representation */}
            <div className="space-y-2">
              <div className="text-[11px] text-[#F2EFE9]/60 flex justify-between">
                <span>HIGH FREQUENCY (LOCAL TOKENS)</span>
                <span className="text-[#FF3B00]">λ = 2π / θ₀</span>
              </div>
              <div className="h-6 flex items-center gap-1 border-b border-[#F2EFE9]/15 pb-1">
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[#FF3B00] transition-all"
                    style={{
                      height: `${Math.abs(Math.sin((i / 24) * Math.PI * 4)) * 100}%`,
                    }}
                  />
                ))}
              </div>

              <div className="text-[11px] text-[#F2EFE9]/60 flex justify-between pt-1">
                <span>LOW FREQUENCY (LONG CONTEXT)</span>
                <span className="text-[#F2EFE9]">λ = 2π / θ_d</span>
              </div>
              <div className="h-6 flex items-center gap-1 border-b border-[#F2EFE9]/15 pb-1">
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[#F2EFE9] opacity-75"
                    style={{
                      height: `${Math.abs(Math.sin((i / 24) * Math.PI)) * 100}%`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#F2EFE9]/5 border border-[#F2EFE9]/10 text-[11px] text-[#F2EFE9]/80">
              RoPE preserves relative distance: the dot product of two rotated vectors depends strictly on their positional difference $(m - n)$, allowing context extrapolation up to 128K tokens.
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 pt-2 border-t border-[#F2EFE9]/10">
            <span>APPLIED IN: LLAMA-3, MISTRAL, GEMINI</span>
            <span className="text-[#FF3B00]">COMPLEX ROTATION: ACTIVE</span>
          </div>
        </div>
      ),
    },
    {
      index: "04",
      tag: "SYNTHESIS",
      title: "Multi-Head Attention Engine",
      math: "Softmax( (Q · Kᵀ) / √dₖ + M ) · V",
      tensor: "[Heads=32, Seq_Len, Seq_Len]",
      description:
        "The nucleus of the transformer. Every token projects Query (what it looks for), Key (what it contains), and Value (its content). The dot product Q·Kᵀ computes pairwise affinity scores, allowing tokens to dynamically contextualize across long distances.",
      keyInsight: "Solves ambiguity: connects 'it' to its true antecedent.",
      gameTargetId: "#game-attention",
      gameLabel: "OPERATE ATTENTION MATRIX [GAME 04] ↗",
      renderVisual: () => (
        <div className="w-full h-full border border-[#F2EFE9]/20 bg-[#0B0B0C] p-6 flex flex-col justify-between swiss-grid">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 border-b border-[#F2EFE9]/10 pb-2">
            <span>QUERY · KEY MATRIX DOT PRODUCT AFFINITY</span>
            <span className="text-[#FF3B00]">HEADS: 32 PARALLEL</span>
          </div>

          <div className="my-auto py-2 space-y-3 font-mono text-xs">
            {/* Visual Attention Matrix 4x4 */}
            <div className="grid grid-cols-4 gap-1 text-center">
              <div className="p-2 border border-[#FF3B00] bg-[#FF3B00] text-[#0B0B0C] font-bold">
                Q1·K1<br /><span className="text-[10px]">0.92</span>
              </div>
              <div className="p-2 border border-[#F2EFE9]/20 bg-[#F2EFE9]/10 text-[#F2EFE9]">
                Q1·K2<br /><span className="text-[10px]">0.05</span>
              </div>
              <div className="p-2 border border-[#F2EFE9]/20 bg-[#F2EFE9]/10 text-[#F2EFE9]">
                Q1·K3<br /><span className="text-[10px]">0.02</span>
              </div>
              <div className="p-2 border border-[#F2EFE9]/10 bg-transparent text-[#F2EFE9]/20">
                -∞<br /><span className="text-[9px]">MASK</span>
              </div>

              <div className="p-2 border border-[#F2EFE9]/20 bg-[#F2EFE9]/10 text-[#F2EFE9]">
                Q2·K1<br /><span className="text-[10px]">0.12</span>
              </div>
              <div className="p-2 border border-[#FF3B00] bg-[#FF3B00] text-[#0B0B0C] font-bold">
                Q2·K2<br /><span className="text-[10px]">0.84</span>
              </div>
              <div className="p-2 border border-[#F2EFE9]/20 bg-[#F2EFE9]/10 text-[#F2EFE9]">
                Q2·K3<br /><span className="text-[10px]">0.04</span>
              </div>
              <div className="p-2 border border-[#F2EFE9]/10 bg-transparent text-[#F2EFE9]/20">
                -∞<br /><span className="text-[9px]">MASK</span>
              </div>
            </div>

            <div className="p-3 bg-[#FF3B00]/10 border-l-2 border-[#FF3B00] text-[11px] text-[#F2EFE9]">
              Multi-Head projection splits the 4,096 dimension into 32 distinct heads of 128 dimensions each, allowing the model to attend simultaneously to syntax, semantics, and temporal distance.
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 pt-2 border-t border-[#F2EFE9]/10">
            <span>CAUSAL MASK: UPPER TRIANGLE ZEROED</span>
            <span className="text-[#FF3B00]">DOT PRODUCT: SCALED √d_k</span>
          </div>
        </div>
      ),
    },
    {
      index: "05",
      tag: "HIGHWAYS",
      title: "Residuals & LayerNorm",
      math: "x_{l+1} = RMSNorm( x_l + FFN(x_l) )",
      tensor: "[Seq_Len, 4096] (Identity Highway)",
      description:
        "Without skip connections, gradients vanish across 80+ neural layers. The residual highway passes the pristine input directly forward, adding only the delta computation. Root Mean Square Normalization (RMSNorm) stabilizes activations without shifting variance.",
      keyInsight: "Enables training networks 100+ layers deep without explosion.",
      renderVisual: () => (
        <div className="w-full h-full border border-[#F2EFE9]/20 bg-[#0B0B0C] p-6 flex flex-col justify-between swiss-grid">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 border-b border-[#F2EFE9]/10 pb-2">
            <span>RESIDUAL SKIP HIGHWAY CIRCUIT DIAGRAM</span>
            <span className="text-[#FF3B00]">LAYER STACK: 80 LAYERS</span>
          </div>

          <div className="my-auto py-2 space-y-3 font-mono text-xs">
            {/* Visual Circuit Diagram */}
            <div className="border border-[#F2EFE9]/20 p-4 space-y-2 bg-[#F2EFE9]/5">
              <div className="flex items-center justify-between">
                <span className="text-[#FF3B00] font-bold">IDENTITY INPUT (x_l)</span>
                <span className="text-[10px] text-[#F2EFE9]/40">UNALTERED STREAM</span>
              </div>
              <div className="h-1 bg-[#FF3B00] w-full" />

              <div className="flex items-center justify-between pt-2">
                <span className="text-[#F2EFE9]">SUB-LAYER COMPUTATION: F(x_l)</span>
                <span className="text-[#FF3B00]">+ DELTA ADDITION</span>
              </div>

              <div className="p-2 border border-[#F2EFE9]/20 bg-[#0B0B0C] text-center text-xs font-bold text-[#F2EFE9]">
                SUMMATION: x_{"{l+1}"} = x_l + F(x_l)
              </div>
            </div>

            <div className="p-3 bg-[#F2EFE9]/5 border border-[#F2EFE9]/10 text-[11px] text-[#F2EFE9]/70">
              Gradients flow directly backward uninterrupted through the identity addition highway, preventing the vanishing gradient problem entirely.
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 pt-2 border-t border-[#F2EFE9]/10">
            <span>NORMALIZATION: RMSNORM (FAST EPSILON)</span>
            <span className="text-[#FF3B00]">HIGHWAY STATUS: OPEN</span>
          </div>
        </div>
      ),
    },
    {
      index: "06",
      tag: "ASSOCIATIVE MEMORY",
      title: "Feed-Forward / SwiGLU",
      math: "FFN(x) = ( Swish(x W_g) ⊙ (x W_u) ) W_d",
      tensor: "[Seq_Len, 4096] → [Seq_Len, 14336] → [4096]",
      description:
        "While attention mixes information *between* tokens, the Feed-Forward Network acts as the model's factual memory store *within* each token. SwiGLU gates project features into an expanded 14,336-dimensional space before condensing back.",
      keyInsight: "Where factual knowledge ('Paris is capital of France') resides.",
      renderVisual: () => (
        <div className="w-full h-full border border-[#F2EFE9]/20 bg-[#0B0B0C] p-6 flex flex-col justify-between swiss-grid">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 border-b border-[#F2EFE9]/10 pb-2">
            <span>SWIGLU EXPANSION &amp; GATING FUNNEL</span>
            <span className="text-[#FF3B00]">3.5x HIDDEN PROJECTION</span>
          </div>

          <div className="my-auto py-2 space-y-3 font-mono text-xs">
            {/* Funnel Diagram */}
            <div className="space-y-2">
              <div className="flex justify-between items-center border border-[#F2EFE9]/20 p-2">
                <span>INPUT VECTOR</span>
                <span className="text-[#FF3B00] font-bold">4,096 DIM</span>
              </div>
              <div className="text-center text-[10px] text-[#FF3B00]">↓ EXPAND &amp; GATE (Swish W_gate ⊙ W_up)</div>
              <div className="flex justify-between items-center border border-[#FF3B00] bg-[#FF3B00]/10 p-3 font-bold text-[#F2EFE9]">
                <span>FACTUAL MEMORY STORE</span>
                <span className="text-[#FF3B00]">14,336 DIM</span>
              </div>
              <div className="text-center text-[10px] text-[#FF3B00]">↓ PROJECT DOWN (W_down)</div>
              <div className="flex justify-between items-center border border-[#F2EFE9]/20 p-2">
                <span>OUTPUT VECTOR</span>
                <span className="text-[#FF3B00] font-bold">4,096 DIM</span>
              </div>
            </div>

            <div className="p-3 bg-[#F2EFE9]/5 border border-[#F2EFE9]/10 text-[11px] text-[#F2EFE9]/70">
              Over 65% of the total model parameter count lives in these FFN matrices, storing empirical world facts acquired during pre-training.
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 pt-2 border-t border-[#F2EFE9]/10">
            <span>ACTIVATION: SILU (SWISH) ELEMENT-WISE</span>
            <span className="text-[#FF3B00]">PARAMS: ~45 BILLION</span>
          </div>
        </div>
      ),
    },
    {
      index: "07",
      tag: "PROBABILITY",
      title: "Softmax & Temperature Sampling",
      math: "P(w_i) = exp(z_i / T) / ∑ exp(z_j / T)",
      tensor: "Logits [50257] → Probabilities [50257]",
      description:
        "The final linear layer maps vectors back into 50,257 unnormalized logit scores. Softmax converts them into a rigorous probability distribution summing to 1.0. Temperature T controls entropy: low T is cold and factual, high T induces wild hallucinations.",
      keyInsight: "LLMs do not output answers; they output probability fields.",
      gameTargetId: "#game-thermostat",
      gameLabel: "DIAL THE THERMOSTAT [GAME 06] ↗",
      renderVisual: () => (
        <div className="w-full h-full border border-[#F2EFE9]/20 bg-[#0B0B0C] p-6 flex flex-col justify-between swiss-grid">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 border-b border-[#F2EFE9]/10 pb-2">
            <span>DYNAMIC PROBABILITY DISTRIBUTION DENSITY</span>
            <span className="text-[#FF3B00]">SOFTMAX CALIBRATION</span>
          </div>

          <div className="my-auto py-2 space-y-3 font-mono text-xs">
            <div className="space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#F2EFE9] font-bold">&quot;telescope&quot;</span>
                <span className="text-[#FF3B00] font-bold">81.2%</span>
              </div>
              <div className="w-full h-2.5 bg-[#F2EFE9]/10">
                <div className="h-full bg-[#FF3B00]" style={{ width: "81.2%" }} />
              </div>

              <div className="flex justify-between text-[11px]">
                <span className="text-[#F2EFE9]">&quot;observatory&quot;</span>
                <span className="text-[#F2EFE9]/60">11.4%</span>
              </div>
              <div className="w-full h-2.5 bg-[#F2EFE9]/10">
                <div className="h-full bg-[#F2EFE9]/70" style={{ width: "11.4%" }} />
              </div>

              <div className="flex justify-between text-[11px]">
                <span className="text-[#F2EFE9]/60">&quot;satellite&quot;</span>
                <span className="text-[#F2EFE9]/40">4.8%</span>
              </div>
              <div className="w-full h-2.5 bg-[#F2EFE9]/10">
                <div className="h-full bg-[#F2EFE9]/30" style={{ width: "4.8%" }} />
              </div>
            </div>

            <div className="p-3 bg-[#FF3B00]/10 border-l-2 border-[#FF3B00] text-[11px] text-[#F2EFE9]">
              High temperatures ($T &gt; 1.0$) divide logits by larger numbers, flattening differences and elevating rare tokens. Low temperatures ($T &lt; 0.3$) approach a Dirac delta function (argmax).
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 pt-2 border-t border-[#F2EFE9]/10">
            <span>NORMALIZATION: ∑ P(w_i) = 1.000</span>
            <span className="text-[#FF3B00]">SAMPLING: NUCLEUS (TOP-P)</span>
          </div>
        </div>
      ),
    },
    {
      index: "08",
      tag: "ITERATION",
      title: "Autoregressive KV-Cache Loop",
      math: "y_{t+1} ~ P(· | y₁, ..., y_t, x)",
      tensor: "KV_Cache [Layers, 2, Seq_Len, d_k]",
      description:
        "Generation is sequential and autoregressive: the model predicts exactly ONE token, appends it to its own prompt, and repeats. To prevent quadratic slowdown, past Key and Value vectors are preserved in the KV-cache in high-speed GPU memory.",
      keyInsight: "A 500-word essay requires 650 forward-pass iterations.",
      gameTargetId: "#game-next-token",
      gameLabel: "ENTER PREDICTOR ARENA [GAME 02] ↗",
      renderVisual: () => (
        <div className="w-full h-full border border-[#F2EFE9]/20 bg-[#0B0B0C] p-6 flex flex-col justify-between swiss-grid">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 border-b border-[#F2EFE9]/10 pb-2">
            <span>HIGH-SPEED GPU KV-CACHE RING BUFFER</span>
            <span className="text-[#FF3B00]">O(1) FORWARD PASS</span>
          </div>

          <div className="my-auto py-2 space-y-3 font-mono text-xs">
            {/* Visual Token Iteration Sequence */}
            <div className="space-y-2">
              <div className="text-[11px] text-[#F2EFE9]/60">
                ACTIVE MEMORY BLOCKS (PRE-COMPUTED KEYS &amp; VALUES):
              </div>
              <div className="flex flex-wrap gap-1.5 p-3 bg-[#F2EFE9]/5 border border-[#F2EFE9]/15">
                {["In", "the", "deep", "neural", "network", "of"].map((tok, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-[#F2EFE9]/10 border border-[#F2EFE9]/20 text-[#F2EFE9] text-xs font-bold"
                  >
                    {tok} <span className="text-[9px] text-[#F2EFE9]/40 block">KV✓</span>
                  </span>
                ))}
                <span className="px-2 py-1 bg-[#FF3B00] text-[#0B0B0C] font-bold animate-pulse text-xs">
                  thought <span className="text-[9px] text-[#0B0B0C]/80 block">NEW⚡</span>
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#FF3B00]/10 border-l-2 border-[#FF3B00] text-[11px] text-[#F2EFE9]">
              Without the KV-cache, generating token 1,000 would require recomputing attention across all 999 previous tokens from scratch ($O(N^2)$ catastrophe). With the cache, inference stays linear $O(N)$!
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40 pt-2 border-t border-[#F2EFE9]/10">
            <span>VRAM FOOTPRINT: 12GB FP16</span>
            <span className="text-[#FF3B00]">NEXT: FEEDBACK LOOP</span>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      // Calculate exact scroll distance: track scrollWidth minus container width
      const getScrollAmount = () => Math.max(0, track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [STAGES.length]);

  return (
    <section
      id="architecture"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#0B0B0C] border-b border-[#F2EFE9]/15 select-none"
    >
      {/* Pinned Gallery Header Ribbon */}
      <div className="absolute top-0 left-0 right-0 z-20 h-14 bg-[#0B0B0C]/90 backdrop-blur border-b border-[#F2EFE9]/15 px-6 flex items-center justify-between font-mono text-xs text-[#F2EFE9]/50">
        <div className="flex items-center gap-3">
          <span className="text-[#FF3B00] font-bold">[HORIZON // 08 ARCHITECTURAL STAGES]</span>
          <span className="hidden sm:inline">END-TO-END TRANSFORMER FORWARD PASS</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#F2EFE9]">SCROLL DOWN TO PROGRESS HORIZONTALLY</span>
          <span className="text-[#FF3B00]">→</span>
        </div>
      </div>

      {/* Horizontal Sliding Track: Exact calculation so no trailing empty black space */}
      <div
        ref={trackRef}
        className="h-full flex pt-14 items-stretch will-change-transform"
      >
        {STAGES.map((stage) => (
          <div
            key={stage.index}
            className="w-[90vw] md:w-[85vw] lg:w-[80vw] h-full flex-shrink-0 border-r border-[#F2EFE9]/15 p-6 md:p-10 flex flex-col justify-between relative bg-[#0B0B0C] swiss-grid"
          >
            {/* Corner registration marks */}
            <span className="absolute top-16 left-6 text-[#FF3B00] font-mono text-xs">+</span>
            <span className="absolute bottom-6 right-6 text-[#FF3B00] font-mono text-xs">+</span>

            {/* Top Stage Header */}
            <div>
              <div className="flex items-center justify-between border-b border-[#F2EFE9]/10 pb-3 mb-4 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-[#FF3B00] text-[#0B0B0C] font-bold">
                    STAGE {stage.index}
                  </span>
                  <span className="text-[#FF3B00] uppercase tracking-wider font-bold">
                    {stage.tag}
                  </span>
                </div>
                <div className="text-[#F2EFE9]/40 font-mono">
                  TRANSFORMER_KERNEL // REF: {stage.index}/08
                </div>
              </div>

              {/* 2-Column Content Grid: Left Text + Right Diagram */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch my-2">
                {/* Left Column: Theory & Formula (6 cols) */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-2xl md:text-4xl font-instrument italic text-[#F2EFE9] mb-3">
                      {stage.title}
                    </h3>

                    <div className="font-mono text-xs text-[#FF3B00] bg-[#FF3B00]/5 border-l-2 border-[#FF3B00] p-2.5 mb-3">
                      {stage.math}
                    </div>

                    <div className="font-mono text-[11px] text-[#F2EFE9]/60 mb-3 flex items-center gap-2">
                      <span className="text-[#F2EFE9]/30">TENSOR FLOW:</span>
                      <span className="text-[#F2EFE9] border border-[#F2EFE9]/20 px-2 py-0.5">
                        {stage.tensor}
                      </span>
                    </div>

                    <p className="font-mono text-xs md:text-sm text-[#F2EFE9]/80 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>

                  <div className="border-t border-[#F2EFE9]/10 pt-3">
                    <div className="font-mono text-xs text-[#F2EFE9]/50 mb-2 flex items-start gap-2">
                      <span className="text-[#FF3B00] font-bold">INSIGHT:</span>
                      <span className="text-[#F2EFE9]">{stage.keyInsight}</span>
                    </div>

                    {stage.gameTargetId && (
                      <a
                        href={stage.gameTargetId}
                        data-cursor="PLAY"
                        className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-[#0B0B0C] bg-[#FF3B00] border border-[#FF3B00] px-4 py-2 hover:bg-[#0B0B0C] hover:text-[#FF3B00] transition-colors"
                      >
                        <span>{stage.gameLabel}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Column: High-Fidelity Stage Visualizer (6 cols) */}
                <div className="lg:col-span-6 h-[260px] md:h-[320px] lg:h-[350px]">
                  {stage.renderVisual()}
                </div>
              </div>
            </div>

            {/* Bottom Panel Status Footer */}
            <div className="border-t border-[#F2EFE9]/10 pt-3 flex justify-between items-center text-[10px] font-mono text-[#F2EFE9]/40">
              <span>MODULE // {stage.tag}</span>
              <span>FORWARD PASS ENGINE // STEP {stage.index} OF 08</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
