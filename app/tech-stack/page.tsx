export default function TechStack() {
    const tools = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Three.js"];
  
    return (
      <div className="p-6 sm:p-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">Tech Stack</h2>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <li
              key={tool}
              className="p-4 bg-gray-800 rounded-lg text-center shadow-lg hover:scale-105 transition"
            >
              {tool}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  