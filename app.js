/**
 * =====================================================================
 * LLM DeepDive - Core Simulation & Interactive Visualization Engine
 * Engineered for 1st-Year B.Tech Students & Curious AI Engineers
 * =====================================================================
 */

// ---------------------------------------------------------------------
// 1. HIGH-DIMENSIONAL SEMANTIC VECTOR DICTIONARY (d = 16)
// Handcrafted with realistic latent semantics so vector arithmetic works!
// e.g., King - Man + Woman ~ Queen, Puppy ~ Dog, Coded ~ Python
// ---------------------------------------------------------------------
const SEMANTIC_VOCAB = {
  // Royalty / People [Gender, Royalty, Age, Power, Tech, Animal, Action, Place, ...]
  "king":      [ 0.90,  0.95,  0.70,  0.90,  0.02,  0.00,  0.10,  0.40,  0.2,  0.1,  0.3,  0.1,  0.5,  0.2,  0.4,  0.9],
  "queen":     [-0.90,  0.95,  0.70,  0.88,  0.02,  0.00,  0.10,  0.40,  0.2,  0.1,  0.3,  0.1,  0.5,  0.2,  0.4,  0.9],
  "man":       [ 0.88, -0.20,  0.65,  0.30,  0.10,  0.05,  0.20,  0.10,  0.1,  0.2,  0.2,  0.1,  0.2,  0.1,  0.1,  0.2],
  "woman":     [-0.88, -0.20,  0.65,  0.30,  0.10,  0.05,  0.20,  0.10,  0.1,  0.2,  0.2,  0.1,  0.2,  0.1,  0.1,  0.2],
  "prince":    [ 0.85,  0.80, -0.50,  0.60,  0.05,  0.00,  0.15,  0.35,  0.2,  0.1,  0.2,  0.1,  0.4,  0.2,  0.3,  0.7],
  "princess":  [-0.85,  0.80, -0.50,  0.60,  0.05,  0.00,  0.15,  0.35,  0.2,  0.1,  0.2,  0.1,  0.4,  0.2,  0.3,  0.7],
  
  // Animals & Pets
  "cat":       [ 0.00, -0.80, -0.20, -0.50, -0.30,  0.95,  0.40, -0.20,  0.8, -0.5,  0.1,  0.7, -0.2,  0.6, -0.1, -0.4],
  "kitten":    [ 0.00, -0.80, -0.90, -0.70, -0.30,  0.94,  0.50, -0.20,  0.8, -0.6,  0.1,  0.8, -0.3,  0.7, -0.1, -0.5],
  "dog":       [ 0.10, -0.80, -0.10, -0.40, -0.30,  0.96,  0.60, -0.10,  0.8, -0.4,  0.1,  0.7, -0.2,  0.6, -0.1, -0.4],
  "puppy":     [ 0.10, -0.80, -0.90, -0.70, -0.30,  0.95,  0.70, -0.10,  0.8, -0.5,  0.1,  0.8, -0.3,  0.7, -0.1, -0.5],
  "wolf":      [ 0.20, -0.50,  0.30,  0.60, -0.40,  0.92,  0.80, -0.40,  0.7, -0.2,  0.3,  0.5, -0.1,  0.4, -0.2, -0.2],
  "lion":      [ 0.30,  0.40,  0.40,  0.85, -0.40,  0.91,  0.75, -0.30,  0.6, -0.1,  0.4,  0.5,  0.1,  0.4, -0.1,  0.1],

  // Computer Science & Tech
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
  "coded":     [ 0.05, -0.10,  0.20,  0.40,  0.92, -0.30,  0.75,  0.40, -0.4,  0.8,  0.8, -0.4,  0.6, -0.3,  0.7,  0.3],

  // Places & Objects
  "mat":       [ 0.00, -0.70, -0.10, -0.80, -0.40, -0.10, -0.90,  0.85,  0.3, -0.3, -0.5,  0.4, -0.4,  0.2, -0.5, -0.3],
  "rug":       [ 0.00, -0.65, -0.10, -0.75, -0.40, -0.10, -0.90,  0.88,  0.3, -0.3, -0.5,  0.4, -0.4,  0.2, -0.5, -0.3],
  "castle":    [ 0.00,  0.85,  0.80,  0.80, -0.20, -0.30, -0.80,  0.95, -0.2,  0.2,  0.2, -0.1,  0.4, -0.2,  0.3,  0.8],
  "laptop":    [ 0.00, -0.10,  0.10,  0.20,  0.92, -0.40, -0.20,  0.80, -0.5,  0.7,  0.7, -0.3,  0.6, -0.2,  0.6,  0.2],

  // Grammar / Common
  "the":       [ 0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
  "on":        [ 0.00, -0.10,  0.00, -0.10, -0.10,  0.00, -0.10,  0.30,  0.0,  0.0, -0.1,  0.1, -0.1,  0.0, -0.1,  0.0],
  "a":         [ 0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
  "is":        [ 0.00,  0.00,  0.10,  0.10,  0.00,  0.00,  0.10,  0.00,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
  "and":       [ 0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
};

// ---------------------------------------------------------------------
// 2. MATHEMATICAL HELPER FUNCTIONS (Linear Algebra for 1st-Year B.Tech)
// ---------------------------------------------------------------------

/** Vector Dot Product: u . v = sum(u_i * v_i) */
function dotProduct(u, v) {
  let sum = 0;
  for (let i = 0; i < u.length; i++) sum += u[i] * v[i];
  return sum;
}

/** Vector L2 Norm / Magnitude: ||u|| = sqrt(sum(u_i^2)) */
function vectorNorm(u) {
  let sum = 0;
  for (let i = 0; i < u.length; i++) sum += u[i] * u[i];
  return Math.sqrt(sum);
}

/** Cosine Similarity: cos(theta) = (u . v) / (||u|| * ||v||) */
function cosineSimilarity(u, v) {
  const normU = vectorNorm(u);
  const normV = vectorNorm(v);
  if (normU === 0 || normV === 0) return 0;
  return dotProduct(u, v) / (normU * normV);
}

/** Vector addition u + v */
function vectorAdd(u, v) {
  return u.map((val, i) => val + (v[i] || 0));
}

/** Vector subtraction u - v */
function vectorSub(u, v) {
  return u.map((val, i) => val - (v[i] || 0));
}

/** Softmax with Temperature T: P_i = exp(z_i / T) / sum(exp(z_j / T)) */
function softmax(logits, temperature = 1.0) {
  const safeT = Math.max(temperature, 0.01);
  const scaled = logits.map(z => z / safeT);
  const maxVal = Math.max(...scaled); // numerical stability trick
  const exps = scaled.map(z => Math.exp(z - maxVal));
  const sumExps = exps.reduce((acc, val) => acc + val, 0);
  return exps.map(e => e / sumExps);
}

/** Hash a string into a pseudo-random 16-D unit vector for unseen words */
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

/**
 * Perform Principal Component Analysis (PCA) projection from 16-D to 3-D
 * using Covariance Matrix & Power Iteration Method
 */
function projectTo3D(vectors) {
  if (vectors.length < 3) {
    return vectors.map(v => [v[0] || 0, v[1] || 0, v[2] || 0]);
  }

  const n = vectors.length;
  const d = vectors[0].length;

  // 1. Compute Centroid / Mean Vector
  const mean = new Array(d).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < d; j++) mean[j] += vectors[i][j];
  }
  for (let j = 0; j < d; j++) mean[j] /= n;

  // 2. Center the vectors
  const centered = vectors.map(v => v.map((val, j) => val - mean[j]));

  // 3. Compute d x d Covariance Matrix: C = (X^T * X) / (n - 1)
  const cov = Array.from({ length: d }, () => new Array(d).fill(0));
  for (let r = 0; r < d; r++) {
    for (let c = 0; c < d; c++) {
      let sum = 0;
      for (let i = 0; i < n; i++) sum += centered[i][r] * centered[i][c];
      cov[r][c] = sum / (n - 1 || 1);
    }
  }

  // 4. Power Iteration to extract Top 3 Principal Eigenvectors
  function powerIteration(matrix, numComponents = 3, iterations = 25) {
    const components = [];
    const mat = matrix.map(row => [...row]);

    for (let k = 0; k < numComponents; k++) {
      let b = new Array(d).fill(0).map((_, i) => Math.sin(i + k + 1));
      let normB = vectorNorm(b);
      b = b.map(x => x / normB);

      for (let iter = 0; iter < iterations; iter++) {
        // Multiply mat * b
        const nextB = new Array(d).fill(0);
        for (let r = 0; r < d; r++) {
          for (let c = 0; c < d; c++) {
            nextB[r] += mat[r][c] * b[c];
          }
        }
        normB = vectorNorm(nextB);
        if (normB === 0) break;
        b = nextB.map(x => x / normB);
      }

      components.push(b);

      // Deflate matrix: mat = mat - lambda * b * b^T
      let lambda = 0;
      for (let r = 0; r < d; r++) {
        for (let c = 0; c < d; c++) {
          lambda += b[r] * mat[r][c] * b[c];
        }
      }

      for (let r = 0; r < d; r++) {
        for (let c = 0; c < d; c++) {
          mat[r][c] -= lambda * b[r] * b[c];
        }
      }
    }
    return components;
  }

  const principalComponents = powerIteration(cov, 3);

  // 5. Project centered data onto top 3 components: [PC1, PC2, PC3]
  return centered.map(v => [
    dotProduct(v, principalComponents[0]),
    dotProduct(v, principalComponents[1]),
    dotProduct(v, principalComponents[2])
  ]);
}

// ---------------------------------------------------------------------
// 3. BYTE-PAIR ENCODING (BPE) TOKENIZER SIMULATOR
// ---------------------------------------------------------------------

class BPETokenizer {
  constructor() {
    this.vocab = new Map();
    this.tokenToId = new Map();
    this.idToToken = new Map();
    this.merges = [];
    this.initBaseVocab();
  }

  initBaseVocab() {
    this.vocab.clear();
    this.tokenToId.clear();
    this.idToToken.clear();

    // Standard ASCII characters
    let id = 100;
    const baseChars = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?:;\"'()-_/[]{}<>=";
    for (const ch of baseChars) {
      this.tokenToId.set(ch, id);
      this.idToToken.set(id, ch);
      id++;
    }

    // Common BPE subword merges
    this.merges = [
      ["t", "h"], ["th", "e"], ["i", "n"], ["e", "r"], ["a", "n"],
      ["r", "e"], ["o", "n"], ["a", "t"], ["e", "n"], ["e", "s"],
      ["o", "r"], ["t", "e"], ["t", "i"], ["a", "r"], ["s", "t"],
      ["T", "h"], ["Th", "e"], ["c", "a"], ["ca", "t"], ["d", "o"],
      ["do", "g"], ["s", "a"], ["sa", "t"], ["m", "a"], ["ma", "t"],
      ["p", "y"], ["py", "t"], ["pyt", "h"], ["pyth", "on"],
      ["c", "o"], ["co", "d"], ["cod", "e"], ["ing", " "],
      ["l", "l"], ["m", "m"], ["L", "L"], ["LL", "M"],
      ["a", "i"], ["A", "I"], ["t", "r"], ["tr", "an"], ["tran", "s"],
      ["form", "er"], ["transform", "er"], ["transform", "ers"]
    ];

    for (const [p1, p2] of this.merges) {
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

    // Simple greedy subword matching from current merges & vocab
    const tokens = [];
    let i = 0;
    while (i < text.length) {
      let matched = false;

      // Try longest match from registered vocab first
      for (let len = Math.min(16, text.length - i); len >= 1; len--) {
        const sub = text.slice(i, i + len);
        const id = this.tokenToId.get(sub);
        if (id !== undefined && id <= 100 + vocabLimit) {
          tokens.push({ text: sub, id: id });
          i += len;
          matched = true;
          break;
        }
      }

      if (!matched) {
        // Fallback to single character
        const ch = text[i];
        let id = this.tokenToId.get(ch);
        if (id === undefined) {
          id = 999; // Unknown / special
          this.tokenToId.set(ch, id);
        }
        tokens.push({ text: ch, id: id });
        i++;
      }
    }
    return tokens;
  }
}

const bpe = new BPETokenizer();

// ---------------------------------------------------------------------
// 4. SELF-ATTENTION (Q, K, V) INTERACTIVE ENGINE
// ---------------------------------------------------------------------

class AttentionEngine {
  constructor(dim = 4) {
    this.dim = dim;
    // 3 distinct attention heads to show students multi-head behavior
    this.headWeights = {
      syntactic: {
        // Head 1: Syntax / grammar (determiners attach to nouns, subjects to verbs)
        wq: [[0.8, -0.2, 0.1, 0.4], [0.1, 0.7, -0.3, 0.2], [-0.2, 0.1, 0.9, -0.1], [0.3, -0.1, 0.2, 0.8]],
        wk: [[0.7, -0.1, 0.2, 0.3], [0.2, 0.8, -0.1, 0.1], [-0.1, 0.2, 0.7, -0.2], [0.4, -0.2, 0.1, 0.9]]
      },
      referential: {
        // Head 2: Coreference / pronouns (e.g. "it", "she", "they" attending back to antecedent)
        wq: [[0.1, 0.9, -0.1, 0.2], [-0.3, 0.2, 0.8, 0.1], [0.7, -0.1, 0.2, 0.4], [0.2, 0.3, -0.2, 0.9]],
        wk: [[0.2, 0.8, -0.2, 0.3], [-0.1, 0.3, 0.7, 0.2], [0.8, -0.2, 0.1, 0.3], [0.1, 0.4, -0.1, 0.8]]
      },
      semantic: {
        // Head 3: Semantic similarity (words in related topical clusters attend)
        wq: [[0.6, 0.5, 0.1, 0.2], [0.4, 0.7, 0.2, 0.1], [0.1, 0.3, 0.8, 0.3], [0.3, 0.2, 0.4, 0.7]],
        wk: [[0.6, 0.4, 0.2, 0.1], [0.5, 0.6, 0.1, 0.2], [0.2, 0.2, 0.9, 0.1], [0.2, 0.3, 0.3, 0.8]]
      }
    };
  }

  computeAttention(tokens, headName = 'syntactic') {
    const n = tokens.length;
    if (n === 0) return { matrix: [], q: [], k: [], v: [] };

    const head = this.headWeights[headName] || this.headWeights.syntactic;
    const dk = this.dim;
    const scale = Math.sqrt(dk);

    // Get 4-D truncated embedding for each token
    const rawVectors = tokens.map(t => {
      const v = pseudoEmbedding(t.text.trim() || t.text);
      return [v[0], v[1], v[2], v[3]];
    });

    // Compute Queries (Q) and Keys (K)
    const Q = rawVectors.map(vec => {
      const q = [0, 0, 0, 0];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) q[r] += vec[c] * head.wq[r][c];
      }
      return q;
    });

    const K = rawVectors.map(vec => {
      const k = [0, 0, 0, 0];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) k[r] += vec[c] * head.wk[r][c];
      }
      return k;
    });

    // Attention Matrix = Softmax((Q * K^T) / sqrt(dk))
    const matrix = [];
    for (let i = 0; i < n; i++) {
      const rowScores = [];
      for (let j = 0; j < n; j++) {
        // Causal masking optional, but for understanding full attention we show bidirectional
        const dot = dotProduct(Q[i], K[j]);
        rowScores.push(dot / scale);
      }
      // Apply Softmax along the row
      const weights = softmax(rowScores, 1.0);
      matrix.push(weights);
    }

    return { matrix, Q, K };
  }
}

