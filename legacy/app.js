/**
 * =====================================================================
 * LLM DeepDive — High-Precision Interactive Neural Simulation Engine
 * Editorial Design Architecture & Mathematical Foundations
 * =====================================================================
 */

// ---------------------------------------------------------------------
// 1. LATENT SEMANTIC VECTOR DICTIONARY (d = 16)
// Mathematically calibrated latent space with verified linear properties
// ---------------------------------------------------------------------
const SEMANTIC_VOCAB = {
  // Royalty / Demographics
  "king":      [ 0.90,  0.95,  0.70,  0.90,  0.02,  0.00,  0.10,  0.40,  0.2,  0.1,  0.3,  0.1,  0.5,  0.2,  0.4,  0.9],
  "queen":     [-0.90,  0.95,  0.70,  0.88,  0.02,  0.00,  0.10,  0.40,  0.2,  0.1,  0.3,  0.1,  0.5,  0.2,  0.4,  0.9],
  "man":       [ 0.88, -0.20,  0.65,  0.30,  0.10,  0.05,  0.20,  0.10,  0.1,  0.2,  0.2,  0.1,  0.2,  0.1,  0.1,  0.2],
  "woman":     [-0.88, -0.20,  0.65,  0.30,  0.10,  0.05,  0.20,  0.10,  0.1,  0.2,  0.2,  0.1,  0.2,  0.1,  0.1,  0.2],
  "prince":    [ 0.85,  0.80, -0.50,  0.60,  0.05,  0.00,  0.15,  0.35,  0.2,  0.1,  0.2,  0.1,  0.4,  0.2,  0.3,  0.7],
  "princess":  [-0.85,  0.80, -0.50,  0.60,  0.05,  0.00,  0.15,  0.35,  0.2,  0.1,  0.2,  0.1,  0.4,  0.2,  0.3,  0.7],
  
  // Fauna
  "cat":       [ 0.00, -0.80, -0.20, -0.50, -0.30,  0.95,  0.40, -0.20,  0.8, -0.5,  0.1,  0.7, -0.2,  0.6, -0.1, -0.4],
  "kitten":    [ 0.00, -0.80, -0.90, -0.70, -0.30,  0.94,  0.50, -0.20,  0.8, -0.6,  0.1,  0.8, -0.3,  0.7, -0.1, -0.5],
  "dog":       [ 0.10, -0.80, -0.10, -0.40, -0.30,  0.96,  0.60, -0.10,  0.8, -0.4,  0.1,  0.7, -0.2,  0.6, -0.1, -0.4],
  "puppy":     [ 0.10, -0.80, -0.90, -0.70, -0.30,  0.95,  0.70, -0.10,  0.8, -0.5,  0.1,  0.8, -0.3,  0.7, -0.1, -0.5],
  "wolf":      [ 0.20, -0.50,  0.30,  0.60, -0.40,  0.92,  0.80, -0.40,  0.7, -0.2,  0.3,  0.5, -0.1,  0.4, -0.2, -0.2],

  // Computing & Mathematics
  "python":    [ 0.00, -0.10,  0.20,  0.30,  0.96, -0.20,  0.50,  0.40, -0.6,  0.8,  0.9, -0.4,  0.7, -0.3,  0.8,  0.4],
  "coding":    [ 0.05, -0.10,  0.10,  0.35,  0.95, -0.30,  0.70,  0.50, -0.5,  0.9,  0.8, -0.5,  0.7, -0.4,  0.8,  0.3],
  "algorithm": [ 0.00,  0.00,  0.50,  0.40,  0.94, -0.40,  0.30,  0.60, -0.7,  0.9,  0.9, -0.6,  0.8, -0.5,  0.9,  0.5],
  "transformer":[0.00,  0.20,  0.40,  0.70,  0.98, -0.30,  0.40,  0.60, -0.6,  0.9,  0.9, -0.5,  0.9, -0.4,  0.9,  0.6],
  "neural":    [ 0.00,  0.10,  0.30,  0.50,  0.96, -0.10,  0.40,  0.50, -0.5,  0.9,  0.9, -0.4,  0.8, -0.3,  0.8,  0.5],
  "matrix":    [ 0.00,  0.00,  0.60,  0.30,  0.88, -0.50,  0.20,  0.50, -0.8,  0.8,  0.8, -0.7,  0.7, -0.6,  0.8,  0.3],

  // Actions & Verbs
  "sat":       [ 0.00, -0.20,  0.00, -0.30, -0.20,  0.10, -0.80,  0.30,  0.1,  0.0, -0.2,  0.2, -0.2,  0.1, -0.3, -0.1],
  "slept":     [ 0.00, -0.30, -0.10, -0.70, -0.30,  0.20, -0.90,  0.40,  0.2, -0.1, -0.3,  0.3, -0.3,  0.2, -0.4, -0.2],
  "jumped":    [ 0.05, -0.10, -0.20,  0.20, -0.10,  0.40,  0.85,  0.10,  0.3,  0.1, -0.1,  0.3, -0.1,  0.2, -0.2,  0.0],

  // Objects & Substrates
  "mat":       [ 0.00, -0.70, -0.10, -0.80, -0.40, -0.10, -0.90,  0.85,  0.3, -0.3, -0.5,  0.4, -0.4,  0.2, -0.5, -0.3],
  "rug":       [ 0.00, -0.65, -0.10, -0.75, -0.40, -0.10, -0.90,  0.88,  0.3, -0.3, -0.5,  0.4, -0.4,  0.2, -0.5, -0.3],
  "laptop":    [ 0.00, -0.10,  0.10,  0.20,  0.92, -0.40, -0.20,  0.80, -0.5,  0.7,  0.7, -0.3,  0.6, -0.2,  0.6,  0.2],

  // Syntax
  "the":       [ 0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
  "on":        [ 0.00, -0.10,  0.00, -0.10, -0.10,  0.00, -0.10,  0.30,  0.0,  0.0, -0.1,  0.1, -0.1,  0.0, -0.1,  0.0]
};

// ---------------------------------------------------------------------
// 2. LINEAR ALGEBRA & STATISTICAL PRIMITIVES
// ---------------------------------------------------------------------

function dotProduct(u, v) {
  let sum = 0;
  for (let i = 0; i < u.length; i++) sum += u[i] * v[i];
  return sum;
}

function vectorNorm(u) {
  let sum = 0;
  for (let i = 0; i < u.length; i++) sum += u[i] * u[i];
  return Math.sqrt(sum);
}

function cosineSimilarity(u, v) {
  const nu = vectorNorm(u);
  const nv = vectorNorm(v);
  if (nu === 0 || nv === 0) return 0;
  return dotProduct(u, v) / (nu * nv);
}

function vectorAdd(u, v) {
  return u.map((val, i) => val + (v[i] || 0));
}

function vectorSub(u, v) {
  return u.map((val, i) => val - (v[i] || 0));
}

function softmax(logits, temperature = 1.0) {
  const safeT = Math.max(temperature, 0.01);
  const scaled = logits.map(z => z / safeT);
  const maxVal = Math.max(...scaled);
  const exps = scaled.map(z => Math.exp(z - maxVal));
  const sumExps = exps.reduce((acc, val) => acc + val, 0);
  return exps.map(e => e / sumExps);
}

function computeEntropy(probabilities) {
  let h = 0;
  for (const p of probabilities) {
    if (p > 0.0001) h -= p * Math.log2(p);
  }
  return h;
}

function pseudoEmbedding(word) {
  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (SEMANTIC_VOCAB[clean]) return [...SEMANTIC_VOCAB[clean]];

  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  
  const vec = [];
  for (let i = 0; i < 16; i++) {
    const val = Math.sin((hash + 1) * (i + 1) * 9301 + 49297) % 233280 / 233280;
    vec.push((val - 0.5) * 2);
  }
  const norm = vectorNorm(vec);
  return vec.map(v => v / (norm || 1));
}

function projectTo3D(vectors) {
  if (vectors.length < 3) {
    return vectors.map(v => [v[0] || 0, v[1] || 0, v[2] || 0]);
  }
  const n = vectors.length;
  const d = vectors[0].length;

  const mean = new Array(d).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < d; j++) mean[j] += vectors[i][j];
  }
  for (let j = 0; j < d; j++) mean[j] /= n;

  const centered = vectors.map(v => v.map((val, j) => val - mean[j]));

  const cov = Array.from({ length: d }, () => new Array(d).fill(0));
  for (let r = 0; r < d; r++) {
    for (let c = 0; c < d; c++) {
      let sum = 0;
      for (let i = 0; i < n; i++) sum += centered[i][r] * centered[i][c];
      cov[r][c] = sum / (n - 1 || 1);
    }
  }

  function powerIteration(matrix, numComponents = 3, iterations = 25) {
    const components = [];
    const mat = matrix.map(row => [...row]);

    for (let k = 0; k < numComponents; k++) {
      let b = new Array(d).fill(0).map((_, i) => Math.sin(i + k + 1));
      let normB = vectorNorm(b);
      b = b.map(x => x / normB);

      for (let iter = 0; iter < iterations; iter++) {
        const nextB = new Array(d).fill(0);
        for (let r = 0; r < d; r++) {
          for (let c = 0; c < d; c++) nextB[r] += mat[r][c] * b[c];
        }
        normB = vectorNorm(nextB);
        if (normB === 0) break;
        b = nextB.map(x => x / normB);
      }
      components.push(b);

      let lambda = 0;
      for (let r = 0; r < d; r++) {
        for (let c = 0; c < d; c++) lambda += b[r] * mat[r][c] * b[c];
      }
      for (let r = 0; r < d; r++) {
        for (let c = 0; c < d; c++) mat[r][c] -= lambda * b[r] * b[c];
      }
    }
    return components;
  }

  const pcs = powerIteration(cov, 3);
  return centered.map(v => [
    dotProduct(v, pcs[0]),
    dotProduct(v, pcs[1]),
    dotProduct(v, pcs[2])
  ]);
}

