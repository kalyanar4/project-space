import Link from "next/link";
import { tools } from "../data/toolsList";

export default function Tools() {
  return (
    <div className="page-shell">
      <section className="page-intro">
        <h1 className="page-title">Developer Tools</h1>
        <p className="page-subtitle">
          Utilities to simplify workflow, speed up delivery, and reduce context switching.
        </p>
      </section>

      <div className="section-divider" />

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.name} href={tool.path} className="service-card">
            <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
            <p>{tool.description}</p>
          </Link>
        ))}
      </section>

      <section className="cta-section">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Suggest a Tool</h2>
        <Link href="/contact" className="primary-btn">
          Get in Touch
        </Link>
      </section>
    </div>
  );
}
