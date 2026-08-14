import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/data/blog";
import { profile } from "@/data/portfolio";
import { JsonLdScript } from "@/components/site/JsonLdScript";
import { SiteChrome } from "@/components/site/SiteChrome";
import { guiInk as ink } from "@/components/site/guiInk";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { blogPostGraph } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: absoluteUrl(`/blog/${post.slug}`) },
    openGraph: {
      type: "article",
      url: absoluteUrl(`/blog/${post.slug}`),
      title: post.title,
      description: post.description,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [profile.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: "@sugamadhikari",
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = blogPostGraph(post);

  return (
    <>
      <JsonLdScript id={`ld-json-blog-${post.slug}`} data={jsonLd} />
      <SiteChrome title="Blog">
        <article className="mx-auto w-full px-[10%] py-12 md:py-16">
          <p className={`mb-3 font-mono text-[10px] uppercase tracking-[0.35em] ${ink.mute}`}>
            <Link href="/blog" className="hover:opacity-70">
              Blog
            </Link>
          </p>
          <h1
            className={`font-mono text-3xl font-bold leading-tight tracking-tight sm:text-4xl ${ink.strong}`}
          >
            {post.title}
          </h1>
          <div className={`mt-4 flex flex-wrap gap-3 font-mono text-xs ${ink.mute}`}>
            <time dateTime={post.publishedAt}>Published {post.publishedAt}</time>
            <span aria-hidden>·</span>
            <time dateTime={post.updatedAt}>Updated {post.updatedAt}</time>
          </div>

          <div className={`mt-10 space-y-6 text-base leading-relaxed sm:text-lg ${ink.body}`}>
            {post.paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>

          <nav className={`mt-14 border-t pt-8 text-sm ${ink.line} ${ink.soft}`} aria-label="Related">
            <Link href="/blog" className={`underline decoration-dotted underline-offset-2 ${ink.strong}`}>
              ← All posts
            </Link>
          </nav>
        </article>
      </SiteChrome>
    </>
  );
}
