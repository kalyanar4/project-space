import Link from "next/link";
import { notFound } from "next/navigation";
import ToolsNav from "../ToolsNav";
import { findToolCategoryBySlug, plannedToolCategories } from "../../data/toolCategories";

interface ToolCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function ToolCategoryPage({ params }: ToolCategoryPageProps) {
  const { category: slug } = await params;
  const category = findToolCategoryBySlug(slug);

  if (!category || category.status === "live") {
    notFound();
  }

  return (
    <div className="page-shell">
      <ToolsNav />
      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">{category.name}</h1>
        <p className="page-subtitle">{category.description}</p>
      </section>

      <section className="glass-card max-w-3xl mx-auto reveal-fade-up">
        <h2 className="text-2xl font-semibold mb-3">Planned Rollout</h2>
        <p className="text-muted mb-3">
          This category is on the roadmap and currently under design and validation.
        </p>
        <p className="text-muted mb-6">Commercial purpose: {category.commercialPurpose}</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/tools" className="secondary-btn">
            Back to All Tools
          </Link>
          <Link href="/contact" className="primary-btn">
            Join Early Access
          </Link>
        </div>
      </section>
    </div>
  );
}

export function generateStaticParams() {
  return plannedToolCategories.map((category) => ({ category: category.slug }));
}
