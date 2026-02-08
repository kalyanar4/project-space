import TrackedLink from "@/components/TrackedLink";
import PageAnalytics from "@/components/PageAnalytics";

const features = [
  "Team workspace and shared tool history",
  "Private processing controls for sensitive documents",
  "Priority support with faster response windows",
  "API access for workflow automation",
];

export default function B2BPage() {
  return (
    <div className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: "/b2b" }} />

      <section className="hero-section reveal-fade-up">
        <div className="hero-content">
          <p className="eyebrow">B2B Plan</p>
          <h1 className="page-title">Team Workflow Infrastructure for Small Agencies</h1>
          <p className="page-subtitle">
            Bring AI + PDF operations into one reliable workspace with private processing,
            shared team velocity, and priority support.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <TrackedLink
              href="/contact"
              className="primary-btn"
              eventName="tool_start"
              eventPayload={{ tool: "b2b_demo_request", source: "b2b_hero" }}
            >
              Book Demo
            </TrackedLink>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <article key={feature} className="service-card reveal-fade-up">
            <h2 className="text-lg font-semibold mb-2">{feature}</h2>
            <p className="text-muted">Commercial impact: better retention, faster delivery, and stronger margins.</p>
          </article>
        ))}
      </section>

      <section className="glass-card reveal-fade-up">
        <h2 className="text-2xl font-semibold mb-2">Agency Outbound Sprint</h2>
        <p className="text-muted mb-4">
          Target: contact 20 agencies per day for 5 days with a 60-second demo clip and one workflow win.
        </p>
        <TrackedLink
          href="/contact"
          className="primary-btn"
          eventName="tool_start"
          eventPayload={{ tool: "b2b_outbound_cta", source: "b2b_outbound_block" }}
        >
          Start Outreach
        </TrackedLink>
      </section>
    </div>
  );
}
