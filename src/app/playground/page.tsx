"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface Message {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  metrics?: {
    latencyMs?: number;
    tokensPerSec?: number;
    completionTokens?: number;
  };
}

interface ModelOption {
  id: string;
  name: string;
  provider: "groq" | "xai";
  context: string;
  speed: string;
  badge: string;
}

const MODELS: ModelOption[] = [
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B Versatile",
    provider: "groq",
    context: "128k context",
    speed: "~350 tok/s",
    badge: "RECOMMENDED",
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B Instant",
    provider: "groq",
    context: "128k context",
    speed: "~850 tok/s",
    badge: "ULTRA FAST",
  },
  {
    id: "deepseek-r1-distill-llama-70b",
    name: "DeepSeek R1 Distill 70B",
    provider: "groq",
    context: "128k context",
    speed: "~300 tok/s",
    badge: "REASONING",
  },
  {
    id: "mixtral-8x7b-32768",
    name: "Mixtral 8x7B MoE",
    provider: "groq",
    context: "32k context",
    speed: "~550 tok/s",
    badge: "MOE",
  },
  {
    id: "grok-2-latest",
    name: "xAI Grok-2 Latest",
    provider: "xai",
    context: "128k context",
    speed: "~150 tok/s",
    badge: "XAI GROK",
  },
  {
    id: "grok-beta",
    name: "xAI Grok Beta",
    provider: "xai",
    context: "128k context",
    speed: "~160 tok/s",
    badge: "XAI GROK",
  },
];

