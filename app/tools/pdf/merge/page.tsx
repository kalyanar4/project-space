"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

type FileWithId = File & { id: string };

export default function MergePDFPage() {
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [thumbnails, setThumbnails] = useState<{ [id: string]: string }>({});
  const [merging, setMerging] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const generateThumbnail = async (file: FileWithId) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const typedarray = new Uint8Array(reader.result as ArrayBuffer);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport }).promise;

      setThumbnails((prev) => ({
        ...prev,
        [file.id]: canvas.toDataURL(),
      }));
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const validPDFs = Array.from(newFiles)
      .filter((file) => file.type === "application/pdf")
      .map((file) => Object.assign(file, { id: crypto.randomUUID() }));

    validPDFs.forEach(generateThumbnail);
    setFiles((prev) => [...prev, ...validPDFs]);
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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = files.findIndex((f) => f.id === active.id);
    const newIndex = files.findIndex((f) => f.id === over.id);
    setFiles(arrayMove(files, oldIndex, newIndex));
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
          Upload PDFs, preview & reorder them, then merge into a single file.
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

        {/* Uploaded Files with Thumbnails */}
        {files.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Reorder Files</h2>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={files.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                  {files.map((file) => (
                    <SortableFileItem
                      key={file.id}
                      file={file}
                      thumbnail={thumbnails[file.id]}
                      onRemove={() => {
                        setFiles((prev) => prev.filter((f) => f.id !== file.id));
                        setThumbnails((prev) => {
                          const { [file.id]: _, ...rest } = prev;
                          return rest;
                        });
                      }}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>

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

// 🧩 Sortable File Item with Thumbnail
function SortableFileItem({
  file,
  thumbnail,
  onRemove,
}: {
  file: FileWithId;
  thumbnail?: string;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-800 p-2 rounded flex items-center border border-gray-700 cursor-move"
    >
      {thumbnail && (
        <img
          src={thumbnail}
          alt="PDF Thumbnail"
          className="w-14 h-20 object-cover rounded mr-4"
        />
      )}
      <span className="flex-1 text-sm truncate">{file.name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-4 text-red-400 hover:text-red-200 transition"
        title="Remove file"
      >
        ✕
      </button>
    </li>
  );
}
