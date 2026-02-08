import { aiTools } from "../../data/aiTools";
import ToolsNav from "../ToolsNav";
import PageAnalytics from "@/components/PageAnalytics";
import TrackedLink from "@/components/TrackedLink";
import TestimonialsGrid from "@/components/TestimonialsGrid";

export default function AIToolsPage() {
  return (
    <div className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: "/tools/ai" }} />
      <ToolsNav />
      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">AI Tools</h1>
        <p className="page-subtitle">Production-ready AI utilities for everyday tasks.</p>
      </section>

      <div className="section-divider" />

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-grid">
        {aiTools.map((tool) => (
          <article key={tool.slug} className="service-card reveal-fade-up flex flex-col justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
              <p>{tool.description}</p>
            </div>
            <div>
              {tool.comingSoon ? (
                <span className="secondary-btn opacity-65 cursor-not-allowed">Coming Soon</span>
              ) : (
                <TrackedLink
                  href={`/tools/ai/${tool.slug}`}
                  className="primary-btn"
                  eventName="tool_start"
                  eventPayload={{ tool: `/tools/ai/${tool.slug}`, source: "ai_tools_grid" }}
                >
                  Open Tool
                </TrackedLink>
              )}
            </div>
          </article>
        ))}
      </section>

      <TestimonialsGrid title="What AI Tool Users Say" />

      <section className="cta-section reveal-fade-up">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Start with the fastest AI workflow</h2>
        <TrackedLink
          href="/tools/ai/text-generator"
          className="primary-btn"
          eventName="tool_start"
          eventPayload={{ tool: "/tools/ai/text-generator", source: "ai_category_cta" }}
        >
          Start Free
        </TrackedLink>
      </section>
    </div>
  );
}
