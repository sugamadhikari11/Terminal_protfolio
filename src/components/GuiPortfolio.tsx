import React from "react";
import {
  contacts,
  experience,
  profile,
  projects,
  skillCategories,
} from "../data/portfolio";

type GuiPortfolioProps = {
  /** Skip rise-in so cube → site expand looks continuous */
  instant?: boolean;
};

const GuiPortfolio: React.FC<GuiPortfolioProps> = ({ instant = false }) => {
  const rise = instant ? "" : "gui-reveal";
  const d1 = instant ? "" : "gui-reveal-delay-1";
  const d2 = instant ? "" : "gui-reveal-delay-2";
  const d3 = instant ? "" : "gui-reveal-delay-3";
  const d4 = instant ? "" : "gui-reveal-delay-4";

  return (
    <div className="gui-portfolio relative min-h-dvh w-full overflow-x-hidden text-zinc-100 [background:var(--gui-bg)]">
      <div className="gui-atmosphere pointer-events-none" aria-hidden />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6 md:px-10">
        <a href="#top" className="font-mono text-sm tracking-[0.2em] text-emerald-400">
          SUGAM
        </a>
        <nav className="hidden gap-6 font-mono text-xs uppercase tracking-widest text-zinc-400 sm:flex">
          <a href="#about" className="transition-colors hover:text-emerald-400">
            About
          </a>
          <a href="#skills" className="transition-colors hover:text-emerald-400">
            Skills
          </a>
          <a href="#projects" className="transition-colors hover:text-emerald-400">
            Projects
          </a>
          <a href="#contact" className="transition-colors hover:text-emerald-400">
            Contact
          </a>
        </nav>
      </header>

      <main id="top" className="relative z-10">
        <section className="gui-hero mx-auto flex min-h-[calc(100dvh-5rem)] max-w-5xl flex-col justify-center px-6 py-16 md:px-10">
          <p
            className={`${rise} font-mono text-xs uppercase tracking-[0.35em] text-emerald-500/80`}
          >
            Portfolio · GUI mode
          </p>
          <h1
            className={`${rise} ${d1} mt-4 font-mono text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl`}
          >
            {profile.name}
          </h1>
          <p
            className={`${rise} ${d2} mt-4 max-w-xl font-mono text-base text-emerald-400/90 sm:text-lg`}
          >
            {profile.title}
          </p>
          <p
            className={`${rise} ${d3} mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg`}
          >
            {profile.tagline}
          </p>
          <div className={`${rise} ${d4} mt-10 flex flex-wrap gap-4`}>
            <a
              href="#projects"
              className="border border-emerald-500/60 bg-emerald-500/10 px-5 py-2.5 font-mono text-sm text-emerald-300 transition hover:bg-emerald-500/20"
            >
              View projects
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-zinc-600 px-5 py-2.5 font-mono text-sm text-zinc-300 transition hover:border-zinc-400 hover:text-white"
            >
              Resume
            </a>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-5xl border-t border-emerald-900/40 px-6 py-20 md:px-10">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-500">About</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-300">
            Based in {profile.location}. {profile.education}
          </p>
          <p className="mt-4 max-w-3xl text-zinc-400">{profile.mission}</p>
          <ul className="mt-10 space-y-6">
            {experience.map((item) => (
              <li key={item.role + item.period} className="border-l border-emerald-500/40 pl-5">
                <div className="font-mono text-sm text-white">
                  {item.role}
                  {item.org ? (
                    <span className="text-zinc-500"> · {item.org}</span>
                  ) : null}
                </div>
                <div className="mt-1 font-mono text-xs text-emerald-500/80">{item.period}</div>
                <p className="mt-2 text-sm text-zinc-400">{item.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="skills" className="mx-auto max-w-5xl border-t border-emerald-900/40 px-6 py-20 md:px-10">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-500">Skills</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((cat) => (
              <div key={cat.name}>
                <h3 className="font-mono text-sm text-white">{cat.name}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <li
                      key={skill}
                      className="border border-emerald-900/60 bg-emerald-950/40 px-2.5 py-1 font-mono text-xs text-emerald-300/90"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-5xl border-t border-emerald-900/40 px-6 py-20 md:px-10">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-500">Projects</h2>
          <div className="mt-10 space-y-8">
            {projects.map((project) => (
              <article
                key={project.name}
                className="group border-b border-zinc-800/80 pb-8 last:border-0"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-lg text-white transition group-hover:text-emerald-400"
                    >
                      {project.name} ↗
                    </a>
                  ) : (
                    <h3 className="font-mono text-lg text-white">{project.name}</h3>
                  )}
                  <span className="font-mono text-xs text-zinc-500">{project.period}</span>
                </div>
                <p className="mt-1 font-mono text-xs text-emerald-500/70">{project.role}</p>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
                  {project.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <li key={t} className="font-mono text-xs text-zinc-500">
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-5xl border-t border-emerald-900/40 px-6 py-20 md:px-10">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-500">Contact</h2>
          <p className="mt-4 max-w-xl text-zinc-400">
            Open to full-time roles, freelance work, and collaborations. Usually replies within 24
            hours.
          </p>
          <ul className="mt-8 space-y-4">
            {contacts.map((c) => (
              <li key={c.label}>
                <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                  {c.label}
                </span>
                <div>
                  <a
                    href={c.href}
                    target={c.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="font-mono text-emerald-400 transition hover:text-emerald-300"
                  >
                    {c.value}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <footer className="border-t border-emerald-900/40 px-6 py-10 text-center font-mono text-xs text-zinc-600 md:px-10">
          <p>© {new Date().getFullYear()} {profile.name} · Flip back to terminal anytime</p>
          <p className="mt-2 text-zinc-700/50">
            3D model:{" "}
            <a
              href="https://sketchfab.com/3d-models/stylized-ww1-plane-c4edeb0e410f46e8a4db320879f0a1db"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-zinc-500 transition-colors"
            >
              Stylized WW1 Plane
            </a>
            {" "}via Sketchfab
          </p>
        </footer>
      </main>
    </div>
  );
};

export default GuiPortfolio;
