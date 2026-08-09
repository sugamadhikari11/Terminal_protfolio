import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { contacts, getProject, profile, projects } from "@/data/portfolio";
import { SiteChrome } from "@/components/site/SiteChrome";
import { guiInk as ink } from "@/components/site/guiInk";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: `${project.name} — Project`,
    description: `${project.summary} ${project.description}`,
    alternates: { canonical: absoluteUrl(`/projects/${project.slug}`) },
    openGraph: {
      type: "article",
      url: absoluteUrl(`/projects/${project.slug}`),
      title: `${project.name} — Sugam Adhikari`,
      description: project.summary,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — Sugam Adhikari`,
      description: project.summary,
      creator: "@sugamadhikari",
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: profile.name,
    },
    url: absoluteUrl(`/projects/${project.slug}`),
    ...(project.link ? { codeRepository: project.link, downloadUrl: project.link } : {}),
    keywords: project.tech.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteChrome title="Projects">
        <main className="mx-auto w-full px-[10%] py-12 md:py-16">
          <p className={`mb-3 font-mono text-[10px] uppercase tracking-[0.35em] ${ink.mute}`}>
            <Link href="/projects" className="hover:opacity-70">
              Projects
            </Link>
            <span className="mx-2 opacity-40">/</span>
            {project.period}
          </p>
          <h1 className={`font-mono text-3xl font-bold tracking-tight sm:text-4xl ${ink.strong}`}>
            {project.name}
          </h1>
          <p className={`mt-3 font-mono text-[11px] uppercase tracking-[0.22em] ${ink.mute}`}>
            {project.role}
          </p>
          <p className={`mt-6 text-lg leading-relaxed ${ink.body}`}>{project.summary}</p>
          <p className={`mt-4 leading-relaxed ${ink.soft}`}>{project.description}</p>

          {(project.highlights ?? []).length > 0 ? (
            <ul className="mt-8 space-y-2">
              {(project.highlights ?? []).map((h) => (
                <li key={h} className={`flex gap-2 text-sm ${ink.soft}`}>
                  <span className={ink.mute}>→</span>
                  {h}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className={`px-2.5 py-1 font-mono text-[10px] ${ink.chip}`}>
                {t}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-2.5">
            {project.link ? (
              <a href={project.link} className={ink.btnPrimary}>
                View on GitHub
              </a>
            ) : null}
            <Link href="/projects" className={ink.btnGhost}>
              All projects
            </Link>
            <a href={contacts[0]?.href ?? "mailto:"} className={ink.btnGhost}>
              Email me
            </a>
          </div>
        </main>
      </SiteChrome>
    </>
  );
}
