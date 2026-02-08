"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { trackCoreEvent } from "@/lib/analytics";

interface PostSuccessEmailCaptureProps {
  toolId: string;
}

export default function PostSuccessEmailCapture({ toolId }: PostSuccessEmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalized = email.trim().toLowerCase();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);

    if (!isValid) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

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
          tool: toolId,
          source: "post_success",
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Could not save your email at this time.");
      }

      trackCoreEvent("email_capture", {
        tool: toolId,
        source: "post_success",
      });

      setStatus("saved");
      setMessage("Thanks. You are on the early updates list.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not save your email.");
    }
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
          {status === "saving" ? "Saving..." : "Get Updates"}
        </button>
      </form>

      {status === "saved" && <p className="text-sm text-green-500 mt-3">{message}</p>}
      {status === "error" && <p className="text-sm text-red-500 mt-3">{message}</p>}

      <div className="mt-4">
        <Link
          href="/checkout/pro"
          className="secondary-btn"
          onClick={() => trackCoreEvent("upgrade_click", { tool: toolId, source: "post_success" })}
        >
          Upgrade to Pro
        </Link>
      </div>
    </section>
  );
}
