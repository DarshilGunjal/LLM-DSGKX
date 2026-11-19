"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface Message {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  reasoning?: string;
  isError?: boolean;
  metrics?: {
    latencyMs?: number;
    tokensPerSec?: number;
    completionTokens?: number;
    promptTokens?: number;
  };
}

interface ModelInfo {
  id: string;
  name: string;
  context: string;
  speed: string;
  badge: string;
}

const DEFAULT_GROQ_MODELS: ModelInfo[] = [
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B Versatile",
    context: "128k context",
    speed: "~350 tok/s",
    badge: "RECOMMENDED",
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B Instant",
    context: "128k context",
    speed: "~850 tok/s",
    badge: "ULTRA FAST",
  },
  {
    id: "openai/gpt-oss-120b",
    name: "OpenAI GPT-OSS 120B",
    context: "128k context",
    speed: "~200 tok/s",
    badge: "GROQ PREVIEW",
  },
  {
    id: "openai/gpt-oss-20b",
    name: "OpenAI GPT-OSS 20B",
    context: "128k context",
    speed: "~450 tok/s",
    badge: "FAST",
  },
  {
    id: "deepseek-r1-distill-llama-70b",
    name: "DeepSeek R1 Distill 70B",
    context: "128k context",
    speed: "~300 tok/s",
    badge: "REASONING",
  },
  {
    id: "qwen/qwen3.8-27b",
    name: "Qwen 3.8 27B Vision",
    context: "128k context",
    speed: "~350 tok/s",
    badge: "MULTIMODAL",
  },
];

