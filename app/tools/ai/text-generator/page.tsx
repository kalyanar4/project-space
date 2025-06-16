import Link from "next/link";
import ToolsNav from "../../ToolsNav";

export default function TextGeneratorPage() {
  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen p-6 sm:p-12">
      <ToolsNav />
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-8">Text Generator</h1>
        <p className="text-lg mb-10">This tool will allow you to generate text using AI. Stay tuned!</p>
        <Link href="/tools/ai" className="text-accent-color hover:underline">
          ← Back to AI Tools
        </Link>
      </div>
    </div>
  );
}
