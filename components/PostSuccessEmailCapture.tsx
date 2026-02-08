"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface PostSuccessEmailCaptureProps {
  toolId: string;
}

export default function PostSuccessEmailCapture({ toolId }: PostSuccessEmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalized = email.trim().toLowerCase();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);

    if (!isValid) {
      setStatus("error");
      return;
    }

    trackEvent("email_capture", {
      tool: toolId,
      source: "post_success",
    });

    setStatus("saved");
    setEmail("");
  };

  return (
    <section className="glass-card mt-5">
      <h3 className="text-lg font-semibold mb-2">Get power-user updates</h3>
      <p className="text-muted mb-4">
        Get advanced workflows, templates, and launch updates for Pro features.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          aria-label="Email"
          required
        />
        <button type="submit" className="primary-btn">
          Get Updates
        </button>
      </form>

      {status === "saved" && (
        <p className="text-sm text-green-500 mt-3">Thanks. You are on the early updates list.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-500 mt-3">Please enter a valid email address.</p>
      )}

      <div className="mt-4">
        <Link
          href="/pricing"
          className="secondary-btn"
          onClick={() => trackEvent("upgrade_click", { tool: toolId, source: "post_success" })}
        >
          Upgrade to Pro
        </Link>
      </div>
    </section>
  );
}