const attentionEngine = new AttentionEngine();

// ---------------------------------------------------------------------
// 5. NEXT-TOKEN SAMPLING & PREDICTION SIMULATOR
// ---------------------------------------------------------------------

const PREDICTION_BANK = {
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
    { token: " animal", logit: 1.2 },
    { token: " snake", logit: 0.9 },
    { token: " sandwich", logit: -1.2 }
  ],
  "neural networks learn from": [
    { token: " data", logit: 7.5 },
    { token: " experience", logit: 5.8 },
    { token: " examples", logit: 5.4 },
    { token: " gradients", logit: 4.1 },
    { token: " errors", logit: 3.6 },
    { token: " books", logit: 1.2 },
    { token: " pizza", logit: -1.8 }
  ]
};

// ---------------------------------------------------------------------
// 6. DOM CONTROLLERS & APPLICATION STATE
// ---------------------------------------------------------------------

const state = {
  inputText: "The cat sat on the mat.",
  tokens: [],
  selectedTokenIndex: 0,
  activeHead: 'syntactic',
  temperature: 0.7,
  topK: 5,
  topP: 0.90,
  vocabLimit: 50,
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
// 7. INITIALIZATION & EVENT BINDINGS
// ---------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  renderKatexMath();
  initTokenizer();
  initEmbeddingPlot();
  initAttentionHeatmap();
  initSamplingControls();
  initVectorArithmetic();
  initAutoregressiveDemo();
  initQuiz();
});

