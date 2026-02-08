"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import Link from "next/link";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as pdfjsLib from "pdfjs-dist/webpack";
import ToolsNav from "../../ToolsNav";
import { EmptyState, ErrorState, LoadingState } from "@/components/FlowStates";
import PostSuccessEmailCapture from "@/components/PostSuccessEmailCapture";
import { trackEvent } from "@/lib/analytics";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

type FileWithId = File & { id: string };

export default function MergePDFPage() {
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [merging, setMerging] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const generateThumbnail = async (file: FileWithId) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const typedarray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        await page.render({ canvasContext: ctx, viewport }).promise;

        setThumbnails((prev) => ({
          ...prev,
          [file.id]: canvas.toDataURL(),
        }));
      } catch {
        setError("Failed to generate preview thumbnails for one or more files.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const validPDFs = Array.from(newFiles)
      .filter((file) => file.type === "application/pdf")
      .map((file) => Object.assign(file, { id: crypto.randomUUID() }));

    if (!validPDFs.length) {
      setError("Please upload valid PDF files.");
      return;
    }

    setError(null);
    validPDFs.forEach(generateThumbnail);
    setFiles((prev) => [...prev, ...validPDFs]);
    setMergedBlob(null);
    setProgress(0);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError("Add at least 2 PDFs to merge.");
      return;
    }

    trackEvent("tool_start", { tool: "pdf_merge" });
    setMerging(true);
    setProgress(0);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      setMergedBlob(blob);
      trackEvent("tool_success", { tool: "pdf_merge" });
    } catch {
      setError("Unable to merge PDFs. Please try different files.");
    } finally {
      setMerging(false);
    }
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = files.findIndex((f) => f.id === active.id);
    const newIndex = files.findIndex((f) => f.id === over.id);
    setFiles(arrayMove(files, oldIndex, newIndex));
  };

  return (
    <div className="page-shell">
      <ToolsNav />
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/tools/pdf" className="text-accent-color hover:underline text-sm">
          ← Back to PDF Tools
        </Link>

        <h1 className="text-5xl font-extrabold my-6 text-center bg-gradient-to-r from-accent-color to-pink-500 bg-clip-text text-transparent">
          Merge PDFs
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Upload PDFs, preview & reorder them, then merge into a single file.
        </p>

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

        <div className="mt-6 grid gap-4">
          {error && <ErrorState title="Merge Error" description={error} />}

          {!error && !merging && files.length === 0 && (
            <EmptyState
              title="No Files Uploaded"
              description="Upload at least 2 PDF files to start merging."
            />
          )}

          {merging && (
            <LoadingState
              title="Merging PDFs"
              description={`Combining files... ${progress}% complete.`}
            />
          )}
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Reorder Files</h2>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={files.map((f) => f.id)} strategy={rectSortingStrategy}>
                <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {files.map((file) => (
                    <SortableThumbnail
                      key={file.id}
                      file={file}
                      thumbnail={thumbnails[file.id]}
                      onRemove={() => {
                        setFiles((prev) => prev.filter((f) => f.id !== file.id));
                        setThumbnails((prev) => {
                          const updated = { ...prev };
                          delete updated[file.id];
                          return updated;
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

        {mergedBlob && (
          <div className="text-center mt-10">
            <h2 className="text-xl font-bold mb-4 text-green-400">Merged successfully.</h2>
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-accent-color text-black font-semibold rounded-lg hover:brightness-110 transition"
            >
              Download Merged PDF
            </button>
            <PostSuccessEmailCapture toolId="pdf_merge" />
          </div>
        )}
      </div>
    </div>
  );
}

function SortableThumbnail({
  file,
  thumbnail,
  onRemove,
}: {
  file: FileWithId;
  thumbnail?: string;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: file.id });

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
      className="relative bg-gray-800 p-2 rounded-lg border border-gray-700 cursor-move"
    >
      {thumbnail && (
        <Image
          src={thumbnail}
          alt="PDF Thumbnail"
          width={128}
          height={128}
          className="w-full h-32 object-cover rounded"
        />
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-1 right-1 text-red-400 hover:text-red-200 transition"
        title="Remove file"
      >
        ✕
      </button>
      <p className="text-xs text-center mt-1 truncate">{file.name}</p>
    </li>
  );
}
