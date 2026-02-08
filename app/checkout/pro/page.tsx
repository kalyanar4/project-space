"use client";

import { useState } from "react";
import Link from "next/link";
import PageAnalytics from "@/components/PageAnalytics";
import { trackCoreEvent } from "@/lib/analytics";

const CHECKOUT_URL = process.env.NEXT_PUBLIC_PRO_CHECKOUT_URL;

export default function ProCheckoutPage() {
  const [upgraded, setUpgraded] = useState(false);

  const handleUpgrade = () => {
    trackCoreEvent("upgrade_click", { source: "checkout_page", tier: "pro" });

    if (CHECKOUT_URL) {
      window.location.href = CHECKOUT_URL;
      return;
    }

    trackCoreEvent("checkout_complete", { source: "checkout_page", tier: "pro" });
    setUpgraded(true);
  };

  return (
    <div className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: "/checkout/pro" }} />

      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">Pro Checkout</h1>
        <p className="page-subtitle">
          Upgrade for higher limits, faster processing, advanced tools, and priority support.
        </p>
      </section>

      <section className="glass-card max-w-3xl mx-auto w-full reveal-fade-up">
        <h2 className="text-2xl font-semibold mb-2">Pro Plan - $19/month</h2>
        <ul className="space-y-2 text-muted mb-5">
          <li>Higher daily usage limits across AI + PDF workflows</li>
          <li>Priority processing for faster output turnaround</li>
          <li>Advanced workflow features and early tool access</li>
          <li>Priority support for production use-cases</li>
        </ul>

        <button onClick={handleUpgrade} className="primary-btn" type="button">
          Start Pro Now
        </button>

        {upgraded && (
          <p className="text-green-500 mt-4">
            Upgrade event recorded. You can now continue with Pro onboarding.
          </p>
        )}

        <p className="text-sm text-muted mt-4">
          Tip: set <code>NEXT_PUBLIC_PRO_CHECKOUT_URL</code> to route users to your payment provider.
        </p>
      </section>

      <section className="cta-section reveal-fade-up">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Need team billing and controls?</h2>
        <Link href="/b2b" className="secondary-btn">
          View B2B Plan
        </Link>
      </section>
    </div>
  );
}
