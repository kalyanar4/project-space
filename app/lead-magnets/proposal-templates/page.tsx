"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import PageAnalytics from "@/components/PageAnalytics";
import { trackCoreEvent } from "@/lib/analytics";
import { ErrorState, LoadingState } from "@/components/FlowStates";

export default function ProposalTemplatesPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();

    trackCoreEvent("tool_start", {
      tool: "lead_magnet_proposal_templates",
      source: "lead_magnet_gate",
    });

    setStatus("saving");
    setMessage("");

    try {
      const res = await fetch("/api/email-capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalized,
          tool: "lead_magnet_proposal_templates",
          source: "lead_magnet_gate",
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Unable to unlock templates right now.");
      }

      trackCoreEvent("email_capture", {
        tool: "lead_magnet_proposal_templates",
        source: "lead_magnet_gate",
      });

      trackCoreEvent("tool_success", {
        tool: "lead_magnet_proposal_templates",
        source: "lead_magnet_gate",
      });

      setStatus("saved");
      setMessage("Templates unlocked. Download them below.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unlock failed.");
    }
  };

  return (
    <div className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: "/lead-magnets/proposal-templates" }} />

      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">10 Client-Proposal Templates</h1>
        <p className="page-subtitle">
          Grab a ready-to-use proposal starter pack for freelancers and small agencies.
        </p>
      </section>

      <section className="glass-card max-w-3xl mx-auto w-full reveal-fade-up">
        <h2 className="text-2xl font-semibold mb-3">What you get</h2>
        <ul className="space-y-2 text-muted mb-5">
          <li>• High-intent proposal structures for common client services</li>
          <li>• Scope, timeline, pricing, and delivery section prompts</li>
          <li>• Templates designed for fast customization and send-out</li>
        </ul>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email to unlock"
            required
          />
          <button type="submit" className="primary-btn" disabled={status === "saving"}>
            {status === "saving" ? "Unlocking..." : "Unlock Templates"}
          </button>
        </form>

        <div className="mt-4 grid gap-3">
          {status === "saving" && (
            <LoadingState
              title="Unlocking Templates"
              description="Saving your email and preparing download access."
            />
          )}

          {status === "error" && <ErrorState title="Unlock Failed" description={message} />}

          {status === "saved" && (
            <section className="glass-card">
              <p className="text-green-500 mb-4">{message}</p>
              <a
                href="/lead-magnets/10-client-proposal-templates.txt"
                download
                className="primary-btn"
                onClick={() =>
                  trackCoreEvent("tool_success", {
                    tool: "lead_magnet_proposal_templates_download",
                    source: "lead_magnet_download",
                  })
                }
              >
                Download Templates
              </a>
            </section>
          )}
        </div>
      </section>

      <section className="cta-section reveal-fade-up">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
          Want AI + PDF workflows to ship client work faster?
        </h2>
        <Link href="/tools" className="primary-btn">
          Start Free
        </Link>
      </section>
    </div>
  );
}
