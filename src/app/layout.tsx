import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { profile } from "@/data/portfolio";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { globalGraph } from "@/lib/schema";
import { JsonLdScript } from "@/components/site/JsonLdScript";

const TITLE = "Sugam Adhikari | Full-Stack, Web3 & Data Science Portfolio";
const DESCRIPTION =
  "Full-stack developer in Kathmandu, Nepal. Next.js, Web3, Solidity, and data science projects.";

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
    template: "%s | Sugam Adhikari",
  },
  description: DESCRIPTION,
  applicationName: "Sugam Adhikari Portfolio",
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
        <JsonLdScript id="ld-json-global" data={globalGraph()} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
