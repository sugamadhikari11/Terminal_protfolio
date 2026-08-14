import type { Metadata } from "next";
import AboutView from "@/components/site/AboutView";
import { JsonLdScript } from "@/components/site/JsonLdScript";
import { SiteChrome } from "@/components/site/SiteChrome";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { aboutGraph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About Sugam Adhikari — Full-Stack, Web3 & Data Science Developer",
  description:
    "Learn about Sugam Adhikari — a full-stack and Web3 developer based in Kathmandu, Nepal, studying BSc Data Science at Birmingham City University via Sunway International College. Specialises in Next.js, Solidity, and AI-driven applications.",
  alternates: { canonical: absoluteUrl("/about") },
  openGraph: {
    type: "profile",
    url: absoluteUrl("/about"),
    title: "About Sugam Adhikari",
    description:
      "Full-stack, Web3 & Data Science developer based in Kathmandu, Nepal. Building at the intersection of blockchain and AI.",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: "About Sugam Adhikari",
    description:
      "Full-stack, Web3 & Data Science developer based in Kathmandu, Nepal.",
    creator: "@sugamadhikari",
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <>
      <JsonLdScript id="ld-json-about" data={aboutGraph()} />
      <SiteChrome title="About">
        <AboutView />
      </SiteChrome>
    </>
  );
}
