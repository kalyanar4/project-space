import Link from "next/link";
import ToolsNav from "../../ToolsNav";

export default function ImageEnhancerPage() {
  return (
    <div className="page-shell">
      <ToolsNav />
      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">Image Enhancer</h1>
        <p className="page-subtitle">
          Improve image clarity and quality for product assets and marketing workflows.
        </p>
      </section>
      <section className="glass-card max-w-3xl mx-auto reveal-fade-up">
        <p className="text-muted mb-4">This tool is in active planning and currently marked as coming soon.</p>
        <p className="text-muted mb-6">
          Commercial purpose: improve creative output quality and reduce manual editing time.
        </p>
        <Link href="/tools/ai" className="secondary-btn">
          Back to AI Tools
        </Link>
      </section>
    </div>
  );
}
