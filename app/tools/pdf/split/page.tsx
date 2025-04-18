"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import Link from "next/link";

export default function SplitPDFPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [splitting, setSplitting] = useState(false);
  const [splitFiles, setSplitFiles] = useState<Blob[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setSplitFiles([]);
    }
  };

  const splitPDF = async () => {
    if (!selectedFile) return;

    setSplitting(true);
    const arrayBuffer = await selectedFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const pages = pdfDoc.getPages();
    const splitBlobs: Blob[] = [];

    for (let i = 0; i < pages.length; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
      const newPdfBytes = await newPdf.save();
      splitBlobs.push(new Blob([newPdfBytes], { type: "application/pdf" }));
    }

    setSplitFiles(splitBlobs);
    setSplitting(false);
  };

  const handleDownload = (blob: Blob, index: number) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `page-${index + 1}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen p-6 sm:p-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/tools/pdf" className="text-accent-color hover:underline text-sm">
          ← Back to PDF Tools
        </Link>

        <h1 className="text-4xl font-bold my-6 text-center">Split PDF</h1>
        <p className="text-center text-gray-400 mb-10">
          Upload a PDF file and split it into individual pages for download.
        </p>

        {/* File Upload */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <label className="block w-full text-center cursor-pointer">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="py-6 px-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-accent-color transition-colors">
              {selectedFile ? (
                <p className="text-sm text-gray-300">
                  Selected File: <strong>{selectedFile.name}</strong>
                </p>
              ) : (
                <p className="text-gray-500">Click here or drag a PDF file to upload</p>
              )}
            </div>
          </label>

          {selectedFile && (
            <div className="text-center mt-6">
              <button
                onClick={splitPDF}
                disabled={splitting}
                className="px-6 py-3 bg-accent-color text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {splitting ? "Splitting..." : "Split PDF"}
              </button>
            </div>
          )}
        </div>

        {/* Split Files */}
        {splitFiles.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Download Pages</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {splitFiles.map((blob, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 p-4 rounded-md flex justify-between items-center border border-gray-700"
                >
                  <span className="text-sm text-gray-300">Page {idx + 1}</span>
                  <button
                    onClick={() => handleDownload(blob, idx)}
                    className="px-4 py-1 text-sm bg-accent-color rounded hover:bg-blue-700 transition"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
