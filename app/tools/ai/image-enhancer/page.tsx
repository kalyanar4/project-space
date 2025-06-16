import Link from "next/link";
import ToolsNav from "../../ToolsNav";

export default function ImageEnhancerPage() {
  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen p-6 sm:p-12">
      <ToolsNav />
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-8">Image Enhancer</h1>
        <p className="text-lg mb-10">Improve your images with AI-powered enhancement. Coming soon!</p>
        <Link href="/tools/ai" className="text-accent-color hover:underline">
          ← Back to AI Tools
        </Link>
      </div>
    </div>
  );
}
