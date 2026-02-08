import Link from "next/link";
import PageAnalytics from "@/components/PageAnalytics";
import { blogPosts } from "../data/blogPosts";

export default function Blog() {
  return (
    <div className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: "/blog" }} />

      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">Blog</h1>
        <p className="page-subtitle">
          Transactional playbooks and workflows for AI + PDF productivity.
        </p>
      </section>

      <div className="section-divider" />

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-grid">
        {blogPosts.map((post) => (
          <article key={post.slug} className="service-card reveal-fade-up">
            <p className="text-xs text-muted uppercase tracking-wide mb-2">
              {post.topic} · {post.readTime}
            </p>
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-xs text-muted mb-3">Intent: {post.intentKeyword}</p>
            <p className="mb-5">{post.description}</p>
            <Link href={`/blog/${post.slug}`} className="secondary-btn">
              Read Playbook
            </Link>
          </article>
        ))}
      </section>

      <section className="cta-section reveal-fade-up">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Need help implementing these workflows?</h2>
        <Link href="/contact" className="primary-btn">
          Contact Us
        </Link>
      </section>
    </div>
  );
}
