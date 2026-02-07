import Link from "next/link";
import ToolsNav from "../../ToolsNav";

export default function CompressPDFPage() {
  return (
    <div className="page-shell">
      <ToolsNav />
      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">PDF Compress</h1>
        <p className="page-subtitle">
          Smart compression workflow is currently in development.
        </p>
      </section>

      <section className="glass-card max-w-3xl mx-auto reveal-fade-up">
        <p className="text-muted mb-4">
          We disabled the previous beta implementation to avoid inaccurate document output.
        </p>
        <p className="text-muted mb-6">
          Commercial purpose: provide safe size optimization for sharing, uploads, and storage costs.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/tools/pdf" className="secondary-btn">
            Back to PDF Tools
          </Link>
          <Link href="/contact" className="primary-btn">
            Join Early Access
          </Link>
        </div>
      </section>
    </div>
  );
}
