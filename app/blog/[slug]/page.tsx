import Link from "next/link";
import { notFound } from "next/navigation";
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
      <section className="page-intro reveal-fade-up">
        <p className="text-sm text-muted uppercase tracking-wide mb-3">
          {post.topic} · {post.readTime}
        </p>
        <h1 className="page-title">{post.title}</h1>
        <p className="page-subtitle">{post.description}</p>
      </section>

      <section className="glass-card max-w-3xl mx-auto space-y-5 reveal-fade-up">
        {post.content.map((paragraph, index) => (
          <p key={index} className="text-muted">
            {paragraph}
          </p>
        ))}
      </section>

      <div className="flex justify-center">
        <Link href="/blog" className="secondary-btn">
          Back to Blog
        </Link>
      </div>
    </article>
  );
}
