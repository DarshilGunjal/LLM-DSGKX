import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SIMULATED_GROQ_CHUNKS = [
  "DSGKX Neural Engine on Groq LPUs initialized.\n\n",
  "The Groq Language Processing Unit (LPU) architecture is fundamentally different from conventional GPUs. ",
  "Instead of using high-bandwidth memory (HBM) with non-deterministic caching, ",
  "Groq LPUs use massively parallel Tensor Streaming Processors (TSPs) with ultra-fast on-chip SRAM. ",
  "This architecture delivers deterministic instruction execution and achieves sustained inference throughput exceeding 500–850 tokens per second.\n\n",
  "```python\n# Groq Python SDK Example\nfrom groq import Groq\n\nclient = Groq(api_key=\"your_groq_api_key\")\ncompletion = client.chat.completions.create(\n    model=\"llama-3.3-70b-versatile\",\n    messages=[\n        {\"role\": \"user\", \"content\": \"Explain Groq LPU determinism\"}\n    ],\n    temperature=0.7,\n    stream=True\n)\n\nfor chunk in completion:\n    print(chunk.choices[0].delta.content or \"\", end=\"\")\n```\n\n",
  "To execute live inference with your own Groq account, enter your Groq API key (starts with 'gsk_') in the Parameters panel on the right.",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      apiKey = "",
      model = "llama-3.3-70b-versatile",
      messages = [],
      temperature = 0.7,
      max_tokens = 2048,
      top_p = 1.0,
      stream = true,
      reasoning_effort,
      reasoningEffort,
      response_format,
    } = body;

    const trimmedKey = (apiKey || "").trim().replace(/^["']|["']$/g, "");

    // Sanitize messages: filter out empty content to prevent Groq 400 Bad Request
    const sanitizedMessages = Array.isArray(messages)
      ? messages
          .filter(
            (m: { role?: string; content?: string }) =>
              m &&
              typeof m.content === "string" &&
              m.content.trim().length > 0
          )
          .map((m: { role?: string; content?: string }) => ({
            role: m.role || "user",
            content: m.content!.trim(),
          }))
      : [];

    // If no API key provided, stream high-fidelity simulation
    if (!trimmedKey) {
      if (stream) {
        const encoder = new TextEncoder();
        const demoStream = new ReadableStream({
          async start(controller) {
            for (const chunk of SIMULATED_GROQ_CHUNKS) {
              const data = JSON.stringify({
                choices: [
                  {
                    delta: { content: chunk },
                    index: 0,
                    finish_reason: null,
                  },
                ],
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              await new Promise((res) => setTimeout(res, 35));
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          },
        });

        return new Response(demoStream, {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      }

      return NextResponse.json({
        choices: [
          {
            message: {
              role: "assistant",
              content: SIMULATED_GROQ_CHUNKS.join(""),
            },
          },
        ],
      });
    }

    if (sanitizedMessages.length === 0) {
      return NextResponse.json(
        { error: "At least one message with text content is required." },
        { status: 400 }
      );
    }

    // Call Groq Official API Endpoint
    const endpoint = "https://api.groq.com/openai/v1/chat/completions";

    const payload: Record<string, unknown> = {
      model,
      messages: sanitizedMessages,
      temperature,
      max_tokens,
      top_p,
      stream,
    };

    if (stream) {
      payload.stream_options = { include_usage: true };
    }

    // Only pass reasoning_effort if model supports it (e.g. DeepSeek R1)
    const effectiveReasoningEffort = reasoning_effort || reasoningEffort;
    const lowerModel = model.toLowerCase();
    const isReasoningModel =
      lowerModel.includes("deepseek") ||
      lowerModel.includes("r1") ||
      lowerModel.includes("reason");

    if (isReasoningModel && effectiveReasoningEffort && effectiveReasoningEffort !== "none") {
      payload.reasoning_effort = effectiveReasoningEffort;
    }

    if (response_format) {
      payload.response_format = response_format;
      // Groq requires the word "json" to be present in messages when json_object mode is requested
      if (response_format.type === "json_object") {
        const hasJsonMention = sanitizedMessages.some((m: { content: string }) =>
          m.content.toLowerCase().includes("json")
        );
        if (!hasJsonMention) {
          sanitizedMessages.push({
            role: "system",
            content: "Output response as valid JSON format.",
          });
        }
      }
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${trimmedKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      let errMsg = `Groq API Error (${response.status}): ${response.statusText}`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error?.message) {
          errMsg = parsed.error.message;
        }
      } catch {
        errMsg = errText || errMsg;
      }

      return NextResponse.json(
        {
          error: errMsg,
          status: response.status,
          modelAttempted: model,
        },
        { status: response.status }
      );
    }

    // Pipe SSE stream directly to client with graceful cancellation handling
    if (stream && response.body) {
      let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
      const clientStream = new ReadableStream({
        async start(controller) {
          reader = response.body!.getReader();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(value);
            }
          } catch (err) {
            controller.error(err);
          } finally {
            controller.close();
          }
        },
        cancel() {
          if (reader) {
            reader.cancel().catch(() => {});
          }
        },
      });

      return new Response(clientStream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    const json = await response.json();
    return NextResponse.json(json);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
