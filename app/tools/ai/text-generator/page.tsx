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
    if (!prompt.trim()) return;
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen p-6 sm:p-12">
      <ToolsNav />
      <div className="max-w-3xl mx-auto">
        <Link href="/tools/ai" className="text-accent-color hover:underline text-sm">
          ← Back to AI Tools
        </Link>
        <h1 className="text-5xl font-extrabold my-6 text-center">Text Generator</h1>
        <p className="text-center text-gray-400 mb-10">Enter a prompt and generate text using AI.</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
          className="w-full p-4 rounded-lg text-black"
          placeholder="Type your prompt here..."
        />
        <div className="text-center mt-6">
          <button
            onClick={generate}
            disabled={loading}
            className="px-6 py-3 bg-accent-color text-black font-semibold rounded-lg hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Text"}
          </button>
        </div>
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        {result && (
          <div className="mt-10 bg-gray-900 p-4 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-2 text-center">Result</h2>
            <p className="whitespace-pre-line">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
