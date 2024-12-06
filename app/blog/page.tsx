export default function Blog() {
  const blogPosts = [
    {
      title: "Tech Talks",
      description: "Explore the latest trends, innovations, and discussions in technology.",
      link: "/blog/tech-talks",
    },
    {
      title: "AI in Race",
      description: "How AI is shaping industries and changing the future.",
      link: "/blog/ai-in-race",
    },
    {
      title: "Videos and Audio",
      description: "Watch and listen to insightful tech videos and podcasts.",
      link: "/blog/videos-and-audio",
    },
    {
      title: "Chat for Free",
      description: "Discover tools and platforms offering free chat and collaboration.",
      link: "/blog/chat-for-free",
    },
    {
      title: "Coding AI",
      description: "Learn how AI is used to write, debug, and optimize code.",
      link: "/blog/coding-ai",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto p-6 sm:p-12">
        {/* <h1 className="text-4xl sm:text-6xl font-bold text-center mb-8"> */}
        <h1 className="animated-gradient-text">
          Blog Posts
        </h1>
        <p className="text-lg sm:text-xl text-center mb-10">
          Dive into our latest articles, insights, and updates on technology, AI, and more.
        </p>
        <div className="section-divider mb-8"></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <div
              key={post.title}
              className="p-6 bg-gray-800 rounded-lg shadow-lg hover:scale-105 transition transform"
            >
              <h2 className="text-xl font-semibold mb-4 text-center">
                {post.title}
              </h2>
              <p className="text-sm sm:text-base text-center mb-4">
                {post.description}
              </p>
              <a
                href={post.link}
                className="block text-center px-4 py-2 bg-accent-color text-white rounded-lg hover:bg-blue-700 transition"
              >
                Read More
              </a>
            </div>
          ))}
        </div>
        <div className="section-divider mt-16 mb-10"></div>
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Want to Share Your Thoughts?
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
