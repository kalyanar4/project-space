import Link from "next/link";
import { aiTools } from "../../data/aiTools";
import ToolsNav from "../ToolsNav";

export default function AIToolsPage() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <ToolsNav />
      <div className="max-w-6xl mx-auto p-6 sm:p-12">
        <h1 className="text-3xl sm:text-5xl font-bold text-center mb-10">AI Tools</h1>
        <div className="section-divider mb-10" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {aiTools.map((tool) => (
            <div key={tool.slug} className="service-card flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-center">{tool.name}</h2>
                <p className="text-sm text-center mb-4">{tool.description}</p>
              </div>
              <div className="text-center">
                {tool.comingSoon ? (
                  <span className="inline-block px-4 py-2 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed">
                    Coming Soon
                  </span>
                ) : (
                  <Link
                    href={`/tools/ai/${tool.slug}`}
                    className="inline-block px-4 py-2 bg-accent-color text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Open Tool
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="section-divider mt-20 mb-10" />

        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Have an AI Tool Idea?</h2>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-accent-color text-white rounded-lg hover:bg-blue-700 transition"
          >
            Suggest It
          </a>
        </div>
      </div>
    </div>
  );
}
