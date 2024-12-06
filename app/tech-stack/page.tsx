"use client";

import { useState } from "react";

export default function TechStack() {
  const tools = [
    {
      name: "React",
      description: "A JavaScript library for building user interfaces.",
      link: "https://reactjs.org/",
    },
    {
      name: "Next.js",
      description: "The React framework for production.",
      link: "https://nextjs.org/",
    },
    {
      name: "TypeScript",
      description:
        "A strongly typed programming language that builds on JavaScript.",
      link: "https://www.typescriptlang.org/",
    },
    {
      name: "Tailwind CSS",
      description:
        "A utility-first CSS framework for rapid UI development.",
      link: "https://tailwindcss.com/",
    },
    {
      name: "Three.js",
      description: "A JavaScript 3D library for rendering graphics.",
      link: "https://threejs.org/",
    },
  ];

  // Use a union type to allow both `number` and `null`
  const [hoveredTool, setHoveredTool] = useState<number | null>(null);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto p-6 sm:p-12">
        <h1 className="text-4xl sm:text-6xl font-bold text-center mb-8">
          Our Tech Stack
        </h1>
        <p className="text-lg sm:text-xl text-center mb-10">
          Explore the powerful technologies we use to build modern, efficient
          solutions.
        </p>
        <div className="section-divider mb-8"></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => (
            <div
              key={tool.name}
              className="relative group p-6 bg-gray-800 rounded-lg shadow-lg hover:scale-105 transition transform"
              onMouseEnter={() => setHoveredTool(index)} // Now valid
              onMouseLeave={() => setHoveredTool(null)} // Now valid
            >
              <h2 className="text-xl font-semibold mb-4 text-center">
                {tool.name}
              </h2>
              <p className="text-sm sm:text-base text-center">
                {hoveredTool === index ? tool.description : ""}
              </p>
              <div className="mt-4 flex justify-center">
                <a
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-accent-color text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="section-divider mt-16 mb-10"></div>
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Want to learn more about our stack?
          </h2>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-accent-color text-white rounded-lg hover:bg-blue-700 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