function renderKatexMath() {
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
// MODULE 1: TOKENIZER & BPE MERGE CONTROLLER
// ---------------------------------------------------------------------

function initTokenizer() {
  const input = document.getElementById("tokenizer-input");
  const chipsContainer = document.getElementById("token-chips-container");
  const tokenStats = document.getElementById("token-stats");
  const vocabSlider = document.getElementById("vocab-slider");
  const vocabSliderVal = document.getElementById("vocab-slider-val");
  const presetButtons = document.querySelectorAll(".tokenizer-preset");

  function update() {
    state.inputText = input.value;
    state.tokens = bpe.tokenize(state.inputText, state.vocabLimit);

    // Render chips
    chipsContainer.innerHTML = "";
    state.tokens.forEach((t, idx) => {
      const chip = document.createElement("div");
      const colorClass = `chip-color-${idx % 8}`;
      chip.className = `token-chip ${colorClass} ${idx === state.selectedTokenIndex ? 'selected' : ''}`;
      
      // Clean visible text representation for whitespace
      const displayTxt = t.text === " " ? "␣" : t.text;
      
      chip.innerHTML = `
        <span class="token-text">${escapeHtml(displayTxt)}</span>
        <span class="token-id">#${t.id}</span>
      `;

      chip.addEventListener("click", () => {
        state.selectedTokenIndex = idx;
        update();
        updateAttentionHeatmap();
      });

      chipsContainer.appendChild(chip);
    });

    // Update Stats
    const charCount = state.inputText.length;
    const tokenCount = state.tokens.length;
    const ratio = tokenCount > 0 ? (charCount / tokenCount).toFixed(2) : "0";

    tokenStats.innerHTML = `
      <div class="flex flex-wrap items-center gap-6 text-sm">
        <div><span class="text-slate-400">Characters:</span> <strong class="text-white font-mono">${charCount}</strong></div>
        <div><span class="text-slate-400">Tokens:</span> <strong class="text-indigo-400 font-mono">${tokenCount}</strong></div>
        <div><span class="text-slate-400">Compression:</span> <strong class="text-emerald-400 font-mono">${ratio} chars/token</strong></div>
        <div><span class="text-slate-400">Active Vocab Size:</span> <strong class="text-cyan-400 font-mono">${state.vocabLimit}</strong></div>
      </div>
    `;

    // Also update Attention Module
    updateAttentionHeatmap();
  }

  input.addEventListener("input", update);

  vocabSlider.addEventListener("input", (e) => {
    state.vocabLimit = Number(e.target.value);
    vocabSliderVal.textContent = state.vocabLimit;
    update();
  });

  presetButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      input.value = btn.getAttribute("data-text");
      state.selectedTokenIndex = 0;
      update();
    });
  });

  // Initial run
  update();
}

