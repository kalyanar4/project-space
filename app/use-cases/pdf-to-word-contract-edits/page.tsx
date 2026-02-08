import type { Metadata } from "next";
import PageAnalytics from "@/components/PageAnalytics";
import TrackedLink from "@/components/TrackedLink";

export const metadata: Metadata = {
  title: "Convert PDF Contracts to Word | Digital Meta Zone",
  description: "Convert PDF contracts to editable Word files for fast client revisions.",
};

export default function PdfToWordUseCasePage() {
  return (
    <div className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: "/use-cases/pdf-to-word-contract-edits" }} />

      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">Convert PDF Contracts to Editable Drafts</h1>
        <p className="page-subtitle">
          Intent keyword: convert pdf contract to word.
        </p>
      </section>

      <section className="glass-card max-w-3xl mx-auto reveal-fade-up">
        <p className="text-muted mb-4">
          Turn static client documents into editable Word drafts when you need to update
          terms, timelines, or pricing before final signature.
        </p>
        <p className="text-muted mb-6">
          Ideal for agencies managing frequent revision loops and legal edits.
        </p>
        <TrackedLink
          href="/tools/pdf/pdf-to-word"
          className="primary-btn"
          eventName="tool_start"
          eventPayload={{ tool: "/tools/pdf/pdf-to-word", source: "seo_use_case_pdf_to_word" }}
        >
          Start Free
        </TrackedLink>
      </section>
    </div>
  );
}
