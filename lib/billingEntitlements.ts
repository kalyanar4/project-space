import { promises as fs } from "node:fs";

export type BillingPlan = "free" | "pro";

export interface BillingEntitlement {
  sessionId: string;
  plan: BillingPlan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeCheckoutSessionId?: string;
  email?: string;
  updatedAt: string;
}

interface BillingStore {
  entitlements: Record<string, BillingEntitlement>;
}

const DEFAULT_STORE_PATH = "/tmp/dmz_billing_entitlements.json";
const defaultStore = (): BillingStore => ({ entitlements: {} });

const getStorePath = () => process.env.BILLING_STORE_FILE || DEFAULT_STORE_PATH;

const readStore = async (): Promise<BillingStore> => {
  try {
    const raw = await fs.readFile(getStorePath(), "utf8");
    const parsed = JSON.parse(raw) as BillingStore;
    return {
      entitlements: parsed?.entitlements || {},
    };
  } catch {
    return defaultStore();
  }
};

const writeStore = async (store: BillingStore) => {
  const path = getStorePath();
  await fs.writeFile(path, JSON.stringify(store, null, 2), "utf8");
};

export const getEntitlement = async (sessionId: string) => {
  const store = await readStore();
  return store.entitlements[sessionId] || null;
};

export const upsertEntitlement = async (
  sessionId: string,
  patch: Omit<BillingEntitlement, "sessionId" | "updatedAt">
) => {
  const store = await readStore();
  const previous = store.entitlements[sessionId];

  const next: BillingEntitlement = {
    sessionId,
    plan: patch.plan || previous?.plan || "free",
    stripeCustomerId: patch.stripeCustomerId || previous?.stripeCustomerId,
    stripeSubscriptionId: patch.stripeSubscriptionId || previous?.stripeSubscriptionId,
    stripeCheckoutSessionId: patch.stripeCheckoutSessionId || previous?.stripeCheckoutSessionId,
    email: patch.email || previous?.email,
    updatedAt: new Date().toISOString(),
  };

  store.entitlements[sessionId] = next;
  await writeStore(store);
  return next;
};

export const setPlanByStripeCustomerId = async (customerId: string, plan: BillingPlan) => {
  const store = await readStore();
  let updated = false;

  for (const [sessionId, entitlement] of Object.entries(store.entitlements)) {
    if (entitlement.stripeCustomerId === customerId) {
      store.entitlements[sessionId] = {
        ...entitlement,
        plan,
        updatedAt: new Date().toISOString(),
      };
      updated = true;
    }
  }

  if (updated) {
    await writeStore(store);
  }

  return updated;
};
