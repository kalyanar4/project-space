import {
  ToolUsageSnapshot,
  getToolUsageSnapshot,
  recordToolSuccess,
} from "@/lib/toolUsage";

interface UsageApiResult {
  snapshot: ToolUsageSnapshot;
  allowed: boolean;
}

const parseSnapshot = (value: unknown): ToolUsageSnapshot | null => {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;

  if (
    typeof source.dayKey !== "string" ||
    typeof source.dailySuccessCount !== "number" ||
    typeof source.totalSuccessCount !== "number" ||
    typeof source.remainingDailyRuns !== "number" ||
    typeof source.isLimitReached !== "boolean"
  ) {
    return null;
  }

  return {
    dayKey: source.dayKey,
    dailySuccessCount: source.dailySuccessCount,
    totalSuccessCount: source.totalSuccessCount,
    remainingDailyRuns: source.remainingDailyRuns,
    isLimitReached: source.isLimitReached,
  };
};

export const getUsageSnapshotWithFallback = async (toolId: string) => {
  try {
    const res = await fetch(`/api/usage/snapshot?toolId=${encodeURIComponent(toolId)}`);
    const data = (await res.json()) as { snapshot?: unknown };
    const snapshot = parseSnapshot(data.snapshot);
    if (res.ok && snapshot) {
      return snapshot;
    }
  } catch {
    // fallback handled below
  }

  return getToolUsageSnapshot(toolId);
};

export const checkUsageWithFallback = async (toolId: string): Promise<UsageApiResult> => {
  try {
    const res = await fetch("/api/usage/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toolId }),
    });
    const data = (await res.json()) as { snapshot?: unknown; allowed?: boolean };
    const snapshot = parseSnapshot(data.snapshot);
    if (res.ok && snapshot) {
      return {
        snapshot,
        allowed: typeof data.allowed === "boolean" ? data.allowed : !snapshot.isLimitReached,
      };
    }
  } catch {
    // fallback handled below
  }

  const snapshot = getToolUsageSnapshot(toolId);
  return {
    snapshot,
    allowed: !snapshot.isLimitReached,
  };
};

export const recordUsageWithFallback = async (toolId: string): Promise<ToolUsageSnapshot> => {
  try {
    const res = await fetch("/api/usage/record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toolId }),
    });
    const data = (await res.json()) as { snapshot?: unknown };
    const snapshot = parseSnapshot(data.snapshot);
    if (res.ok && snapshot) {
      return snapshot;
    }
  } catch {
    // fallback handled below
  }

  return recordToolSuccess(toolId);
};
