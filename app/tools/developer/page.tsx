"use client";

import { useMemo, useState } from "react";
import ToolsNav from "../ToolsNav";
import { EmptyState, ErrorState } from "@/components/FlowStates";

function tryParseJson(input: string) {
  return JSON.parse(input);
}

export default function DeveloperToolsPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [encoded, setEncoded] = useState("");
  const [decoded, setDecoded] = useState("");
  const [urlInput, setUrlInput] = useState("");

  const parsedJson = useMemo(() => {
    if (!jsonInput.trim()) {
      return { pretty: "", minified: "", error: null as string | null };
    }

    try {
      const parsed = tryParseJson(jsonInput);
      return {
        pretty: JSON.stringify(parsed, null, 2),
        minified: JSON.stringify(parsed),
        error: null as string | null,
      };
    } catch {
      return {
        pretty: "",
        minified: "",
        error: "Invalid JSON. Please fix syntax to format output.",
      };
    }
  }, [jsonInput]);

  const handleEncode = () => {
    const value = encoded.trim();
    if (!value) {
      setDecoded("");
      return;
    }
    setDecoded(btoa(unescape(encodeURIComponent(value))));
  };

  const handleDecode = () => {
    const value = decoded.trim();
    if (!value) {
      setEncoded("");
      return;
    }

    try {
      setEncoded(decodeURIComponent(escape(atob(value))));
    } catch {
      setEncoded("Invalid Base64 input.");
    }
  };

  return (
    <div className="page-shell">
      <ToolsNav />
      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">Developer Utilities</h1>
        <p className="page-subtitle">
          MVP set for formatting and conversion tasks developers use daily.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="glass-card reveal-fade-up">
          <h2 className="text-xl font-semibold mb-3">JSON Formatter</h2>
          <textarea
            rows={8}
            placeholder='Paste JSON here, e.g. {"name":"DMZ"}'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />

          {parsedJson.error ? (
            <div className="mt-4">
              <ErrorState title="Formatting Error" description={parsedJson.error} />
            </div>
          ) : !jsonInput.trim() ? (
            <div className="mt-4">
              <EmptyState
                title="No JSON Provided"
                description="Paste JSON to view pretty and minified outputs."
              />
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              <div>
                <p className="text-sm text-muted mb-1">Pretty JSON</p>
                <pre className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-3 overflow-auto text-sm">
                  {parsedJson.pretty}
                </pre>
              </div>
              <div>
                <p className="text-sm text-muted mb-1">Minified JSON</p>
                <pre className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-3 overflow-auto text-sm">
                  {parsedJson.minified}
                </pre>
              </div>
            </div>
          )}
        </article>

        <article className="glass-card reveal-fade-up">
          <h2 className="text-xl font-semibold mb-3">Base64 Encode / Decode</h2>
          <label className="text-sm text-muted">Plain Text</label>
          <textarea
            rows={4}
            value={encoded}
            onChange={(e) => setEncoded(e.target.value)}
            placeholder="Enter text to encode"
          />
          <div className="mt-3 flex gap-2">
            <button className="secondary-btn" onClick={handleEncode} type="button">
              Encode
            </button>
            <button className="secondary-btn" onClick={handleDecode} type="button">
              Decode
            </button>
          </div>

          <label className="text-sm text-muted mt-4 block">Base64 Value</label>
          <textarea
            rows={4}
            value={decoded}
            onChange={(e) => setDecoded(e.target.value)}
            placeholder="Base64 output/input"
          />

          <div className="mt-4">
            <label className="text-sm text-muted">URL Encode / Decode</label>
            <textarea
              rows={3}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste text for URL encoding"
            />
            <div className="mt-2 grid gap-2 text-sm">
              <p>
                <strong>Encoded:</strong> {urlInput ? encodeURIComponent(urlInput) : "-"}
              </p>
              <p>
                <strong>Decoded:</strong>{" "}
                {urlInput
                  ? (() => {
                      try {
                        return decodeURIComponent(urlInput);
                      } catch {
                        return "Invalid encoded URL value.";
                      }
                    })()
                  : "-"}
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
