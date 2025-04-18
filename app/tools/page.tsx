import Link from "next/link";
import { tools } from "../data/toolsList";

export default function Tools() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto p-6 sm:p-12">
        <h1 className="animated-gradient-text">Developer Tools</h1>
        <p className="text-lg sm:text-xl text-center mb-10">
          Discover an array of tools designed to enhance productivity, simplify
          workflows, and power innovation.
        </p>

        <div className="section-divider mb-8"></div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.path}
              className="service-card transition-transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold mb-4 text-center">
                {tool.name}
              </h2>
              <p className="text-sm sm:text-base text-center">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="section-divider mt-16 mb-10"></div>

        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Suggest a Tool
          </h2>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-accent-color text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}
