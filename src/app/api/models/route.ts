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
      return NextResponse.json({ models: [], error: `Failed to fetch: ${res.statusText}` });
    }

    const data = await res.json();
    const modelIds: string[] = (data.data || [])
      .map((m: { id: string }) => m.id)
      // Exclude audio/whisper models from chat dropdown
      .filter((id: string) => !id.includes("whisper"));

    return NextResponse.json({ models: modelIds });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error querying Groq models";
    return NextResponse.json({ models: [], error: message });
  }
}
