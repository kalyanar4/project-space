export type ToolCategoryStatus = "live" | "planned";

export interface ToolCategory {
  slug: string;
  name: string;
  description: string;
  status: ToolCategoryStatus;
  commercialPurpose: string;
}

export const toolCategories: ToolCategory[] = [
  {
    slug: "pdf",
    name: "PDF Tools",
    description: "Merge, split, convert, and optimize PDFs in browser.",
    status: "live",
    commercialPurpose: "Attract high-intent utility traffic and convert into recurring users.",
  },
  {
    slug: "ai",
    name: "AI Tools",
    description: "Text generation, AI workflows, and curated AI news.",
    status: "live",
    commercialPurpose: "Position product as an AI productivity hub for modern teams.",
  },
  {
    slug: "developer",
    name: "Developer Utilities",
    description: "Formatting, validation, and build-support tools for engineers.",
    status: "planned",
    commercialPurpose: "Increase retention via frequent developer workflow usage.",
  },
  {
    slug: "ui",
    name: "UI Tools",
    description: "Design-ready resources, generators, and component helpers.",
    status: "planned",
    commercialPurpose: "Capture design/dev collaboration use-cases and team upgrades.",
  },
  {
    slug: "data",
    name: "Data Visualization",
    description: "Fast chart and data presentation helpers for reporting.",
    status: "planned",
    commercialPurpose: "Serve analytics teams and enable premium reporting workflows.",
  },
  {
    slug: "daily",
    name: "Daily Utilities",
    description: "Everyday conversion and quick-operation productivity tools.",
    status: "planned",
    commercialPurpose: "Drive repeat visits from broad utility search demand.",
  },
  {
    slug: "backend",
    name: "Backend Tools",
    description: "API testing and backend diagnostics for service reliability.",
    status: "planned",
    commercialPurpose: "Create B2B value around engineering productivity and uptime.",
  },
  {
    slug: "lambda",
    name: "Lambda Tools",
    description: "Serverless helpers and deployment-focused runtime utilities.",
    status: "planned",
    commercialPurpose: "Support cloud-native builders and enterprise deployment teams.",
  },
];

export const liveToolCategories = toolCategories.filter((tool) => tool.status === "live");
export const plannedToolCategories = toolCategories.filter((tool) => tool.status === "planned");

export const findToolCategoryBySlug = (slug: string) =>
  toolCategories.find((category) => category.slug === slug);
