import type { Metadata } from "next";
import PageAnalytics from "@/components/PageAnalytics";
import TrackedLink from "@/components/TrackedLink";

export const metadata: Metadata = {
  title: "PDF Merge Online vs Desktop Tools | Digital Meta Zone",
  description: "Compare browser PDF merge vs desktop software for contract workflows.",
};

export default function PdfMergeComparisonPage() {
  return (
    <div className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: "/compare/pdf-merge-vs-desktop-tools" }} />

      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">PDF Merge Online vs Desktop Tools</h1>
        <p className="page-subtitle">
          Intent keyword: pdf merge online vs desktop.
        </p>
      </section>

      <section className="glass-card max-w-3xl mx-auto reveal-fade-up">
        <p className="text-muted mb-4">
          Browser merge workflows are faster for quick client packets, especially when
          you need no installation and simple ordering.
        </p>
        <p className="text-muted mb-6">
          Desktop tools are useful for heavy offline editing, while online merge is ideal
          for speed-focused delivery teams.
        </p>
        <TrackedLink
          href="/tools/pdf/merge"
          className="primary-btn"
          eventName="tool_start"
          eventPayload={{ tool: "/tools/pdf/merge", source: "seo_compare_pdf_merge" }}
        >
          Start Free
        </TrackedLink>
      </section>
    </div>
  );
}
