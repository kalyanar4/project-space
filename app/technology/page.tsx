import Link from "next/link";

const valuePoints = [
  {
    title: "Deliver Faster",
    description:
      "Use ready AI drafting and PDF workflows to finish repeat client tasks in minutes, not hours.",
  },
  {
    title: "Avoid Delivery Mistakes",
    description:
      "Standardized steps for merge, split, and conversion reduce rework before client handoff.",
  },
  {
    title: "Protect Your Margin",
    description:
      "Less manual document work means more billable time and healthier project profitability.",
  },
  {
    title: "Stay Consistent Across Clients",
    description:
      "Run the same proven process every time, even when deadlines stack up.",
  },
  {
    title: "Ship Without Extra Tools",
    description:
      "Keep AI and PDF operations in one workspace instead of juggling multiple apps.",
  },
  {
    title: "Scale Small Teams",
    description:
      "Give freelancers and small agencies a repeatable operating layer for higher output.",
  },
];

export default function WhyUsPage() {
  return (
    <div className="page-shell">
      <section className="page-intro">
        <h1 className="page-title">Why Freelancers and Agencies Choose DMZ</h1>
        <p className="page-subtitle">
          Built for high-frequency client delivery work where speed, accuracy, and reliability directly
          impact revenue.
        </p>
      </section>

      <div className="section-divider" />

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {valuePoints.map((point) => (
          <article key={point.title} className="service-card">
            <h2 className="text-xl font-semibold mb-3">{point.title}</h2>
            <p>{point.description}</p>
          </article>
        ))}
      </section>

      <section className="cta-section">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
          Ready to speed up client delivery?
        </h2>
        <Link href="/tools" className="primary-btn">
          Explore Tools
        </Link>
      </section>
    </div>
  );
}
