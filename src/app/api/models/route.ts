import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey = "" } = body;
    const trimmedKey = apiKey.trim().replace(/^["']|["']$/g, "");

    if (!trimmedKey) {
      return NextResponse.json({ models: [] });
    }

    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: {
        Authorization: `Bearer ${trimmedKey}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      let errMsg = `Groq Authentication Failed (${res.status}): ${res.statusText}`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error?.message) {
          errMsg = parsed.error.message;
        }
      } catch {
        errMsg = errText || errMsg;
      }
      return NextResponse.json({ models: [], error: errMsg }, { status: res.status });
    }

    const data = await res.json();
    const modelIds: string[] = (data.data || [])
      .map((m: { id: string }) => m.id)
      // Exclude audio/whisper models from standard chat dropdown
      .filter((id: string) => !id.includes("whisper"));

    return NextResponse.json({ models: modelIds, count: modelIds.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error querying Groq models";
    return NextResponse.json({ models: [], error: message }, { status: 500 });
  }
}
