import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { projects } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";

/** Site-wide content refresh — bump when home/about chrome changes meaningfully */
const SITE_UPDATED = "2026-08-10";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: SITE_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: SITE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: SITE_UPDATED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: SITE_UPDATED,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/references`,
      lastModified: SITE_UPDATED,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/resume.pdf`,
      lastModified: "2025-08-28",
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
