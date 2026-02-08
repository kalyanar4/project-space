import { tools } from "../data/toolsList";
import PageAnalytics from "@/components/PageAnalytics";
import TrackedLink from "@/components/TrackedLink";

export default function Tools() {
  return (
    <div className="page-shell">
      <PageAnalytics event="tools_page_view" payload={{ page: "/tools" }} />

      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">Developer Tools</h1>
        <p className="page-subtitle">
          AI + PDF productivity for freelancers and small agencies.
        </p>
      </section>

      <div className="section-divider" />

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-grid">
        {tools.map((tool) => (
          <TrackedLink
            key={tool.name}
            href={tool.path}
            className="service-card reveal-fade-up"
            eventName="tools_category_click"
            eventPayload={{ category: tool.name, path: tool.path, status: tool.status }}
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
        <TrackedLink href="/tools/developer" className="primary-btn" eventName="tools_start_free_click" eventPayload={{ source: "tools_cta" }}>
          Start Free
        </TrackedLink>
      </section>
    </div>
  );
}