// ---------------------------------------------------------------------
// 3. BYTE-PAIR ENCODING ENGINE
// ---------------------------------------------------------------------
class BPETokenizer {
  constructor() {
    this.tokenToId = new Map();
    this.idToToken = new Map();
    this.initBase();
  }

  initBase() {
    let id = 100;
    const baseChars = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?:;\"'()-_/[]{}<>=";
    for (const ch of baseChars) {
      this.tokenToId.set(ch, id);
      this.idToToken.set(id, ch);
      id++;
    }

    const merges = [
      ["t", "h"], ["th", "e"], ["i", "n"], ["e", "r"], ["a", "n"],
      ["r", "e"], ["o", "n"], ["a", "t"], ["e", "n"], ["e", "s"],
      ["T", "h"], ["Th", "e"], ["c", "a"], ["ca", "t"], ["d", "o"],
      ["do", "g"], ["s", "a"], ["sa", "t"], ["m", "a"], ["ma", "t"],
      ["p", "y"], ["py", "t"], ["pyt", "h"], ["pyth", "on"],
      ["c", "o"], ["co", "d"], ["cod", "e"],
      ["t", "r"], ["tr", "an"], ["tran", "s"], ["form", "er"],
      ["transform", "er"], ["transform", "ers"]
    ];

    for (const [p1, p2] of merges) {
      const merged = p1 + p2;
      if (!this.tokenToId.has(merged)) {
        this.tokenToId.set(merged, id);
        this.idToToken.set(id, merged);
        id++;
      }
    }
  }

