import type { Metadata } from "next";
import PageAnalytics from "@/components/PageAnalytics";
import TrackedLink from "@/components/TrackedLink";

export const metadata: Metadata = {
  title: "Merge Client Contracts Online | Digital Meta Zone",
  description: "Merge client contracts online in minutes with a browser-based PDF merge workflow.",
};

export default function PdfMergeUseCasePage() {
  return (
    <div className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: "/use-cases/pdf-merge-client-contracts" }} />

      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">Merge Client Contracts in Minutes</h1>
        <p className="page-subtitle">
          Intent keyword: merge client contracts online.
        </p>
      </section>

      <section className="glass-card max-w-3xl mx-auto reveal-fade-up">
        <p className="text-muted mb-4">
          Combine multiple contract PDFs into one clean file for client approval, legal review,
          and internal handoff without switching apps.
        </p>
        <p className="text-muted mb-6">
          Best for freelancers and agencies handling proposals, MSAs, and revision-based
          contract packets.
        </p>
        <TrackedLink
          href="/tools/pdf/merge"
          className="primary-btn"
          eventName="tool_start"
          eventPayload={{ tool: "/tools/pdf/merge", source: "seo_use_case_pdf_merge" }}
        >
          Start Free
        </TrackedLink>
      </section>
    </div>
  );
}