const SYSTEM_PRESETS = [
  {
    label: "Direct & Concise",
    prompt:
      "You are a helpful, direct, and concise AI assistant powered by Groq LPUs. Provide clear, accurate answers with clean formatting and no unnecessary filler.",
  },
  {
    label: "Senior Software Engineer",
    prompt:
      "You are a Senior Principal Engineer. Provide production-ready code with clean architecture, proper error handling, algorithmic complexity analysis, and zero fluff.",
  },
  {
    label: "Creative Technologist",
    prompt:
      "You are DSGKX, an elite Creative Technologist. Your answers are mathematically precise, aesthetically uncompromising, and formatted in clean markdown.",
  },
  {
    label: "JSON Specialist",
    prompt:
      "You are an automated data transformation kernel. Return strictly formatted, valid JSON objects with zero conversational filler or markdown codeblocks outside JSON.",
  },
];

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [apiKeyStatusMsg, setApiKeyStatusMsg] = useState<string>("");

  const [model, setModel] = useState<string>("llama-3.3-70b-versatile");
  const [customModelInput, setCustomModelInput] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>(DEFAULT_GROQ_MODELS);
  const [isFetchingModels, setIsFetchingModels] = useState<boolean>(false);

  // Playground Parameter States (matching Groq console screenshot)
  const [systemPrompt, setSystemPrompt] = useState<string>(
    "You are a helpful, intelligent AI assistant running on ultra-fast Groq LPU inference."
  );
  const [isSystemOpen, setIsSystemOpen] = useState<boolean>(true);
  const [temperature, setTemperature] = useState<number>(1.0);
  const [maxTokens, setMaxTokens] = useState<number>(2048);
  const [reasoningEffort, setReasoningEffort] = useState<"none" | "low" | "medium" | "high">("medium");
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isJsonMode, setIsJsonMode] = useState<boolean>(false);
  const [browserSearch, setBrowserSearch] = useState<boolean>(false);
  const [codeInterpreter, setCodeInterpreter] = useState<boolean>(false);

  // Message & Stream States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      role: "user",
      content: "Explain how Groq LPUs achieve 500+ tokens per second compared to conventional GPUs.",
    },
  ]);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [streamingReasoning, setStreamingReasoning] = useState<string>("");
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

  // Code Export Modal
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [codeTab, setCodeTab] = useState<"python" | "curl" | "node">("python");
  const [copyCodeSuccess, setCopyCodeSuccess] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load Groq API key from localStorage on mount
  useEffect(() => {
    const savedKey =
      localStorage.getItem("dsgkx_groq_api_key") ||
      localStorage.getItem("dsgkx_api_key");
    if (savedKey) {
      const clean = savedKey.trim().replace(/^["']|["']$/g, "");
      setApiKey(clean);
      fetchLiveGroqModels(clean);
    }
  }, []);

  const handleApiKeyChange = (val: string) => {
    const clean = val.trim().replace(/^["']|["']$/g, "");
    setApiKey(clean);
    localStorage.setItem("dsgkx_groq_api_key", clean);
    if (clean.length > 10) {
      fetchLiveGroqModels(clean);
    } else {
      setApiKeyStatus("idle");
      setApiKeyStatusMsg("");
    }
  };

  // Fetch live active models from Groq API
  const fetchLiveGroqModels = async (key: string) => {
    if (!key) return;
    setIsFetchingModels(true);
    setApiKeyStatus("checking");
    setApiKeyStatusMsg("Verifying with Groq Cloud...");
    try {
      const res = await fetch("/api/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key }),
      });
      const data = await res.json();
      if (res.ok && data.models && data.models.length > 0) {
        const liveList: ModelInfo[] = data.models.map((id: string) => {
          const known = DEFAULT_GROQ_MODELS.find((m) => m.id === id);
          return (
            known || {
              id,
              name: id,
              context: "128k context",
              speed: "LPU Speed",
              badge: "ACTIVE",
            }
          );
        });
        setAvailableModels(liveList);
        setApiKeyStatus("valid");
        setApiKeyStatusMsg(`✓ Groq Key Active (${data.models.length} models synced)`);

        // If current model isn't in account's models, switch to first available
        if (!data.models.includes(model)) {
          setModel(data.models[0]);
        }
      } else {
        setApiKeyStatus("invalid");
        setApiKeyStatusMsg(data.error || "Groq key verification failed (Check key at console.groq.com/keys)");
      }
    } catch {
      setApiKeyStatus("invalid");
      setApiKeyStatusMsg("Network error verifying Groq key");
    } finally {
      setIsFetchingModels(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, streamingReasoning]);

  // Execute inference request against Groq
  const handleSubmit = async (overridePrompt?: string, overrideModel?: string) => {
    if (isLoading) return;

    const activeModel = overrideModel || model;
    let updatedMessages = [...messages];
    const textToSend = overridePrompt !== undefined ? overridePrompt : currentInput.trim();

    if (textToSend) {
      updatedMessages.push({
        id: `msg-${Date.now()}`,
        role: "user",
        content: textToSend,
      });
      if (overridePrompt === undefined) {
        setCurrentInput("");
      }
    }

    if (updatedMessages.length === 0) return;

    // Filter out previous error cards
    const validChatHistory = updatedMessages.filter((m) => !m.isError);

    setMessages(validChatHistory);
    setIsLoading(true);
    setStreamingContent("");
    setStreamingReasoning("");

    const startTime = performance.now();
    let firstTokenTime = 0;
    let accumulatedText = "";
    let accumulatedReasoning = "";
    let tokenCount = 0;
    let exactPromptTokens = 0;
    let exactCompletionTokens = 0;

    abortControllerRef.current = new AbortController();

    try {
      const fullMessagesPayload = [
        ...(systemPrompt.trim()
          ? [{ role: "system", content: systemPrompt.trim() }]
          : []),
        ...validChatHistory
          .filter((m) => m.content.trim().length > 0)
          .map((m) => ({ role: m.role, content: m.content.trim() })),
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          model: activeModel,
          messages: fullMessagesPayload,
          temperature,
          max_tokens: maxTokens,
          top_p: 1.0,
          stream: isStreaming,
          reasoning_effort: reasoningEffort !== "none" ? reasoningEffort : undefined,
          response_format: isJsonMode ? { type: "json_object" } : undefined,
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
                const delta = parsed.choices?.[0]?.delta;

                if (delta) {
                  // Capture reasoning tokens (e.g. DeepSeek R1)
                  if (delta.reasoning_content) {
                    accumulatedReasoning += delta.reasoning_content;
                    setStreamingReasoning(accumulatedReasoning);
                  }

                  // Capture main content tokens
                  if (delta.content) {
                    if (tokenCount === 0) {
                      firstTokenTime = performance.now();
                    }
                    tokenCount++;
                    accumulatedText += delta.content;
                    setStreamingContent(accumulatedText);
                  }
                }

                // Check for stream usage chunk (stream_options: { include_usage: true })
                if (parsed.usage) {
                  if (parsed.usage.prompt_tokens) {
                    exactPromptTokens = parsed.usage.prompt_tokens;
                  }
                  if (parsed.usage.completion_tokens) {
                    exactCompletionTokens = parsed.usage.completion_tokens;
                    tokenCount = exactCompletionTokens;
                  }
                }
              } catch {
                // Ignore SSE framing splits
              }
            }
          }
        }
      } else {
        const json = await res.json();
        accumulatedText = json.choices?.[0]?.message?.content || "";
        tokenCount = Math.ceil(accumulatedText.length / 4);
        if (json.usage) {
          exactPromptTokens = json.usage.prompt_tokens || 0;
          exactCompletionTokens = json.usage.completion_tokens || tokenCount;
          tokenCount = exactCompletionTokens;
        }
      }

      const totalTimeMs = performance.now() - startTime;
      const genTimeSec = (totalTimeMs - (firstTokenTime ? firstTokenTime - startTime : 0)) / 1000;
      const speed = genTimeSec > 0 ? Math.round(tokenCount / genTimeSec) : 0;

      const promptTok =
        exactPromptTokens ||
        Math.ceil(fullMessagesPayload.reduce((acc, m) => acc + m.content.length, 0) / 4);

      setTelemetry({
        latencyMs: Math.round(totalTimeMs),
        tokensPerSec: speed,
        completionTokens: exactCompletionTokens || tokenCount,
        promptTokens: promptTok,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: accumulatedText,
          reasoning: accumulatedReasoning || undefined,
          metrics: {
            latencyMs: Math.round(totalTimeMs),
            tokensPerSec: speed,
            completionTokens: exactCompletionTokens || tokenCount,
            promptTokens: promptTok,
          },
        },
      ]);
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        const errorMsg = err instanceof Error ? err.message : "Inference failed";
        const isModelAccessError =
          errorMsg.toLowerCase().includes("does not exist") ||
          errorMsg.toLowerCase().includes("access to it");

        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            isError: true,
            content: `⚠ [GROQ LPU API ERROR]: ${errorMsg}\n\n${
              isModelAccessError
                ? `Notice: The model '${activeModel}' is not active or accessible on your Groq tier. Click below to instantly switch to an active production model:`
                : "Please verify your Groq API key (starts with 'gsk_') in the Parameters sidebar."
            }`,
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      setStreamingContent("");
      setStreamingReasoning("");
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
    setStreamingReasoning("");
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

  // Code Export Snippets for Groq
  const getPythonSnippet = () => {
    const fullMessages = [
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      ...messages.filter((m) => !m.isError).map((m) => ({ role: m.role, content: m.content })),
    ];

    return `import os
from groq import Groq

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY", "${apiKey || "gsk_..."}"),
)

completion = client.chat.completions.create(
    model="${model}",
    messages=${JSON.stringify(fullMessages, null, 4)},
    temperature=${temperature},
    max_tokens=${maxTokens},
    stream=${isStreaming},${isJsonMode ? '\n    response_format={"type": "json_object"},' : ""}${
      reasoningEffort !== "none" ? `\n    reasoning_effort="${reasoningEffort}",` : ""
    }
)

${
  isStreaming
    ? `for chunk in completion:
    print(chunk.choices[0].delta.content or "", end="", flush=True)`
    : `print(completion.choices[0].message.content)`
}`;
  };

  const getCurlSnippet = () => {
    const fullMessages = [
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      ...messages.filter((m) => !m.isError).map((m) => ({ role: m.role, content: m.content })),
    ];

    const bodyObj: Record<string, unknown> = {
      model,
      messages: fullMessages,
      temperature,
      max_tokens: maxTokens,
      stream: isStreaming,
    };
    if (isJsonMode) {
      bodyObj.response_format = { type: "json_object" };
    }
    if (reasoningEffort !== "none") {
      bodyObj.reasoning_effort = reasoningEffort;
    }

    return `curl -X POST "https://api.groq.com/openai/v1/chat/completions" \\
  -H "Authorization: Bearer ${apiKey || "$GROQ_API_KEY"}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(bodyObj, null, 2)}'`;
  };

  const getNodeSnippet = () => {
    return `import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "${apiKey || "gsk_..."}" });

async function main() {
  const chatCompletion = await groq.chat.completions.create({
    model: "${model}",
    messages: [
      { role: "system", content: "${systemPrompt.replace(/"/g, '\\"')}" },
${messages
  .filter((m) => !m.isError)
  .map((m) => `      { role: "${m.role}", content: "${m.content.replace(/"/g, '\\"')}" },`)
  .join("\n")}
    ],
    temperature: ${temperature},
    max_tokens: ${maxTokens},
    stream: true,${isJsonMode ? '\n    response_format: { type: "json_object" },' : ""}
  });

  for await (const chunk of chatCompletion) {
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
      {/* Top Header: Matching Groq Console in Swiss Neo-Brutalist Aesthetic */}
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
              DSGKX // GROQ
            </span>
          </Link>

          <span className="text-[#F2EFE9]/30 text-xs hidden sm:inline">/</span>

          {/* Project Breadcrumb (matching Groq screenshot) */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#F2EFE9]/60">
            <span>Personal</span>
            <span>/</span>
            <span className="text-[#F2EFE9] font-bold">Default Project</span>
          </div>
        </div>

        {/* Center Mode Switcher (Chat vs Studio) & Model Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-[#F2EFE9]/20 bg-[#F2EFE9]/5 p-0.5 text-xs">
            <button className="px-3 py-1 bg-[#FF3B00] text-[#0B0B0C] font-bold uppercase">
              Chat
            </button>
            <button className="px-3 py-1 text-[#F2EFE9]/50 hover:text-[#F2EFE9] uppercase">
              Studio
            </button>
          </div>

          {/* Model Badge */}
          <div className="hidden md:flex items-center gap-2 text-xs border border-[#F2EFE9]/20 px-3 py-1.5 bg-[#0B0B0C]">
            <span className="w-2 h-2 bg-[#FF3B00] animate-pulse" />
            <span className="text-[#F2EFE9] font-bold truncate max-w-[200px]">
              {availableModels.find((m) => m.id === model)?.name || model}
            </span>
            <span className="text-[10px] text-[#FF3B00] px-1 bg-[#FF3B00]/10 font-bold">
              LPU
            </span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCodeModalOpen(true)}
            data-cursor="CODE"
            className="px-3 py-1.5 border border-[#F2EFE9]/30 text-xs hover:border-[#FF3B00] hover:text-[#FF3B00] transition-colors flex items-center gap-1.5"
          >
            <span>&lt;/&gt;</span>
            <span className="hidden sm:inline">View code</span>
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

      {/* Main Workspace: Left Chat Canvas + Right PARAMETERS Panel */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Chat Area */}
        <main className="flex-1 flex flex-col justify-between overflow-y-auto border-r border-[#F2EFE9]/15">
          {/* SYSTEM Message Box (Matching Groq screenshot) */}
          <div className="border-b border-[#F2EFE9]/15 bg-[#0B0B0C]">
            <div className="px-6 py-2.5 flex items-center justify-between text-xs text-[#F2EFE9]/50 border-b border-[#F2EFE9]/10">
              <button
                onClick={() => setIsSystemOpen(!isSystemOpen)}
                className="flex items-center gap-2 text-[#FF3B00] font-bold uppercase hover:text-[#F2EFE9]"
              >
                <span>{isSystemOpen ? "▼" : "▶"}</span>
                <span>SYSTEM</span>
                <span className="text-[11px] text-[#F2EFE9]/40 font-normal">
                  Enter system message (Optional)
                </span>
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
                  placeholder="Enter system message (Optional)..."
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
                  Groq LPU Neural Playground
                </div>
                <p className="text-xs text-[#F2EFE9]/60 max-w-md">
                  Powered by Groq LPUs for sub-second deterministic inference. Enter your query below to stream tokens.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleSubmit("How far is the Moon from Earth in miles and kilometers?")
                    }
                    className="px-3 py-1.5 border border-[#FF3B00] text-xs text-[#FF3B00] hover:bg-[#FF3B00] hover:text-[#0B0B0C] transition-colors"
                  >
                    Try: &quot;How far is the Moon?&quot; →
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              const isError = msg.isError;

              return (
                <div
                  key={msg.id || index}
                  className={`border p-4 sm:p-6 relative ${
                    isError
                      ? "border-red-500 bg-red-950/20"
                      : isUser
                      ? "border-[#F2EFE9]/20 bg-[#F2EFE9]/5"
                      : "border-[#FF3B00]/40 bg-[#0B0B0C] shadow-[0_0_20px_rgba(255,59,0,0.04)]"
                  }`}
                >
                  {/* Role Header */}
                  <div className="flex justify-between items-center text-[10px] font-mono border-b border-[#F2EFE9]/10 pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 ${
                          isError
                            ? "bg-red-500"
                            : isUser
                            ? "bg-[#F2EFE9]"
                            : "bg-[#FF3B00] animate-pulse"
                        }`}
                      />
                      <span
                        className={`font-bold tracking-wider ${
                          isError
                            ? "text-red-400"
                            : isUser
                            ? "text-[#F2EFE9]"
                            : "text-[#FF3B00]"
                        }`}
                      >
                        {isError
                          ? "GROQ API ERROR"
                          : isUser
                          ? "USER"
                          : `ASSISTANT // ${model.toUpperCase()}`}
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

                  {/* DeepSeek R1 Reasoning Accordion (if present) */}
                  {msg.reasoning && (
                    <div className="mb-4 border border-[#FF3B00]/30 bg-[#FF3B00]/5 p-3 text-xs font-mono">
                      <div className="flex items-center gap-2 text-[#FF3B00] font-bold text-[10px] uppercase mb-1.5">
                        <span className="w-1.5 h-1.5 bg-[#FF3B00] animate-pulse" />
                        <span>THINKING PROCESS // CHAIN OF THOUGHT</span>
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto text-[11px] text-[#F2EFE9]/70">
                        {msg.reasoning}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="font-mono text-xs sm:text-sm text-[#F2EFE9] leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>

                  {/* 1-Click Recovery if model error occurs */}
                  {isError && (
                    <div className="mt-4 pt-3 border-t border-red-500/30 flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setModel("llama-3.3-70b-versatile");
                          handleSubmit(undefined, "llama-3.3-70b-versatile");
                        }}
                        className="px-3 py-1.5 bg-[#FF3B00] text-[#0B0B0C] font-bold text-xs uppercase hover:bg-white transition-colors"
                      >
                        👉 Switch to Llama 3.3 70B &amp; Retry
                      </button>
                      <button
                        onClick={() => {
                          setModel("llama-3.1-8b-instant");
                          handleSubmit(undefined, "llama-3.1-8b-instant");
                        }}
                        className="px-3 py-1.5 border border-[#F2EFE9]/30 text-[#F2EFE9] hover:border-[#FF3B00] text-xs uppercase transition-colors"
                      >
                        Try Llama 3.1 8B Instant (~850 tok/s)
                      </button>
                      <button
                        onClick={() => {
                          setModel("openai/gpt-oss-120b");
                          handleSubmit(undefined, "openai/gpt-oss-120b");
                        }}
                        className="px-3 py-1.5 border border-[#FF3B00]/50 text-[#FF3B00] hover:bg-[#FF3B00]/10 text-xs uppercase transition-colors"
                      >
                        Try OpenAI GPT-OSS 120B
                      </button>
                      {apiKey && (
                        <button
                          onClick={() => fetchLiveGroqModels(apiKey)}
                          className="px-3 py-1.5 border border-[#F2EFE9]/20 text-[#F2EFE9]/70 hover:text-white text-xs uppercase transition-colors"
                        >
                          ↻ Sync My Groq Models
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Live Streaming Bubble */}
            {isLoading && (
              <div className="border border-[#FF3B00] bg-[#FF3B00]/5 p-4 sm:p-6 relative">
                <div className="flex justify-between items-center text-[10px] font-mono border-b border-[#FF3B00]/20 pb-2 mb-3 text-[#FF3B00]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF3B00] animate-ping" />
                    <span className="font-bold">STREAMING FROM GROQ LPU // {model.toUpperCase()}</span>
                  </div>
                  <span className="font-bold">INFERENCE IN PROGRESS...</span>
                </div>

                {/* Live Reasoning Stream (DeepSeek R1) */}
                {streamingReasoning && (
                  <div className="mb-4 border border-[#FF3B00]/30 bg-[#FF3B00]/10 p-3 text-xs font-mono">
                    <div className="flex items-center gap-2 text-[#FF3B00] font-bold text-[10px] uppercase mb-1">
                      <span className="w-1.5 h-1.5 bg-[#FF3B00] animate-pulse" />
                      <span>THINKING IN PROGRESS (REASONING)...</span>
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto text-[11px] text-[#F2EFE9]/70">
                      {streamingReasoning}
                    </div>
                  </div>
                )}

                <div className="font-mono text-xs sm:text-sm text-[#F2EFE9] leading-relaxed whitespace-pre-wrap">
                  {streamingContent}
                  <span className="inline-block w-2 h-4 bg-[#FF3B00] ml-1 animate-pulse align-middle" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Action Ribbon (Matching Groq console layout) */}
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
                  Clear
                </button>
              </div>

              <span>Press ⌘+Enter to submit</span>
            </div>

            <div className="relative">
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter user message..."
                rows={3}
                disabled={isLoading}
                className="w-full bg-[#F2EFE9]/5 border-2 border-[#F2EFE9]/20 p-4 text-xs sm:text-sm text-[#F2EFE9] focus:outline-none focus:border-[#FF3B00] transition-colors font-mono resize-none disabled:opacity-50"
              />

              {/* Submit Button (Matching screenshot's Submit ⌘↵ pill) */}
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
                    onClick={() => handleSubmit()}
                    data-cursor="RUN"
                    className="px-6 py-2 bg-[#FF3B00] text-[#0B0B0C] font-bold text-xs uppercase tracking-wider hover:bg-[#F2EFE9] transition-all flex items-center gap-2 border border-[#FF3B00]"
                  >
                    <span>Submit</span>
                    <span className="text-[10px] text-[#0B0B0C]/80 font-mono">⌘↵</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar: PARAMETERS Panel (Matching Groq Console) */}
        <aside className="w-full lg:w-80 xl:w-96 bg-[#0B0B0C] border-t lg:border-t-0 border-[#F2EFE9]/15 p-6 overflow-y-auto space-y-6 select-none">
          <div className="flex justify-between items-center text-xs font-mono border-b border-[#F2EFE9]/15 pb-3">
            <span className="text-[#FF3B00] font-bold uppercase tracking-wider">
              [PARAMETERS]
            </span>
            <span className="text-[#F2EFE9]/40 text-[10px]">GROQ LPU ENGINE</span>
          </div>

          {/* 1. Groq API Key Input */}
          <div className="border border-[#F2EFE9]/20 p-4 bg-[#F2EFE9]/5 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-[#FF3B00] font-bold uppercase">
                GROQ API KEY
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
              placeholder="gsk_... (Enter your Groq Key)"
              className="w-full bg-[#0B0B0C] border border-[#F2EFE9]/30 p-2 text-xs text-[#F2EFE9] font-mono focus:outline-none focus:border-[#FF3B00]"
            />

            <div className="text-[10px] flex justify-between items-center pt-1">
              <span
                className={
                  apiKeyStatus === "valid"
                    ? "text-emerald-400 font-bold"
                    : apiKeyStatus === "invalid"
                    ? "text-red-400 font-bold"
                    : "text-[#F2EFE9]/50"
                }
              >
                {apiKeyStatusMsg || (apiKey ? "✓ Key Saved" : "Simulation Mode (No Key)")}
              </span>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[#FF3B00] underline ml-2 whitespace-nowrap"
              >
                Get Groq Key ↗
              </a>
            </div>

            {/* Sync live models button */}
            {apiKey && (
              <button
                onClick={() => fetchLiveGroqModels(apiKey)}
                disabled={isFetchingModels}
                className="w-full mt-1 py-1 text-[10px] border border-[#F2EFE9]/20 hover:border-[#FF3B00] text-[#F2EFE9]/70 hover:text-[#FF3B00] transition-colors"
              >
                {isFetchingModels ? "Syncing..." : "↻ Sync Live Models from Groq"}
              </button>
            )}
          </div>

          {/* 2. Model Selector Dropdown */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#F2EFE9]/70">MODEL</span>
              <span className="text-[10px] text-[#FF3B00]">
                {availableModels.find((m) => m.id === model)?.speed || "~500 tok/s"}
              </span>
            </div>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-[#0B0B0C] border-2 border-[#F2EFE9]/30 p-2.5 text-xs text-[#F2EFE9] font-bold focus:outline-none focus:border-[#FF3B00]"
            >
              {availableModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.context})
                </option>
              ))}
            </select>

            {/* Custom Model Input Option */}
            <div className="pt-1">
              <input
                type="text"
                placeholder="Or type custom Groq model ID..."
                value={customModelInput}
                onChange={(e) => setCustomModelInput(e.target.value)}
                onBlur={() => {
                  if (customModelInput.trim()) {
                    setModel(customModelInput.trim());
                  }
                }}
                className="w-full bg-[#0B0B0C] border border-[#F2EFE9]/20 p-1.5 text-[11px] text-[#F2EFE9] focus:outline-none focus:border-[#FF3B00]"
              />
            </div>
          </div>

          {/* 3. Temperature Slider (Matching Groq screenshot: 0-2, default 1) */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#F2EFE9]/70">Temperature</span>
              <input
                type="number"
                min="0"
                max="2"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
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
              <span>1 (Default)</span>
              <span>2 (Creative)</span>
            </div>
          </div>

          {/* 4. Max Completion Tokens (Matching Groq screenshot: default 2048) */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#F2EFE9]/70">Max Completion Tokens</span>
              <input
                type="number"
                min="1"
                max="32768"
                step="64"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value) || 2048)}
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

          {/* 5. Reasoning Effort (Matching Groq screenshot: medium) */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#F2EFE9]/70">Reasoning</span>
              <select
                value={reasoningEffort}
                onChange={(e) =>
                  setReasoningEffort(e.target.value as "none" | "low" | "medium" | "high")
                }
                className="bg-[#0B0B0C] border border-[#F2EFE9]/30 px-2 py-1 text-xs text-[#FF3B00] font-bold"
              >
                <option value="none">none</option>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>
          </div>

          {/* 6. Stream & JSON Toggles (Matching Groq screenshot) */}
          <div className="space-y-3 pt-2 border-t border-[#F2EFE9]/10 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#F2EFE9]/70">Stream</span>
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

          {/* 7. Built-in Tools (Matching Groq Console: Browser Search & Code Interpreter) */}
          <div className="space-y-2.5 pt-2 border-t border-[#F2EFE9]/10 font-mono text-xs">
            <span className="text-[10px] text-[#F2EFE9]/40 uppercase block">
              BUILT-IN TOOLS
            </span>
            <div className="flex justify-between items-center">
              <span className="text-[#F2EFE9]/70">Browser Search</span>
              <button
                onClick={() => setBrowserSearch(!browserSearch)}
                className={`w-11 h-6 p-0.5 border transition-colors ${
                  browserSearch
                    ? "border-[#FF3B00] bg-[#FF3B00]"
                    : "border-[#F2EFE9]/30 bg-[#F2EFE9]/10"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-[#0B0B0C] transition-transform ${
                    browserSearch ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#F2EFE9]/70">Code Interpreter</span>
              <button
                onClick={() => setCodeInterpreter(!codeInterpreter)}
                className={`w-11 h-6 p-0.5 border transition-colors ${
                  codeInterpreter
                    ? "border-[#FF3B00] bg-[#FF3B00]"
                    : "border-[#F2EFE9]/30 bg-[#F2EFE9]/10"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-[#0B0B0C] transition-transform ${
                    codeInterpreter ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 8. Live Telemetry HUD */}
          <div className="border border-[#F2EFE9]/20 p-4 bg-[#0B0B0C] space-y-2 font-mono text-xs">
            <div className="text-[10px] text-[#FF3B00] font-bold uppercase border-b border-[#F2EFE9]/10 pb-1 flex justify-between">
              <span>LIVE TELEMETRY</span>
              <span>GROQ LPU</span>
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
                <span className="text-[#F2EFE9] font-bold">
                  {telemetry.completionTokens || "--"}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Code Export Modal (cURL, Python, Node.js) */}
      {isCodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl border-2 border-[#F2EFE9]/30 bg-[#0B0B0C] p-6 space-y-4 swiss-grid shadow-[0_0_50px_rgba(255,59,0,0.2)]">
            <div className="flex justify-between items-center border-b border-[#F2EFE9]/15 pb-3">
              <span className="font-bold text-sm text-[#FF3B00]">
                [EXPORT RUNTIME CODE: GROQ LPU]
              </span>
              <button
                onClick={() => setIsCodeModalOpen(false)}
                className="text-[#F2EFE9]/50 hover:text-[#FF3B00] text-sm"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="flex gap-2 text-xs font-mono border-b border-[#F2EFE9]/10 pb-2">
              {(["python", "curl", "node"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setCodeTab(t)}
                  className={`px-3 py-1 uppercase font-bold border transition-colors ${
                    codeTab === t
                      ? "border-[#FF3B00] bg-[#FF3B00] text-[#0B0B0C]"
                      : "border-[#F2EFE9]/20 text-[#F2EFE9]/60 hover:text-[#F2EFE9]"
                  }`}
                >
                  {t === "python" ? "Python (Groq SDK)" : t === "node" ? "Node.js (TS)" : "cURL"}
                </button>
              ))}
            </div>

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
