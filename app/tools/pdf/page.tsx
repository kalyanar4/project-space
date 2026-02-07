import Link from "next/link";
import { pdfTools } from "../../data/pdfTools";
import ToolsNav from "../ToolsNav";

export default function PDFToolsPage() {
  return (
    <div className="page-shell">
      <ToolsNav />

      <section className="page-intro">
        <h1 className="page-title">PDF Tools</h1>
        <p className="page-subtitle">Fast document workflows for merge, split, convert, and optimize tasks.</p>
      </section>

      <div className="section-divider" />

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pdfTools.map((tool) => (
          <article key={tool.slug} className="service-card flex flex-col justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
              <p>{tool.description}</p>
            </div>
            <div>
              <Link href={`/tools/pdf/${tool.slug}`} className="primary-btn">
                Open Tool
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="cta-section">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Need a Specific PDF Tool?</h2>
        <Link href="/contact" className="primary-btn">
          Suggest It
        </Link>
      </section>
    </div>
  );
}
