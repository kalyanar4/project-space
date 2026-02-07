"use client";

import { useState } from "react";
import Link from "next/link";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";
import ToolsNav from "../../ToolsNav";
// Importing the webpack build of pdfjs prevents Next.js from trying to
// include the optional Node `canvas` package during build time, which
// previously caused compilation errors. This variant is intended for
// bundlers and works entirely in the browser.
import * as pdfjsLib from "pdfjs-dist/webpack";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

export default function PDFToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [wordBlob, setWordBlob] = useState<Blob | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setWordBlob(null);
    }
  };

  const convertPDF = async () => {
    if (!file) return;

    setConverting(true);
    setProgress(0);

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
    setConverting(false);
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

        {converting && (
          <div className="mt-6">
            <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
              <div
                className="h-full bg-accent-color transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-center text-gray-400 mt-2">{progress}%</p>
          </div>
        )}

        {wordBlob && (
          <div className="text-center mt-10">
            <h2 className="text-xl font-bold mb-4 text-green-400">✅ Conversion complete!</h2>
            <button
              onClick={downloadDocx}
              className="px-6 py-3 bg-accent-color text-black font-semibold rounded-lg hover:brightness-110 transition"
            >
              Download Word File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
