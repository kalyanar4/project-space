"use client";

import { useState } from "react";
import Link from "next/link";

export default function TechStack() {
  const tools = [
    {
      name: "React",
      description: "A JavaScript library for building user interfaces.",
      link: "https://reactjs.org/",
    },
    {
      name: "Next.js",
      description: "The React framework for production-grade web applications.",
      link: "https://nextjs.org/",
    },
    {
      name: "TypeScript",
      description: "Static typing and tooling that make large JavaScript projects safer.",
      link: "https://www.typescriptlang.org/",
    },
    {
      name: "Tailwind CSS",
      description: "Utility-first styling for building polished interfaces quickly.",
      link: "https://tailwindcss.com/",
    },
    {
      name: "Three.js",
      description: "WebGL-based 3D rendering for immersive browser experiences.",
      link: "https://threejs.org/",
    },
  ];

  const [hoveredTool, setHoveredTool] = useState<number | null>(null);

  return (
    <div className="page-shell">
      <section className="page-intro">
        <h1 className="page-title">Technology</h1>
        <p className="page-subtitle">
          Core technologies behind our products and internal tooling.
        </p>
      </section>

      <div className="section-divider" />

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <article
            key={tool.name}
            className="service-card"
            onMouseEnter={() => setHoveredTool(index)}
            onMouseLeave={() => setHoveredTool(null)}
          >
            <h2 className="text-xl font-semibold mb-3">{tool.name}</h2>
            <p>{hoveredTool === index ? tool.description : "Hover to preview"}</p>
            <div className="mt-5">
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-btn"
              >
                Learn More
              </a>
            </div>
          </article>
        ))}
      </section>

      <section className="cta-section">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
          Want to learn more about our stack?
        </h2>
        <Link href="/contact" className="primary-btn">
          Contact Us
        </Link>
      </section>
    </div>
  );
}