const SYSTEM_PRESETS = [
  {
    label: "Creative Technologist",
    prompt:
      "You are DSGKX, an elite Creative Technologist and AI Architect. Your answers are mathematically precise, aesthetically uncompromising, and formatted in clean markdown.",
  },
  {
    label: "Senior Engineer",
    prompt:
      "You are a Senior Principal Engineer. Provide concise, production-ready code with clean error handling, architecture notes, and zero unnecessary fluff.",
  },
  {
    label: "General Assistant",
    prompt: "You are a helpful, direct, and intelligent AI assistant.",
  },
];

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [model, setModel] = useState<string>("llama-3.3-70b-versatile");
  const [systemPrompt, setSystemPrompt] = useState<string>(
    "You are DSGKX Neural Engine, a high-performance cognitive assistant. Respond with mathematical clarity, structured formatting, and deep technical depth."
  );
  const [isSystemOpen, setIsSystemOpen] = useState<boolean>(true);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(2048);
  const [topP, setTopP] = useState<number>(1.0);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isJsonMode, setIsJsonMode] = useState<boolean>(false);
  const [reasoningEffort, setReasoningEffort] = useState<"low" | "medium" | "high">("medium");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      role: "user",
      content:
        "Explain how the scaled dot-product attention mechanism prevents exploding gradients in high-dimensional transformers.",
    },
  ]);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [telemetry, setTelemetry] = useState<{
    latencyMs: number;
    tokensPerSec: number;
    completionTokens: number;
    promptTokens: number;
  }>({
    latencyMs: 0,
    tokensPerSec: 0,
    completionTokens: 0,
    promptTokens: 0,
  });

  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [codeTab, setCodeTab] = useState<"curl" | "python" | "node">("curl");
  const [copyCodeSuccess, setCopyCodeSuccess] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load API Key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem("dsgkx_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      // Auto-switch model if xAI key detected
      if (savedKey.startsWith("xai-")) {
        setModel("grok-2-latest");
      }
    }
  }, []);

  const handleApiKeyChange = (val: string) => {
    setApiKey(val);
    localStorage.setItem("dsgkx_api_key", val.trim());
    if (val.trim().startsWith("xai-") && !model.startsWith("grok")) {
      setModel("grok-2-latest");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  // Determine provider from key or model
  const detectedProvider: "groq" | "xai" | "demo" = apiKey.trim().startsWith("xai-") ||
    model.startsWith("grok")
    ? "xai"
    : apiKey.trim()
    ? "groq"
    : "demo";

  // Execute inference request
  const handleSubmit = async () => {
    if (isLoading) return;

    let updatedMessages = [...messages];
    if (currentInput.trim()) {
      updatedMessages.push({
        id: `msg-${Date.now()}`,
        role: "user",
        content: currentInput.trim(),
      });
      setCurrentInput("");
    }

    if (updatedMessages.length === 0) return;

    setMessages(updatedMessages);
    setIsLoading(true);
    setStreamingContent("");

    const startTime = performance.now();
    let firstTokenTime = 0;
    let accumulatedText = "";
    let tokenCount = 0;

    abortControllerRef.current = new AbortController();

    try {
      // Assemble full payload with system message prepended if present
      const fullMessagesPayload = [
        ...(systemPrompt.trim()
          ? [{ role: "system", content: systemPrompt.trim() }]
          : []),
        ...updatedMessages.map((m) => ({ role: m.role, content: m.content })),
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          provider: detectedProvider,
          apiKey: apiKey.trim(),
          model,
          messages: fullMessagesPayload,
          temperature,
          max_tokens: maxTokens,
          top_p: topP,
          stream: isStreaming,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(errJson.error || `HTTP ${res.status}`);
      }

      if (isStreaming && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(":")) continue;
            if (trimmed === "data: [DONE]") continue;

            if (trimmed.startsWith("data: ")) {
              try {
                const parsed = JSON.parse(trimmed.slice(6));
                const delta = parsed.choices?.[0]?.delta?.content || "";
                if (delta) {
                  if (tokenCount === 0) {
                    firstTokenTime = performance.now();
                  }
                  tokenCount++;
                  accumulatedText += delta;
                  setStreamingContent(accumulatedText);
                }
              } catch {
                // Ignore chunk parse anomalies
              }
            }
          }
        }
      } else {
        const json = await res.json();
        accumulatedText = json.choices?.[0]?.message?.content || "";
        tokenCount = Math.ceil(accumulatedText.length / 4);
      }

      const totalTimeMs = performance.now() - startTime;
      const genTimeSec = (totalTimeMs - (firstTokenTime ? firstTokenTime - startTime : 0)) / 1000;
      const speed = genTimeSec > 0 ? Math.round(tokenCount / genTimeSec) : 0;

      setTelemetry({
        latencyMs: Math.round(totalTimeMs),
        tokensPerSec: speed,
        completionTokens: tokenCount,
        promptTokens: Math.ceil(
          fullMessagesPayload.reduce((acc, m) => acc + m.content.length, 0) / 4
        ),
      });

      // Commit finalized assistant message
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: accumulatedText,
          metrics: {
            latencyMs: Math.round(totalTimeMs),
            tokensPerSec: speed,
            completionTokens: tokenCount,
          },
        },
      ]);
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        const errorMsg = err instanceof Error ? err.message : "Inference failed";
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: `⚠ [DSGKX KERNEL ERROR]: ${errorMsg}\n\nTip: If you haven't entered an API key, check your Groq key at console.groq.com/keys or xAI key at console.x.ai.`,
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      setStreamingContent("");
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  };

  const handleClear = () => {
    handleStop();
    setMessages([]);
    setCurrentInput("");
    setStreamingContent("");
  };

  const handleAddUserTurn = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        role: "user",
        content: "",
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Generate code snippets
  const getCurlSnippet = () => {
    const fullMessages = [
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];
    const endpoint =
      detectedProvider === "xai"
        ? "https://api.x.ai/v1/chat/completions"
        : "https://api.groq.com/openai/v1/chat/completions";

    return `curl -X POST "${endpoint}" \\
  -H "Authorization: Bearer ${apiKey || "$API_KEY"}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "messages": ${JSON.stringify(fullMessages, null, 4)},
    "temperature": ${temperature},
    "max_tokens": ${maxTokens},
    "top_p": ${topP},
    "stream": ${isStreaming}
  }'`;
  };

  const getPythonSnippet = () => {
    const isXai = detectedProvider === "xai";
    return `import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("${isXai ? "XAI_API_KEY" : "GROQ_API_KEY"}", "${apiKey || "YOUR_KEY"}"),
    base_url="${isXai ? "https://api.x.ai/v1" : "https://api.groq.com/openai/v1"}",
)

response = client.chat.completions.create(
    model="${model}",
    messages=[
        {"role": "system", "content": "${systemPrompt}"},
${messages.map((m) => `        {"role": "${m.role}", "content": "${m.content.replace(/"/g, '\\"')}"},`).join("\n")}
    ],
    temperature=${temperature},
    max_tokens=${maxTokens},
    top_p=${topP},
    stream=${isStreaming},
)

