export interface ToolUsageSnapshot {
  dayKey: string;
  dailySuccessCount: number;
  totalSuccessCount: number;
  remainingDailyRuns: number;
  isLimitReached: boolean;
}

interface StoredToolUsage {
  dayKey: string;
  dailyCounts: Record<string, number>;
  lifetimeCounts: Record<string, number>;
}

const USAGE_STORAGE_KEY = "dmz_tool_usage";
export const FREE_DAILY_LIMIT = 3;

const getDayKey = () => new Date().toISOString().slice(0, 10);

const getDefaultUsage = (): StoredToolUsage => ({
  dayKey: getDayKey(),
  dailyCounts: {},
  lifetimeCounts: {},
});

const readUsage = (): StoredToolUsage => {
  if (typeof window === "undefined") return getDefaultUsage();

  try {
    const raw = window.localStorage.getItem(USAGE_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoredToolUsage) : getDefaultUsage();

    if (parsed.dayKey !== getDayKey()) {
      return {
        dayKey: getDayKey(),
        dailyCounts: {},
        lifetimeCounts: parsed.lifetimeCounts || {},
      };
    }

    return {
      dayKey: parsed.dayKey,
      dailyCounts: parsed.dailyCounts || {},
      lifetimeCounts: parsed.lifetimeCounts || {},
    };
  } catch {
    return getDefaultUsage();
  }
};

const writeUsage = (usage: StoredToolUsage) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(usage));
  } catch {
    // Ignore storage failures and continue user flow.
  }
};

const toSnapshot = (toolId: string, usage: StoredToolUsage): ToolUsageSnapshot => {
  const dailySuccessCount = usage.dailyCounts[toolId] || 0;
  const totalSuccessCount = usage.lifetimeCounts[toolId] || 0;
  const remainingDailyRuns = Math.max(FREE_DAILY_LIMIT - dailySuccessCount, 0);

  return {
    dayKey: usage.dayKey,
    dailySuccessCount,
    totalSuccessCount,
    remainingDailyRuns,
    isLimitReached: dailySuccessCount >= FREE_DAILY_LIMIT,
  };
};

export const getToolUsageSnapshot = (toolId: string) => {
  const usage = readUsage();
  return toSnapshot(toolId, usage);
};

export const recordToolSuccess = (toolId: string) => {
  const usage = readUsage();
  usage.dailyCounts[toolId] = (usage.dailyCounts[toolId] || 0) + 1;
  usage.lifetimeCounts[toolId] = (usage.lifetimeCounts[toolId] || 0) + 1;
  writeUsage(usage);
  return toSnapshot(toolId, usage);
};
