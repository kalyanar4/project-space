import ToolsNav from "../../ToolsNav";
import latestNews from "../../../data/latestNews.json";
import NewsCard from "../../../../components/NewsCard";
import { EmptyState } from "@/components/FlowStates";

export default function AINewsPage() {
  return (
    <div className="page-shell">
      <ToolsNav />
      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">Latest AI News</h1>
        <p className="page-subtitle">Curated updates from the AI ecosystem.</p>
      </section>
      <div className="section-divider" />
      {latestNews.length === 0 ? (
        <EmptyState title="No News Yet" description="AI news items will appear here as soon as they are available." />
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 stagger-grid">
          {latestNews.map((item, idx) => (
            <NewsCard key={idx} item={item} />
          ))}
        </section>
      )}
    </div>
  );
}
