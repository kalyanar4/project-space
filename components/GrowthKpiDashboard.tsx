"use client";

import { useMemo } from "react";
import { getStoredAnalyticsEvents } from "@/lib/analytics";

interface MetricCard {
  label: string;
  value: string;
  note: string;
}

const PRO_PRICE_USD = 19;

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

export default function GrowthKpiDashboard() {
  const metrics = useMemo(() => {
    const events = getStoredAnalyticsEvents();
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const weekly = events.filter((entry) => new Date(entry.timestamp).getTime() >= oneWeekAgo);

    const count = (name: string) => weekly.filter((entry) => entry.event === name).length;

    const landingViews = count("landing_view");
    const toolStarts = count("tool_start");
    const toolSuccess = count("tool_success");
    const emailCaptures = count("email_capture");
    const checkouts = count("checkout_complete");

    const activationRate = toolStarts > 0 ? toolSuccess / toolStarts : 0;
    const leadCaptureRate = toolSuccess > 0 ? emailCaptures / toolSuccess : 0;
    const conversionRate = toolSuccess > 0 ? checkouts / toolSuccess : 0;

    const weeklyDaySet = new Set(
      weekly
        .filter((entry) => entry.event === "tool_success")
        .map((entry) => entry.timestamp.slice(0, 10))
    );
    const retentionSignal = weeklyDaySet.size / 7;

    const revenue = checkouts * PRO_PRICE_USD;
    const revenuePerThousandVisitors = landingViews > 0 ? (revenue / landingViews) * 1000 : 0;

    const cards: MetricCard[] = [
      {
        label: "Activation Rate",
        value: formatPercent(activationRate),
        note: "tool_success / tool_start",
      },
      {
        label: "7-Day Return Signal",
        value: formatPercent(retentionSignal),
        note: "days with tool_success in last 7 days",
      },
      {
        label: "Free to Paid Conversion",
        value: formatPercent(conversionRate),
        note: "checkout_complete / tool_success",
      },
      {
        label: "Lead Capture Rate",
        value: formatPercent(leadCaptureRate),
        note: "email_capture / tool_success",
      },
      {
        label: "Revenue per 1000 Visitors",
        value: `$${revenuePerThousandVisitors.toFixed(2)}`,
        note: `checkout_complete * $${PRO_PRICE_USD}`,
      },
    ];

    return {
      cards,
      eventsObserved: weekly.length,
      empty: weekly.length === 0,
    };
  }, []);

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.cards.map((metric) => (
        <article key={metric.label} className="service-card reveal-fade-up">
          <p className="eyebrow mb-2">Weekly KPI</p>
          <h2 className="text-lg font-semibold">{metric.label}</h2>
          <p className="text-3xl font-bold my-3">{metric.value}</p>
          <p className="text-sm text-muted">{metric.note}</p>
        </article>
      ))}

      <article className="glass-card sm:col-span-2 lg:col-span-3 reveal-fade-up">
        <h3 className="text-lg font-semibold mb-2">Data Source</h3>
        {metrics.empty ? (
          <p className="text-muted">
            No analytics events detected yet on this browser. Use the tools and checkout flow to populate
            Week 5 KPI calculations.
          </p>
        ) : (
          <p className="text-muted">
            Calculated from {metrics.eventsObserved} tracked events recorded in this browser during the
            last 7 days.
          </p>
        )}
      </article>
    </section>
  );
}
