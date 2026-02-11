import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BILLING_SESSION_COOKIE } from "@/lib/billingSession";
import { getEntitlement } from "@/lib/billingEntitlements";

export async function GET() {
  const cookieStore = cookies();
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
