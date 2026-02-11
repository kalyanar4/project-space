import { NextRequest, NextResponse } from "next/server";
import {
  BILLING_SESSION_COOKIE,
  billingSessionCookieOptions,
  createBillingSessionId,
} from "@/lib/billingSession";
import { consumeRateLimit } from "@/lib/requestRateLimit";

export async function POST(req: NextRequest) {
  const secure =
    (req.headers.get("x-forwarded-proto") || "").toLowerCase() === "https" ||
    (req.headers.get("origin") || "").startsWith("https://");
  const sessionId = req.cookies.get(BILLING_SESSION_COOKIE)?.value || createBillingSessionId();
  const responseHeaders = new Headers({ "Content-Type": "application/json" });

  const jsonError = (
    status: number,
    errorCode: string,
    message: string,
    extra: Record<string, string | number | boolean | null | undefined> = {}
  ) => {
    const response = NextResponse.json(
      {
        ok: false,
        error: message,
        errorCode,
        ...extra,
      },
      { status, headers: responseHeaders }
    );
    response.cookies.set(BILLING_SESSION_COOKIE, sessionId, billingSessionCookieOptions(secure));
    return response;
  };

  const jsonOk = (body: Record<string, unknown>) => {
    const response = NextResponse.json({ ok: true, ...body }, { status: 200, headers: responseHeaders });
    response.cookies.set(BILLING_SESSION_COOKIE, sessionId, billingSessionCookieOptions(secure));
    return response;
  };

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";

  const rateWindowMs = Math.max(Number(process.env.AI_RATE_LIMIT_WINDOW_MS || 60000), 1000);
  const ipLimit = Math.max(Number(process.env.AI_RATE_LIMIT_IP_MAX || 40), 1);
  const sessionLimit = Math.max(Number(process.env.AI_RATE_LIMIT_SESSION_MAX || 25), 1);

  const ipRate = consumeRateLimit(`ai:ip:${ip}`, ipLimit, rateWindowMs);
  if (!ipRate.allowed) {
    responseHeaders.set("Retry-After", String(ipRate.retryAfterSeconds));
    responseHeaders.set("X-RateLimit-Limit", String(ipRate.limit));
    responseHeaders.set("X-RateLimit-Remaining", String(ipRate.remaining));
    responseHeaders.set("X-RateLimit-Reset", String(ipRate.resetAt));
    return jsonError(429, "rate_limit_exceeded", "Too many requests from this IP. Try again shortly.");
  }

  const sessionRate = consumeRateLimit(`ai:session:${sessionId}`, sessionLimit, rateWindowMs);
  if (!sessionRate.allowed) {
    responseHeaders.set("Retry-After", String(sessionRate.retryAfterSeconds));
    responseHeaders.set("X-RateLimit-Limit", String(sessionRate.limit));
    responseHeaders.set("X-RateLimit-Remaining", String(sessionRate.remaining));
    responseHeaders.set("X-RateLimit-Reset", String(sessionRate.resetAt));
    return jsonError(429, "rate_limit_exceeded", "Too many requests in this session. Try again shortly.");
  }

  responseHeaders.set("X-RateLimit-Limit", String(Math.min(ipLimit, sessionLimit)));
  responseHeaders.set("X-RateLimit-Remaining", String(Math.min(ipRate.remaining, sessionRate.remaining)));
  responseHeaders.set("X-RateLimit-Reset", String(Math.min(ipRate.resetAt, sessionRate.resetAt)));

  const maxBodyBytes = Math.max(Number(process.env.AI_REQUEST_MAX_BYTES || 16000), 1024);
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > maxBodyBytes) {
    return jsonError(
      413,
      "request_too_large",
      `Request body is too large. Keep it under ${maxBodyBytes} bytes.`
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return jsonError(500, "provider_not_configured", "Missing OpenAI API key.");
  }

  let prompt = "";
  try {
    const rawBody = await req.text();
    if (new TextEncoder().encode(rawBody).byteLength > maxBodyBytes) {
      return jsonError(
        413,
        "request_too_large",
        `Request body is too large. Keep it under ${maxBodyBytes} bytes.`
      );
    }

    const payload = JSON.parse(rawBody) as { prompt?: unknown };
    prompt = String(payload?.prompt ?? "").trim();
  } catch {
    return jsonError(400, "invalid_json", "Invalid JSON payload.");
  }

  if (!prompt) {
    return jsonError(400, "prompt_required", "Prompt is required.");
  }

  const maxPromptChars = Math.max(Number(process.env.AI_PROMPT_MAX_CHARS || 4000), 1);
  if (prompt.length > maxPromptChars) {
    return jsonError(
      400,
      "prompt_too_long",
      `Prompt is too long. Please keep it under ${maxPromptChars} characters.`
    );
  }

  const timeoutMs = Math.min(Math.max(Number(process.env.OPENAI_TIMEOUT_MS || 20000), 1000), 120000);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

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
      signal: controller.signal,
    });

    if (!openAiRes.ok) {
      const errorText = await openAiRes.text();
      return jsonError(
        openAiRes.status,
        "provider_error",
        "Text generation provider returned an error.",
        { providerError: errorText.slice(0, 400) }
      );
    }

    const data = await openAiRes.json();
    const text = data.choices?.[0]?.message?.content?.trim() ?? "";
    return jsonOk({ text });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return jsonError(504, "upstream_timeout", `Text generation timed out after ${timeoutMs}ms.`);
    }
    return jsonError(502, "provider_unavailable", "Failed to generate text.");
  } finally {
    clearTimeout(timeout);
  }
}
