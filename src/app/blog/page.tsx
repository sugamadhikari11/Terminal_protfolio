import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { profile } from "@/data/portfolio";
import { SiteChrome } from "@/components/site/SiteChrome";
import { guiInk as ink } from "@/components/site/guiInk";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — Web3, AI & Full-Stack Notes",
  description:
    "Articles by Sugam Adhikari on Web3, AI integrations, DeFi, Next.js, and building an interactive portfolio that stays SEO-friendly.",
  alternates: { canonical: absoluteUrl("/blog") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/blog"),
    title: "Blog — Sugam Adhikari (SA)",
    description: "Notes on Web3, AI, and full-stack product work.",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Sugam Adhikari (SA)",
    description: "Notes on Web3, AI, and full-stack product work.",
    creator: "@sugamadhikari",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  url: absoluteUrl("/blog"),
  name: "Sugam Adhikari Blog",
  description: "Notes on Web3, AI, and full-stack product work.",
  author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: profile.name },
  blogPost: blogPosts.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    description: post.description,
  })),
};

export default function BlogIndexPage() {
  const posts = [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteChrome title="Blog">
        <main className="mx-auto w-full px-[10%] py-12 md:py-16">
          <section className="mb-12">
            <p className={`mb-3 font-mono text-[10px] uppercase tracking-[0.35em] ${ink.mute}`}>
              Writing
            </p>
            <h1 className={`font-mono text-3xl font-bold tracking-tight sm:text-4xl ${ink.strong}`}>
              Blog
            </h1>
            <p className={`mt-4 max-w-2xl leading-relaxed ${ink.body}`}>
              Short notes on Web3, AI tooling, and shipping full-stack products.
            </p>
          </section>

          <ol className="space-y-0">
            {posts.map((post) => (
              <li key={post.slug} className={`border-b py-8 last:border-0 ${ink.line}`}>
                <time
                  dateTime={post.publishedAt}
                  className={`font-mono text-[10px] uppercase tracking-[0.2em] ${ink.mute}`}
                >
                  {post.publishedAt}
                </time>
                <h2 className={`mt-2 font-mono text-xl font-semibold sm:text-2xl ${ink.strong}`}>
                  <Link href={`/blog/${post.slug}`} className="hover:opacity-70">
                    {post.title}
                  </Link>
                </h2>
                <p className={`mt-3 max-w-3xl text-sm leading-relaxed ${ink.soft}`}>
                  {post.description}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className={`mt-4 inline-block text-sm underline decoration-dotted underline-offset-4 ${ink.strong}`}
                >
                  Read article →
                </Link>
              </li>
            ))}
          </ol>
        </main>
      </SiteChrome>
    </>
  );
}
