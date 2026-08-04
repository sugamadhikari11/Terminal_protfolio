import ModeCube from "@/components/ModeCube";
import { contacts, experience, profile, projects } from "@/data/portfolio";

/**
 * Home is mostly a client 3D/terminal experience.
 * This server-rendered block gives crawlers real text about Sugam Adhikari (SA).
 */
function SeoContent() {
  return (
    <section className="sr-only" aria-label="About Sugam Adhikari">
      <h1>
        {profile.name} (SA) — {profile.title}
      </h1>
      <p>{profile.tagline}</p>
      <p>
        Based in {profile.location}. {profile.education}
      </p>
      <p>{profile.mission}</p>

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
        {projects.slice(0, 6).map((project) => (
          <li key={project.name}>
            <strong>{project.name}</strong> — {project.summary} Tech:{" "}
            {project.tech.join(", ")}.
            {project.link ? (
              <>
                {" "}
                <a href={project.link}>{project.name} on GitHub</a>
              </>
            ) : null}
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
      <SeoContent />
      <ModeCube />
    </>
  );
}
