import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SIMULATED_STREAM_CHUNKS = [
  "DSGKX Neural Engine initialized. ",
  "The Moon is approximately 384,400 kilometers (238,855 miles) away from Earth on average. ",
  "Because its orbit is elliptical, this distance oscillates between 363,300 km at perigee (closest approach) and 405,500 km at apogee (farthest reach).\n\n",
  "```python\n# Distance Calculation in Kilometers\naverage_distance_km = 384_400\nlight_travel_time_sec = average_distance_km / 299_792.458  # ~1.28 seconds\nprint(f'Light takes {light_travel_time_sec:.2f}s to reach the Moon')\n```\n\n",
  "To execute live inference with your own model weights, make sure to select the matching provider: ",
  "• If you have an xAI Grok key (starts with 'xai-'), choose the 'xAI Grok' provider and a 'grok-2' model.\n",
  "• If you have a Groq key (starts with 'gsk_'), choose the 'Groq LPUs' provider and a 'llama-3' model.",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let {
      provider = "auto", // "groq" | "xai" | "openai" | "demo" | "auto"
      apiKey = "",
      model = "llama-3.3-70b-versatile",
      messages = [],
      temperature = 0.7,
      max_tokens = 2048,
      top_p = 1.0,
      stream = true,
      customBaseUrl = "",
    } = body;

    const trimmedKey = (apiKey || "").trim().replace(/^["']|["']$/g, "");

    // If demo mode or no key provided, return simulated stream
    if (provider === "demo" || !trimmedKey) {
      if (stream) {
        const encoder = new TextEncoder();
        const demoStream = new ReadableStream({
          async start(controller) {
            for (const chunk of SIMULATED_STREAM_CHUNKS) {
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
              await new Promise((res) => setTimeout(res, 50));
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
              content: SIMULATED_STREAM_CHUNKS.join(""),
            },
          },
        ],
      });
    }

    // Determine target provider & endpoint
    let endpoint = "https://api.groq.com/openai/v1/chat/completions";

    const isXaiKey = trimmedKey.startsWith("xai-");
    const isGroqKey = trimmedKey.startsWith("gsk_");
    const isGrokModel = model.toLowerCase().startsWith("grok");

    if (provider === "xai" || isXaiKey || isGrokModel) {
      endpoint = "https://api.x.ai/v1/chat/completions";
      // Auto-correct model for xAI if a Llama model was accidentally passed with an xAI key
      if (!isGrokModel && (provider === "xai" || isXaiKey)) {
        model = "grok-2-latest";
      }
    } else if (provider === "groq" || isGroqKey) {
      endpoint = "https://api.groq.com/openai/v1/chat/completions";
      // Auto-correct model for Groq if a Grok model was accidentally passed with a Groq key
      if (isGrokModel) {
        model = "llama-3.3-70b-versatile";
      }
    } else if (provider === "custom" && customBaseUrl) {
      endpoint = customBaseUrl.endsWith("/chat/completions")
        ? customBaseUrl
        : `${customBaseUrl.replace(/\/$/, "")}/chat/completions`;
    }

    const payload: Record<string, unknown> = {
      model,
      messages,
      temperature,
      max_tokens,
      top_p,
      stream,
    };

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
      let errMsg = `Upstream error (${response.status}): ${response.statusText}`;
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
          hint: isXaiKey
            ? "Your key starts with 'xai-' (xAI Grok). Make sure your model is set to 'grok-2-latest'."
            : isGroqKey
            ? "Your key starts with 'gsk_' (Groq). Make sure your model is set to a Groq model (e.g. llama-3.3-70b-versatile)."
            : undefined,
        },
        { status: response.status }
      );
    }

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
