"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";
import * as pdfjsLib from "pdfjs-dist/webpack";
import ToolsNav from "../../ToolsNav";
import { EmptyState, ErrorState, LoadingState } from "@/components/FlowStates";
import PostSuccessEmailCapture from "@/components/PostSuccessEmailCapture";
import ToolTrustSignals from "@/components/ToolTrustSignals";
import ToolNextActions from "@/components/ToolNextActions";
import UpgradePrompt from "@/components/UpgradePrompt";
import { trackEvent } from "@/lib/analytics";
import { ToolUsageSnapshot, getToolUsageSnapshot, recordToolSuccess } from "@/lib/toolUsage";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

export default function PDFToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [wordBlob, setWordBlob] = useState<Blob | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<ToolUsageSnapshot | null>(null);
  const [showValueUpgrade, setShowValueUpgrade] = useState(false);
  const [showLimitUpgrade, setShowLimitUpgrade] = useState(false);

  useEffect(() => {
    const current = getToolUsageSnapshot("pdf_to_word");
    setUsage(current);
    setShowLimitUpgrade(current.isLimitReached);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setWordBlob(null);
      setError(null);
    } else {
      setError("Please select a valid PDF file.");
    }
  };

  const convertPDF = async () => {
    if (!file) {
      setError("Upload a PDF before converting.");
      return;
    }

    const current = getToolUsageSnapshot("pdf_to_word");
    setUsage(current);

    if (current.isLimitReached) {
      setError("Daily free limit reached. Upgrade to Pro for higher limits.");
      setShowLimitUpgrade(true);
      trackEvent("tool_start", { tool: "pdf_to_word", blocked: "limit_hit" });
      return;
    }

    trackEvent("tool_start", { tool: "pdf_to_word" });
    setConverting(true);
    setProgress(0);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

      const paragraphs: Paragraph[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = (content.items as Array<{ str?: string }>)
          .map((item) => ("str" in item && item.str ? item.str : ""))
          .join(" ");
        paragraphs.push(new Paragraph(text));
        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      const doc = new Document({ sections: [{ children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      setWordBlob(blob);
      trackEvent("tool_success", { tool: "pdf_to_word" });
      const nextUsage = recordToolSuccess("pdf_to_word");
      setUsage(nextUsage);
      setShowValueUpgrade(nextUsage.totalSuccessCount >= 2);
      setShowLimitUpgrade(nextUsage.isLimitReached);
    } catch {
      setError("Conversion failed. Try another PDF file.");
    } finally {
      setConverting(false);
    }
  };

  const downloadDocx = () => {
    if (!wordBlob || !file) return;
    const name = file.name.replace(/\.pdf$/i, "") + ".docx";
    saveAs(wordBlob, name);
  };

  return (
    <div className="page-shell">
      <ToolsNav />
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/tools/pdf" className="text-accent-color hover:underline text-sm">
          ← Back to PDF Tools
        </Link>

        <h1 className="text-5xl font-extrabold my-6 text-center bg-gradient-to-r from-accent-color to-pink-500 bg-clip-text text-transparent">
          PDF to Word
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Convert a PDF into an editable Word document directly in your browser.
        </p>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 text-center">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer text-sm text-gray-400 hover:text-white">
            {file ? file.name : "Click to upload a PDF"}
          </label>

          {file && (
            <div className="mt-6">
              <button
                onClick={convertPDF}
                disabled={converting}
                className="px-6 py-3 bg-accent-color text-black rounded-lg hover:brightness-110 transition disabled:opacity-50"
              >
                {converting ? "Converting..." : "Convert to Word"}
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-muted text-center mt-3">
          Free plan usage today: {usage?.dailySuccessCount ?? 0}/3 successful runs.
        </p>

        <ToolTrustSignals
          privacyNote="Files are processed client-side in this conversion flow and not uploaded by default."
          processingNote="Text extraction and DOCX generation happen directly in your browser."
          reliabilityNote="Complex scanned PDFs may have imperfect extraction; verify the output before sending."
        />

        <section className="glass-card mt-5">
          <h3 className="text-lg font-semibold mb-2">Related Guides</h3>
          <div className="flex flex-wrap gap-2">
            <Link href="/blog/convert-scanned-pdf-to-editable-draft-workflow" className="secondary-btn">
              Scanned PDF Draft Workflow
            </Link>
            <Link href="/use-cases/pdf-to-word-contract-edits" className="secondary-btn">
              Convert Contract PDFs
            </Link>
            <Link href="/compare/pdf-to-word-vs-manual-retyping" className="secondary-btn">
              Conversion vs Retyping
            </Link>
          </div>
        </section>

        <div className="mt-6 grid gap-4">
          {error && <ErrorState title="Conversion Error" description={error} />}

          {!error && !file && (
            <EmptyState
              title="No File Selected"
              description="Upload a PDF to generate an editable Word file."
            />
          )}

          {converting && (
            <LoadingState
              title="Converting PDF"
              description={`Extracting text and building document... ${progress}% complete.`}
            />
          )}
        </div>

        {wordBlob && (
          <div className="text-center mt-10">
            <h2 className="text-xl font-bold mb-4 text-green-400">Conversion complete.</h2>
            <button
              onClick={downloadDocx}
              className="px-6 py-3 bg-accent-color text-black font-semibold rounded-lg hover:brightness-110 transition"
            >
              Download Word File
            </button>
            <ToolNextActions
              sourceToolId="pdf_to_word"
              actions={[
                {
                  title: "Try Split PDF",
                  description: "Split source PDFs into smaller sections before converting large files.",
                  href: "/tools/pdf/split",
                },
                {
                  title: "Generate summary with AI",
                  description: "Paste converted text into AI Text Generator for executive summaries.",
                  href: "/tools/ai/text-generator",
                },
              ]}
            />
            <PostSuccessEmailCapture toolId="pdf_to_word" />
            {showValueUpgrade && !showLimitUpgrade && (
              <UpgradePrompt sourceToolId="pdf_to_word" trigger="value_moment" />
            )}
            {showLimitUpgrade && (
              <UpgradePrompt sourceToolId="pdf_to_word" trigger="limit_hit" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
