import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing OpenAI API key." }, { status: 500 });
  }

  let prompt = "";
  try {
    const payload = await req.json();
    prompt = String(payload?.prompt ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }

  if (prompt.length > 4000) {
    return NextResponse.json(
      { error: "Prompt is too long. Please keep it under 4000 characters." },
      { status: 400 }
    );
  }

  try {
    const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!openAiRes.ok) {
      const errorText = await openAiRes.text();
      return NextResponse.json({ error: errorText }, { status: openAiRes.status });
    }

    const data = await openAiRes.json();
    const text = data.choices?.[0]?.message?.content?.trim() ?? "";
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "Failed to generate text." }, { status: 500 });
  }
}
