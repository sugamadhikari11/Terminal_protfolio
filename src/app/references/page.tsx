import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/data/portfolio";
import { SiteChrome } from "@/components/site/SiteChrome";
import { guiInk as ink } from "@/components/site/guiInk";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "References & Credits — Sugam Adhikari",
  description:
    "Attributions and references for 3D models, open-source tools, and libraries used in the Sugam Adhikari portfolio website — including the Stylized WW1 Plane from Sketchfab.",
  alternates: { canonical: absoluteUrl("/references") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/references"),
    title: "References & Credits — Sugam Adhikari",
    description: "Attributions for 3D models, libraries, and open-source tools used in this portfolio.",
    siteName: SITE_NAME,
  },
  robots: { index: true, follow: true },
};

const REFS = [
  {
    category: "3D Models",
    items: [
      {
        title: "Stylized WW1 Plane",
        author: "Sketchfab Community",
        url: "https://sketchfab.com/3d-models/stylized-ww1-plane-c4edeb0e410f46e8a4db320879f0a1db",
        usage: "Animated fly-through intro in the GUI mode sky experience.",
        license: "Sketchfab Standard License",
      },
    ],
  },
  {
    category: "Core Frameworks",
    items: [
      {
        title: "Next.js",
        author: "Vercel",
        url: "https://nextjs.org",
        usage: "React framework powering the portfolio.",
        license: "MIT",
      },
      {
        title: "React Three Fiber",
        author: "Poimandres",
        url: "https://github.com/pmndrs/react-three-fiber",
        usage: "3D scene rendering for the GUI sky experience.",
        license: "MIT",
      },
      {
        title: "Three.js",
        author: "mrdoob",
        url: "https://threejs.org",
        usage: "WebGL rendering engine.",
        license: "MIT",
      },
    ],
  },
];

export default function ReferencesPage() {
  return (
    <SiteChrome title="References">
      <main className="mx-auto w-full px-[10%] py-12 md:py-16">
        <section className="mb-12">
          <p className={`mb-3 font-mono text-[10px] uppercase tracking-[0.35em] ${ink.mute}`}>
            Attributions
          </p>
          <h1 className={`font-mono text-3xl font-bold tracking-tight sm:text-4xl ${ink.strong}`}>
            References
          </h1>
          <p className={`mt-4 max-w-2xl leading-relaxed ${ink.body}`}>
            Credits for the 3D models and open-source libraries that power this portfolio.
          </p>
        </section>

        {REFS.map((group) => (
          <section key={group.category} className={`mb-10 border-t pt-8 ${ink.line}`}>
            <h2 className={`mb-5 font-mono text-[10px] uppercase tracking-[0.3em] ${ink.mute}`}>
              {group.category}
            </h2>
            <ul className="space-y-4">
              {group.items.map((item) => (
                <li
                  key={item.title}
                  className={`rounded-xl border bg-white/35 p-4 backdrop-blur-sm ${ink.line}`}
                >
                  <a
                    href={item.url}
                    className={`font-semibold underline decoration-dotted underline-offset-2 ${ink.strong}`}
                  >
                    {item.title}
                  </a>
                  <span className={`ml-2 text-xs ${ink.mute}`}>by {item.author}</span>
                  <p className={`mt-1 text-sm ${ink.soft}`}>{item.usage}</p>
                  <span className={`mt-2 inline-block px-2 py-0.5 font-mono text-[10px] ${ink.chip}`}>
                    {item.license}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className={`border-t pt-8 text-sm ${ink.line} ${ink.soft}`}>
          Other code and design by{" "}
          <Link href="/about" className={`underline decoration-dotted underline-offset-2 ${ink.strong}`}>
            {profile.name}
          </Link>
          .
        </p>
      </main>
    </SiteChrome>
  );
}
