import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  BILLING_SESSION_COOKIE,
  billingSessionCookieOptions,
  createBillingSessionId,
} from "@/lib/billingSession";
import { getServerToolUsageSnapshot } from "@/lib/serverToolUsage";

export const dynamic = "force-static";
const IS_STATIC_EXPORT =
  process.env.GITHUB_PAGES === "true" || process.env.NEXT_STATIC_EXPORT === "1";

const withSessionCookie = (response: NextResponse, sessionId: string, secure: boolean) => {
  response.cookies.set(BILLING_SESSION_COOKIE, sessionId, billingSessionCookieOptions(secure));
  return response;
};

export async function GET(req: Request) {
  if (IS_STATIC_EXPORT) {
    return NextResponse.json({
      ok: true,
      snapshot: {
        dayKey: "static_export",
        dailySuccessCount: 0,
        totalSuccessCount: 0,
        remainingDailyRuns: 3,
        isLimitReached: false,
        plan: "free",
      },
    });
  }

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
