import PageAnalytics from "@/components/PageAnalytics";
import TrackedLink from "@/components/TrackedLink";

const channels = [
  {
    name: "Reddit/X Communities",
    play: "Publish practical before/after workflow clips and link one hero tool + one post.",
  },
  {
    name: "Indie Hackers + Product Hunt Prep",
    play: "Share build-in-public updates, collect feedback, and stage launch copy/screenshots.",
  },
  {
    name: "Niche Facebook/Slack Groups",
    play: "Post operator-focused mini tutorials on client proposal and contract workflows.",
  },
];

export default function GrowthDistributionPage() {
  return (
    <div className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: "/growth/distribution" }} />

      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">Week 3 Distribution Engine</h1>
        <p className="page-subtitle">
          Channel-specific publishing plan to distribute SEO pages and transactional content.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-grid">
        {channels.map((channel) => (
          <article key={channel.name} className="service-card reveal-fade-up">
            <h2 className="text-xl font-semibold mb-2">{channel.name}</h2>
            <p className="text-muted mb-3">{channel.play}</p>
            <p className="text-sm text-muted">One intent keyword, one CTA, one measurable event per post.</p>
          </article>
        ))}
      </section>

      <section className="cta-section reveal-fade-up">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Turn distribution traffic into activated users</h2>
        <TrackedLink
          href="/tools"
          className="primary-btn"
          eventName="tool_start"
          eventPayload={{ tool: "/tools", source: "growth_distribution_cta" }}
        >
          Start Free
        </TrackedLink>
      </section>
    </div>
  );
}
