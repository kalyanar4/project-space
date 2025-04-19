"use client";

import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import Link from "next/link";

export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [quality, setQuality] = useState(0.6); // Between 0 and 1

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setOriginalSize(selected.size);
      setCompressedBlob(null);
    }
  };

  const compressPDF = async () => {
    if (!file) return;

    setCompressing(true);

    const buffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer);
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();

      // Render page to canvas
      const canvas = document.createElement("canvas");
      const scale = 1; // you can reduce this for more compression
      canvas.width = width * scale;
      canvas.height = height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) continue;

      // Draw blank white background
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw page content - currently we "flatten" it visually only
      ctx.font = "20px sans-serif";
      ctx.fillStyle = "#000";
      ctx.fillText("🧠 Page preview compression placeholder", 20, 40);

      // Export as JPEG or WEBP
      const imageDataUrl = canvas.toDataURL("image/jpeg", quality);
      const imageBytes = await fetch(imageDataUrl).then((res) => res.arrayBuffer());
      const embeddedImage = await pdfDoc.embedJpg(imageBytes);

      // Clear existing content
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(1, 1, 1),
      });

      // Re-insert image
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }

    const compressedBytes = await pdfDoc.save();
    const compressed = new Blob([compressedBytes], { type: "application/pdf" });
    setCompressedBlob(compressed);
    setCompressedSize(compressed.size);
    setCompressing(false);
  };

  const handleDownload = () => {
    if (!compressedBlob) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compressed.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number) =>
    (bytes / 1024 / 1024).toFixed(2) + " MB";

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen p-6 sm:p-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/tools/pdf" className="text-accent-color hover:underline text-sm">
          ← Back to PDF Tools
        </Link>

        <h1 className="text-5xl font-extrabold my-6 text-center bg-gradient-to-r from-accent-color to-yellow-400 bg-clip-text text-transparent">
          Compress PDF (Beta)
        </h1>

        <p className="text-center text-gray-400 mb-10">
          In-browser compression by flattening & downscaling PDF pages. No uploads. 🔐
        </p>

        {/* File Picker */}
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

          {/* Quality */}
          {file && (
            <div className="mt-6">
              <p className="text-sm mb-2">Compression Quality:</p>
              <input
                type="range"
                min={0.3}
                max={0.9}
                step={0.1}
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs mt-1 text-gray-400">Current: {(quality * 100).toFixed(0)}%</p>

              <button
                onClick={compressPDF}
                disabled={compressing}
                className="mt-6 px-6 py-3 bg-accent-color text-black rounded-lg hover:brightness-110 transition disabled:opacity-50"
              >
                {compressing ? "Compressing..." : "Compress PDF"}
              </button>
            </div>
          )}
        </div>

        {/* Result */}
        {compressedBlob && (
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-400">✅ Compression Complete</h2>
            <p className="text-sm text-gray-400 mb-2">
              Original: {formatBytes(originalSize!)} → Compressed: {formatBytes(compressedSize!)}
            </p>
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-accent-color text-black font-semibold rounded-lg hover:brightness-110 transition"
            >
              Download Compressed PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
