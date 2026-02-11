import { createHmac, timingSafeEqual } from "node:crypto";

interface StripeSignatureParts {
  timestamp: number;
  signatures: string[];
}

const parseStripeSignatureHeader = (value: string): StripeSignatureParts | null => {
  const segments = value.split(",").map((segment) => segment.trim());
  const timestampRaw = segments.find((segment) => segment.startsWith("t="))?.slice(2);
  const signatures = segments
    .filter((segment) => segment.startsWith("v1="))
    .map((segment) => segment.slice(3));

  if (!timestampRaw || signatures.length === 0) return null;

  const timestamp = Number(timestampRaw);
  if (!Number.isFinite(timestamp)) return null;

  return { timestamp, signatures };
};

const safeEqualHex = (a: string, b: string) => {
  try {
    const ab = Buffer.from(a, "hex");
    const bb = Buffer.from(b, "hex");
    if (ab.length !== bb.length) return false;
    return timingSafeEqual(ab, bb);
  } catch {
    return false;
  }
};

export const verifyStripeWebhookSignature = (
  payload: string,
  signatureHeader: string,
  webhookSecret: string,
  toleranceSeconds = 300
) => {
  const parsed = parseStripeSignatureHeader(signatureHeader);
  if (!parsed) return false;

  const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - parsed.timestamp);
  if (ageSeconds > toleranceSeconds) return false;

  const signedPayload = `${parsed.timestamp}.${payload}`;
  const expected = createHmac("sha256", webhookSecret).update(signedPayload).digest("hex");
  return parsed.signatures.some((signature) => safeEqualHex(expected, signature));
};

export const createStripeCheckoutSession = async ({
  secretKey,
  priceId,
  successUrl,
  cancelUrl,
  billingSessionId,
}: {
  secretKey: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  billingSessionId: string;
}) => {
  const form = new URLSearchParams();
  form.set("mode", "subscription");
  form.set("line_items[0][price]", priceId);
  form.set("line_items[0][quantity]", "1");
  form.set("success_url", successUrl);
  form.set("cancel_url", cancelUrl);
  form.set("client_reference_id", billingSessionId);
  form.set("metadata[billing_session_id]", billingSessionId);
  form.set("allow_promotion_codes", "true");

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  const data = await response.json();
  return {
    ok: response.ok,
    status: response.status,
    data,
  };
};
