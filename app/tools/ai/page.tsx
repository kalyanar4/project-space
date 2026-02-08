import Link from "next/link";
import { aiTools } from "../../data/aiTools";
import ToolsNav from "../ToolsNav";

export default function AIToolsPage() {
  return (
    <div className="page-shell">
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
                <Link href={`/tools/ai/${tool.slug}`} className="primary-btn">
                  Open Tool
                </Link>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="cta-section reveal-fade-up">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Start with the fastest AI workflow</h2>
        <Link href="/tools/ai/text-generator" className="primary-btn">
          Start Free
        </Link>
      </section>
    </div>
  );
}
