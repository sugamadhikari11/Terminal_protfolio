import Link from "next/link";
import ModeCube from "@/components/ModeCube";
import { JsonLdScript } from "@/components/site/JsonLdScript";
import { contacts, experience, profile, projects } from "@/data/portfolio";
import { blogPosts } from "@/data/blog";
import { homeGraph } from "@/lib/schema";
import { SITE_NAV } from "@/lib/site";

/**
 * Home is mostly a client 3D/terminal experience.
 * This server-rendered block gives crawlers real text + crawlable internal links.
 * Visible footer lives on content pages (and mobile GUI) — not fixed over the sky.
 */
function SeoContent() {
  return (
    <section className="sr-only" aria-label="Sugam Adhikari portfolio overview">
      <h1>
        {profile.name} — {profile.title}
      </h1>
      <p>{profile.tagline}</p>
      <p>
        Based in {profile.location}. {profile.education}
      </p>
      <p>{profile.mission}</p>

      <nav aria-label="Site pages">
        <ul>
          {SITE_NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
          <li>
            <a href="/resume.pdf">Resume PDF</a>
          </li>
        </ul>
      </nav>

      <h2>Experience</h2>
      <ul>
        {experience.map((item) => (
          <li key={item.role + item.period}>
            {item.role}
            {item.org ? ` at ${item.org}` : ""} ({item.period}) — {item.detail}
          </li>
        ))}
      </ul>

      <h2>Featured projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.slug}>
            <Link href={`/projects/${project.slug}`}>
              <strong>{project.name}</strong>
            </Link>{" "}
            — {project.summary} Tech: {project.tech.join(", ")}.
            {project.link ? (
              <>
                {" "}
                <a href={project.link}>{project.name} on GitHub</a>
              </>
            ) : null}
          </li>
        ))}
      </ul>

      <h2>Latest writing</h2>
      <ul>
        {blogPosts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link> — {post.description}
          </li>
        ))}
      </ul>

      <h2>Contact</h2>
      <ul>
        {contacts.map((c) => (
          <li key={c.label}>
            <a href={c.href}>
              {c.label}: {c.value}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLdScript id="ld-json-home" data={homeGraph()} />
      <SeoContent />
      <ModeCube />
    </>
  );
}
