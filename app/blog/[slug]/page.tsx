import Link from "next/link";
import { notFound } from "next/navigation";
import PageAnalytics from "@/components/PageAnalytics";
import TrackedLink from "@/components/TrackedLink";
import { blogPosts, findBlogPostBySlug } from "../../data/blogPosts";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = findBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: `/blog/${slug}` }} />

      <section className="page-intro reveal-fade-up">
        <p className="text-sm text-muted uppercase tracking-wide mb-3">
          {post.topic} · {post.readTime}
        </p>
        <h1 className="page-title">{post.title}</h1>
        <p className="page-subtitle">{post.description}</p>
      </section>

      <section className="glass-card max-w-3xl mx-auto space-y-5 reveal-fade-up">
        <p className="text-sm text-muted">Intent keyword: {post.intentKeyword}</p>
        {post.content.map((paragraph, index) => (
          <p key={index} className="text-muted">
            {paragraph}
          </p>
        ))}
        <div className="pt-2">
          <TrackedLink
            href={post.primaryCta.href}
            className="primary-btn"
            eventName="tool_start"
            eventPayload={{ tool: post.primaryCta.href, source: `blog_cta_${post.slug}` }}
          >
            {post.primaryCta.label}
          </TrackedLink>
        </div>
      </section>

      <section className="glass-card max-w-3xl mx-auto reveal-fade-up">
        <h2 className="text-xl font-semibold mb-3">Related Links</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {post.relatedLinks.map((link) => (
            <TrackedLink
              key={link.href}
              href={link.href}
              className="secondary-btn"
              eventName="tool_start"
              eventPayload={{ tool: link.href, source: `blog_related_${post.slug}` }}
            >
              {link.label}
            </TrackedLink>
          ))}
        </div>
      </section>

      <div className="flex justify-center">
        <Link href="/blog" className="secondary-btn">
          Back to Blog
        </Link>
      </div>
    </article>
  );
}
