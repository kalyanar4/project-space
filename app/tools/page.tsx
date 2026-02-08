import { tools } from "../data/toolsList";
import PageAnalytics from "@/components/PageAnalytics";
import TrackedLink from "@/components/TrackedLink";

const heroTools = [
  {
    name: "PDF Merge",
    path: "/tools/pdf/merge",
    outcome: "Combine multiple client documents into one clean deliverable.",
    value: "High-frequency agency workflow with immediate output value.",
  },
  {
    name: "PDF to Word",
    path: "/tools/pdf/pdf-to-word",
    outcome: "Convert static PDFs into editable drafts for fast revisions.",
    value: "Saves manual rewriting time on proposals and contracts.",
  },
  {
    name: "AI Text Generator",
    path: "/tools/ai/text-generator",
    outcome: "Draft client-facing copy, summaries, and first-pass deliverables.",
    value: "Reduces blank-page time and accelerates proposal turnaround.",
  },
];

export default function Tools() {
  return (
    <div className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: "/tools" }} />

      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">Developer Tools</h1>
        <p className="page-subtitle">
          AI + PDF productivity for freelancers and small agencies.
        </p>
      </section>

      <div className="section-divider" />

      <section className="reveal-fade-up">
        <div className="page-intro mb-7">
          <h2 className="page-title">Hero Tools</h2>
          <p className="page-subtitle">Productized workflows designed for immediate outcomes.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-grid">
          {heroTools.map((tool) => (
            <article key={tool.name} className="service-card reveal-fade-up">
              <p className="text-xs uppercase tracking-wide text-muted mb-2">Most Used</p>
              <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
              <p className="text-muted mb-2">{tool.outcome}</p>
              <p className="text-sm text-muted mb-4">{tool.value}</p>
              <TrackedLink
                href={tool.path}
                className="primary-btn"
                eventName="tool_start"
                eventPayload={{ tool: tool.path, source: "hero_tools_section" }}
              >
                Open Hero Tool
              </TrackedLink>
            </article>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-grid">
        {tools.map((tool) => (
          <TrackedLink
            key={tool.name}
            href={tool.path}
            className="service-card reveal-fade-up"
            eventName="tool_start"
            eventPayload={{ tool: tool.path, category: tool.name, source: "tools_grid" }}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-xl font-semibold">{tool.name}</h2>
              <span className={tool.status === "live" ? "status-pill-live" : "status-pill-planned"}>
                {tool.status === "live" ? "Live" : "Planned"}
              </span>
            </div>
            <p className="mb-3">{tool.description}</p>
            <p className="text-sm text-muted">Commercial purpose: {tool.commercialPurpose}</p>
          </TrackedLink>
        ))}
      </section>

      <section className="cta-section reveal-fade-up">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Ready to try the tools?</h2>
        <TrackedLink href="/tools/developer" className="primary-btn" eventName="tool_start" eventPayload={{ tool: "/tools/developer", source: "tools_cta" }}>
          Start Free
        </TrackedLink>
      </section>
    </div>
  );
}
