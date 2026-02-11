"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import PageAnalytics from "@/components/PageAnalytics";
import { trackCoreEvent } from "@/lib/analytics";

export default function ProCheckoutPage() {
  const [upgraded, setUpgraded] = useState(false);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const trackedCompleteRef = useRef(false);

  const pollEntitlement = async () => {
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const res = await fetch("/api/billing/entitlement", { method: "GET" });
      const data = (await res.json()) as { plan?: string };
      if (data.plan === "pro") {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    return false;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const nextStatus = new URLSearchParams(window.location.search).get("status");
    setStatus(nextStatus);
  }, []);

  useEffect(() => {
    let mounted = true;

    const syncCheckoutStatus = async () => {
      if (status === "cancel") {
        if (mounted) {
          setStatusMessage("Checkout canceled. You can resume anytime.");
          setUpgraded(false);
        }
        return;
      }

      if (status !== "success") return;

      if (mounted) {
        setStatusMessage("Finalizing your Pro access...");
      }

      const hasProAccess = await pollEntitlement();
      if (!mounted) return;

      if (!hasProAccess) {
        setError("Payment succeeded, but Pro access is still syncing. Please refresh in a moment.");
        return;
      }

      setUpgraded(true);
      setStatusMessage("Pro access enabled.");
      if (!trackedCompleteRef.current) {
        trackCoreEvent("checkout_complete", { source: "checkout_page", tier: "pro" });
        trackedCompleteRef.current = true;
      }
    };

    syncCheckoutStatus();
    return () => {
      mounted = false;
    };
  }, [status]);

  const handleUpgrade = async () => {
    setError(null);
    setStatusMessage(null);
    trackCoreEvent("upgrade_click", { source: "checkout_page", tier: "pro" });
    setIsStartingCheckout(true);

    try {
      const res = await fetch("/api/billing/create-checkout-session", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        setError(data.error || "Failed to start checkout.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Checkout service is unavailable. Try again shortly.");
    } finally {
      setIsStartingCheckout(false);
    }
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

        <button onClick={handleUpgrade} className="primary-btn" type="button" disabled={isStartingCheckout}>
          {isStartingCheckout ? "Redirecting to Checkout..." : "Start Pro Now"}
        </button>

        {upgraded && (
          <p className="text-green-500 mt-4">
            Pro is active. You can continue with advanced tool workflows.
          </p>
        )}

        {statusMessage && <p className="text-muted mt-4">{statusMessage}</p>}
        {error && <p className="text-red-400 mt-4">{error}</p>}

        <p className="text-sm text-muted mt-4">
          Powered by Stripe Checkout. Configure billing with <code>STRIPE_SECRET_KEY</code>,{" "}
          <code>STRIPE_PRICE_ID_PRO</code>, and <code>STRIPE_WEBHOOK_SECRET</code>.
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