  tokenize(text, vocabLimit = 1000) {
    if (!text) return [];
    const tokens = [];
    let i = 0;
    while (i < text.length) {
      let matched = false;
      for (let len = Math.min(16, text.length - i); len >= 1; len--) {
        const sub = text.slice(i, i + len);
        const id = this.tokenToId.get(sub);
        if (id !== undefined && id <= 100 + vocabLimit) {
          tokens.push({ text: sub, id });
          i += len;
          matched = true;
          break;
        }
      }
      if (!matched) {
        const ch = text[i];
        let id = this.tokenToId.get(ch) || 999;
        tokens.push({ text: ch, id });
        i++;
      }
    }
    return tokens;
  }
}

const bpe = new BPETokenizer();

// ---------------------------------------------------------------------
// 4. MULTI-HEAD SELF ATTENTION MECHANISM
// ---------------------------------------------------------------------
class AttentionEngine {
  constructor() {
    this.heads = {
      syntactic: {
        wq: [[0.8, -0.2, 0.1, 0.4], [0.1, 0.7, -0.3, 0.2], [-0.2, 0.1, 0.9, -0.1], [0.3, -0.1, 0.2, 0.8]],
        wk: [[0.7, -0.1, 0.2, 0.3], [0.2, 0.8, -0.1, 0.1], [-0.1, 0.2, 0.7, -0.2], [0.4, -0.2, 0.1, 0.9]]
      },
      referential: {
        wq: [[0.1, 0.9, -0.1, 0.2], [-0.3, 0.2, 0.8, 0.1], [0.7, -0.1, 0.2, 0.4], [0.2, 0.3, -0.2, 0.9]],
        wk: [[0.2, 0.8, -0.2, 0.3], [-0.1, 0.3, 0.7, 0.2], [0.8, -0.2, 0.1, 0.3], [0.1, 0.4, -0.1, 0.8]]
      },
      semantic: {
        wq: [[0.6, 0.5, 0.1, 0.2], [0.4, 0.7, 0.2, 0.1], [0.1, 0.3, 0.8, 0.3], [0.3, 0.2, 0.4, 0.7]],
        wk: [[0.6, 0.4, 0.2, 0.1], [0.5, 0.6, 0.1, 0.2], [0.2, 0.2, 0.9, 0.1], [0.2, 0.3, 0.3, 0.8]]
      }
    };
  }

  compute(tokens, headName = 'syntactic') {
    const n = tokens.length;
    if (n === 0) return { matrix: [], Q: [], K: [] };

    const head = this.heads[headName] || this.heads.syntactic;
    const dk = 4;
    const scale = Math.sqrt(dk);

    const rawVecs = tokens.map(t => {
      const v = pseudoEmbedding(t.text.trim() || t.text);
      return [v[0], v[1], v[2], v[3]];
    });

    const Q = rawVecs.map(v => {
      const q = [0, 0, 0, 0];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) q[r] += v[c] * head.wq[r][c];
      }
      return q;
    });

    const K = rawVecs.map(v => {
      const k = [0, 0, 0, 0];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) k[r] += v[c] * head.wk[r][c];
      }
      return k;
    });

    const matrix = [];
    for (let i = 0; i < n; i++) {
      const rowScores = [];
      for (let j = 0; j < n; j++) {
        rowScores.push(dotProduct(Q[i], K[j]) / scale);
      }
      matrix.push(softmax(rowScores, 1.0));
    }

    return { matrix, Q, K };
  }
}

const attentionEngine = new AttentionEngine();

