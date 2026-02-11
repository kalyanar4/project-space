export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;
export type CoreAnalyticsEvent =
  | "landing_view"
  | "tool_start"
  | "tool_success"
  | "email_capture"
  | "upgrade_click"
  | "checkout_complete";

export interface StoredAnalyticsEvent {
  event: string;
  payload: AnalyticsPayload;
  timestamp: string;
}

const ANALYTICS_STORAGE_KEY = "dmz_analytics_events";
const MAX_STORED_EVENTS = 500;

const dispatchServerAnalyticsEvent = (
  event: string,
  payload: AnalyticsPayload,
  timestamp: string
) => {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    event,
    payload,
    timestamp,
    path: window.location.pathname,
  });

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/events", blob);
      return;
    }
  } catch {
    // Ignore and fallback to fetch.
  }

  fetch("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    keepalive: true,
    body,
  }).catch(() => {
    // Never block UX on analytics transport failures.
  });
};

export const trackEvent = (event: string, payload: AnalyticsPayload = {}) => {
  if (typeof window === "undefined") return;

  const data = { event, ...payload };

  const dataLayer = (window as typeof window & { dataLayer?: unknown[] }).dataLayer;
  if (Array.isArray(dataLayer)) {
    dataLayer.push(data);
  }

  const gtag = (window as typeof window & {
    gtag?: (command: string, eventName: string, params: AnalyticsPayload) => void;
  }).gtag;

  if (typeof gtag === "function") {
    gtag("event", event, payload);
  }

  try {
    const existing = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    const parsed = existing ? (JSON.parse(existing) as StoredAnalyticsEvent[]) : [];
    const timestamp = new Date().toISOString();
    const nextEntry: StoredAnalyticsEvent = {
      event,
      payload,
      timestamp,
    };
    const next = [...parsed, nextEntry].slice(-MAX_STORED_EVENTS);
    window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(next));
    dispatchServerAnalyticsEvent(event, payload, timestamp);
  } catch {
    // Ignore storage errors; analytics should never block the user flow.
    dispatchServerAnalyticsEvent(event, payload, new Date().toISOString());
  }

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, payload);
  }
};

export const trackCoreEvent = (event: CoreAnalyticsEvent, payload: AnalyticsPayload = {}) => {
  trackEvent(event, payload);
};

export const getStoredAnalyticsEvents = () => {
  if (typeof window === "undefined") return [] as StoredAnalyticsEvent[];

  try {
    const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAnalyticsEvent[]) : [];
  } catch {
    return [] as StoredAnalyticsEvent[];
  }
};
