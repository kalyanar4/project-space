import Link from "next/link";
import { tools } from "../data/toolsList";

export default function Tools() {
  return (
    <div className="page-shell">
      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">Developer Tools</h1>
        <p className="page-subtitle">
          Our niche is AI and document productivity for creators, developers, and small teams.
        </p>
      </section>

      <div className="section-divider" />

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-grid">
        {tools.map((tool) => (
          <Link key={tool.name} href={tool.path} className="service-card reveal-fade-up">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-xl font-semibold">{tool.name}</h2>
              <span className={tool.status === "live" ? "status-pill-live" : "status-pill-planned"}>
                {tool.status === "live" ? "Live" : "Planned"}
              </span>
            </div>
            <p className="mb-3">{tool.description}</p>
            <p className="text-sm text-muted">Commercial purpose: {tool.commercialPurpose}</p>
          </Link>
        ))}
      </section>

      <section className="cta-section reveal-fade-up">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Need a specific workflow?</h2>
        <Link href="/contact" className="primary-btn">
          Request a Tool
        </Link>
      </section>
    </div>
  );
}