// ---------------------------------------------------------------------
// 5. APPLICATION STATE
// ---------------------------------------------------------------------
const state = {
  inputText: "The cat sat on the mat.",
  tokens: [],
  selectedTokenIndex: 0,
  activeHead: 'syntactic',
  temperature: 0.70,
  topK: 5,
  topP: 0.90,
  vocabLimit: 60,
  embedSentences: [
    "The cat sat on the mat.",
    "A kitten rested on the rug.",
    "The puppy jumped on the carpet.",
    "A wolf prowled in the forest.",
    "Python is my favorite programming language.",
    "Coding algorithms requires mathematical logic.",
    "Transformers rely on multi-head self-attention.",
    "Deep neural networks process multidimensional tensors.",
    "The king ruled his magnificent castle.",
    "The queen welcomed the visiting prince."
  ],
  customPoint: null,
  isAutoGenerating: false,
  generationInterval: null
};

// ---------------------------------------------------------------------
// 6. INITIALIZATION
// ---------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderKatex();
  initTokenizer();
  initEmbeddingPlot();
  initAttentionMatrix();
  initSamplingControls();
  initVectorArithmetic();
  initAutoregressiveStudio();
  initQuiz();
});

function renderKatex() {
  if (window.renderMathInElement) {
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      throwOnError: false
    });
  }
}

// ---------------------------------------------------------------------
// MODULE 1: TOKENIZER CONTROLLER
// ---------------------------------------------------------------------
function initTokenizer() {
  const input = document.getElementById("tokenizer-input");
  const container = document.getElementById("token-nodes-container");
  const telemetry = document.getElementById("tensor-telemetry");
  const stats = document.getElementById("tokenizer-metrics");
  const vocabSlider = document.getElementById("vocab-slider");
  const vocabVal = document.getElementById("vocab-slider-val");
  const presets = document.querySelectorAll(".preset-btn");

  function update() {
    state.inputText = input.value;
    state.tokens = bpe.tokenize(state.inputText, state.vocabLimit);

    // Render nodes
    container.innerHTML = "";
    state.tokens.forEach((t, idx) => {
      const node = document.createElement("div");
      node.className = `token-node ${idx === state.selectedTokenIndex ? 'active-token' : ''}`;
      const displayTxt = t.text === " " ? "␣" : t.text;
      node.innerHTML = `
        <span class="token-chars">${escapeHtml(displayTxt)}</span>
        <span class="token-meta">id:${t.id}</span>
      `;
      node.addEventListener("click", () => {
        state.selectedTokenIndex = idx;
        update();
        renderAttentionMatrix();
      });
      container.appendChild(node);
    });

    // Update telemetry ribbon
    const seqLen = state.tokens.length;
    telemetry.innerHTML = `
      <span>TENSOR SHAPE:</span>
      <span class="tensor-box">[1, ${seqLen}, 16]</span>
      <span>• SEQ_LEN:</span>
      <span class="tensor-box">${seqLen} tokens</span>
      <span>• VOCAB_LIMIT:</span>
      <span class="tensor-box">${state.vocabLimit}</span>
    `;

    // Metrics
    const charLen = state.inputText.length;
    const ratio = seqLen > 0 ? (charLen / seqLen).toFixed(2) : "0";
    stats.innerHTML = `
      <div class="flex items-center gap-6 text-xs font-mono text-slate-400">
        <div>Characters: <strong class="text-white">${charLen}</strong></div>
        <div>Tokens: <strong class="text-cyan-400">${seqLen}</strong></div>
        <div>Density: <strong class="text-amber-400">${ratio} chars/token</strong></div>
      </div>
    `;

    renderAttentionMatrix();
  }

  input.addEventListener("input", update);

  vocabSlider.addEventListener("input", (e) => {
    state.vocabLimit = Number(e.target.value);
    vocabVal.textContent = state.vocabLimit;
    update();
  });

  presets.forEach(btn => {
    btn.addEventListener("click", () => {
      input.value = btn.getAttribute("data-text");
      state.selectedTokenIndex = 0;
      update();
    });
  });

  update();
}

