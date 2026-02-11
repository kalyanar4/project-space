import { promises as fs } from "node:fs";
import { getEntitlement } from "./billingEntitlements.ts";

export interface ServerToolUsageSnapshot {
  dayKey: string;
  dailySuccessCount: number;
  totalSuccessCount: number;
  remainingDailyRuns: number;
  isLimitReached: boolean;
  plan: "free" | "pro";
}

interface StoredSessionUsage {
  dayKey: string;
  dailyCounts: Record<string, number>;
  lifetimeCounts: Record<string, number>;
}

interface ToolUsageStore {
  sessions: Record<string, StoredSessionUsage>;
}

const DEFAULT_STORE_PATH = "/tmp/dmz_tool_usage_server.json";
const FREE_DAILY_LIMIT = 3;
const PRO_DAILY_LIMIT = 1000;

const getStorePath = () => process.env.TOOL_USAGE_STORE_FILE || DEFAULT_STORE_PATH;
const getDayKey = () => new Date().toISOString().slice(0, 10);

const defaultSession = (): StoredSessionUsage => ({
  dayKey: getDayKey(),
  dailyCounts: {},
  lifetimeCounts: {},
});

const readStore = async (): Promise<ToolUsageStore> => {
  try {
    const raw = await fs.readFile(getStorePath(), "utf8");
    const parsed = JSON.parse(raw) as ToolUsageStore;
    return {
      sessions: parsed?.sessions || {},
    };
  } catch {
    return { sessions: {} };
  }
};

const writeStore = async (store: ToolUsageStore) => {
  await fs.writeFile(getStorePath(), JSON.stringify(store, null, 2), "utf8");
};

const resolvePlan = async (billingSessionId: string): Promise<"free" | "pro"> => {
  const entitlement = await getEntitlement(billingSessionId);
  return entitlement?.plan === "pro" ? "pro" : "free";
};

const getLimitForPlan = (plan: "free" | "pro") => (plan === "pro" ? PRO_DAILY_LIMIT : FREE_DAILY_LIMIT);

const ensureCurrentDay = (session: StoredSessionUsage): StoredSessionUsage => {
  if (session.dayKey === getDayKey()) return session;
  return {
    dayKey: getDayKey(),
    dailyCounts: {},
    lifetimeCounts: session.lifetimeCounts || {},
  };
};

const toSnapshot = (
  toolId: string,
  session: StoredSessionUsage,
  plan: "free" | "pro"
): ServerToolUsageSnapshot => {
  const dailySuccessCount = session.dailyCounts[toolId] || 0;
  const totalSuccessCount = session.lifetimeCounts[toolId] || 0;
  const limit = getLimitForPlan(plan);
  const remainingDailyRuns = Math.max(limit - dailySuccessCount, 0);

  return {
    dayKey: session.dayKey,
    dailySuccessCount,
    totalSuccessCount,
    remainingDailyRuns,
    isLimitReached: dailySuccessCount >= limit,
    plan,
  };
};

export const getServerToolUsageSnapshot = async (billingSessionId: string, toolId: string) => {
  const plan = await resolvePlan(billingSessionId);
  const store = await readStore();
  const session = ensureCurrentDay(store.sessions[billingSessionId] || defaultSession());
  return toSnapshot(toolId, session, plan);
};

export const recordServerToolSuccess = async (billingSessionId: string, toolId: string) => {
  const plan = await resolvePlan(billingSessionId);
  const store = await readStore();
  const session = ensureCurrentDay(store.sessions[billingSessionId] || defaultSession());
  const snapshot = toSnapshot(toolId, session, plan);

  if (snapshot.isLimitReached) {
    return snapshot;
  }

  session.dailyCounts[toolId] = (session.dailyCounts[toolId] || 0) + 1;
  session.lifetimeCounts[toolId] = (session.lifetimeCounts[toolId] || 0) + 1;
  store.sessions[billingSessionId] = session;
  await writeStore(store);

  return toSnapshot(toolId, session, plan);
};
