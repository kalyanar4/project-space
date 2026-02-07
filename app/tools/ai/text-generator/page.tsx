"use client";

import { useState } from "react";
import Link from "next/link";
import ToolsNav from "../../ToolsNav";

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

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {result && (
          <section className="glass-card mt-6 reveal-fade-up">
            <h2 className="text-xl font-semibold mb-3">Result</h2>
            <p className="whitespace-pre-line text-muted">{result}</p>
          </section>
        )}
      </section>
    </div>
  );
}
