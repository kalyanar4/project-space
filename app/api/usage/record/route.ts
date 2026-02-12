import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  BILLING_SESSION_COOKIE,
  billingSessionCookieOptions,
  createBillingSessionId,
} from "@/lib/billingSession";
import { recordServerToolSuccess } from "@/lib/serverToolUsage";

export const dynamic = "force-static";

const withSessionCookie = (response: NextResponse, sessionId: string, secure: boolean) => {
  response.cookies.set(BILLING_SESSION_COOKIE, sessionId, billingSessionCookieOptions(secure));
  return response;
};

export async function POST(req: Request) {
  let body: { toolId?: string };
  try {
    body = (await req.json()) as { toolId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const toolId = String(body.toolId || "").trim();
  if (!toolId) {
    return NextResponse.json({ error: "toolId is required." }, { status: 400 });
  }

  const origin = req.headers.get("origin") || "";
  const secure = origin.startsWith("https://");
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(BILLING_SESSION_COOKIE)?.value || createBillingSessionId();
  const snapshot = await recordServerToolSuccess(sessionId, toolId);

  if (snapshot.isLimitReached) {
    const response = NextResponse.json(
      {
        ok: false,
        error: "limit_hit",
        snapshot,
      },
      { status: 429 }
    );
    return withSessionCookie(response, sessionId, secure);
  }

  const response = NextResponse.json({ ok: true, snapshot });
  return withSessionCookie(response, sessionId, secure);
}
