"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";
import {
  contacts,
  experience,
  profile,
  projects,
  skillCategories,
  type Project,
} from "../../data/portfolio";
import { SiteFooter } from "@/components/site/SiteChrome";

/* ── Palette (mirrors SectionCopy ink tokens) ───────────────────────── */
const ink = {
  strong: "text-[#071525]",
  body: "text-[#0d2138]/90",
  soft: "text-[#16324f]/75",
  mute: "text-[#1a3a5c]/55",
  line: "border-[#0d2138]/20",
  chip: "border border-[#0d2138]/18 bg-white/55 text-[#0d2138]/85",
};

const easeOut = [0.22, 1, 0.36, 1] as const;

/* ── Motion helpers (mobile-only component) ─────────────────────────── */
function Reveal({
  children,
  className = "",
  delay = 0,
  y = 22,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  id?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      id={id}
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px -6% 0px", amount: 0.25 }}
      transition={{ duration: 0.65, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

function Stagger({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-6% 0px", amount: 0.2 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduce ? 0 : 0.07,
            delayChildren: reduce ? 0 : delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: easeOut },
  },
};

function FadeItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

/**
 * One full mobile screen per section.
 * Short content leaves empty sky below — next section never shares the row.
 */
function ScreenSection({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={[
        "box-border flex w-full snap-start flex-col",
        "min-h-[100dvh] px-5",
        "pt-[max(4.25rem,calc(env(safe-area-inset-top)+3.25rem))]",
        "pb-[max(1.5rem,env(safe-area-inset-bottom))]",
        className,
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-xl shrink-0">{children}</div>
      {/* Remaining viewport stays empty sky — next section starts on its own screen */}
    </section>
  );
}

/* ── Shared primitives ─────────────────────────────────────────────── */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className={`mb-2 font-mono text-[10px] uppercase tracking-[0.38em] ${ink.mute}`}>
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className={`font-mono text-2xl font-semibold leading-tight tracking-tight ${ink.strong}`}>
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className={`mt-3 text-[0.95rem] leading-relaxed ${ink.body}`}>{children}</p>
  );
}

function SoftButton({
  href,
  children,
  primary = false,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
}) {
  const cls = primary
    ? "inline-flex items-center px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] bg-[#071525] text-white"
    : `inline-flex items-center px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] border ${ink.line} ${ink.strong} bg-white/40`;

  const motionProps = {
    whileTap: { scale: 0.97 },
    whileHover: { y: -1 },
    transition: { type: "spring" as const, stiffness: 420, damping: 28 },
  };

  if (href) {
    return (
      <motion.a
        href={href}
        target={href.startsWith("http") || href.endsWith(".pdf") ? "_blank" : undefined}
        rel={href.startsWith("http") || href.endsWith(".pdf") ? "noopener noreferrer" : undefined}
        className={cls}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} className={cls} {...motionProps}>
      {children}
    </motion.button>
  );
}

/* ── Project Detail Modal ───────────────────────────────────────────── */
function ProjectModal({
  project,
  index,
  total,
  onClose,
}: {
  project: Project;
  index: number;
  total: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const content = (
    <AnimatePresence>
      <motion.div
        key="mob-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-[9999] flex items-end justify-center"
        style={{
          background: "rgba(7,21,37,0.62)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={onClose}
      >
        <motion.div
          key="mob-modal-panel"
          initial={{ y: 56, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 48, opacity: 0 }}
          transition={{ duration: 0.38, ease: easeOut }}
          className="relative w-full overflow-hidden rounded-t-2xl"
          style={{
            background: "rgba(196,223,242,0.97)",
            boxShadow: "0 -16px 60px rgba(7,21,37,0.24)",
            maxHeight: "88dvh",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center pb-1 pt-3">
            <div className="h-1 w-10 rounded-full bg-[#0d2138]/20" />
          </div>

          <div className={`flex items-start justify-between gap-3 border-b px-5 pb-4 pt-2 ${ink.line}`}>
            <div>
              <p className={`mb-0.5 font-mono text-[9px] uppercase tracking-[0.38em] ${ink.mute}`}>
                Project {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </p>
              <h2 className={`font-mono text-lg font-semibold leading-tight ${ink.strong}`}>
                {project.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={`mt-1 shrink-0 rounded-full border border-[#0d2138]/18 bg-white/50 p-1.5 ${ink.strong}`}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3 3l10 10M13 3L3 13"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="overflow-y-auto overscroll-contain px-5 pb-10 pt-4">
            <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${ink.mute}`}>
              {project.role} · {project.period}
            </p>
            <p className={`mt-3 text-[0.95rem] leading-relaxed ${ink.body}`}>
              {project.description}
            </p>

            {(project.highlights ?? []).length > 0 && (
              <div className="mt-5">
                <p className={`mb-2 font-mono text-[9px] uppercase tracking-[0.3em] ${ink.mute}`}>
                  Highlights
                </p>
                <ul className="space-y-1.5">
                  {(project.highlights ?? []).map((h) => (
                    <li
                      key={h}
                      className={`flex items-start gap-2 text-[0.88rem] leading-snug ${ink.soft}`}
                    >
                      <span className={`mt-0.5 shrink-0 font-mono leading-none ${ink.mute}`}>
                        →
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-5">
              <p className={`mb-2 font-mono text-[9px] uppercase tracking-[0.3em] ${ink.mute}`}>
                Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span key={t} className={`px-2 py-0.5 font-mono text-[10px] ${ink.chip}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <SoftButton href={`/projects/${project.slug}`} primary>
                Project page
              </SoftButton>
              {project.link ? (
                <SoftButton href={project.link}>Open repo ↗</SoftButton>
              ) : (
                <span
                  className={`inline-flex items-center border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] opacity-50 ${ink.line} ${ink.strong}`}
                >
                  Private project
                </span>
              )}
              <SoftButton onClick={onClose}>Close</SoftButton>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}

/* ── Project card ───────────────────────────────────────────────────── */
function ProjectCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 360, damping: 26 }}
        className={`rounded-xl border ${ink.line} bg-white/35 px-4 py-4 backdrop-blur-sm`}
      >
        <p className={`mb-1 font-mono text-[9px] uppercase tracking-[0.3em] ${ink.mute}`}>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h3 className={`font-mono text-[1rem] font-semibold leading-snug ${ink.strong}`}>
          {project.name}
        </h3>
        <p className={`mt-1.5 text-[0.85rem] leading-snug ${ink.soft}`}>{project.summary}</p>
        <p className={`mt-1 font-mono text-[9px] uppercase tracking-[0.16em] ${ink.mute}`}>
          {project.role} · {project.period}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1">
          {project.tech.map((t) => (
            <span key={t} className={`px-1.5 py-0.5 font-mono text-[9px] ${ink.chip}`}>
              {t}
            </span>
          ))}
        </div>
        <div className="mt-3.5 flex flex-wrap gap-2">
          <SoftButton primary onClick={() => setOpen(true)}>
            Learn more
          </SoftButton>
          <SoftButton href={`/projects/${project.slug}`}>Page</SoftButton>
          {project.link ? <SoftButton href={project.link}>Open repo</SoftButton> : null}
        </div>
      </motion.div>

      {open && (
        <ProjectModal
          project={project}
          index={index}
          total={total}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

/* ── Main mobile layout ─────────────────────────────────────────────── */
export default function MobileGuiPortfolio() {
  const reduce = useReducedMotion();

  return (
    <div
      className="fixed inset-0 z-[30] snap-y snap-mandatory overflow-y-auto overscroll-contain"
      style={{
        background: "linear-gradient(160deg, #c4dff2 0%, #d8eef8 40%, #b8d8ee 100%)",
      }}
    >
      {/* Soft drifting sky washes */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,255,255,0.55) 0%, transparent 100%)",
        }}
      />
      {!reduce ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none fixed -left-16 top-24 z-0 h-56 w-56 rounded-full bg-white/35 blur-3xl"
            animate={{ x: [0, 24, 0], y: [0, 12, 0], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none fixed -right-10 top-[42%] z-0 h-64 w-64 rounded-full bg-[#9ec9e8]/40 blur-3xl"
            animate={{ x: [0, -18, 0], y: [0, -14, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />
        </>
      ) : null}

      <div className="relative z-10">
        {/* ── Hero ── */}
        <ScreenSection>
          <Stagger delay={0.05}>
            <FadeItem>
              <Eyebrow>Portfolio · GUI mode</Eyebrow>
            </FadeItem>
            <FadeItem>
              <h1
                className={`font-mono text-3xl font-bold leading-tight tracking-tight ${ink.strong}`}
              >
                {profile.name}
              </h1>
            </FadeItem>
            <FadeItem>
              <p className={`mt-2 font-mono text-sm ${ink.soft}`}>{profile.title}</p>
            </FadeItem>
            <FadeItem>
              <Lead>{profile.tagline}</Lead>
            </FadeItem>
            <FadeItem>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <SoftButton href="#mob-projects" primary>
                  View projects
                </SoftButton>
                <SoftButton href="/resume.pdf">Resume</SoftButton>
                <SoftButton href="/about">About</SoftButton>
              </div>
            </FadeItem>
          </Stagger>
        </ScreenSection>

        {/* ── About ── */}
        <ScreenSection>
          <Reveal delay={0.02}>
            <Eyebrow>About</Eyebrow>
            <SectionTitle>{profile.mission}</SectionTitle>
            <Lead>{profile.education}</Lead>
          </Reveal>
        </ScreenSection>

        {/* ── Experience ── */}
        <ScreenSection>
          <Reveal>
            <Eyebrow>Experience</Eyebrow>
            <SectionTitle>Roles</SectionTitle>
            <Stagger className="mt-6 space-y-5" delay={0.06}>
              {experience.map((item) => (
                <FadeItem key={item.role + item.period}>
                  <li className={`list-none border-l-2 pl-4 ${ink.line}`}>
                    <div className={`font-mono text-[0.95rem] font-semibold ${ink.strong}`}>
                      {item.role}
                      {item.org && (
                        <span className={`font-normal ${ink.mute}`}> · {item.org}</span>
                      )}
                    </div>
                    <p className={`font-mono text-[9px] uppercase tracking-[0.2em] ${ink.mute}`}>
                      {item.period}
                    </p>
                    <p className={`mt-1 text-[0.85rem] leading-snug ${ink.soft}`}>
                      {item.detail}
                    </p>
                  </li>
                </FadeItem>
              ))}
            </Stagger>
          </Reveal>
        </ScreenSection>

        {/* ── Skills ── */}
        <ScreenSection>
          <Reveal>
            <Eyebrow>Skills</Eyebrow>
            <SectionTitle>Toolkit</SectionTitle>
            <Stagger className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4" delay={0.06}>
              {skillCategories.map((cat) => (
                <FadeItem key={cat.name}>
                  <h3
                    className={`mb-1.5 font-mono text-[9px] uppercase tracking-[0.28em] ${ink.mute}`}
                  >
                    {cat.name}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {cat.skills.map((s) => (
                      <motion.span
                        key={s}
                        className={`px-1.5 py-0.5 font-mono text-[9px] ${ink.chip}`}
                        whileHover={{ scale: 1.04 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </FadeItem>
              ))}
            </Stagger>
          </Reveal>
        </ScreenSection>

        {/* ── Projects (can grow taller than one screen) ── */}
        <ScreenSection id="mob-projects">
          <Reveal>
            <Eyebrow>Projects</Eyebrow>
            <SectionTitle>Selected Work</SectionTitle>
            <Stagger className="mt-5 space-y-3.5" delay={0.05}>
              {projects.map((project, i) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={i}
                  total={projects.length}
                />
              ))}
            </Stagger>
          </Reveal>
        </ScreenSection>

        {/* ── Contact ── */}
        <ScreenSection>
          <Reveal>
            <Eyebrow>Contact</Eyebrow>
            <SectionTitle>Let&apos;s build</SectionTitle>
            <Lead>Open to full-time roles, freelance, and ambitious collaborations.</Lead>
            <Stagger className="mt-6 space-y-4" delay={0.06}>
              {contacts.map((c) => (
                <FadeItem key={c.label}>
                  <p className={`font-mono text-[9px] uppercase tracking-[0.3em] ${ink.mute}`}>
                    {c.label}
                  </p>
                  <a
                    href={c.href}
                    className={`font-mono text-[0.95rem] font-medium underline decoration-dotted underline-offset-2 ${ink.strong}`}
                  >
                    {c.value}
                  </a>
                </FadeItem>
              ))}
            </Stagger>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <SoftButton href="/blog">Blog</SoftButton>
              <SoftButton href="/references">References</SoftButton>
            </div>
          </Reveal>
        </ScreenSection>

        {/* ── Footer ── */}
        <ScreenSection>
          <Reveal delay={0.04}>
            <SiteFooter />
          </Reveal>
        </ScreenSection>
      </div>
    </div>
  );
}
