"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface PageAnalyticsProps {
  event: string;
  payload?: Record<string, string | number | boolean | null | undefined>;
}

export default function PageAnalytics({ event, payload }: PageAnalyticsProps) {
  useEffect(() => {
    trackEvent(event, payload);
  }, [event, payload]);

  return null;
}
