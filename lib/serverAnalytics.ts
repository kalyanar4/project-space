import { promises as fs } from "node:fs";
import type { AnalyticsPayload, StoredAnalyticsEvent } from "./analytics";

interface ServerAnalyticsEvent extends StoredAnalyticsEvent {
  sessionId: string;
  path?: string;
  userAgent?: string;
  ip?: string;
}

interface ServerAnalyticsStore {
  sessions: Record<string, ServerAnalyticsEvent[]>;
}

const DEFAULT_STORE_PATH = "/tmp/dmz_analytics_events_server.json";
const MAX_EVENTS_PER_SESSION = 5000;

const getStorePath = () => process.env.ANALYTICS_STORE_FILE || DEFAULT_STORE_PATH;

const readStore = async (): Promise<ServerAnalyticsStore> => {
  try {
    const raw = await fs.readFile(getStorePath(), "utf8");
    const parsed = JSON.parse(raw) as ServerAnalyticsStore;
    return {
      sessions: parsed?.sessions || {},
    };
  } catch {
    return { sessions: {} };
  }
};

const writeStore = async (store: ServerAnalyticsStore) => {
  await fs.writeFile(getStorePath(), JSON.stringify(store, null, 2), "utf8");
};

export const ingestServerAnalyticsEvent = async (entry: {
  sessionId: string;
  event: string;
  payload?: AnalyticsPayload;
  timestamp?: string;
  path?: string;
  userAgent?: string;
  ip?: string;
}) => {
  const store = await readStore();
  const bucket = store.sessions[entry.sessionId] || [];
  const next: ServerAnalyticsEvent = {
    event: entry.event,
    payload: entry.payload || {},
    timestamp: entry.timestamp || new Date().toISOString(),
    sessionId: entry.sessionId,
    path: entry.path,
    userAgent: entry.userAgent,
    ip: entry.ip,
  };
  const updated = [...bucket, next].slice(-MAX_EVENTS_PER_SESSION);
  store.sessions[entry.sessionId] = updated;
  await writeStore(store);
  return next;
};

export const listServerAnalyticsEvents = async (sessionId: string, sinceIso?: string) => {
  const store = await readStore();
  const events = store.sessions[sessionId] || [];
  if (!sinceIso) return events;

  const since = new Date(sinceIso).getTime();
  if (!Number.isFinite(since)) return events;
  return events.filter((entry) => new Date(entry.timestamp).getTime() >= since);
};
