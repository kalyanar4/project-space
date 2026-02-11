export const BILLING_SESSION_COOKIE = "dmz_billing_session";
const BILLING_SESSION_TTL_SECONDS = 60 * 60 * 24 * 365;

export const createBillingSessionId = () => crypto.randomUUID();

export const billingSessionCookieOptions = (secure: boolean) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure,
  path: "/",
  maxAge: BILLING_SESSION_TTL_SECONDS,
});