// ---------------------------------------------------------------------
// MODULE 2: 3D EMBEDDING PLOT & COSINE SIMILARITY
// ---------------------------------------------------------------------

function initEmbeddingPlot() {
  const sentenceBox = document.getElementById("embed-sentences");
  const embedBtn = document.getElementById("embed-replot-btn");
  const customWordInput = document.getElementById("custom-word-input");
  const addWordBtn = document.getElementById("add-word-btn");

  function runEmbeddingPipeline() {
    const rawLines = sentenceBox.value.split("\n").map(s => s.trim()).filter(s => s.length > 0);
    state.embedSentences = rawLines;

    // Convert each sentence to mean vector of its words
    const sentenceVectors = state.embedSentences.map(sent => {
      const words = sent.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w);
      if (words.length === 0) return new Array(16).fill(0);

      const sumVec = new Array(16).fill(0);
      words.forEach(w => {
        const v = pseudoEmbedding(w);
        for (let i = 0; i < 16; i++) sumVec[i] += v[i];
      });
      return sumVec.map(val => val / words.length);
    });

    // If custom point added, append it
    let allVectors = [...sentenceVectors];
    let allLabels = [...state.embedSentences];
    if (state.customPoint) {
      allVectors.push(state.customPoint.vector);
      allLabels.push(`🌟 [CUSTOM] ${state.customPoint.text}`);
    }

    // Project 16-D vectors to 3-D via PCA
    const coords3D = projectTo3D(allVectors);

    // Build Plotly 3D Scatter
    const x = coords3D.map(p => p[0]);
    const y = coords3D.map(p => p[1]);
    const z = coords3D.map(p => p[2]);

    const colors = allLabels.map(l => {
      if (l.startsWith("🌟")) return "#f43f5e"; // bright rose for user
      if (l.toLowerCase().includes("cat") || l.toLowerCase().includes("dog") || l.toLowerCase().includes("wolf") || l.toLowerCase().includes("kitten")) return "#10b981"; // Animals
      if (l.toLowerCase().includes("python") || l.toLowerCase().includes("code") || l.toLowerCase().includes("transformer") || l.toLowerCase().includes("tensor")) return "#06b6d4"; // Tech
      if (l.toLowerCase().includes("king") || l.toLowerCase().includes("queen") || l.toLowerCase().includes("prince")) return "#f59e0b"; // Royalty
      return "#6366f1"; // default indigo
    });

    const sizes = allLabels.map(l => l.startsWith("🌟") ? 12 : 7);

    const trace = {
      x, y, z,
      mode: 'markers+text',
      type: 'scatter3d',
      text: allLabels.map(s => s.length > 20 ? s.slice(0, 20) + "…" : s),
      hovertext: allLabels,
      hoverinfo: 'text',
      textposition: 'top center',
      textfont: { family: 'Plus Jakarta Sans, sans-serif', size: 10, color: '#94a3b8' },
      marker: {
        size: sizes,
        color: colors,
        opacity: 0.9,
        line: { color: '#ffffff', width: 1 }
      }
    };

    const layout = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { l: 0, r: 0, t: 0, b: 0 },
      scene: {
        xaxis: { title: 'PC 1 (Latent Semantics)', color: '#64748b', gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.1)' },
        yaxis: { title: 'PC 2 (Grammar / Domain)', color: '#64748b', gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.1)' },
        zaxis: { title: 'PC 3 (Context Specificity)', color: '#64748b', gridcolor: 'rgba(255,255,255,0.06)', zerolinecolor: 'rgba(255,255,255,0.1)' },
        camera: { eye: { x: 1.4, y: 1.4, z: 0.9 } }
      }
    };

    Plotly.newPlot("embedding-plotly-container", [trace], layout, { responsive: true, displayModeBar: false });

    // Update Closest Semantic Pairs Table
    renderClosestPairs(allVectors, allLabels);
  }

  embedBtn.addEventListener("click", runEmbeddingPipeline);

  addWordBtn.addEventListener("click", () => {
    const txt = customWordInput.value.trim();
    if (!txt) return;
    const v = pseudoEmbedding(txt);
    state.customPoint = { text: txt, vector: v };
    runEmbeddingPipeline();
  });

  runEmbeddingPipeline();
}

