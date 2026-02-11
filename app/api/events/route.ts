import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  BILLING_SESSION_COOKIE,
  billingSessionCookieOptions,
  createBillingSessionId,
} from "@/lib/billingSession";
import { ingestServerAnalyticsEvent, listServerAnalyticsEvents } from "@/lib/serverAnalytics";

const withSessionCookie = (response: NextResponse, sessionId: string, secure: boolean) => {
  response.cookies.set(BILLING_SESSION_COOKIE, sessionId, billingSessionCookieOptions(secure));
  return response;
};

const getSecureFlag = (req: Request) => {
  const forwarded = req.headers.get("x-forwarded-proto");
  if (forwarded) return forwarded === "https";
  const origin = req.headers.get("origin") || "";
  return origin.startsWith("https://");
};

export async function POST(req: Request) {
  const secure = getSecureFlag(req);
  const cookieStore = cookies();
  const sessionId = cookieStore.get(BILLING_SESSION_COOKIE)?.value || createBillingSessionId();

  let body: {
    event?: string;
    payload?: Record<string, string | number | boolean | null | undefined>;
    timestamp?: string;
    path?: string;
  };

  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const event = String(body.event || "").trim();
  if (!event) {
    return NextResponse.json({ error: "event is required." }, { status: 400 });
  }

  if (event.length > 100) {
    return NextResponse.json({ error: "event is too long." }, { status: 400 });
  }

  await ingestServerAnalyticsEvent({
    sessionId,
    event,
    payload: body.payload || {},
    timestamp: body.timestamp,
    path: body.path || undefined,
    userAgent: req.headers.get("user-agent") || undefined,
    ip:
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      undefined,
  });

  const response = NextResponse.json({ ok: true });
  return withSessionCookie(response, sessionId, secure);
}

export async function GET(req: Request) {
  const secure = getSecureFlag(req);
  const cookieStore = cookies();
  const sessionId = cookieStore.get(BILLING_SESSION_COOKIE)?.value || createBillingSessionId();

  const { searchParams } = new URL(req.url);
  const days = Number(searchParams.get("days") || "7");
  const boundedDays = Number.isFinite(days) && days > 0 ? Math.min(days, 90) : 7;
  const sinceIso = new Date(Date.now() - boundedDays * 24 * 60 * 60 * 1000).toISOString();
  const events = await listServerAnalyticsEvents(sessionId, sinceIso);

  const response = NextResponse.json({ ok: true, events, sessionId, days: boundedDays });
  return withSessionCookie(response, sessionId, secure);
}
