import type { Metadata } from "next";
import PageAnalytics from "@/components/PageAnalytics";
import TrackedLink from "@/components/TrackedLink";

export const metadata: Metadata = {
  title: "AI Text Generator vs Starting from Blank | Digital Meta Zone",
  description: "Compare AI-first drafting against blank-page writing for proposals and client docs.",
};

export default function AiTextComparisonPage() {
  return (
    <div className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: "/compare/ai-text-generator-vs-blank-page" }} />

      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">AI Text Generator vs Starting from Blank</h1>
        <p className="page-subtitle">
          Intent keyword: ai text generator vs blank page.
        </p>
      </section>

      <section className="glass-card max-w-3xl mx-auto reveal-fade-up">
        <p className="text-muted mb-4">
          AI-first drafting helps teams move past the blank page and iterate faster on
          proposal copy, summaries, and deliverable descriptions.
        </p>
        <p className="text-muted mb-6">
          Blank-page writing can still be valuable for final polish, but AI reduces first-draft time.
        </p>
        <TrackedLink
          href="/tools/ai/text-generator"
          className="primary-btn"
          eventName="tool_start"
          eventPayload={{ tool: "/tools/ai/text-generator", source: "seo_compare_ai_text" }}
        >
          Start Free
        </TrackedLink>
      </section>
    </div>
  );
}
