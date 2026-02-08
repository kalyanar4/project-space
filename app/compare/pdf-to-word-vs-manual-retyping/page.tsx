import type { Metadata } from "next";
import PageAnalytics from "@/components/PageAnalytics";
import TrackedLink from "@/components/TrackedLink";

export const metadata: Metadata = {
  title: "PDF to Word vs Manual Retyping | Digital Meta Zone",
  description: "See why PDF to Word conversion beats manual retyping for revision-heavy work.",
};

export default function PdfToWordComparisonPage() {
  return (
    <div className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: "/compare/pdf-to-word-vs-manual-retyping" }} />

      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">PDF to Word vs Manual Retyping</h1>
        <p className="page-subtitle">
          Intent keyword: pdf to word vs manual retyping.
        </p>
      </section>

      <section className="glass-card max-w-3xl mx-auto reveal-fade-up">
        <p className="text-muted mb-4">
          Conversion workflows save significant drafting time compared with manual retyping,
          especially for long contracts and statement-of-work documents.
        </p>
        <p className="text-muted mb-6">
          Manual retyping is error-prone; conversion gives a faster editable baseline.
        </p>
        <TrackedLink
          href="/tools/pdf/pdf-to-word"
          className="primary-btn"
          eventName="tool_start"
          eventPayload={{ tool: "/tools/pdf/pdf-to-word", source: "seo_compare_pdf_to_word" }}
        >
          Start Free
        </TrackedLink>
      </section>
    </div>
  );
}
