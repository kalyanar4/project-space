export default function Projects() {
  const projects = [
    {
      name: "Management Tools",
      description: "A suite of tools for team and project management, including task tracking, timelines, and reporting.",
    },
    {
      name: "GEO Location Project",
      description: "Advanced location tracking and mapping solutions for geospatial data analysis and visualization.",
    },
    {
      name: "Chat Rep",
      description: "A real-time chatbot system designed to improve customer interactions with AI-powered responses.",
    },
    {
      name: "Game Hub",
      description: "A central platform for game enthusiasts, featuring game reviews, live leaderboards, and community forums.",
    },
    {
      name: "The UI Framework",
      description: "A customizable UI framework for building responsive, modern web applications effortlessly.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto p-6 sm:p-12">
        {/* <h1 className="text-4xl sm:text-6xl font-bold text-center mb-8"> */}
        <h1 className="animated-gradient-text">
          Our Projects
        </h1>
        <p className="text-lg sm:text-xl text-center mb-10">
          Explore some of our innovative projects showcasing advanced
          technologies and creative solutions.
        </p>
        <div className="section-divider mb-8"></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.name}
              className="p-6 glass-card rounded-lg hover:scale-105 transition transform"
            >
              <h2 className="text-xl font-semibold mb-4 text-center">
                {project.name}
              </h2>
              <p className="text-sm sm:text-base text-center">
                {project.description}
              </p>
            </div>
          ))}
        </div>
        <div className="section-divider mt-16 mb-10"></div>
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Have a Project Idea?
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
