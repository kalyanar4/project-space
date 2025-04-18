"use client";

import { useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import Link from "next/link";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

type PageRangeInput = string;

export default function SplitPDFPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [splitFiles, setSplitFiles] = useState<Blob[]>([]);
  const [splitting, setSplitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [pageRanges, setPageRanges] = useState<PageRangeInput>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file || file.type !== "application/pdf") return;
    setSelectedFile(file);
    setSplitFiles([]);
    setProgress(0);
    setThumbnails([]);

    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const typedarray = new Uint8Array(fileReader.result as ArrayBuffer);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      const thumbs: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        thumbs.push(canvas.toDataURL());
      }

      setThumbnails(thumbs);
    };
    fileReader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const parsePageRanges = (input: string, total: number) => {
    const pages: number[] = [];
    input.split(",").forEach((part) => {
      const [start, end] = part.split("-").map(Number);
      if (!isNaN(start)) {
        if (isNaN(end)) {
          pages.push(start - 1);
        } else {
          for (let i = start; i <= end; i++) {
            if (i <= total) pages.push(i - 1);
          }
        }
      }
    });
    return Array.from(new Set(pages)).sort((a, b) => a - b);
  };

  const splitPDF = async () => {
    if (!selectedFile) return;
    setSplitting(true);
    setProgress(0);

    const arrayBuffer = await selectedFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = pdfDoc.getPageCount();
    const pagesToSplit = pageRanges ? parsePageRanges(pageRanges, totalPages) : [...Array(totalPages).keys()];
    const splitBlobs: Blob[] = [];

    for (let i = 0; i < pagesToSplit.length; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [pagesToSplit[i]]);
      newPdf.addPage(copiedPage);
      const newPdfBytes = await newPdf.save();
      splitBlobs.push(new Blob([newPdfBytes], { type: "application/pdf" }));

      await new Promise((r) => setTimeout(r, 80));
      setProgress(Math.round(((i + 1) / pagesToSplit.length) * 100));
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
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen p-6 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/tools/pdf" className="text-accent-color hover:underline text-sm">
          ← Back to PDF Tools
        </Link>

        <h1 className="text-5xl font-extrabold my-6 text-center bg-gradient-to-r from-accent-color to-blue-500 bg-clip-text text-transparent">
          Split PDF
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Upload a PDF file, preview it, select pages to split, and download individual files.
        </p>

        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-accent-color transition-all"
        >
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            className="text-gray-400 hover:text-white text-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFile ? `Change File` : `Click or drag a PDF here to upload`}
          </button>
          {selectedFile && <p className="mt-2 text-sm text-green-400">✅ {selectedFile.name}</p>}
        </div>

        {thumbnails.length > 0 && (
          <div className="my-8">
            <h2 className="text-xl font-bold mb-2">Preview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {thumbnails.map((src, idx) => (
                <div key={idx} className="bg-gray-800 p-2 rounded shadow">
                  <img src={src} alt={`Page ${idx + 1}`} className="rounded" />
                  <p className="text-xs text-center text-gray-400 mt-1">Page {idx + 1}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedFile && (
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Enter page ranges (e.g. <code className="text-yellow-400">1-3, 5, 7-8</code>)
            </label>
            <input
              type="text"
              value={pageRanges}
              onChange={(e) => setPageRanges(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-2 text-sm text-white mb-4"
              placeholder="Leave blank to split all pages"
            />
            <button
              onClick={splitPDF}
              disabled={splitting}
              className="px-6 py-3 bg-accent-color text-black font-semibold rounded-lg hover:brightness-110 transition disabled:opacity-50"
            >
              {splitting ? "Splitting..." : "Split PDF"}
            </button>
          </div>
        )}

        {/* Progress bar */}
        {splitting && (
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

        {/* Download */}
        {splitFiles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-center">Download Pages</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {splitFiles.map((blob, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 p-4 rounded-xl flex justify-between items-center border border-gray-700"
                >
                  <span className="text-sm text-gray-300">Page {idx + 1}</span>
                  <button
                    onClick={() => handleDownload(blob, idx)}
                    className="px-4 py-1 text-sm bg-accent-color text-black font-semibold rounded hover:brightness-110 transition"
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
