import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  BILLING_SESSION_COOKIE,
  billingSessionCookieOptions,
  createBillingSessionId,
} from "@/lib/billingSession";
import { getServerToolUsageSnapshot } from "@/lib/serverToolUsage";

const withSessionCookie = (response: NextResponse, sessionId: string, secure: boolean) => {
  response.cookies.set(BILLING_SESSION_COOKIE, sessionId, billingSessionCookieOptions(secure));
  return response;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const toolId = String(searchParams.get("toolId") || "").trim();
  if (!toolId) {
    return NextResponse.json({ error: "toolId is required." }, { status: 400 });
  }

  const origin = req.headers.get("origin") || "";
  const secure = origin.startsWith("https://");
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(BILLING_SESSION_COOKIE)?.value || createBillingSessionId();
  const snapshot = await getServerToolUsageSnapshot(sessionId, toolId);
  const response = NextResponse.json({ ok: true, snapshot });
  return withSessionCookie(response, sessionId, secure);
}
