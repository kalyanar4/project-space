"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import Link from "next/link";

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const validPDFs = Array.from(newFiles).filter(file => file.type === "application/pdf");
    setFiles(prev => [...prev, ...validPDFs]);
    setMergedBlob(null);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const mergePDFs = async () => {
    setMerging(true);
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const blob = new Blob([mergedBytes], { type: "application/pdf" });
    setMergedBlob(blob);
    setMerging(false);
  };

  const handleDownload = () => {
    if (!mergedBlob) return;
    const url = URL.createObjectURL(mergedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen p-6 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/tools/pdf" className="text-accent-color hover:underline text-sm">
          ← Back to PDF Tools
        </Link>

        <h1 className="text-5xl font-extrabold my-6 text-center bg-gradient-to-r from-accent-color to-pink-500 bg-clip-text text-transparent">
          Merge PDFs
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Upload two or more PDFs to combine them into one document.
        </p>

        {/* Drop Zone */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-accent-color transition-all"
        >
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer text-sm text-gray-400 hover:text-white">
            Click or drag PDF files here to upload
          </label>
        </div>

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Files to Merge</h2>
            <ul className="space-y-2">
              {files.map((file, idx) => (
                <li
                  key={idx}
                  className="bg-gray-800 px-4 py-2 rounded flex justify-between items-center text-sm"
                >
                  {file.name}
                </li>
              ))}
            </ul>

            <div className="mt-6 text-center">
              <button
                onClick={mergePDFs}
                disabled={merging || files.length < 2}
                className="px-6 py-3 bg-accent-color text-black font-semibold rounded-lg hover:brightness-110 transition disabled:opacity-50"
              >
                {merging ? "Merging..." : "Merge PDFs"}
              </button>
            </div>
          </div>
        )}

        {/* Progress */}
        {merging && (
          <div className="mt-4">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-accent-color animate-pulse w-full" />
            </div>
            <p className="text-xs text-center text-gray-400 mt-2">Merging in progress...</p>
          </div>
        )}

        {/* Download */}
        {mergedBlob && (
          <div className="text-center mt-10">
            <h2 className="text-xl font-bold mb-4 text-green-400">✅ Merged successfully!</h2>
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-accent-color text-black font-semibold rounded-lg hover:brightness-110 transition"
            >
              Download Merged PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
