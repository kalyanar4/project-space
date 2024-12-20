export default function Home() {
  return (
    
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Welcome to Digital Meta Zone
          </h1>
          <p className="text-lg sm:text-xl mb-8">
            Discover cutting-edge experiments, futuristic tools, and stellar projects.
          </p>
          <a
            href="/projects"
            className="inline-block px-6 py-3 bg-accent-color text-white rounded-lg hover:bg-blue-700 transition"
          >
            Explore Projects
          </a>
        </div>
      </section>
      {/* Divider */}
      <div className="section-divider"></div>

       {/* Animated Gradient Center Area */}
       <section className="animated-gradient-section">
        <h2 className="animated-gradient-text">Digital Meta Zone</h2>
      </section>

      {/* Divider */}
      <div className="section-divider"></div>



    {/* Services Section */}
<section className="services-section">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
      Our Services
    </h2>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Service Cards */}
      <div className="service-card">
        <h3 className="text-xl font-semibold mb-4">Tech Exploration</h3>
        <p>
          Dive into our advanced experiments and technologies pushing the boundaries of innovation.
        </p>
      </div>
      <div className="service-card">
        <h3 className="text-xl font-semibold mb-4">Custom Tools</h3>
        <p>
          Explore tools built to solve real-world problems with a futuristic touch.
        </p>
      </div>
      <div className="service-card">
        <h3 className="text-xl font-semibold mb-4">Learn and Grow</h3>
        <p>
          Access resources, tutorials, and guides to master cutting-edge technologies.
        </p>
      </div>
      <div className="service-card">
        <h3 className="text-xl font-semibold mb-4">AI Tools</h3>
        <p>
          Leverage cutting-edge AI solutions, from chatbots to image generation, to supercharge your workflows.
        </p>
      </div>
      <div className="service-card">
        <h3 className="text-xl font-semibold mb-4">Developer Utilities</h3>
        <p>
          Access developer tools like JSON formatters, code converters, and API testers.
        </p>
      </div>
      <div className="service-card">
        <h3 className="text-xl font-semibold mb-4">Daily Utilities</h3>
        <p>
          Perform tasks like PDF merging, image resizing, video editing, and file conversions quickly and efficiently.
        </p>
      </div>
    </div>
  </div>
</section>


       {/* Divider */}
       <div className="section-divider"></div>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
            Ready to explore the future?
          </h2>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-accent-color text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