function renderClosestPairs(vectors, labels) {
  const pairsContainer = document.getElementById("closest-pairs-output");
  const pairs = [];
  for (let i = 0; i < vectors.length; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      const sim = cosineSimilarity(vectors[i], vectors[j]);
      pairs.push({ a: labels[i], b: labels[j], sim });
    }
  }
  pairs.sort((x, y) => y.sim - x.sim);

  const top5 = pairs.slice(0, 5);
  let html = `
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs font-mono">
        <thead>
          <tr class="border-b border-white/10 text-slate-400">
            <th class="py-2 px-3">Vector A</th>
            <th class="py-2 px-3">Vector B</th>
            <th class="py-2 px-3">Cosine Similarity</th>
            <th class="py-2 px-3">Interpretation</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
  `;

  top5.forEach(p => {
    const pct = Math.max(0, (p.sim * 100)).toFixed(1);
    const badgeColor = p.sim > 0.8 ? 'badge-emerald' : (p.sim > 0.6 ? 'badge-cyan' : 'badge-indigo');
    html += `
      <tr class="hover:bg-white/5 transition">
        <td class="py-2.5 px-3 text-slate-200 truncate max-w-[200px]" title="${escapeHtml(p.a)}">${escapeHtml(p.a)}</td>
        <td class="py-2.5 px-3 text-slate-200 truncate max-w-[200px]" title="${escapeHtml(p.b)}">${escapeHtml(p.b)}</td>
        <td class="py-2.5 px-3 font-semibold text-white">
          <div class="flex items-center gap-2">
            <span>${p.sim.toFixed(4)}</span>
            <div class="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-cyan-400 rounded-full" style="width: ${pct}%"></div>
            </div>
          </div>
        </td>
        <td class="py-2.5 px-3"><span class="badge-pill ${badgeColor}">${pct}% Aligned</span></td>
      </tr>
    `;
  });

  html += `</tbody></table></div>`;
  pairsContainer.innerHTML = html;
}

// ---------------------------------------------------------------------
// MODULE 3: VECTOR ARITHMETIC (King - Man + Woman = Queen)
// ---------------------------------------------------------------------

function initVectorArithmetic() {
  const wordA = document.getElementById("vec-word-a");
  const wordB = document.getElementById("vec-word-b");
  const wordC = document.getElementById("vec-word-c");
  const calcBtn = document.getElementById("vec-calc-btn");
  const resultContainer = document.getElementById("vec-arithmetic-result");

  function calculate() {
    const a = wordA.value.toLowerCase().trim();
    const b = wordB.value.toLowerCase().trim();
    const c = wordC.value.toLowerCase().trim();

    const vecA = pseudoEmbedding(a);
    const vecB = pseudoEmbedding(b);
    const vecC = pseudoEmbedding(c);

    // Target = A - B + C
    const target = vectorAdd(vectorSub(vecA, vecB), vecC);

    // Find nearest neighbor in SEMANTIC_VOCAB
    let bestWord = null;
    let highestSim = -Infinity;
    const scores = [];

    for (const [vocabWord, vocabVec] of Object.entries(SEMANTIC_VOCAB)) {
      // Don't match the inputs themselves
      if (vocabWord === a || vocabWord === b || vocabWord === c) continue;
      const sim = cosineSimilarity(target, vocabVec);
      scores.push({ word: vocabWord, sim });
      if (sim > highestSim) {
        highestSim = sim;
        bestWord = vocabWord;
      }
    }

    scores.sort((x, y) => y.sim - x.sim);
    const top3 = scores.slice(0, 3);

    resultContainer.innerHTML = `
      <div class="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30">
        <div class="text-xs text-slate-400 mb-1">Mathematical Vector Result:</div>
        <div class="text-lg font-bold text-white mb-3">
          <span class="text-cyan-400">"${a}"</span> &minus; 
          <span class="text-rose-400">"${b}"</span> + 
          <span class="text-amber-400">"${c}"</span> &approx; 
          <span class="text-emerald-400 text-xl font-extrabold uppercase ml-1">"${bestWord}"</span>
        </div>
        <div class="text-xs text-slate-400 mb-2">Nearest Neighbors by Cosine Angle:</div>
        <div class="flex flex-wrap gap-2">
          ${top3.map(item => `
            <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono">
              <strong class="text-white">${item.word}</strong>: ${(item.sim * 100).toFixed(1)}% match
            </span>
          `).join('')}
        </div>
      </div>
    `;
  }

  calcBtn.addEventListener("click", calculate);
  calculate();
}

// ---------------------------------------------------------------------
// MODULE 4: SELF-ATTENTION MATRIX & HEATMAP
// ---------------------------------------------------------------------

