import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BILLING_SESSION_COOKIE } from "@/lib/billingSession";
import { getEntitlement } from "@/lib/billingEntitlements";

export const dynamic = "force-static";
const IS_STATIC_EXPORT =
  process.env.GITHUB_PAGES === "true" || process.env.NEXT_STATIC_EXPORT === "1";

export async function GET() {
  if (IS_STATIC_EXPORT) {
    return NextResponse.json({ plan: "free", source: "static_export" });
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(BILLING_SESSION_COOKIE)?.value;

  if (!sessionId) {
    return NextResponse.json({ plan: "free", source: "no_session" });
  }

  const entitlement = await getEntitlement(sessionId);
  if (!entitlement) {
    return NextResponse.json({ plan: "free", source: "session_unknown", sessionId });
  }

  return NextResponse.json({
    plan: entitlement.plan,
    sessionId,
    updatedAt: entitlement.updatedAt,
    email: entitlement.email || null,
  });
}
