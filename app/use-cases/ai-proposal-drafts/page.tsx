import type { Metadata } from "next";
import PageAnalytics from "@/components/PageAnalytics";
import TrackedLink from "@/components/TrackedLink";

export const metadata: Metadata = {
  title: "AI Proposal Draft Generator | Digital Meta Zone",
  description: "Generate first-draft client proposals with AI and reduce blank-page time.",
};

export default function AiProposalDraftsUseCasePage() {
  return (
    <div className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: "/use-cases/ai-proposal-drafts" }} />

      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">Generate Client Proposal Drafts with AI</h1>
        <p className="page-subtitle">
          Intent keyword: ai proposal draft generator.
        </p>
      </section>

      <section className="glass-card max-w-3xl mx-auto reveal-fade-up">
        <p className="text-muted mb-4">
          Build first-draft proposals, scopes, and summary copy in minutes, then refine
          for your brand voice and project details.
        </p>
        <p className="text-muted mb-6">
          Useful for freelancers and small agencies sending high-volume proposals.
        </p>
        <TrackedLink
          href="/tools/ai/text-generator"
          className="primary-btn"
          eventName="tool_start"
          eventPayload={{ tool: "/tools/ai/text-generator", source: "seo_use_case_ai_text" }}
        >
          Start Free
        </TrackedLink>
      </section>
    </div>
  );
}
