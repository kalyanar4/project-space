"use client";

import TrackedLink from "@/components/TrackedLink";

interface UpgradePromptProps {
  sourceToolId: string;
  trigger: "value_moment" | "limit_hit";
}

export default function UpgradePrompt({ sourceToolId, trigger }: UpgradePromptProps) {
  const isLimitHit = trigger === "limit_hit";

  return (
    <section className="glass-card mt-5 border border-[var(--accent-color)]/30">
      <p className="eyebrow">Pro Upgrade</p>
      <h3 className="text-xl font-semibold mb-2">
        {isLimitHit ? "Daily free limit reached" : "Want faster output and higher limits?"}
      </h3>
      <p className="text-muted mb-4">
        {isLimitHit
          ? "Upgrade to Pro for higher daily limits, faster processing, and advanced workflows."
          : "You have completed multiple successful runs. Unlock higher limits and priority processing with Pro."}
      </p>
      <TrackedLink
        href="/checkout/pro"
        className="primary-btn"
        eventName="upgrade_click"
        eventPayload={{ tool: sourceToolId, source: isLimitHit ? "limit_hit" : "value_moment" }}
      >
        Upgrade to Pro
      </TrackedLink>
    </section>
  );
}
