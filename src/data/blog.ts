export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** ISO date published */
  publishedAt: string;
  /** ISO date last meaningfully updated */
  updatedAt: string;
  tags: string[];
  /** Short markdown-like paragraphs for the article body */
  paragraphs: string[];
};

/**
 * Editorial blog posts — real crawlable URLs for Search Console indexing.
 * Keep updatedAt accurate when you edit a post (sitemap uses it).
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "building-at-the-intersection-of-web3-and-ai",
    title: "Building at the Intersection of Web3 and AI",
    description:
      "How Sugam Adhikari approaches full-stack products that combine blockchain rails with AI agents, MCP integrations, and modern Next.js UIs.",
    publishedAt: "2026-03-12",
    updatedAt: "2026-08-04",
    tags: ["Web3", "AI", "Next.js", "Portfolio"],
    paragraphs: [
      "Most products I care about sit between two stacks that used to feel separate: verifiable on-chain logic, and intelligent off-chain agents. Web3 gives ownership and transparent settlement. AI gives interfaces that understand intent. Shipping both well means treating contracts, APIs, and UI as one product surface.",
      "On the chain side I lean on Solidity, Hardhat, and wallet-first React/Next clients — swap, lend, stake, lottery, and auction flows where the happy path is auditable. Off-chain, I wire Next.js apps to MongoDB or Django services, then layer AI integrations and MCP tools so operators can automate the boring parts without hiding the critical state.",
      "The portfolio site itself is a small proof of that mindset: a terminal for engineers who like commands, and a 3D GUI for people who want to explore. Same content, different interaction model — and every important page also exists as a normal HTML route so search engines and AI crawlers can read it.",
      "If you are hiring for full-stack, Web3, or AI-adjacent product work, start with the Projects page and the resume — then email me. I am based in Kathmandu and open to full-time and freelance collaborations.",
    ],
  },
  {
    slug: "from-defi-internships-to-multi-vendor-commerce",
    title: "From DeFi Internships to Multi-Vendor Commerce",
    description:
      "Lessons from NovaChain DeFi internship work and shipping a Next.js multi-vendor marketplace with MongoDB and role-based flows.",
    publishedAt: "2026-05-20",
    updatedAt: "2026-08-04",
    tags: ["DeFi", "E-commerce", "Solidity", "MongoDB"],
    paragraphs: [
      "My internship on NovaChain was a crash course in production DeFi habits: test the contracts, keep the React wallet UI honest about gas and failure modes, and never assume the happy path. Swap, lending, and staking are simple to demo and hard to harden — Hardhat tests and careful ethers.js wiring catch most of the surprises early.",
      "That discipline carried into the multi-vendor e-commerce platform I have been building with Next.js and MongoDB. Vendors, buyers, orders, and payouts are just another set of role boundaries. The difference is that failures show up as refunds and support tickets instead of reverted transactions — so observability and clear admin tools matter as much as pretty storefronts.",
      "Across both domains I keep the same rule: make the data model boring and the UX crisp. Whether the source of truth is a contract or a collection, the interface should tell the user what just happened and what they can do next.",
    ],
  },
  {
    slug: "why-this-portfolio-has-a-terminal-and-a-sky",
    title: "Why This Portfolio Has a Terminal and a Sky",
    description:
      "Design notes on Sugam Adhikari’s interactive portfolio — terminal ModeCube, 3D plane flight, and dedicated SEO pages for About, Projects, Blog, and References.",
    publishedAt: "2026-07-08",
    updatedAt: "2026-08-09",
    tags: ["Design", "Three.js", "SEO", "Next.js"],
    paragraphs: [
      "I wanted a portfolio that felt like me: playful for people who enjoy systems, and still respectful of recruiters who need a clear About page in under a minute. The cube flips between a classic terminal and a GUI sky with a WW1-style plane — fun, but not a maze.",
      "Interactive experiences are terrible as the only SEO strategy. Search engines and many AI tools prefer real URLs with headings, dates, and internal links. So every story told in the GUI also lives on /about, /projects, /blog, and /references, with a sitemap and JSON-LD that point at the same Person entity.",
      "If you arrived from Search Console or a social preview: welcome. Use the footer links to move around, or type help in the terminal on the home experience. The sky is optional; the content is not.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllBlogSlugs() {
  return blogPosts.map((p) => p.slug);
}
