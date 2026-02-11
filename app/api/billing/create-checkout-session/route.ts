import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  BILLING_SESSION_COOKIE,
  billingSessionCookieOptions,
  createBillingSessionId,
} from "@/lib/billingSession";
import { createStripeCheckoutSession } from "@/lib/stripeBilling";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status });

const toOrigin = (req: Request) => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (!host) return null;

  const proto = req.headers.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
};

export async function POST(req: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY?.trim();
  const stripePriceId = process.env.STRIPE_PRICE_ID_PRO?.trim();

  if (!stripeSecret || !stripePriceId) {
    return json(
      {
        error:
          "Billing is not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID_PRO environment variables.",
      },
      503
    );
  }

  const origin = toOrigin(req);
  if (!origin) {
    return json(
      {
        error: "Unable to resolve site URL for checkout. Set NEXT_PUBLIC_SITE_URL.",
      },
      500
    );
  }

  const successUrl = `${origin}/checkout/pro?status=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/checkout/pro?status=cancel`;

  const cookieStore = await cookies();
  const existing = cookieStore.get(BILLING_SESSION_COOKIE)?.value;
  const billingSessionId = existing || createBillingSessionId();

  try {
    const session = await createStripeCheckoutSession({
      secretKey: stripeSecret,
      priceId: stripePriceId,
      successUrl,
      cancelUrl,
      billingSessionId,
    });

    if (!session.ok || !session.data?.url) {
      return json(
        {
          error: "Failed to create checkout session.",
          details: session.data,
        },
        502
      );
    }

    const response = json({
      url: String(session.data.url),
      id: String(session.data.id),
    });
    response.cookies.set(
      BILLING_SESSION_COOKIE,
      billingSessionId,
      billingSessionCookieOptions(origin.startsWith("https://"))
    );
    return response;
  } catch {
    return json({ error: "Checkout provider is unavailable." }, 502);
  }
}