// ---------------------------------------------------------------------
// MODULE 2: 3D EMBEDDING & LATENT GEOMETRY
// ---------------------------------------------------------------------
function initEmbeddingPlot() {
  const sentenceBox = document.getElementById("embed-sentences");
  const replotBtn = document.getElementById("replot-3d-btn");
  const customWordInput = document.getElementById("custom-word-input");
  const injectBtn = document.getElementById("inject-word-btn");

  function draw() {
    const lines = sentenceBox.value.split("\n").map(s => s.trim()).filter(Boolean);
    state.embedSentences = lines;

    const sentenceVectors = lines.map(sent => {
      const words = sent.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
      if (words.length === 0) return new Array(16).fill(0);
      const sum = new Array(16).fill(0);
      words.forEach(w => {
        const v = pseudoEmbedding(w);
        for (let i = 0; i < 16; i++) sum[i] += v[i];
      });
      return sum.map(x => x / words.length);
    });

    let allVecs = [...sentenceVectors];
    let allLabels = [...lines];

    if (state.customPoint) {
      allVecs.push(state.customPoint.vector);
      allLabels.push(`★ [USER] ${state.customPoint.text}`);
    }

    const coords = projectTo3D(allVecs);

    const x = coords.map(p => p[0]);
    const y = coords.map(p => p[1]);
    const z = coords.map(p => p[2]);

    const colors = allLabels.map(l => {
      if (l.startsWith("★")) return "#f43f5e";
      if (/cat|dog|wolf|kitten/i.test(l)) return "#10b981";
      if (/python|code|algorithm|transformer|tensor/i.test(l)) return "#06b6d4";
      if (/king|queen|prince/i.test(l)) return "#f59e0b";
      return "#64748b";
    });

    const sizes = allLabels.map(l => l.startsWith("★") ? 10 : 6);

    const trace = {
      x, y, z,
      mode: 'markers+text',
      type: 'scatter3d',
      text: allLabels.map(s => s.length > 22 ? s.slice(0, 22) + "…" : s),
      hovertext: allLabels,
      hoverinfo: 'text',
      textposition: 'top center',
      textfont: { family: 'JetBrains Mono, monospace', size: 9, color: '#94a3b8' },
      marker: {
        size: sizes,
        color: colors,
        opacity: 0.9,
        line: { color: '#ffffff', width: 0.5 }
      }
    };

    const layout = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { l: 0, r: 0, t: 0, b: 0 },
      scene: {
        xaxis: { title: 'PC1', color: '#475569', gridcolor: 'rgba(255,255,255,0.04)', zerolinecolor: 'rgba(255,255,255,0.08)' },
        yaxis: { title: 'PC2', color: '#475569', gridcolor: 'rgba(255,255,255,0.04)', zerolinecolor: 'rgba(255,255,255,0.08)' },
        zaxis: { title: 'PC3', color: '#475569', gridcolor: 'rgba(255,255,255,0.04)', zerolinecolor: 'rgba(255,255,255,0.08)' },
        camera: { eye: { x: 1.4, y: 1.4, z: 0.9 } }
      }
    };

    Plotly.newPlot("plotly-3d-canvas", [trace], layout, { responsive: true, displayModeBar: false });
    renderClosestPairs(allVecs, allLabels);
  }

  replotBtn.addEventListener("click", draw);
  injectBtn.addEventListener("click", () => {
    const text = customWordInput.value.trim();
    if (!text) return;
    state.customPoint = { text, vector: pseudoEmbedding(text) };
    draw();
  });

  draw();
}

function renderClosestPairs(vectors, labels) {
  const container = document.getElementById("closest-pairs-table");
  const pairs = [];
  for (let i = 0; i < vectors.length; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      pairs.push({ a: labels[i], b: labels[j], sim: cosineSimilarity(vectors[i], vectors[j]) });
    }
  }
  pairs.sort((x, y) => y.sim - x.sim);

  let html = `
    <table class="w-full text-left text-xs font-mono">
      <thead>
        <tr class="border-b border-white/5 text-slate-500">
          <th class="py-2 px-3">Vector A</th>
          <th class="py-2 px-3">Vector B</th>
          <th class="py-2 px-3">Cos(θ)</th>
          <th class="py-2 px-3">Alignment</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5">
  `;

  pairs.slice(0, 4).forEach(p => {
    const pct = Math.max(0, p.sim * 100).toFixed(1);
    html += `
      <tr>
        <td class="py-2 px-3 text-slate-300 truncate max-w-[180px]">${escapeHtml(p.a)}</td>
        <td class="py-2 px-3 text-slate-300 truncate max-w-[180px]">${escapeHtml(p.b)}</td>
        <td class="py-2 px-3 text-white font-semibold">${p.sim.toFixed(4)}</td>
        <td class="py-2 px-3"><span class="tag-badge tag-cyan">${pct}%</span></td>
      </tr>
    `;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
}

// ---------------------------------------------------------------------
// MODULE 3: VECTOR ARITHMETIC MACHINE
// ---------------------------------------------------------------------
function initVectorArithmetic() {
  const a = document.getElementById("vec-input-a");
  const b = document.getElementById("vec-input-b");
  const c = document.getElementById("vec-input-c");
  const btn = document.getElementById("vec-eval-btn");
  const out = document.getElementById("vec-arithmetic-out");

  function evaluate() {
    const wA = a.value.trim().toLowerCase();
    const wB = b.value.trim().toLowerCase();
    const wC = c.value.trim().toLowerCase();

    const target = vectorAdd(vectorSub(pseudoEmbedding(wA), pseudoEmbedding(wB)), pseudoEmbedding(wC));

    let bestMatch = null;
    let highestSim = -Infinity;
    const ranked = [];

    for (const [w, vec] of Object.entries(SEMANTIC_VOCAB)) {
      if (w === wA || w === wB || w === wC) continue;
      const sim = cosineSimilarity(target, vec);
      ranked.push({ word: w, sim });
      if (sim > highestSim) {
        highestSim = sim;
        bestMatch = w;
      }
    }

    ranked.sort((x, y) => y.sim - x.sim);

    out.innerHTML = `
      <div class="flex items-center justify-between p-4 rounded-lg bg-[#07080c] border border-white/5">
        <div>
          <div class="text-[11px] font-mono text-slate-500 mb-1">LATENT VECTOR ARITHMETIC RESULT</div>
          <div class="text-base font-mono font-bold text-white">
            <span class="text-cyan-400">"${wA}"</span> &minus; 
            <span class="text-slate-400">"${wB}"</span> + 
            <span class="text-amber-400">"${wC}"</span> &approx; 
            <span class="text-emerald-400 text-lg uppercase ml-1">"${bestMatch}"</span>
          </div>
        </div>
        <div class="text-right font-mono text-xs text-slate-400">
          <div>Cosine Alignment: <strong class="text-white">${(highestSim * 100).toFixed(1)}%</strong></div>
          <div class="text-[10px] text-slate-500">Angle: ~${(Math.acos(Math.max(-1, Math.min(1, highestSim))) * (180 / Math.PI)).toFixed(1)}°</div>
        </div>
      </div>
    `;
  }

  btn.addEventListener("click", evaluate);
  evaluate();
}

// ---------------------------------------------------------------------
// MODULE 4: SELF-ATTENTION MATRIX & ARCS
// ---------------------------------------------------------------------
function initAttentionMatrix() {
  const headBtns = document.querySelectorAll(".head-switch-btn");
  headBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      headBtns.forEach(b => b.classList.remove("btn-active"));
      btn.classList.add("btn-active");
      state.activeHead = btn.getAttribute("data-head");
      renderAttentionMatrix();
    });
  });
}