function initAttentionHeatmap() {
  const headButtons = document.querySelectorAll(".attention-head-btn");

  headButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      headButtons.forEach(b => b.classList.remove("active", "btn-primary"));
      headButtons.forEach(b => b.classList.add("btn-secondary"));
      btn.classList.add("active", "btn-primary");
      btn.classList.remove("btn-secondary");

      state.activeHead = btn.getAttribute("data-head");
      updateAttentionHeatmap();
    });
  });

  updateAttentionHeatmap();
}

function updateAttentionHeatmap() {
  const container = document.getElementById("attention-heatmap-grid");
  const focusTokenText = document.getElementById("focus-token-display");
  const focusTokenWeights = document.getElementById("focus-token-weights");

  if (!container || state.tokens.length === 0) return;

  const { matrix, Q, K } = attentionEngine.computeAttention(state.tokens, state.activeHead);
  const n = state.tokens.length;

  // Render Matrix Grid
  let html = `<div class="inline-block"><div class="flex">`;
  html += `<div class="w-12 h-8"></div>`; // top-left empty corner
  
  // Header Columns
  for (let j = 0; j < n; j++) {
    const txt = state.tokens[j].text === " " ? "␣" : state.tokens[j].text;
    html += `<div class="w-11 h-8 flex items-center justify-center text-[11px] font-mono font-bold text-slate-400 truncate" title="${escapeHtml(txt)}">${escapeHtml(txt)}</div>`;
  }
  html += `</div>`;

  // Rows
  for (let i = 0; i < n; i++) {
    const rowTxt = state.tokens[i].text === " " ? "␣" : state.tokens[i].text;
    const isSelectedRow = (i === state.selectedTokenIndex);
    html += `<div class="flex items-center mb-1">`;
    html += `<div class="w-12 h-11 flex items-center justify-end pr-2 text-[11px] font-mono font-bold ${isSelectedRow ? 'text-indigo-400' : 'text-slate-400'} truncate" title="${escapeHtml(rowTxt)}">${escapeHtml(rowTxt)}</div>`;

    for (let j = 0; j < n; j++) {
      const weight = matrix[i][j];
      const intensity = Math.min(1, Math.max(0, weight));
      
      // Color from deep indigo to electric cyan / amber
      let bgColor;
      if (intensity < 0.15) {
        bgColor = `rgba(15, 23, 42, 0.7)`;
      } else if (intensity < 0.4) {
        bgColor = `rgba(99, 102, 241, ${intensity * 1.5})`;
      } else {
        bgColor = `rgba(6, 182, 212, ${intensity})`;
      }

      html += `
        <div class="heatmap-cell mx-0.5" 
             style="background: ${bgColor}; color: ${intensity > 0.4 ? '#07090e' : '#e2e8f0'};"
             data-row="${i}" data-col="${j}"
             title="${escapeHtml(state.tokens[i].text)} -> ${escapeHtml(state.tokens[j].text)}: ${(weight * 100).toFixed(1)}%">
          ${(weight).toFixed(2)}
        </div>
      `;
    }
    html += `</div>`;
  }
  html += `</div>`;
  container.innerHTML = html;

  // Add click listeners to cells
  container.querySelectorAll(".heatmap-cell").forEach(cell => {
    cell.addEventListener("click", () => {
      const row = Number(cell.getAttribute("data-row"));
      state.selectedTokenIndex = row;
      // Re-render
      const chips = document.querySelectorAll(".token-chip");
      chips.forEach((c, idx) => {
        if (idx === row) c.classList.add("selected");
        else c.classList.remove("selected");
      });
      updateAttentionHeatmap();
    });
  });

  // Update Focus Breakdown
  if (state.selectedTokenIndex < n) {
    const currentToken = state.tokens[state.selectedTokenIndex];
    focusTokenText.textContent = `"${currentToken.text === ' ' ? '␣ (Space)' : currentToken.text}" (Token #${state.selectedTokenIndex + 1})`;

    const rowWeights = matrix[state.selectedTokenIndex];
    let breakdownHtml = `<div class="space-y-2 mt-3">`;
    state.tokens.forEach((t, j) => {
      const w = rowWeights[j];
      const pct = (w * 100).toFixed(1);
      const isHigh = w > 0.3;
      breakdownHtml += `
        <div>
          <div class="flex justify-between text-xs mb-1 font-mono">
            <span class="${isHigh ? 'text-cyan-300 font-bold' : 'text-slate-400'}">${escapeHtml(t.text === ' ' ? '␣' : t.text)}</span>
            <span class="${isHigh ? 'text-cyan-300 font-bold' : 'text-slate-500'}">${pct}%</span>
          </div>
          <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full ${isHigh ? 'bg-cyan-400' : 'bg-indigo-500/60'}" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    });
    breakdownHtml += `</div>`;
    focusTokenWeights.innerHTML = breakdownHtml;
  }
}

// ---------------------------------------------------------------------
// MODULE 5: SOFTMAX, TEMPERATURE & SAMPLING ENGINE
// ---------------------------------------------------------------------

function initSamplingControls() {
  const tempSlider = document.getElementById("temp-slider");
  const tempValue = document.getElementById("temp-value");
  const topKSlider = document.getElementById("topk-slider");
  const topKValue = document.getElementById("topk-value");
  const topPSlider = document.getElementById("topp-slider");
  const topPValue = document.getElementById("topp-value");
  const contextSelect = document.getElementById("sampling-context-select");

  function updateSampling() {
    state.temperature = parseFloat(tempSlider.value);
    state.topK = parseInt(topKSlider.value, 10);
    state.topP = parseFloat(topPSlider.value);

    tempValue.textContent = state.temperature.toFixed(2);
    topKValue.textContent = state.topK;
    topPValue.textContent = state.topP.toFixed(2);

    renderSamplingChart();
  }

  tempSlider.addEventListener("input", updateSampling);
  topKSlider.addEventListener("input", updateSampling);
  topPSlider.addEventListener("input", updateSampling);
  contextSelect.addEventListener("change", updateSampling);

  updateSampling();
}

function renderSamplingChart() {
  const container = document.getElementById("sampling-bars-container");
  const contextKey = document.getElementById("sampling-context-select").value;
  const candidates = PREDICTION_BANK[contextKey] || PREDICTION_BANK["the cat sat on the"];

  // 1. Calculate Softmax Probabilities with Temperature
  const logits = candidates.map(c => c.logit);
  const rawProbs = softmax(logits, state.temperature);

  // Combine into list of candidates with probabilities
  let pool = candidates.map((c, i) => ({
    token: c.token,
    logit: c.logit,
    prob: rawProbs[i]
  }));

  // Sort descending by probability
  pool.sort((a, b) => b.prob - a.prob);

  // 2. Apply Top-K Cutoff
  pool.forEach((item, idx) => {
    item.passTopK = (idx < state.topK);
  });

  // 3. Apply Top-P (Nucleus) Cutoff
  let cumulative = 0;
  pool.forEach((item) => {
    if (cumulative < state.topP) {
      item.passTopP = true;
      cumulative += item.prob;
    } else {
      item.passTopP = false;
    }
  });

  // Render Bar Charts
  let html = `<div class="space-y-3">`;
  pool.forEach((item) => {
    const isEligible = item.passTopK && item.passTopP;
    const pct = (item.prob * 100).toFixed(1);

    let barColor = "bg-indigo-500";
    let statusBadge = "";

    if (!item.passTopK) {
      barColor = "bg-slate-700 opacity-40";
      statusBadge = `<span class="text-[10px] text-rose-400 font-mono ml-2">[Cut by Top-K]</span>`;
    } else if (!item.passTopP) {
      barColor = "bg-slate-700 opacity-40";
      statusBadge = `<span class="text-[10px] text-amber-400 font-mono ml-2">[Cut by Top-P]</span>`;
    } else {
      barColor = "bg-gradient-to-r from-indigo-500 to-cyan-400";
      statusBadge = `<span class="text-[10px] text-emerald-400 font-mono ml-2">[Candidate]</span>`;
    }

    html += `
      <div class="p-2.5 rounded-lg bg-black/30 border border-white/5 ${isEligible ? 'hover:border-cyan-500/30' : ''} transition">
        <div class="flex items-center justify-between text-xs font-mono mb-1">
          <div class="flex items-center">
            <span class="font-bold text-white text-sm bg-white/10 px-2 py-0.5 rounded">${escapeHtml(item.token)}</span>
            <span class="text-slate-500 ml-2">logit: ${item.logit.toFixed(1)}</span>
            ${statusBadge}
          </div>
          <div class="font-bold ${isEligible ? 'text-cyan-400' : 'text-slate-500'}">${pct}%</div>
        </div>
        <div class="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
          <div class="h-full ${barColor} rounded-full transition-all duration-300" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  });
  html += `</div>`;

  container.innerHTML = html;
}

// ---------------------------------------------------------------------
// MODULE 6: AUTOREGRESSIVE GENERATION STUDIO (Token-by-Token)
// ---------------------------------------------------------------------

function initAutoregressiveDemo() {
  const promptInput = document.getElementById("auto-gen-prompt");
  const stepBtn = document.getElementById("auto-gen-step-btn");
  const playBtn = document.getElementById("auto-gen-play-btn");
  const resetBtn = document.getElementById("auto-gen-reset-btn");
  const streamOutput = document.getElementById("auto-gen-stream");
  const kvCacheCount = document.getElementById("kv-cache-counter");

  let currentTokens = ["The", " cat", " sat", " on", " the"];

  function renderStream() {
    streamOutput.innerHTML = "";
    currentTokens.forEach((t, i) => {
      const span = document.createElement("span");
      const isNew = i >= 5;
      span.className = `inline-block px-1.5 py-0.5 mx-0.5 my-0.5 rounded text-sm font-mono ${isNew ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse' : 'bg-white/10 text-slate-200'}`;
      span.textContent = t;
      streamOutput.appendChild(span);
    });
    kvCacheCount.textContent = `${currentTokens.length} vectors cached`;
  }

  function stepGenerate() {
    const sentenceSoFar = currentTokens.join("").toLowerCase().trim();
    
    // Simple autoregressive lookup simulation
    let nextWord = " mat";
    if (sentenceSoFar.endsWith("mat")) nextWord = " and";
    else if (sentenceSoFar.endsWith("and")) nextWord = " purred";
    else if (sentenceSoFar.endsWith("purred")) nextWord = " softly";
    else if (sentenceSoFar.endsWith("softly")) nextWord = " in";
    else if (sentenceSoFar.endsWith("in")) nextWord = " the";
    else if (sentenceSoFar.endsWith("the")) nextWord = " sunshine";
    else if (sentenceSoFar.endsWith("sunshine")) nextWord = ".";
    else if (sentenceSoFar.endsWith(".")) nextWord = " [EOS]";
    else nextWord = " softly";

    if (nextWord !== " [EOS]") {
      currentTokens.push(nextWord);
      renderStream();
    } else {
      currentTokens.push(" [EOS]");
      renderStream();
      stopAutoPlay();
    }
  }

  function toggleAutoPlay() {
    if (state.isAutoGenerating) {
      stopAutoPlay();
    } else {
      state.isAutoGenerating = true;
      playBtn.innerHTML = `<span>Pause Loop</span>`;
      playBtn.classList.replace("btn-accent-cyan", "btn-secondary");
      state.generationInterval = setInterval(() => {
        if (currentTokens.includes(" [EOS]")) {
          stopAutoPlay();
        } else {
          stepGenerate();
        }
      }, 700);
    }
  }

  function stopAutoPlay() {
    state.isAutoGenerating = false;
    clearInterval(state.generationInterval);
    playBtn.innerHTML = `<span>▶ Auto Play</span>`;
    playBtn.classList.replace("btn-secondary", "btn-accent-cyan");
  }

  stepBtn.addEventListener("click", stepGenerate);
  playBtn.addEventListener("click", toggleAutoPlay);
  resetBtn.addEventListener("click", () => {
    stopAutoPlay();
    currentTokens = ["The", " cat", " sat", " on", " the"];
    renderStream();
  });

  renderStream();
}

// ---------------------------------------------------------------------
// MODULE 7: B.TECH CONCEPT CHECKER (GAMIFIED INTERACTIVE QUIZ)
// ---------------------------------------------------------------------

const QUIZ_QUESTIONS = [
  {
    q: "1. Why does the Self-Attention formula divide by $\\sqrt{d_k}$?",
    options: [
      "To prevent vanishing gradients by keeping dot product variance around 1",
      "To compress vectors so they take less RAM in GPU cache",
      "Because Vaswani et al. found it by trial and error without math reasons",
      "To convert 64-bit floating point numbers to 32-bit integers"
    ],
    correct: 0,
    explanation: "Correct! When dimension $d_k$ is large (e.g. 64 or 128), the variance of the dot product $\\sum q_i k_i$ grows to $d_k$. Without scaling by $\\sqrt{d_k}$, softmax saturates into regions with near-zero gradients!"
  },
  {
    q: "2. What happens when the Temperature parameter $T \\to 0$ in Softmax?",
    options: [
      "Generation becomes completely random like tossing fair dice",
      "The model becomes deterministic (Greedy Search / Argmax), always picking the #1 highest scoring token",
      "The LLM crashes with a ZeroDivisionError",
      "The model generates endless repeating loops of spaces"
    ],
    correct: 1,
    explanation: "Spot on! As $T \\to 0$, $z_i / T$ magnifies the gap between logits. The top candidate gets ~100% probability, turning into deterministic greedy decoding."
  },
  {
    q: "3. Why do Transformers require Positional Encodings, whereas RNNs do not?",
    options: [
      "Because Transformers are permutation-invariant: $Q K^T$ does not inherently know which token came first!",
      "Because GPUs can only process numbered array indices",
      "Because tokens in English are longer than tokens in Hindi or Chinese",
      "Because Positional Encodings are needed to encrypt the prompt"
    ],
    correct: 0,
    explanation: "Exactly! Self-attention computes set operations across all tokens simultaneously in parallel. Without adding positional vectors, 'Man bites dog' and 'Dog bites man' would have identical attention scores!"
  },
  {
    q: "4. What is the KV Cache in LLM inference?",
    options: [
      "A database storing training dataset answers",
      "Saved Key and Value vectors from previous tokens so we don't recompute attention for past tokens from scratch",
      "A cache on the hard drive for vocabulary lookup",
      "A cryptographic hash for verifying model weights"
    ],
    correct: 1,
    explanation: "Brilliant! In autoregressive decoding, past tokens never change. By caching their $K$ and $V$ projection matrices, each new token only needs to project its own $Q$ and attend to the cached $K, V$!"
  }
];

function initQuiz() {
  const container = document.getElementById("btech-quiz-container");
  if (!container) return;

  let html = `<div class="space-y-6">`;
  QUIZ_QUESTIONS.forEach((q, idx) => {
    html += `
      <div class="p-5 rounded-xl bg-slate-900/70 border border-white/10" id="quiz-card-${idx}">
        <div class="font-bold text-white text-sm mb-3">${q.q}</div>
        <div class="space-y-2">
          ${q.options.map((opt, optIdx) => `
            <button class="quiz-option-btn w-full text-left p-3 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-400 text-xs font-mono text-slate-300 transition flex items-center justify-between"
                    data-q="${idx}" data-opt="${optIdx}">
              <span>${opt}</span>
              <span class="quiz-marker font-bold ml-2"></span>
            </button>
          `).join('')}
        </div>
        <div class="quiz-feedback hidden mt-3 p-3 rounded-lg text-xs font-mono"></div>
      </div>
    `;
  });
  html += `</div>`;

  container.innerHTML = html;

  // Add click handlers
  container.querySelectorAll(".quiz-option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const qIdx = parseInt(btn.getAttribute("data-q"), 10);
      const optIdx = parseInt(btn.getAttribute("data-opt"), 10);
      const q = QUIZ_QUESTIONS[qIdx];
      const card = document.getElementById(`quiz-card-${qIdx}`);
      const feedback = card.querySelector(".quiz-feedback");
      const allBtns = card.querySelectorAll(".quiz-option-btn");

      allBtns.forEach(b => b.classList.remove("border-emerald-500", "border-rose-500", "bg-emerald-500/10", "bg-rose-500/10"));

      if (optIdx === q.correct) {
        btn.classList.add("border-emerald-500", "bg-emerald-500/10");
        feedback.className = "quiz-feedback mt-3 p-3 rounded-lg text-xs font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 block";
        feedback.innerHTML = `<strong>&check; Well done!</strong> ${q.explanation}`;
      } else {
        btn.classList.add("border-rose-500", "bg-rose-500/10");
        feedback.className = "quiz-feedback mt-3 p-3 rounded-lg text-xs font-mono bg-rose-500/15 border border-rose-500/30 text-rose-300 block";
        feedback.innerHTML = `<strong>&cross; Not quite!</strong> Hint: Check the mathematical derivations in the sections above.`;
      }
      renderKatexMath();
    });
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
