export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  topic: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "tech-talks",
    title: "Tech Talks",
    description:
      "Latest trends, product choices, and architecture discussions across modern web platforms.",
    readTime: "5 min",
    topic: "Engineering",
    content: [
      "Modern engineering teams win by reducing handoff friction and tightening feedback loops.",
      "Practical architecture choices should optimize for deploy speed, observability, and maintainability.",
      "The strongest product teams blend experimentation discipline with clear UX consistency.",
    ],
  },
  {
    slug: "ai-in-race",
    title: "AI in Race",
    description:
      "How AI capabilities are shifting product development and operational scale.",
    readTime: "4 min",
    topic: "AI",
    content: [
      "AI now compresses implementation time for prototyping, support, and content workflows.",
      "Teams that treat AI as workflow infrastructure instead of novelty gain durable advantages.",
      "Quality controls and clear evaluation criteria are critical for safe production adoption.",
    ],
  },
  {
    slug: "videos-and-audio",
    title: "Videos and Audio",
    description:
      "Curated visual and audio sessions focused on practical implementation and craft.",
    readTime: "3 min",
    topic: "Learning",
    content: [
      "Short-form learning content helps teams absorb patterns faster than long documentation alone.",
      "Audio and video formats are most useful when paired with hands-on examples.",
      "A learning system should prioritize relevance, not volume.",
    ],
  },
  {
    slug: "chat-for-free",
    title: "Chat for Free",
    description:
      "A look at accessible collaboration and chat tools for distributed teams.",
    readTime: "4 min",
    topic: "Collaboration",
    content: [
      "Free collaboration tooling can cover early-stage team needs if workflow discipline is strong.",
      "Decision logs, asynchronous updates, and shared conventions matter more than tool count.",
      "As teams scale, governance and integrations become the main upgrade drivers.",
    ],
  },
  {
    slug: "coding-ai",
    title: "Coding AI",
    description:
      "Using AI to scaffold, debug, and accelerate day-to-day software development.",
    readTime: "6 min",
    topic: "Development",
    content: [
      "Coding assistants are best used for scaffolding, review support, and repetitive tasks.",
      "Human review remains essential for architecture and long-term maintainability.",
      "Teams should define where AI is mandatory, optional, or restricted in the pipeline.",
    ],
  },
];

export const findBlogPostBySlug = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);
