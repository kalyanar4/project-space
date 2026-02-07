import Link from "next/link";

export default function Blog() {
  const blogPosts = [
    {
      title: "Tech Talks",
      description:
        "Latest trends, product choices, and architecture discussions across modern web platforms.",
      link: "/blog/tech-talks",
    },
    {
      title: "AI in Race",
      description:
        "How AI capabilities are shifting product development and operational scale.",
      link: "/blog/ai-in-race",
    },
    {
      title: "Videos and Audio",
      description:
        "Curated visual and audio sessions focused on practical implementation and craft.",
      link: "/blog/videos-and-audio",
    },
    {
      title: "Chat for Free",
      description:
        "A look at accessible collaboration and chat tools for distributed teams.",
      link: "/blog/chat-for-free",
    },
    {
      title: "Coding AI",
      description:
        "Using AI to scaffold, debug, and accelerate day-to-day software development.",
      link: "/blog/coding-ai",
    },
  ];

  return (
    <div className="page-shell">
      <section className="page-intro">
        <h1 className="page-title">Blog</h1>
        <p className="page-subtitle">
          Notes and updates on tooling, AI, and engineering workflows.
        </p>
      </section>

      <div className="section-divider" />

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <article key={post.title} className="service-card">
            <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
            <p className="mb-5">{post.description}</p>
            <Link href={post.link} className="secondary-btn">
              Read More
            </Link>
          </article>
        ))}
      </section>

      <section className="cta-section">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Want to Share Your Thoughts?</h2>
        <Link href="/contact" className="primary-btn">
          Contact Us
        </Link>
      </section>
    </div>
  );
}
