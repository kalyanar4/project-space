import Link from "next/link";

export default function Projects() {
  const projects = [
    {
      name: "Management Tools",
      description:
        "Team and project operations with task tracking, timelines, and measurable delivery reporting.",
    },
    {
      name: "GEO Location Project",
      description:
        "Geospatial analysis and mapping experiences for location-driven products and insights.",
    },
    {
      name: "Chat Rep",
      description:
        "A real-time assistant workflow for handling user conversations with smart response routing.",
    },
    {
      name: "Game Hub",
      description:
        "Community platform for game discovery, scoreboards, and player-driven discussions.",
    },
    {
      name: "The UI Framework",
      description:
        "A reusable UI foundation for fast, consistent, responsive product experiences.",
    },
  ];

  return (
    <div className="page-shell">
      <section className="page-intro">
        <h1 className="page-title">Projects</h1>
        <p className="page-subtitle">
          Selected initiatives that combine engineering rigor with practical outcomes.
        </p>
      </section>

      <div className="section-divider" />

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <article key={project.name} className="service-card">
            <h2 className="text-xl font-semibold mb-3">{project.name}</h2>
            <p>{project.description}</p>
          </article>
        ))}
      </section>

      <section className="cta-section">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Have a Project Idea?</h2>
        <Link href="/contact" className="primary-btn">
          Contact Us
        </Link>
      </section>
    </div>
  );
}