${
  isStreaming
    ? `for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)`
    : `print(response.choices[0].message.content)`
}`;
  };

  const getNodeSnippet = () => {
    const isXai = detectedProvider === "xai";
    return `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.${isXai ? "XAI_API_KEY" : "GROQ_API_KEY"} || "${apiKey || "YOUR_KEY"}",
  baseURL: "${isXai ? "https://api.x.ai/v1" : "https://api.groq.com/openai/v1"}",
});

async function main() {
  const stream = await client.chat.completions.create({
    model: "${model}",
    messages: [
      { role: "system", content: "${systemPrompt}" },
${messages.map((m) => `      { role: "${m.role}", content: "${m.content.replace(/"/g, '\\"')}" },`).join("\n")}
    ],
    temperature: ${temperature},
    max_tokens: ${maxTokens},
    stream: true,
  });

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}

main();`;
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyCodeSuccess(true);
    setTimeout(() => setCopyCodeSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F2EFE9] font-mono flex flex-col selection:bg-[#FF3B00] selection:text-[#0B0B0C]">
      {/* Top Navigation Bar in Groq / Swiss Brutalist Style */}
      <header className="h-14 border-b border-[#F2EFE9]/15 bg-[#0B0B0C] px-4 sm:px-6 flex items-center justify-between z-30 select-none">
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
              DSGKX
            </span>
          </Link>

          <span className="text-[#F2EFE9]/30 text-xs hidden sm:inline">/</span>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#F2EFE9]/60">
            <span>Core</span>
            <span>/</span>
            <span className="text-[#F2EFE9] font-bold">Neural Playground</span>
          </div>
        </div>

        {/* Center Mode Switcher & Model Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-[#F2EFE9]/20 bg-[#F2EFE9]/5 p-0.5 text-xs">
            <button className="px-3 py-1 bg-[#FF3B00] text-[#0B0B0C] font-bold uppercase">
              Chat
            </button>
            <button className="px-3 py-1 text-[#F2EFE9]/50 hover:text-[#F2EFE9] uppercase">
              Studio
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs border border-[#F2EFE9]/20 px-3 py-1.5 bg-[#0B0B0C]">
            <span className="w-2 h-2 bg-[#FF3B00] animate-pulse" />
            <span className="text-[#F2EFE9] font-bold truncate max-w-[180px]">
              {MODELS.find((m) => m.id === model)?.name || model}
            </span>
            <span className="text-[10px] text-[#FF3B00] px-1 bg-[#FF3B00]/10">
              {MODELS.find((m) => m.id === model)?.badge}
            </span>
          </div>
        </div>

        {/* Right Utility Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCodeModalOpen(true)}
            data-cursor="CODE"
            className="px-3 py-1.5 border border-[#F2EFE9]/30 text-xs hover:border-[#FF3B00] hover:text-[#FF3B00] transition-colors flex items-center gap-1.5"
          >
            <span>&lt;/&gt;</span>
            <span className="hidden sm:inline">View Code</span>
          </button>

          <Link
            href="/"
            data-cursor="BACK"
            className="px-3 py-1.5 border border-[#FF3B00] bg-[#FF3B00]/10 text-[#FF3B00] text-xs font-bold hover:bg-[#FF3B00] hover:text-[#0B0B0C] transition-colors"
          >
            ← Explainer
          </Link>
        </div>
      </header>

      {/* Main Split Layout: Left Chat + Right Parameters Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Chat Area */}
        <main className="flex-1 flex flex-col justify-between overflow-y-auto border-r border-[#F2EFE9]/15">
          {/* Top Collapsible System Message */}
          <div className="border-b border-[#F2EFE9]/15 bg-[#0B0B0C]">
            <div className="px-6 py-2.5 flex items-center justify-between text-xs text-[#F2EFE9]/50 border-b border-[#F2EFE9]/10">
              <button
                onClick={() => setIsSystemOpen(!isSystemOpen)}
                className="flex items-center gap-2 text-[#FF3B00] font-bold uppercase hover:text-[#F2EFE9]"
              >
                <span>{isSystemOpen ? "▼" : "▶"}</span>
                <span>SYSTEM INSTRUCTIONS (OPTIONAL)</span>
              </button>

              <div className="flex items-center gap-2">
                {SYSTEM_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setSystemPrompt(p.prompt)}
                    className="hidden sm:inline text-[10px] px-2 py-0.5 border border-[#F2EFE9]/20 hover:border-[#FF3B00] hover:text-[#FF3B00] text-[#F2EFE9]/70"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {isSystemOpen && (
              <div className="p-4 sm:p-6">
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Enter system prompt (e.g. You are a helpful AI assistant)..."
                  rows={2}
                  className="w-full bg-[#F2EFE9]/5 border border-[#F2EFE9]/20 p-3 text-xs md:text-sm text-[#F2EFE9] focus:outline-none focus:border-[#FF3B00] transition-colors font-mono resize-y"
                />
              </div>
            )}
          </div>

          {/* Messages Stream Container */}
          <div className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto">
            {messages.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center text-center font-mono space-y-3">
                <div className="text-3xl font-instrument italic text-[#F2EFE9]">
                  DSGKX Neural Sandbox
                </div>
                <p className="text-xs text-[#F2EFE9]/60 max-w-md">
                  Type your query below or select a template to initiate low-latency inference on Groq LPUs or xAI Grok.
                </p>
                <button
                  onClick={() =>
                    setCurrentInput(
                      "Write a high-performance Python matrix multiplication kernel using Triton."
                    )
                  }
                  className="px-3 py-1.5 border border-[#FF3B00] text-xs text-[#FF3B00] hover:bg-[#FF3B00] hover:text-[#0B0B0C] transition-colors"
                >
                  Try: &quot;Triton Matrix Multiplication&quot; →
                </button>
              </div>
            )}

            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id || index}
                  className={`border p-4 sm:p-6 relative ${
                    isUser
                      ? "border-[#F2EFE9]/20 bg-[#F2EFE9]/5"
                      : "border-[#FF3B00]/40 bg-[#0B0B0C] shadow-[0_0_20px_rgba(255,59,0,0.04)]"
                  }`}
                >
                  {/* Role Header */}
                  <div className="flex justify-between items-center text-[10px] font-mono border-b border-[#F2EFE9]/10 pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 ${
                          isUser ? "bg-[#F2EFE9]" : "bg-[#FF3B00] animate-pulse"
                        }`}
                      />
                      <span
                        className={`font-bold tracking-wider ${
                          isUser ? "text-[#F2EFE9]" : "text-[#FF3B00]"
                        }`}
                      >
                        {isUser ? "USER" : `ASSISTANT // ${model.toUpperCase()}`}
                      </span>
                    </div>

                    {msg.metrics && (
                      <div className="flex items-center gap-3 text-[#F2EFE9]/40">
                        <span>{msg.metrics.completionTokens} tokens</span>
                        <span>{msg.metrics.latencyMs}ms</span>
                        <span className="text-[#FF3B00] font-bold">
                          {msg.metrics.tokensPerSec} tok/s
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="font-mono text-xs sm:text-sm text-[#F2EFE9] leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {/* Live Streaming Message Bubble */}
            {isLoading && (
              <div className="border border-[#FF3B00] bg-[#FF3B00]/5 p-4 sm:p-6 relative">
                <div className="flex justify-between items-center text-[10px] font-mono border-b border-[#FF3B00]/20 pb-2 mb-3 text-[#FF3B00]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF3B00] animate-ping" />
                    <span className="font-bold">STREAMING FROM DSGKX // {model}</span>
                  </div>
                  <span className="font-bold">INFERENCE IN PROGRESS...</span>
                </div>

                <div className="font-mono text-xs sm:text-sm text-[#F2EFE9] leading-relaxed whitespace-pre-wrap">
                  {streamingContent}
                  <span className="inline-block w-2 h-4 bg-[#FF3B00] ml-1 animate-pulse align-middle" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Action & Input Ribbon */}
          <div className="border-t border-[#F2EFE9]/15 bg-[#0B0B0C] p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#F2EFE9]/40">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddUserTurn}
                  data-cursor="ADD"
                  className="hover:text-[#FF3B00] transition-colors"
                >
                  + Add message
                </button>
                <span>|</span>
                <button
                  onClick={handleClear}
                  data-cursor="CLEAR"
                  className="hover:text-[#FF3B00] transition-colors"
                >
                  Clear thread
                </button>
              </div>

              <span>Press ⌘+Enter to submit</span>
            </div>

            <div className="relative">
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter user message (e.g. Analyze the mathematical derivation of cross-entropy loss)..."
                rows={3}
                disabled={isLoading}
                className="w-full bg-[#F2EFE9]/5 border-2 border-[#F2EFE9]/20 p-4 text-xs sm:text-sm text-[#F2EFE9] focus:outline-none focus:border-[#FF3B00] transition-colors font-mono resize-none disabled:opacity-50"
              />

              {/* Submit / Stop Button */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                {isLoading ? (
                  <button
                    onClick={handleStop}
                    className="px-4 py-2 bg-red-600 text-white font-bold text-xs uppercase hover:bg-red-700 transition-colors flex items-center gap-1.5"
                  >
                    <span>■</span>
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    data-cursor="RUN"
                    className="px-5 py-2.5 bg-[#FF3B00] text-[#0B0B0C] font-bold text-xs uppercase tracking-wider hover:bg-[#F2EFE9] transition-colors flex items-center gap-2"
                  >
                    <span>Submit</span>
                    <span className="text-[10px] text-[#0B0B0C]/70">⌘↵</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar: PARAMETERS Panel (Identical to Groq Console in Swiss Style) */}
        <aside className="w-full lg:w-80 xl:w-96 bg-[#0B0B0C] border-t lg:border-t-0 border-[#F2EFE9]/15 p-6 overflow-y-auto space-y-6 select-none">
          <div className="flex justify-between items-center text-xs font-mono border-b border-[#F2EFE9]/15 pb-3">
            <span className="text-[#FF3B00] font-bold uppercase tracking-wider">
              [PARAMETERS]
            </span>
            <span className="text-[#F2EFE9]/40 text-[10px]">DSGKX // INFERENCE</span>
          </div>

          {/* API Key Box */}
          <div className="border border-[#F2EFE9]/20 p-4 bg-[#F2EFE9]/5 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-[#FF3B00] font-bold uppercase">
                API KEY (GROQ OR XAI)
              </span>
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-[#F2EFE9]/50 hover:text-[#FF3B00]"
              >
                {showApiKey ? "HIDE" : "SHOW"}
              </button>
            </div>

            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="gsk_... or xai-..."
              className="w-full bg-[#0B0B0C] border border-[#F2EFE9]/30 p-2 text-xs text-[#F2EFE9] font-mono focus:outline-none focus:border-[#FF3B00]"
            />

            <div className="text-[10px] text-[#F2EFE9]/50 flex justify-between pt-1">
              <span>
                {detectedProvider === "xai"
                  ? "✓ xAI Grok Key Active"
                  : detectedProvider === "groq"
                  ? "✓ Groq Key Active"
                  : "Demo Simulation Mode"}
              </span>
              <a
                href={
                  detectedProvider === "xai"
                    ? "https://console.x.ai"
                    : "https://console.groq.com/keys"
                }
                target="_blank"
                rel="noreferrer"
                className="text-[#FF3B00] underline"
              >
                Get Key ↗
              </a>
            </div>
          </div>

          {/* Model Selector Dropdown */}
          <div className="space-y-1.5 font-mono text-xs">
            <label className="text-[#F2EFE9]/70 flex justify-between">
              <span>MODEL</span>
              <span className="text-[10px] text-[#FF3B00]">
                {MODELS.find((m) => m.id === model)?.speed}
              </span>
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-[#0B0B0C] border border-[#F2EFE9]/30 p-2.5 text-xs text-[#F2EFE9] focus:outline-none focus:border-[#FF3B00]"
            >
              <optgroup label="Groq LPUs (Ultra Low Latency)">
                {MODELS.filter((m) => m.provider === "groq").map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.context})
                  </option>
                ))}
              </optgroup>
              <optgroup label="xAI Grok Models">
                {MODELS.filter((m) => m.provider === "xai").map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.context})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#F2EFE9]/70">Temperature</span>
              <input
                type="number"
                min="0"
                max="2"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-16 bg-[#0B0B0C] border border-[#F2EFE9]/30 p-1 text-right text-xs text-[#FF3B00] font-bold"
              />
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-[#FF3B00] bg-[#F2EFE9]/10 h-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#F2EFE9]/40">
              <span>0 (Factual)</span>
              <span>1 (Creative)</span>
              <span>2 (Chaos)</span>
            </div>
          </div>

          {/* Max Completion Tokens Slider */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#F2EFE9]/70">Max Completion Tokens</span>
              <input
                type="number"
                min="1"
                max="8192"
                step="64"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-16 bg-[#0B0B0C] border border-[#F2EFE9]/30 p-1 text-right text-xs text-[#FF3B00] font-bold"
              />
            </div>
            <input
              type="range"
              min="1"
              max="8192"
              step="64"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full accent-[#FF3B00] bg-[#F2EFE9]/10 h-1.5 cursor-pointer"
            />
          </div>

          {/* Top P Slider */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#F2EFE9]/70">Top P (Nucleus)</span>
              <span className="text-[#FF3B00] font-bold">{topP}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              className="w-full accent-[#FF3B00] bg-[#F2EFE9]/10 h-1.5 cursor-pointer"
            />
          </div>

          {/* Reasoning Effort (For DeepSeek R1 / Grok) */}
          <div className="space-y-1.5 font-mono text-xs">
            <label className="text-[#F2EFE9]/70 block">Reasoning Effort</label>
            <div className="grid grid-cols-3 gap-1 border border-[#F2EFE9]/20 p-1">
              {(["low", "medium", "high"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setReasoningEffort(r)}
                  className={`py-1 text-center text-xs uppercase font-bold transition-colors ${
                    reasoningEffort === r
                      ? "bg-[#FF3B00] text-[#0B0B0C]"
                      : "text-[#F2EFE9]/50 hover:text-[#F2EFE9]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles (Stream, JSON Mode) */}
          <div className="space-y-3 pt-2 border-t border-[#F2EFE9]/10 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#F2EFE9]/70">Stream Response</span>
              <button
                onClick={() => setIsStreaming(!isStreaming)}
                className={`w-11 h-6 p-0.5 border transition-colors ${
                  isStreaming
                    ? "border-[#FF3B00] bg-[#FF3B00]"
                    : "border-[#F2EFE9]/30 bg-[#F2EFE9]/10"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-[#0B0B0C] transition-transform ${
                    isStreaming ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#F2EFE9]/70">JSON Mode</span>
              <button
                onClick={() => setIsJsonMode(!isJsonMode)}
                className={`w-11 h-6 p-0.5 border transition-colors ${
                  isJsonMode
                    ? "border-[#FF3B00] bg-[#FF3B00]"
                    : "border-[#F2EFE9]/30 bg-[#F2EFE9]/10"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-[#0B0B0C] transition-transform ${
                    isJsonMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Live Performance Telemetry Gauge */}
          <div className="border border-[#F2EFE9]/20 p-4 bg-[#0B0B0C] space-y-2 font-mono text-xs">
            <div className="text-[10px] text-[#FF3B00] font-bold uppercase border-b border-[#F2EFE9]/10 pb-1 flex justify-between">
              <span>LIVE TELEMETRY</span>
              <span>DSGKX-LPU</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-[#F2EFE9]/40 block text-[9px]">TOTAL TIME</span>
                <span className="text-[#F2EFE9] font-bold">
                  {telemetry.latencyMs ? `${telemetry.latencyMs} ms` : "--"}
                </span>
              </div>
              <div>
                <span className="text-[#F2EFE9]/40 block text-[9px]">SPEED</span>
                <span className="text-[#FF3B00] font-bold">
                  {telemetry.tokensPerSec ? `${telemetry.tokensPerSec} tok/s` : "--"}
                </span>
              </div>
              <div>
                <span className="text-[#F2EFE9]/40 block text-[9px]">PROMPT TOKENS</span>
                <span className="text-[#F2EFE9] font-bold">{telemetry.promptTokens || "--"}</span>
              </div>
              <div>
                <span className="text-[#F2EFE9]/40 block text-[9px]">COMPLETION</span>
                <span className="text-[#F2EFE9] font-bold">{telemetry.completionTokens || "--"}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Code Export Modal */}
      {isCodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl border-2 border-[#F2EFE9]/30 bg-[#0B0B0C] p-6 space-y-4 swiss-grid shadow-[0_0_50px_rgba(255,59,0,0.2)]">
            <div className="flex justify-between items-center border-b border-[#F2EFE9]/15 pb-3">
              <span className="font-bold text-sm text-[#FF3B00]">
                [EXPORT RUNTIME CODE]
              </span>
              <button
                onClick={() => setIsCodeModalOpen(false)}
                className="text-[#F2EFE9]/50 hover:text-[#FF3B00] text-sm"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Code Tabs */}
            <div className="flex gap-2 text-xs font-mono border-b border-[#F2EFE9]/10 pb-2">
              {(["curl", "python", "node"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setCodeTab(t)}
                  className={`px-3 py-1 uppercase font-bold border transition-colors ${
                    codeTab === t
                      ? "border-[#FF3B00] bg-[#FF3B00] text-[#0B0B0C]"
                      : "border-[#F2EFE9]/20 text-[#F2EFE9]/60 hover:text-[#F2EFE9]"
                  }`}
                >
                  {t === "node" ? "Node.js (TS)" : t}
                </button>
              ))}
            </div>

            {/* Code Snippet Box */}
            <div className="relative">
              <pre className="p-4 bg-[#F2EFE9]/5 border border-[#F2EFE9]/15 text-xs text-[#F2EFE9] overflow-x-auto max-h-80 font-mono">
                <code>
                  {codeTab === "curl"
                    ? getCurlSnippet()
                    : codeTab === "python"
                    ? getPythonSnippet()
                    : getNodeSnippet()}
                </code>
              </pre>

              <button
                onClick={() =>
                  copyCode(
                    codeTab === "curl"
                      ? getCurlSnippet()
                      : codeTab === "python"
                      ? getPythonSnippet()
                      : getNodeSnippet()
                  )
                }
                className="absolute top-3 right-3 px-3 py-1 bg-[#FF3B00] text-[#0B0B0C] font-bold text-xs uppercase hover:bg-[#F2EFE9] transition-colors"
              >
                {copyCodeSuccess ? "COPIED ✓" : "COPY CODE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
