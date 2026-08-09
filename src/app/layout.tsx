import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { profile, contacts } from "@/data/portfolio";
import { SITE_NAV, SITE_NAME, SITE_URL } from "@/lib/site";

const TITLE = "Sugam Adhikari (SA) | Full-Stack, Web3 & Data Science Portfolio";
const DESCRIPTION =
  "Sugam Adhikari (SA) — full-stack developer in Kathmandu, Nepal. Portfolio of Next.js, Web3, Solidity, and data science projects. Interactive terminal + 3D sky experience.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0e0c" },
    { media: "(prefers-color-scheme: light)", color: "#c4dff2" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Sugam Adhikari (SA)",
  },
  description: DESCRIPTION,
  applicationName: "SA Portfolio",
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  publisher: profile.name,
  category: "portfolio",
  keywords: [
    "Sugam Adhikari",
    "SA",
    "Sugam Adhikari portfolio",
    "full-stack developer Nepal",
    "Web3 developer Kathmandu",
    "Next.js developer",
    "Solidity developer",
    "data science portfolio",
    "blockchain developer Nepal",
    "React TypeScript portfolio",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@sugamadhikari",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  other: {
    "geo.region": "NP-P3",
    "geo.placename": "Kathmandu",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
    },
    {
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
      sameAs: contacts
        .map((c) => c.href)
        .filter((href) => href.startsWith("http")),
      knowsAbout: [
        "Full-stack development",
        "Web3",
        "Solidity",
        "Next.js",
        "Data science",
        "React",
        "TypeScript",
      ],
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profile`,
      url: SITE_URL,
      name: TITLE,
      description: DESCRIPTION,
      mainEntity: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "SiteNavigationElement",
      "@id": `${SITE_URL}/#nav`,
      name: "Primary",
      hasPart: SITE_NAV.map((item) => ({
        "@type": "WebPage",
        name: item.label,
        url: item.href === "/" ? SITE_URL : `${SITE_URL}${item.href}`,
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0e0c" />
        <meta name="color-scheme" content="dark light" />
        <link rel="author" href={SITE_URL} />
      </head>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
