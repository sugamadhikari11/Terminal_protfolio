import type { BlogPost } from "@/data/blog";
import { blogPosts } from "@/data/blog";
import { contacts, profile, projects, skillCategories, type Project } from "@/data/portfolio";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";

/** Stable @id anchors — reference by @id on child pages, define fully in globalGraph(). */
export const SCHEMA_IDS = {
  person: `${SITE_URL}/#person`,
  website: `${SITE_URL}/#website`,
  homeWebpage: `${SITE_URL}/#webpage`,
  projectsCollection: `${absoluteUrl("/projects")}#webpage`,
  blog: `${absoluteUrl("/blog")}#blog`,
  aboutService: `${absoluteUrl("/about")}#service`,
} as const;

export const OG_IMAGE = {
  "@type": "ImageObject" as const,
  url: `${SITE_URL}/opengraph-image`,
  width: 1200,
  height: 630,
};

const IN_LANGUAGE = "en-US";

const PERSON_EMAIL = contacts.find((c) => c.href.startsWith("mailto:"))?.href ?? "";

const PERSON_SAME_AS = [
  "https://github.com/sugamadhikari11",
  "https://www.linkedin.com/in/sugamadhikari/",
  "https://twitter.com/sugamadhikari",
];

const PERSON_KNOWS_ABOUT = [
  ...new Set(skillCategories.flatMap((c) => c.skills)),
  "Smart Contracts",
  "DApps",
  "Data Science",
  "MCP Integration",
];

/** Visible FAQ on /about — must match FAQPage schema verbatim. */
export const ABOUT_FAQ = [
  {
    question: "Is Sugam Adhikari available for freelance or full-time work?",
    answer:
      "Yes. Sugam is open to full-time roles, freelance projects, and collaborations in full-stack development, Web3/blockchain, and data science.",
  },
  {
    question: "What technologies does Sugam Adhikari specialize in?",
    answer:
      "Next.js, React, TypeScript, and Tailwind CSS on the frontend; Node.js, PHP, Django, and MongoDB on the backend; Solidity, Web3.js, and ethers.js for blockchain/DApp development; and Python for data science and machine learning.",
  },
  {
    question: "Where is Sugam Adhikari based?",
    answer: "Sugam is based in Kathmandu, Nepal, and works with clients and teams remotely.",
  },
] as const;

function personRef() {
  return { "@id": SCHEMA_IDS.person };
}

function websiteRef() {
  return { "@id": SCHEMA_IDS.website };
}

export function breadcrumbList(
  items: ReadonlyArray<{ name: string; path: string }>
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.path === "/" ? `${SITE_URL}/` : absoluteUrl(item.path),
    })),
  };
}

export function projectsItemList(name = "Projects") {
  return {
    "@type": "ItemList",
    name,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: absoluteUrl(`/projects/${p.slug}`),
    })),
  };
}

function blogPostsItemList() {
  return {
    "@type": "ItemList",
    name: "Blog posts",
    itemListElement: blogPosts.map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
    })),
  };
}

/** Approximate ISO date from project period string (first segment). */
function periodStartIso(period: string): string {
  const start = period.split("–")[0]?.trim() ?? period;
  const months: Record<string, string> = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
  };
  const yearMatch = start.match(/\b(20\d{2})\b/);
  const year = yearMatch?.[1] ?? "2024";
  if (/^\d{4}$/.test(start.trim())) return `${start.trim()}-01-01`;
  const lower = start.toLowerCase();
  for (const [name, num] of Object.entries(months)) {
    if (lower.includes(name)) return `${year}-${num}-01`;
  }
  return `${year}-01-01`;
}

/** Site-wide Person + WebSite — inject once in root layout. */
export function globalGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": SCHEMA_IDS.person,
        name: profile.name,
        alternateName: "SA",
        url: `${SITE_URL}/`,
        image: OG_IMAGE,
        jobTitle: "Full-Stack, Web3 & Data Science Developer",
        description: `${profile.tagline} ${profile.education}`,
        ...(PERSON_EMAIL ? { email: PERSON_EMAIL } : {}),
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kathmandu",
          addressRegion: "Bagmati Province",
          addressCountry: "NP",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Birmingham City University",
          sameAs: "https://en.wikipedia.org/wiki/Birmingham_City_University",
        },
        knowsAbout: PERSON_KNOWS_ABOUT,
        sameAs: PERSON_SAME_AS,
        worksFor: {
          "@type": "Organization",
          name: "Independent / Freelance",
        },
      },
      {
        "@type": "WebSite",
        "@id": SCHEMA_IDS.website,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description:
          "Portfolio of Next.js, Web3, Solidity, and data science projects by Sugam Adhikari.",
        publisher: personRef(),
        inLanguage: IN_LANGUAGE,
      },
    ],
  };
}

