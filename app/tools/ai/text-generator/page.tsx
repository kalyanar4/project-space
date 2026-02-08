"use client";

import { useState } from "react";
import Link from "next/link";
import ToolsNav from "../../ToolsNav";
import { EmptyState, ErrorState, LoadingState } from "@/components/FlowStates";
import PostSuccessEmailCapture from "@/components/PostSuccessEmailCapture";
import { trackEvent } from "@/lib/analytics";

export default function TextGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    trackEvent("tool_start", { tool: "ai_text_generator" });
    setLoading(true);
    setError(null);
    setResult("");

    try {
      const res = await fetch("/api/generate-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error generating text");
      setResult(data.text);
      trackEvent("tool_success", { tool: "ai_text_generator" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <ToolsNav />
      <section className="max-w-3xl mx-auto w-full reveal-fade-up">
        <Link href="/tools/ai" className="text-accent-color hover:underline text-sm">
          ← Back to AI Tools
        </Link>

        <h1 className="page-title mt-5">Text Generator</h1>
        <p className="page-subtitle text-center mb-8">
          Enter a prompt and generate draft text using AI.
        </p>

        <div className="glass-card">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={7}
            className="w-full"
            placeholder="Type your prompt here..."
          />
          <div className="text-center mt-5">
            <button
              onClick={generate}
              disabled={loading}
              className="primary-btn disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Text"}
            </button>
          </div>
        </div>

        <div className="mt-6">
          {loading && (
            <LoadingState
              title="Generating Response"
              description="AI is preparing your output. This usually takes a few seconds."
            />
          )}

          {!loading && error && <ErrorState title="Generation Failed" description={error} />}

          {!loading && !error && !result && (
            <EmptyState
              title="No Result Yet"
              description="Submit a prompt to generate your first response."
            />
          )}

          {!loading && result && (
            <section className="glass-card reveal-fade-up">
              <h2 className="text-xl font-semibold mb-3">Result</h2>
              <p className="whitespace-pre-line text-muted">{result}</p>
              <PostSuccessEmailCapture toolId="ai_text_generator" />
            </section>
          )}
        </div>
      </section>
    </div>
  );
}
