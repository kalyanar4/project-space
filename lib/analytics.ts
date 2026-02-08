export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;
export type CoreAnalyticsEvent =
  | "landing_view"
  | "tool_start"
  | "tool_success"
  | "email_capture"
  | "upgrade_click";

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

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, payload);
  }
};

export const trackCoreEvent = (event: CoreAnalyticsEvent, payload: AnalyticsPayload = {}) => {
  trackEvent(event, payload);
};
