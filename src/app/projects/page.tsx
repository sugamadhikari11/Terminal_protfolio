import type { Metadata } from "next";
import Link from "next/link";
import { projects, contacts } from "@/data/portfolio";
import { JsonLdScript } from "@/components/site/JsonLdScript";
import { SiteChrome } from "@/components/site/SiteChrome";
import { guiInk as ink } from "@/components/site/guiInk";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { projectsIndexGraph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Projects — Sugam Adhikari",
  description:
    "Portfolio of projects by Sugam Adhikari — e-commerce, DeFi smart contracts, NFT auctions, blockchain DApps, and ML dashboards built with Next.js, Solidity, React, and Python.",
  alternates: { canonical: absoluteUrl("/projects") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/projects"),
    title: "Projects — Sugam Adhikari (SA)",
    description: "Full-stack and Web3 project portfolio by Sugam Adhikari.",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Sugam Adhikari (SA)",
    description: "Full-stack and Web3 project portfolio by Sugam Adhikari.",
    creator: "@sugamadhikari",
  },
  robots: { index: true, follow: true },
};

export default function ProjectsPage() {
  return (
    <>
      <JsonLdScript id="ld-json-projects" data={projectsIndexGraph()} />
      <SiteChrome title="Projects">
        <main className="mx-auto w-full px-[10%] py-12 md:py-16">
          <section className="mb-12">
            <p className={`mb-3 font-mono text-[10px] uppercase tracking-[0.35em] ${ink.mute}`}>
              Selected work
            </p>
            <h1 className={`font-mono text-3xl font-bold tracking-tight sm:text-4xl ${ink.strong}`}>
              Projects
            </h1>
            <p className={`mt-4 max-w-2xl leading-relaxed ${ink.body}`}>
              Full-stack, Web3, and data science projects — from on-chain DeFi to multi-vendor
              marketplaces and ML tools.
            </p>
          </section>

          <ol className="space-y-0">
            {projects.map((project, idx) => (
              <li
                key={project.slug}
                id={project.slug}
                className={`border-b py-8 last:border-0 ${ink.line}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-xs ${ink.mute}`}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h2 className={`font-mono text-xl font-semibold sm:text-2xl ${ink.strong}`}>
                      <Link href={`/projects/${project.slug}`} className="hover:opacity-70">
                        {project.name}
                      </Link>
                    </h2>
                  </div>
                  <span className={`font-mono text-xs ${ink.mute}`}>{project.period}</span>
                </div>
                <p className={`mt-1 font-mono text-[10px] uppercase tracking-[0.22em] ${ink.mute}`}>
                  {project.role}
                </p>
                <p className={`mt-3 max-w-3xl text-sm leading-relaxed ${ink.soft}`}>
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span key={t} className={`px-2 py-0.5 font-mono text-[10px] ${ink.chip}`}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link href={`/projects/${project.slug}`} className={ink.btnPrimary}>
                    Project page
                  </Link>
                  {project.link ? (
                    <a href={project.link} className={ink.btnGhost}>
                      GitHub
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>

          <section className={`mt-12 border-t pt-10 text-center ${ink.line}`}>
            <div className="flex flex-wrap justify-center gap-2.5">
              <a href={contacts[0]?.href ?? "mailto:"} className={ink.btnPrimary}>
                Email me
              </a>
              <Link href="/about" className={ink.btnGhost}>
                About
              </Link>
            </div>
          </section>
        </main>
      </SiteChrome>
    </>
  );
}
