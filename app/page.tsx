import Link from "next/link";

const services = [
  {
    title: "Tech Exploration",
    description:
      "Track experiments and applied research that turns emerging ideas into practical products.",
  },
  {
    title: "Custom Tools",
    description:
      "Purpose-built utilities for document workflows, automation, and fast prototyping.",
  },
  {
    title: "Learning Resources",
    description:
      "Clear guides and references designed to help teams ship modern software faster.",
  },
  {
    title: "AI Workflows",
    description:
      "Production-minded AI tooling for generation, summarization, and day-to-day productivity.",
  },
  {
    title: "Developer Utilities",
    description:
      "Conversion, formatting, and debugging helpers that remove repetitive engineering friction.",
  },
  {
    title: "Daily Utilities",
    description:
      "Reliable file and media tools to get routine tasks done with fewer steps.",
  },
];

export default function Home() {
  return (
    <div className="page-shell">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="page-title">Digital Meta Zone</h1>
          <p className="page-subtitle">
            Modern tools and experiments with an interface focused on clarity,
            speed, and polish.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/projects" className="primary-btn">
              Explore Projects
            </Link>
            <Link href="/tools" className="secondary-btn">
              Open Tools
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="animated-gradient-section">
        <h2 className="animated-gradient-text">Build. Ship. Refine.</h2>
      </section>

      <div className="section-divider" />

      <section className="services-section">
        <div className="page-intro">
          <h2 className="page-title">Our Services</h2>
          <p className="page-subtitle">
            A focused toolkit for engineering teams, creators, and product builders.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="service-card">
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      <section className="cta-section">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
          Ready to explore what comes next?
        </h2>
        <Link href="/contact" className="primary-btn">
          Get in Touch
        </Link>
      </section>
    </div>
  );
}
