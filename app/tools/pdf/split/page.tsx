"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/webpack";
import Link from "next/link";
import Image from "next/image";
import ToolsNav from "../../ToolsNav";
import { EmptyState, ErrorState, LoadingState } from "@/components/FlowStates";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

type PageRangeInput = string;

export default function SplitPDFPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [splitFiles, setSplitFiles] = useState<Blob[]>([]);
  const [splitting, setSplitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [pageRanges, setPageRanges] = useState<PageRangeInput>("");
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file || file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }

    setError(null);
    setSelectedFile(file);
    setSplitFiles([]);
    setProgress(0);
    setThumbnails([]);

    const fileReader = new FileReader();
    fileReader.onload = async () => {
      try {
        const typedarray = new Uint8Array(fileReader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        const thumbs: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) continue;

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport }).promise;
          thumbs.push(canvas.toDataURL());
        }

        setThumbnails(thumbs);
      } catch {
        setError("Unable to generate PDF preview thumbnails.");
      }
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
      if (!Number.isNaN(start)) {
        if (Number.isNaN(end)) {
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
    if (!selectedFile) {
      setError("Upload a file before splitting.");
      return;
    }

    setSplitting(true);
    setProgress(0);
    setError(null);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();
      const pagesToSplit = pageRanges
        ? parsePageRanges(pageRanges, totalPages)
        : [...Array(totalPages).keys()];

      if (pagesToSplit.length === 0) {
        setError("No valid pages selected. Check your page range input.");
        setSplitting(false);
        return;
      }

      const splitBlobs: Blob[] = [];

      for (let i = 0; i < pagesToSplit.length; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pagesToSplit[i]]);
        newPdf.addPage(copiedPage);
        const newPdfBytes = await newPdf.save();
        splitBlobs.push(new Blob([newPdfBytes], { type: "application/pdf" }));

        setProgress(Math.round(((i + 1) / pagesToSplit.length) * 100));
      }

      setSplitFiles(splitBlobs);
    } catch {
      setError("Failed to split PDF. Please try a different file.");
    } finally {
      setSplitting(false);
    }
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
    <div className="page-shell">
      <ToolsNav />
      <div className="max-w-4xl mx-auto w-full">
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
            {selectedFile ? "Change File" : "Click or drag a PDF here to upload"}
          </button>
          {selectedFile && <p className="mt-2 text-sm text-green-400">{selectedFile.name}</p>}
        </div>

        <div className="mt-6 grid gap-4">
          {error && <ErrorState title="Split Error" description={error} />}

          {!error && !selectedFile && (
            <EmptyState
              title="No File Selected"
              description="Upload a PDF to preview pages and split output files."
            />
          )}

          {splitting && (
            <LoadingState
              title="Splitting PDF"
              description={`Processing selected pages... ${progress}% complete.`}
            />
          )}
        </div>

        {thumbnails.length > 0 && (
          <div className="my-8">
            <h2 className="text-xl font-bold mb-2">Preview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {thumbnails.map((src, idx) => (
                <div key={idx} className="bg-gray-800 p-2 rounded shadow">
                  <Image
                    src={src}
                    alt={`Page ${idx + 1}`}
                    width={200}
                    height={200}
                    className="rounded"
                    unoptimized
                  />
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
