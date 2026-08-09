import type { Metadata } from "next";
import AboutView from "@/components/site/AboutView";
import { SiteChrome } from "@/components/site/SiteChrome";
import { contacts, profile } from "@/data/portfolio";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Sugam Adhikari — Full-Stack, Web3 & Data Science Developer",
  description:
    "Learn about Sugam Adhikari (SA) — a full-stack and Web3 developer based in Kathmandu, Nepal, studying BSc Data Science at Birmingham City University via Sunway International College. Specialises in Next.js, Solidity, and AI-driven applications.",
  alternates: { canonical: absoluteUrl("/about") },
  openGraph: {
    type: "profile",
    url: absoluteUrl("/about"),
    title: "About Sugam Adhikari (SA)",
    description:
      "Full-stack, Web3 & Data Science developer based in Kathmandu, Nepal. Building at the intersection of blockchain and AI.",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: "About Sugam Adhikari (SA)",
    description:
      "Full-stack, Web3 & Data Science developer based in Kathmandu, Nepal.",
    creator: "@sugamadhikari",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": absoluteUrl("/about"),
  url: absoluteUrl("/about"),
  name: "About Sugam Adhikari",
  description:
    "Full-stack, Web3 & Data Science developer based in Kathmandu, Nepal.",
  mainEntity: {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: profile.name,
    alternateName: "SA",
    url: SITE_URL,
    jobTitle: profile.title,
    description: profile.tagline,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Birmingham City University",
      description: "via Sunway International College",
    },
    sameAs: contacts
      .map((c) => c.href)
      .filter((href) => href.startsWith("http")),
    knowsAbout: [
      "Full-stack development",
      "Web3",
      "Solidity",
      "Next.js",
      "Data Science",
      "React",
      "TypeScript",
      "Machine Learning",
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteChrome title="About">
        <AboutView />
      </SiteChrome>
    </>
  );
}
