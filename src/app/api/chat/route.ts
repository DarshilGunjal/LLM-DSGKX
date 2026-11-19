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
    } = body;

    const trimmedKey = (apiKey || "").trim().replace(/^["']|["']$/g, "");

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
              await new Promise((res) => setTimeout(res, 40));
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

    // Call Groq Official API Endpoint
    const endpoint = "https://api.groq.com/openai/v1/chat/completions";

    const payload: Record<string, unknown> = {
      model,
      messages,
      temperature,
      max_tokens,
      top_p,
      stream,
    };

    if (reasoning_effort) {
      payload.reasoning_effort = reasoning_effort;
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

    // Pipe SSE stream directly to client
    if (stream && response.body) {
      const clientStream = new ReadableStream({
        async start(controller) {
          const reader = response.body!.getReader();
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