export function homeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": SCHEMA_IDS.homeWebpage,
        url: `${SITE_URL}/`,
        name: "Sugam Adhikari | Full-Stack, Web3 & Data Science Portfolio",
        description:
          "Full-stack developer in Kathmandu, Nepal. Next.js, Web3, Solidity, and data science projects.",
        isPartOf: websiteRef(),
        about: personRef(),
        primaryImageOfPage: OG_IMAGE,
        inLanguage: IN_LANGUAGE,
      },
      projectsItemList("Featured Projects"),
    ],
  };
}

export function aboutGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${absoluteUrl("/about")}#webpage`,
        url: absoluteUrl("/about"),
        name: "About Sugam Adhikari",
        description:
          "Learn about Sugam Adhikari — a full-stack and Web3 developer based in Kathmandu, Nepal.",
        isPartOf: websiteRef(),
        mainEntity: personRef(),
        inLanguage: IN_LANGUAGE,
      },
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ]),
      {
        "@type": "Service",
        "@id": SCHEMA_IDS.aboutService,
        serviceType: "Full-Stack, Web3 & Data Science Development",
        provider: personRef(),
        areaServed: {
          "@type": "Country",
          name: "Worldwide (remote); based in Kathmandu, Nepal",
        },
        description:
          "Full-stack web development, Web3/Solidity smart-contract engineering, and data science/AI integration for freelance and full-time collaborations.",
        audience: {
          "@type": "Audience",
          audienceType:
            "Startups, agencies, and companies hiring full-stack, Web3, or data science talent",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: ABOUT_FAQ.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}

export function projectsIndexGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": SCHEMA_IDS.projectsCollection,
        url: absoluteUrl("/projects"),
        name: "Projects | Sugam Adhikari",
        isPartOf: websiteRef(),
        about: personRef(),
        inLanguage: IN_LANGUAGE,
        mainEntity: projectsItemList(),
      },
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" },
      ]),
    ],
  };
}

export function projectDetailGraph(project: Project) {
  const projectUrl = absoluteUrl(`/projects/${project.slug}`);
  const projectId = `${projectUrl}#project`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["CreativeWork", "SoftwareSourceCode"],
        "@id": projectId,
        name: project.name,
        url: projectUrl,
        headline: project.summary,
        description: project.description,
        creator: personRef(),
        author: personRef(),
        dateCreated: periodStartIso(project.period),
        dateModified: project.updatedAt,
        programmingLanguage: project.tech,
        keywords: project.tech,
        ...(project.link ? { codeRepository: project.link } : {}),
        isPartOf: { "@id": SCHEMA_IDS.projectsCollection },
      },
      {
        "@type": "WebPage",
        "@id": `${projectUrl}#webpage`,
        url: projectUrl,
        name: `${project.name} — Project | Sugam Adhikari`,
        isPartOf: websiteRef(),
        mainEntity: { "@id": projectId },
        inLanguage: IN_LANGUAGE,
      },
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" },
        { name: project.name, path: `/projects/${project.slug}` },
      ]),
    ],
  };
}

export function blogIndexGraph() {
  const list = blogPostsItemList();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": SCHEMA_IDS.blog,
        url: absoluteUrl("/blog"),
        name: "Blog | Sugam Adhikari",
        publisher: personRef(),
        isPartOf: websiteRef(),
        inLanguage: IN_LANGUAGE,
      },
      list,
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
      ]),
    ],
  };
}

export function blogPostGraph(post: BlogPost) {
  const postUrl = absoluteUrl(`/blog/${post.slug}`);
  const articleId = `${postUrl}#article`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": articleId,
        headline: post.title,
        description: post.description,
        url: postUrl,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: personRef(),
        publisher: personRef(),
        image: OG_IMAGE,
        articleSection: "Portfolio",
        keywords: post.tags,
        inLanguage: IN_LANGUAGE,
        mainEntityOfPage: { "@id": `${postUrl}#webpage` },
      },
      {
        "@type": "WebPage",
        "@id": `${postUrl}#webpage`,
        url: postUrl,
        name: `${post.title} | Sugam Adhikari`,
        isPartOf: websiteRef(),
        inLanguage: IN_LANGUAGE,
      },
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` },
      ]),
    ],
  };
}

export function referencesGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absoluteUrl("/references")}#webpage`,
        url: absoluteUrl("/references"),
        name: "References | Sugam Adhikari",
        description:
          "Attributions for 3D models, libraries, and open-source tools used in this portfolio.",
        isPartOf: websiteRef(),
        inLanguage: IN_LANGUAGE,
      },
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "References", path: "/references" },
      ]),
    ],
  };
}
