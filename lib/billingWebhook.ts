import { setPlanByStripeCustomerId, upsertEntitlement } from "./billingEntitlements.ts";
import { verifyStripeWebhookSignature } from "./stripeBilling.ts";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

interface StripeEvent {
  type: string;
  data?: {
    object?: {
      id?: string;
      client_reference_id?: string | null;
      metadata?: Record<string, string | undefined>;
      customer?: string | null;
      subscription?: string | null;
      customer_details?: {
        email?: string | null;
      };
    };
  };
}

export async function handleBillingWebhook(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    return jsonResponse({ error: "Missing STRIPE_WEBHOOK_SECRET." }, 503);
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return jsonResponse({ error: "Missing stripe-signature header." }, 400);
  }

  const payload = await req.text();
  const isValid = verifyStripeWebhookSignature(payload, signature, webhookSecret);
  if (!isValid) {
    return jsonResponse({ error: "Invalid webhook signature." }, 400);
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(payload) as StripeEvent;
  } catch {
    return jsonResponse({ error: "Invalid JSON payload." }, 400);
  }

  const object = event.data?.object;

  if (event.type === "checkout.session.completed" && object) {
    const sessionId =
      object.client_reference_id || object.metadata?.billing_session_id || undefined;
    if (sessionId) {
      await upsertEntitlement(sessionId, {
        plan: "pro",
        stripeCustomerId: object.customer || undefined,
        stripeSubscriptionId: object.subscription || undefined,
        stripeCheckoutSessionId: object.id || undefined,
        email: object.customer_details?.email || undefined,
      });
    }
  }

  if (event.type === "customer.subscription.deleted" && object?.customer) {
    await setPlanByStripeCustomerId(object.customer, "free");
  }

  return jsonResponse({ received: true });
}
