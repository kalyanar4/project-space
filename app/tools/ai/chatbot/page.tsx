import Link from "next/link";
import ToolsNav from "../../ToolsNav";

export default function ChatbotPage() {
  return (
    <div className="page-shell">
      <ToolsNav />
      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">Chatbot</h1>
        <p className="page-subtitle">
          Conversational assistant workflows for product support and lead qualification.
        </p>
      </section>
      <section className="glass-card max-w-3xl mx-auto reveal-fade-up">
        <p className="text-muted mb-4">This tool is in active planning and currently marked as coming soon.</p>
        <p className="text-muted mb-6">
          Commercial purpose: increase support efficiency and capture qualified inbound demand.
        </p>
        <Link href="/tools/ai" className="secondary-btn">
          Back to AI Tools
        </Link>
      </section>
    </div>
  );
}
