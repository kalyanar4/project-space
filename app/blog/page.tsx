import Link from "next/link";
import { blogPosts } from "../data/blogPosts";

export default function Blog() {
  return (
    <div className="page-shell">
      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">Blog</h1>
        <p className="page-subtitle">
          Notes on AI workflow design, developer productivity, and digital tooling.
        </p>
      </section>

      <div className="section-divider" />

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-grid">
        {blogPosts.map((post) => (
          <article key={post.slug} className="service-card reveal-fade-up">
            <p className="text-xs text-muted uppercase tracking-wide mb-2">
              {post.topic} · {post.readTime}
            </p>
            <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
            <p className="mb-5">{post.description}</p>
            <Link href={`/blog/${post.slug}`} className="secondary-btn">
              Read More
            </Link>
          </article>
        ))}
      </section>

      <section className="cta-section reveal-fade-up">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Want to Share Your Thoughts?</h2>
        <Link href="/contact" className="primary-btn">
          Contact Us
        </Link>
      </section>
    </div>
  );
}
