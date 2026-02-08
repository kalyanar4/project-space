import PageAnalytics from "@/components/PageAnalytics";
import TrackedLink from "@/components/TrackedLink";
import TestimonialsGrid from "@/components/TestimonialsGrid";

const services = [
  {
    title: "AI Content Workflows",
    description:
      "Generate, refine, and repurpose text outputs for product, marketing, and support operations.",
    value: "Commercial impact: reduce content turnaround time and operating costs.",
  },
  {
    title: "Document Operations",
    description:
      "Handle merge, split, conversion, and packaging tasks directly in browser for fast output.",
    value: "Commercial impact: create recurring utility usage and workflow lock-in.",
  },
  {
    title: "Developer Productivity",
    description:
      "Support engineers with focused utilities that remove repetitive formatting and conversion steps.",
    value: "Commercial impact: increase retention from daily engineering usage.",
  },
];

const commercialComponents = [
  {
    component: "Home + Positioning",
    purpose: "Clearly communicate niche and credibility.",
    revenueFit: "Improves conversion from first-time visitors to active users.",
  },
  {
    component: "Tools Catalog",
    purpose: "Guide users to high-intent utility workflows.",
    revenueFit: "Supports freemium, subscription, and enterprise packaging.",
  },
  {
    component: "AI/PDF Tool Flows",
    purpose: "Deliver immediate user outcomes with minimal setup.",
    revenueFit: "Drives repeat usage, upsell potential, and referrals.",
  },
  {
    component: "Blog + Knowledge",
    purpose: "Build trust and organic discovery around practical use-cases.",
    revenueFit: "Improves top-of-funnel acquisition and authority.",
  },
  {
    component: "Contact + CTA",
    purpose: "Capture partnership requests, tool requests, and enterprise leads.",
    revenueFit: "Enables direct B2B opportunities and custom engagements.",
  },
];

export default function Home() {
  return (
    <div className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: "/" }} />

      <section className="hero-section reveal-fade-up">
        <div className="hero-content">
          <p className="eyebrow">Digital Meta Zone</p>
          <h1 className="page-title">AI + PDF Productivity for Freelancers and Small Agencies</h1>
          <p className="page-subtitle">
            We help freelancers and small agencies ship faster with practical AI workflows
            and reliable PDF utilities in one polished workspace.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <TrackedLink href="/tools" className="primary-btn" eventName="tool_start" eventPayload={{ tool: "global_tools_entry", source: "home_hero" }}>
              Start Free
            </TrackedLink>
          </div>
        </div>
      </section>

      <section className="glass-card reveal-fade-up">
        <h2 className="text-3xl font-semibold tracking-tight mb-3">Predefined Niche</h2>
        <p className="text-muted">
          Our niche is fixed: AI + PDF productivity for freelancers and small agencies.
          We prioritize high-frequency client delivery tasks where speed and reliability
          directly affect revenue.
        </p>
      </section>

      <div className="section-divider" />

      <section className="services-section">
        <div className="page-intro reveal-fade-up">
          <h2 className="page-title">Core Service Pillars</h2>
          <p className="page-subtitle">
            Built to move from discovery to output with minimal friction.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-grid">
          {services.map((service) => (
            <article key={service.title} className="service-card reveal-fade-up">
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="mb-3">{service.description}</p>
              <p className="text-sm text-muted">{service.value}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      <section className="reveal-fade-up">
        <div className="page-intro mb-8">
          <h2 className="page-title">Pricing Skeleton</h2>
          <p className="page-subtitle">Simple structure to validate conversion before full billing rollout.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 max-w-4xl mx-auto w-full">
          <article className="glass-card reveal-fade-up">
            <h3 className="text-2xl font-semibold">Free</h3>
            <p className="text-3xl font-bold my-3">$0</p>
            <p className="text-muted">Basic usage limits</p>
          </article>
          <article className="glass-card reveal-fade-up">
            <h3 className="text-2xl font-semibold">Pro</h3>
            <p className="text-3xl font-bold my-3">$19/mo</p>
            <p className="text-muted">Higher limits, faster processing, advanced tools</p>
            <div className="mt-5">
              <TrackedLink
                href="/pricing"
                className="primary-btn"
                eventName="upgrade_click"
                eventPayload={{ tier: "pro", source: "home_pricing" }}
              >
                View Pro Plan
              </TrackedLink>
            </div>
          </article>
        </div>
      </section>

      <div className="section-divider" />

      <section className="glass-card reveal-fade-up">
        <h2 className="text-2xl font-semibold mb-2">Free Lead Magnet</h2>
        <p className="text-muted mb-4">
          Download “10 Client-Proposal Templates” after a quick email unlock.
        </p>
        <TrackedLink
          href="/lead-magnets/proposal-templates"
          className="primary-btn"
          eventName="tool_start"
          eventPayload={{ tool: "lead_magnet_proposal_templates", source: "home_lead_magnet" }}
        >
          Get Free Templates
        </TrackedLink>
      </section>

      <div className="section-divider" />

      <TestimonialsGrid />

      <div className="section-divider" />

      <section className="reveal-fade-up">
        <div className="page-intro mb-8">
          <h2 className="page-title">Commercial Purpose By Component</h2>
          <p className="page-subtitle">Each product area maps to a business outcome.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {commercialComponents.map((item) => (
            <article key={item.component} className="glass-card reveal-fade-up">
              <h3 className="text-lg font-semibold mb-2">{item.component}</h3>
              <p className="text-muted mb-2">{item.purpose}</p>
              <p className="text-sm text-muted">{item.revenueFit}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section reveal-fade-up">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
          Want a smooth production-ready experience for your workflow?
        </h2>
        <TrackedLink href="/tools" className="primary-btn" eventName="tool_start" eventPayload={{ tool: "global_tools_entry", source: "home_footer_cta" }}>
          Start Free
        </TrackedLink>
      </section>
    </div>
  );
}
