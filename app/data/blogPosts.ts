export interface BlogLink {
  label: string;
  href: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  topic: string;
  intentKeyword: string;
  content: string[];
  primaryCta: BlogLink;
  relatedLinks: BlogLink[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "merge-client-contracts-in-2-mins",
    title: "How to merge client contracts in 2 mins",
    description:
      "A fast workflow for combining client agreements and proposal documents into one review-ready PDF.",
    readTime: "4 min",
    topic: "PDF Workflow",
    intentKeyword: "merge client contracts online",
    content: [
      "Start by collecting all contract revisions and supporting documents in one folder so ordering is easy.",
      "Upload only final candidate files, then arrange them in legal review order: cover, agreement, scope, appendices.",
      "After merging, export one clean PDF and share that version for approval to avoid feedback on outdated files.",
    ],
    primaryCta: {
      label: "Start Free",
      href: "/tools/pdf/merge",
    },
    relatedLinks: [
      { label: "Use Case: Merge Client Contracts", href: "/use-cases/pdf-merge-client-contracts" },
      { label: "Comparison: Online vs Desktop Merge", href: "/compare/pdf-merge-vs-desktop-tools" },
      { label: "Tool: Split PDF", href: "/tools/pdf/split" },
    ],
  },
  {
    slug: "convert-scanned-pdf-to-editable-draft-workflow",
    title: "Convert scanned PDF to editable draft workflow",
    description:
      "A practical process to extract text from PDF documents and move quickly into client-ready edits.",
    readTime: "5 min",
    topic: "Document Ops",
    intentKeyword: "convert scanned pdf to editable draft",
    content: [
      "Use PDF to Word conversion as a first pass, then review structure and formatting before final client edits.",
      "When source quality is low, run short section conversions first so cleanup is manageable.",
      "Once edited, keep a changelog and track final version IDs to avoid contract confusion.",
    ],
    primaryCta: {
      label: "Start Free",
      href: "/tools/pdf/pdf-to-word",
    },
    relatedLinks: [
      { label: "Use Case: Contract PDF to Word", href: "/use-cases/pdf-to-word-contract-edits" },
      { label: "Comparison: Conversion vs Retyping", href: "/compare/pdf-to-word-vs-manual-retyping" },
      { label: "Tool: AI Text Generator", href: "/tools/ai/text-generator" },
    ],
  },
  {
    slug: "ai-first-client-proposal-drafting-playbook",
    title: "AI-first client proposal drafting playbook",
    description:
      "How to generate proposal first drafts with AI while keeping your agency voice and delivery quality.",
    readTime: "6 min",
    topic: "AI Workflow",
    intentKeyword: "ai proposal draft generator",
    content: [
      "Begin with a structured prompt containing business context, scope constraints, and target outcomes.",
      "Generate multiple draft variants, then merge the strongest sections into one final draft.",
      "Use a human review pass for pricing, legal language, and brand tone before sharing externally.",
    ],
    primaryCta: {
      label: "Start Free",
      href: "/tools/ai/text-generator",
    },
    relatedLinks: [
      { label: "Use Case: AI Proposal Drafts", href: "/use-cases/ai-proposal-drafts" },
      { label: "Comparison: AI vs Blank Page", href: "/compare/ai-text-generator-vs-blank-page" },
      { label: "Lead Magnet: Proposal Templates", href: "/lead-magnets/proposal-templates" },
    ],
  },
  {
    slug: "proposal-to-contract-handoff-with-ai-and-pdf-tools",
    title: "Proposal-to-contract handoff with AI and PDF tools",
    description:
      "A conversion-focused workflow from first proposal draft to final contract packet delivery.",
    readTime: "5 min",
    topic: "Operations",
    intentKeyword: "proposal to contract workflow",
    content: [
      "Draft proposal language with AI to reduce first-pass writing time.",
      "Convert supporting documents into editable drafts for legal and client-specific revisions.",
      "Merge final assets into one contract packet to simplify approvals and reduce communication loops.",
    ],
    primaryCta: {
      label: "Start Free",
      href: "/tools",
    },
    relatedLinks: [
      { label: "Tool: AI Text Generator", href: "/tools/ai/text-generator" },
      { label: "Tool: PDF to Word", href: "/tools/pdf/pdf-to-word" },
      { label: "Tool: PDF Merge", href: "/tools/pdf/merge" },
    ],
  },
];

export const findBlogPostBySlug = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);