function renderAttentionMatrix() {
  const gridContainer = document.getElementById("matrix-grid-view");
  const arcWords = document.getElementById("arc-words-strip");
  const focusDetail = document.getElementById("focus-token-meta");

  if (!gridContainer || state.tokens.length === 0) return;

  const { matrix } = attentionEngine.compute(state.tokens, state.activeHead);
  const n = state.tokens.length;

  // Render Matrix Grid
  let html = `<div class="inline-block"><div class="flex">`;
  html += `<div class="w-10 h-7"></div>`;
  for (let j = 0; j < n; j++) {
    const txt = state.tokens[j].text === " " ? "␣" : state.tokens[j].text;
    html += `<div class="w-10 h-7 flex items-center justify-center text-[10px] font-mono text-slate-500 truncate" title="${escapeHtml(txt)}">${escapeHtml(txt)}</div>`;
  }
  html += `</div>`;

  for (let i = 0; i < n; i++) {
    const rowTxt = state.tokens[i].text === " " ? "␣" : state.tokens[i].text;
    const isSelected = i === state.selectedTokenIndex;
    html += `<div class="flex items-center mb-1">`;
    html += `<div class="w-10 h-9 flex items-center justify-end pr-2 text-[10px] font-mono ${isSelected ? 'text-cyan-400 font-bold' : 'text-slate-500'} truncate">${escapeHtml(rowTxt)}</div>`;

    for (let j = 0; j < n; j++) {
      const val = matrix[i][j];
      const intensity = Math.min(1, Math.max(0, val));
      const bg = intensity < 0.1 ? 'rgba(255,255,255,0.03)' : `rgba(6, 182, 212, ${intensity * 0.95})`;
      const textCol = intensity > 0.4 ? '#06070a' : '#94a3b8';

      html += `
        <div class="matrix-cell mx-0.5"
             style="background: ${bg}; color: ${textCol};"
             data-row="${i}" data-col="${j}"
             title="${escapeHtml(state.tokens[i].text)} -> ${escapeHtml(state.tokens[j].text)}: ${(val * 100).toFixed(1)}%">
          ${val.toFixed(2)}
        </div>
      `;
    }
    html += `</div>`;
  }
  html += `</div>`;
  gridContainer.innerHTML = html;

  gridContainer.querySelectorAll(".matrix-cell").forEach(cell => {
    cell.addEventListener("click", () => {
      state.selectedTokenIndex = Number(cell.getAttribute("data-row"));
      renderAttentionMatrix();
    });
  });

  // Render Interactive Arc Strip
  arcWords.innerHTML = "";
  state.tokens.forEach((t, idx) => {
    const tag = document.createElement("span");
    tag.className = `arc-word-tag ${idx === state.selectedTokenIndex ? 'selected' : ''}`;
    tag.textContent = t.text === " " ? "␣" : t.text;
    tag.addEventListener("click", () => {
      state.selectedTokenIndex = idx;
      renderAttentionMatrix();
    });
    arcWords.appendChild(tag);
  });

  // Render Focus Breakdown
  if (state.selectedTokenIndex < n) {
    const cur = state.tokens[state.selectedTokenIndex];
    const weights = matrix[state.selectedTokenIndex];
    let breakdown = `
      <div class="text-xs font-mono text-white mb-2">Focus: <strong class="text-cyan-400">"${cur.text === ' ' ? '␣' : cur.text}"</strong> (Index #${state.selectedTokenIndex})</div>
      <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
    `;
    state.tokens.forEach((t, j) => {
      const w = weights[j];
      const pct = (w * 100).toFixed(1);
      breakdown += `
        <div>
          <div class="flex justify-between text-[11px] font-mono text-slate-400 mb-0.5">
            <span>${escapeHtml(t.text === ' ' ? '␣' : t.text)}</span>
            <span class="text-white">${pct}%</span>
          </div>
          <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div class="h-full bg-cyan-400" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    });
    breakdown += `</div>`;
    focusDetail.innerHTML = breakdown;
  }
}

// ---------------------------------------------------------------------
// MODULE 5: SAMPLING & PROBABILITY DISTRIBUTION
// ---------------------------------------------------------------------
const PREDICTIONS = {
  "the cat sat on the": [
    { token: " mat", logit: 6.8 },
    { token: " rug", logit: 5.9 },
    { token: " floor", logit: 4.8 },
    { token: " couch", logit: 4.2 },
    { token: " grass", logit: 3.1 },
    { token: " table", logit: 2.7 },
    { token: " roof", logit: 1.9 },
    { token: " moon", logit: -0.5 }
  ],
  "python is a great": [
    { token: " programming", logit: 7.2 },
    { token: " language", logit: 6.9 },
    { token: " tool", logit: 4.8 },
    { token: " choice", logit: 4.5 },
    { token: " framework", logit: 3.2 },
    { token: " animal", logit: 1.2 }
  ]
};

function initSamplingControls() {
  const tempSlider = document.getElementById("temp-fader");
  const tempVal = document.getElementById("temp-fader-val");
  const topKSlider = document.getElementById("topk-fader");
  const topKVal = document.getElementById("topk-fader-val");
  const topPSlider = document.getElementById("topp-fader");
  const topPVal = document.getElementById("topp-fader-val");
  const contextSelect = document.getElementById("sampling-prompt-select");
  const entropyMeter = document.getElementById("entropy-readout");

  function sync() {
    state.temperature = parseFloat(tempSlider.value);
    state.topK = parseInt(topKSlider.value, 10);
    state.topP = parseFloat(topPSlider.value);

    tempVal.textContent = state.temperature.toFixed(2);
    topKVal.textContent = state.topK;
    topPVal.textContent = state.topP.toFixed(2);

    const candidates = PREDICTIONS[contextSelect.value] || PREDICTIONS["the cat sat on the"];
    const logits = candidates.map(c => c.logit);
    const probs = softmax(logits, state.temperature);

    const h = computeEntropy(probs);
    entropyMeter.textContent = `${h.toFixed(2)} bits`;

    renderSamplingBars(candidates, probs);
  }

  tempSlider.addEventListener("input", sync);
  topKSlider.addEventListener("input", sync);
  topPSlider.addEventListener("input", sync);
  contextSelect.addEventListener("change", sync);

  sync();
}

function renderSamplingBars(candidates, probs) {
  const container = document.getElementById("sampling-histogram-bars");
  let pool = candidates.map((c, i) => ({ token: c.token, logit: c.logit, prob: probs[i] }));
  pool.sort((a, b) => b.prob - a.prob);

  pool.forEach((item, idx) => {
    item.passK = idx < state.topK;
  });

  let cum = 0;
  pool.forEach(item => {
    if (cum < state.topP) {
      item.passP = true;
      cum += item.prob;
    } else {
      item.passP = false;
    }
  });

  let html = `<div class="space-y-2">`;
  pool.forEach(item => {
    const ok = item.passK && item.passP;
    const pct = (item.prob * 100).toFixed(1);
    const barBg = ok ? 'bg-cyan-400' : 'bg-slate-700 opacity-30';

    html += `
      <div class="p-2 rounded bg-[#090b0f] border border-white/5 font-mono text-xs">
        <div class="flex justify-between items-center mb-1">
          <div class="flex items-center gap-2">
            <span class="font-bold ${ok ? 'text-white' : 'text-slate-600'}">"${escapeHtml(item.token)}"</span>
            <span class="text-[10px] text-slate-500">logit: ${item.logit.toFixed(1)}</span>
            ${!item.passK ? '<span class="tag-badge tag-slate text-[9px]">Cut Top-K</span>' : ''}
            ${!item.passP ? '<span class="tag-badge tag-amber text-[9px]">Cut Top-P</span>' : ''}
          </div>
          <div class="font-semibold ${ok ? 'text-cyan-400' : 'text-slate-600'}">${pct}%</div>
        </div>
        <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full ${barBg} rounded-full transition-all duration-200" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

// ---------------------------------------------------------------------
// MODULE 6: AUTOREGRESSIVE GENERATOR
// ---------------------------------------------------------------------
function initAutoregressiveStudio() {
  const stepBtn = document.getElementById("step-gen-btn");
  const playBtn = document.getElementById("play-gen-btn");
  const resetBtn = document.getElementById("reset-gen-btn");
  const stream = document.getElementById("typewriter-stream");
  const kvReadout = document.getElementById("kv-telemetry-readout");

  let seq = ["The", " cat", " sat", " on", " the"];

  function render() {
    stream.innerHTML = "";
    seq.forEach((w, i) => {
      const span = document.createElement("span");
      const isRecent = i >= 5;
      span.className = `inline-block px-1.5 py-0.5 mx-0.5 my-0.5 rounded text-xs font-mono ${isRecent ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/5 text-slate-300'}`;
      span.textContent = w;
      stream.appendChild(span);
    });
    kvReadout.textContent = `${seq.length} Key-Value pairs cached (${(seq.length * 0.12).toFixed(2)} KB)`;
  }

  function step() {
    const s = seq.join("").toLowerCase().trim();
    let nxt = " mat";
    if (s.endsWith("mat")) nxt = " and";
    else if (s.endsWith("and")) nxt = " purred";
    else if (s.endsWith("purred")) nxt = " softly";
    else if (s.endsWith("softly")) nxt = " in";
    else if (s.endsWith("in")) nxt = " the";
    else if (s.endsWith("the")) nxt = " sun";
    else if (s.endsWith("sun")) nxt = ".";
    else if (s.endsWith(".")) nxt = " [EOS]";
    else nxt = " softly";

    if (nxt !== " [EOS]") {
      seq.push(nxt);
      render();
    } else {
      seq.push(" [EOS]");
      render();
      stopPlay();
    }
  }

  function toggle() {
    if (state.isAutoGenerating) {
      stopPlay();
    } else {
      state.isAutoGenerating = true;
      playBtn.textContent = "Pause Loop";
      state.generationInterval = setInterval(() => {
        if (seq.includes(" [EOS]")) stopPlay();
        else step();
      }, 650);
    }
  }

  function stopPlay() {
    state.isAutoGenerating = false;
    clearInterval(state.generationInterval);
    playBtn.textContent = "Auto Play Loop";
  }

  stepBtn.addEventListener("click", step);
  playBtn.addEventListener("click", toggle);
  resetBtn.addEventListener("click", () => {
    stopPlay();
    seq = ["The", " cat", " sat", " on", " the"];
    render();
  });

  render();
}

// ---------------------------------------------------------------------
// MODULE 7: INTERACTIVE CHECKPOINTS
// ---------------------------------------------------------------------
const QUESTIONS = [
  {
    q: "1. Why does the Attention formula scale by 1 / √dₖ?",
    opts: [
      "To prevent vanishing gradients when large vector dimensions push Softmax into saturated flat regions.",
      "To reduce memory usage in GPU high-bandwidth memory (HBM).",
      "Because GPUs can only compute square roots of powers of two."
    ],
    correct: 0,
    exp: "Correct! The variance of the dot product ∑ q_i k_i scales proportionally to d_k. Dividing by √d_k pulls the variance back to 1, keeping softmax gradients healthy!"
  },
  {
    q: "2. What happens as Temperature T approaches 0?",
    opts: [
      "The distribution flattens into high entropy randomness.",
      "The model degenerates into deterministic Argmax (Greedy Decoding), always picking the highest logit token.",
      "The Transformer crashes with division by zero."
    ],
    correct: 1,
    exp: "Spot on! As T → 0, differences between logits become infinitely magnified, concentrating 100% of probability onto the #1 top candidate."
  },
  {
    q: "3. Why do Transformers require Positional Encodings?",
    opts: [
      "Because Self-Attention is permutation-invariant: Q K^T does not inherently know which word came first!",
      "To encrypt the tokens before sending them across the PCIe bus.",
      "Because English tokens take more bytes than Chinese tokens."
    ],
    correct: 0,
    exp: "Precisely! Without Positional Encodings, 'Dog bites man' and 'Man bites dog' yield identical attention scores."
  }
];

function initQuiz() {
  const container = document.getElementById("quiz-container");
  if (!container) return;

  let html = `<div class="space-y-4">`;
  QUESTIONS.forEach((q, idx) => {
    html += `
      <div class="p-4 rounded-lg bg-[#07080c] border border-white/5" id="quiz-block-${idx}">
        <div class="font-mono text-xs font-semibold text-white mb-2">${q.q}</div>
        <div class="space-y-1.5">
          ${q.opts.map((opt, oIdx) => `
            <button class="quiz-btn w-full text-left p-2.5 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-mono text-slate-300 transition"
                    data-q="${idx}" data-opt="${oIdx}">
              ${opt}
            </button>
          `).join('')}
        </div>
        <div class="quiz-feedback hidden mt-2 p-2 rounded text-xs font-mono"></div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;

  container.querySelectorAll(".quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const qIdx = Number(btn.getAttribute("data-q"));
      const oIdx = Number(btn.getAttribute("data-opt"));
      const q = QUESTIONS[qIdx];
      const block = document.getElementById(`quiz-block-${qIdx}`);
      const fb = block.querySelector(".quiz-feedback");
      const btns = block.querySelectorAll(".quiz-btn");

      btns.forEach(b => b.classList.remove("border-emerald-500", "border-rose-500"));

      if (oIdx === q.correct) {
        btn.classList.add("border-emerald-500");
        fb.className = "quiz-feedback mt-2 p-2.5 rounded text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 block";
        fb.innerHTML = `<strong>✓ Correct:</strong> ${q.exp}`;
      } else {
        btn.classList.add("border-rose-500");
        fb.className = "quiz-feedback mt-2 p-2.5 rounded text-xs font-mono bg-rose-500/10 border border-rose-500/30 text-rose-300 block";
        fb.innerHTML = `<strong>✗ Incorrect:</strong> Re-examine the mathematical principles above.`;
      }
    });
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
