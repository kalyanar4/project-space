import Link from "next/link";

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
      <section className="hero-section reveal-fade-up">
        <div className="hero-content">
          <p className="eyebrow">Digital Meta Zone</p>
          <h1 className="page-title">AI + Document Productivity Platform</h1>
          <p className="page-subtitle">
            Our niche is practical AI and document workflow utilities for creators,
            developers, and small teams that need fast, reliable execution.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/tools" className="primary-btn">
              Explore Tools
            </Link>
            <Link href="/projects" className="secondary-btn">
              View Projects
            </Link>
          </div>
        </div>
      </section>

      <section className="glass-card reveal-fade-up">
        <h2 className="text-3xl font-semibold tracking-tight mb-3">Predefined Niche</h2>
        <p className="text-muted">
          We focus on two high-frequency use-cases: AI-assisted content workflows and
          in-browser document operations. This keeps product direction sharp and aligns
          feature development with clear commercial value.
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
        <Link href="/contact" className="primary-btn">
          Talk to Us
        </Link>
      </section>
    </div>
  );
}
