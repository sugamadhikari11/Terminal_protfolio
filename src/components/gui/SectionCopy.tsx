"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { createPortal } from "react-dom";
import {
  contacts,
  experience,
  profile,
  projects,
  skillCategories,
  type Project,
} from "../../data/portfolio";
import { scrollStage } from "./scrollStage";
import { useIsMobile } from "@/hooks/use-mobile";

const FLOW_EASE = [0.22, 1, 0.36, 1] as const;

/** Parent: soft slide + fade; children cascade in for a natural read. */
const frameVariants: Variants = {
  initial: (side: "left" | "right") => ({
    opacity: 0,
    x: side === "left" ? -20 : 20,
    y: 10,
  }),
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.48,
      ease: FLOW_EASE,
      when: "beforeChildren",
      staggerChildren: 0.055,
      delayChildren: 0.03,
    },
  },
  exit: (side: "left" | "right") => ({
    opacity: 0,
    x: side === "left" ? -12 : 12,
    y: -6,
    transition: { duration: 0.32, ease: FLOW_EASE },
  }),
};

const lineVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: FLOW_EASE },
  },
};

function FlowLine({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={lineVariants} className={className}>
      {children}
    </motion.div>
  );
}

type SectionCopyProps = {
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

/**
 * One frame at a time. Work is split across project beats
 * so nothing stacks into a congested wall of text.
 */
const SECTIONS = [
  { id: "home", start: 0, end: 0.12 },
  { id: "about", start: 0.12, end: 0.24 },
  { id: "skills", start: 0.24, end: 0.34 },
  { id: "work", start: 0.34, end: 0.82 },
  { id: "contact", start: 0.82, end: 1.01 },
] as const;

/** Featured projects — one scroll beat each */
const FEATURED_PROJECTS = projects.slice(0, 5);

type SectionId = (typeof SECTIONS)[number]["id"];

/**
 * Side is locked for the life of a section/project beat (no mid-frame flip).
 * Alternates left/right so the plane’s empty half stays readable.
 */
const SECTION_SIDE: Record<SectionId, "left" | "right"> = {
  home: "left", // plane on right
  about: "left",
  skills: "right", // plane crosses left
  work: "left", // overridden per project below
  contact: "left", // plane settles right
};

function sideForSection(id: SectionId, projectIndex: number): "left" | "right" {
  if (id === "work") {
    // Projects alternate sides — even left, odd right
    return projectIndex % 2 === 0 ? "left" : "right";
  }
  return SECTION_SIDE[id];
}

function useScrollProgress(scrollRef: React.RefObject<HTMLDivElement | null>) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = Math.max(1, el.scrollHeight - el.clientHeight);
        setT(el.scrollTop / max);
      });
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, [scrollRef]);
  return t;
}

function activeSection(t: number): SectionId {
  for (let i = SECTIONS.length - 1; i >= 0; i--) {
    if (t >= SECTIONS[i].start) return SECTIONS[i].id;
  }
  return "home";
}

function projectIndexAt(t: number): number {
  const work = SECTIONS.find((s) => s.id === "work")!;
  const span = Math.max(1e-6, work.end - work.start);
  const u = Math.min(0.999, Math.max(0, (t - work.start) / span));
  return Math.min(FEATURED_PROJECTS.length - 1, Math.floor(u * FEATURED_PROJECTS.length));
}

/** Readable ink on sky — desktop navy; phones use pure black for contrast */
const ink = {
  strong: "text-[#071525] max-md:text-black",
  body: "text-[#0d2138]/90 max-md:text-black/95",
  soft: "text-[#16324f]/75 max-md:text-black/85",
  mute: "text-[#1a3a5c]/55 max-md:text-black/70",
  line: "border-[#0d2138]/20 max-md:border-black/25",
  chip: "border-[#0d2138]/18 bg-white/55 text-[#0d2138]/85 max-md:border-black/20 max-md:text-black/90",
  shadow: "[text-shadow:0_1px_12px_rgba(255,255,255,0.55)] max-md:[text-shadow:0_1px_10px_rgba(255,255,255,0.85)]",
};

function SectionFrame({
  textSide,
  children,
  enableInnerScroll = false,
}: {
  sectionId: string;
  textSide: "left" | "right";
  children: React.ReactNode;
  /** Phone: allow this panel to scroll when skills/projects are tall */
  enableInnerScroll?: boolean;
}) {
  return (
    <motion.div
      custom={textSide}
      variants={frameVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      data-gui-copy-scroll={enableInnerScroll ? "1" : undefined}
      className={[
        // Desktop/default: side column — full flight scroll unchanged
        "pointer-events-auto absolute inset-y-0 flex w-[min(100%,22rem)] flex-col justify-center overflow-visible px-7 md:w-[min(44%,30rem)] md:px-12 lg:w-[min(42%,32rem)] lg:px-14",
        textSide === "left"
          ? "left-0"
          : "right-0 items-end text-right",
        // Mobile-only: tall top band + soft sky wash so long copy stays readable over plane/mist
        "max-md:inset-x-0 max-md:inset-y-auto max-md:top-0 max-md:left-0 max-md:right-0 max-md:z-40 max-md:max-h-[calc(100dvh-5.25rem)] max-md:w-full max-md:items-start max-md:justify-start max-md:overflow-y-auto max-md:overscroll-contain max-md:px-4 max-md:pb-6 max-md:pt-[max(3.75rem,calc(env(safe-area-inset-top)+2.65rem))] max-md:text-left",
        "max-md:bg-gradient-to-b max-md:from-[rgba(196,223,242,0.94)] max-md:via-[rgba(196,223,242,0.72)] max-md:to-transparent",
        ink.shadow,
      ].join(" ")}
    >
      <div
        className={[
          "w-full max-md:max-w-xl",
          textSide === "right" ? "text-right max-md:text-left" : "",
        ].join(" ")}
      >
        {children}
      </div>
    </motion.div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className={`mb-3 font-mono text-[10px] uppercase tracking-[0.42em] max-md:mb-2 max-md:tracking-[0.32em] ${ink.mute}`}>
      {children}
    </p>
  );
}

function Display({
  as: Tag = "h2",
  children,
}: {
  as?: "h1" | "h2";
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={`font-mono text-[1.65rem] font-medium leading-[1.08] tracking-[-0.03em] max-md:text-[1.35rem] max-md:leading-[1.12] sm:text-[2.2rem] md:text-[2.75rem] lg:text-[3.1rem] ${ink.strong}`}
    >
      {children}
    </Tag>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className={`mt-3 max-w-md text-sm leading-relaxed max-md:mt-2 max-md:text-[0.9rem] max-md:leading-snug sm:mt-4 sm:text-base md:text-[1.05rem] ${ink.body}`}>
      {children}
    </p>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className={`mt-3 max-w-md text-[0.95rem] leading-relaxed max-md:mt-2 max-md:text-[0.88rem] max-md:leading-snug ${ink.soft}`}>{children}</p>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <p className={`mt-3 font-mono text-[10px] uppercase tracking-[0.22em] max-md:mt-1.5 max-md:tracking-[0.16em] ${ink.mute}`}>
      {children}
    </p>
  );
}

function Btn({
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
  const className = [
    "inline-flex min-h-10 items-center justify-center px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] transition sm:min-h-0 sm:px-5 sm:text-[11px] sm:tracking-[0.22em]",
    primary
      ? "bg-[#071525] text-white hover:bg-[#13273d]"
      : `border ${ink.line} ${ink.strong} bg-white/40 hover:bg-white/70`,
  ].join(" ");

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>
    );
  }

  const isMail = href?.startsWith("mailto:");
  return (
    <a
      href={href}
      target={isMail ? undefined : "_blank"}
      rel={isMail ? undefined : "noopener noreferrer"}
      className={className}
    >
      {children}
    </a>
  );
}

const projectVariants: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: FLOW_EASE,
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.26, ease: FLOW_EASE },
  },
};

/* ── Project Detail Modal ──────────────────────────────────────────── */
const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
};

const modalPanelVariants: Variants = {
  initial: { opacity: 0, y: 32, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1], when: "beforeChildren", staggerChildren: 0.055 },
  },
  exit: { opacity: 0, y: 20, scale: 0.97, transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] } },
};

const modalLineVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
};

function ProjectDetailModal({
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
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const allHighlights = project.highlights ?? [];

  const modalContent = (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        variants={modalBackdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center"
        style={{ background: "rgba(7,21,37,0.62)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          key="modal-panel"
          variants={modalPanelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-full max-w-2xl overflow-hidden rounded-t-2xl sm:rounded-2xl"
          style={{
            background: "rgba(196,223,242,0.97)",
            boxShadow: "0 32px 80px rgba(7,21,37,0.32), 0 2px 0 rgba(255,255,255,0.45) inset",
            maxHeight: "92dvh",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-[#0d2138]/14 px-6 pb-4 pt-5 sm:px-8 sm:pt-6">
            <motion.div variants={modalLineVariants}>
              <p className={`mb-1 font-mono text-[10px] uppercase tracking-[0.38em] ${ink.mute}`}>
                Project {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </p>
              <h2 className={`font-mono text-xl font-medium leading-tight tracking-tight sm:text-2xl ${ink.strong}`}>
                {project.name}
              </h2>
            </motion.div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className={`mt-1 shrink-0 rounded-full border border-[#0d2138]/18 bg-white/50 p-1.5 transition hover:bg-white/80 ${ink.strong}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto overscroll-contain px-6 pb-8 pt-5 sm:px-8 sm:pb-10">
            <motion.p variants={modalLineVariants} className={`font-mono text-[11px] uppercase tracking-[0.22em] ${ink.mute}`}>
              {project.role} · {project.period}
            </motion.p>

            <motion.p variants={modalLineVariants} className={`mt-4 text-[1.05rem] leading-relaxed sm:text-[1.1rem] ${ink.body}`}>
              {project.description}
            </motion.p>

            {allHighlights.length > 0 && (
              <motion.div variants={modalLineVariants} className="mt-6">
                <p className={`mb-3 font-mono text-[10px] uppercase tracking-[0.3em] ${ink.mute}`}>Highlights</p>
                <ul className="space-y-2">
                  {allHighlights.map((h) => (
                    <li key={h} className={`flex items-start gap-2.5 text-sm leading-relaxed sm:text-[0.95rem] ${ink.soft}`}>
                      <span className={`mt-0.5 shrink-0 font-mono text-base leading-none ${ink.mute}`}>→</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Tech chips */}
            <motion.div variants={modalLineVariants} className="mt-6">
              <p className={`mb-2.5 font-mono text-[10px] uppercase tracking-[0.3em] ${ink.mute}`}>Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className={`px-2.5 py-1 font-mono text-[11px] ${ink.chip}`}>{t}</span>
                ))}
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div variants={modalLineVariants} className="mt-8 flex flex-wrap gap-3">
              {project.link ? (
                <Btn href={project.link} primary>Open repo ↗</Btn>
              ) : (
                <span className={`inline-flex items-center px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] opacity-50 border border-[#0d2138]/20 ${ink.strong}`}>
                  Private project
                </span>
              )}
              <Btn onClick={onClose}>Close</Btn>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}

/** Project body only — parent SectionFrame stays mounted so reverse-scroll isn't blocked. */
function ProjectBody({
  project,
  index,
  total,
  textSide,
}: {
  project: Project;
  index: number;
  total: number;
  textSide: "left" | "right";
}) {
  const [showModal, setShowModal] = useState(false);
  const highlights = project.highlights?.slice(0, 1) ?? [];
  return (
    <>
      <motion.div variants={projectVariants} initial="initial" animate="animate" exit="exit">
        <FlowLine>
          <Eyebrow>
            Project {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </Eyebrow>
        </FlowLine>

        <FlowLine>
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-mono text-[1.45rem] font-medium leading-[1.1] tracking-[-0.02em] underline-offset-4 transition hover:underline max-md:text-[1.28rem] sm:text-[1.85rem] md:text-[2.35rem] ${ink.strong}`}
            >
              {project.name}
            </a>
          ) : (
            <Display>{project.name}</Display>
          )}
        </FlowLine>

        <FlowLine>
          <Lead>{project.summary}</Lead>
        </FlowLine>
        <FlowLine>
          <Meta>
            {project.role} · {project.period}
          </Meta>
        </FlowLine>

        {highlights.length ? (
          <FlowLine>
            <ul className={["mt-4 max-w-md space-y-2 text-[0.9rem] leading-snug max-md:mt-2.5 max-md:space-y-1.5 max-md:text-[0.85rem]", ink.soft].join(" ")}>
              {highlights.map((h) => (
                <li key={h}>
                  <span className={ink.mute}>— </span>
                  {h}
                </li>
              ))}
            </ul>
          </FlowLine>
        ) : null}

        <FlowLine>
          <p className={`mt-5 font-mono text-[10px] uppercase tracking-[0.18em] max-md:mt-3 max-md:text-[9px] max-md:normal-case max-md:tracking-[0.04em] ${ink.mute}`}>
            {project.tech.join(" · ")}
          </p>
        </FlowLine>

        <FlowLine>
          <div
            className={[
              "mt-6 flex flex-wrap gap-2 sm:gap-3 max-md:mt-4",
              textSide === "right" ? "sm:justify-end" : "",
            ].join(" ")}
          >
            {/* Learn More — always visible */}
            <Btn primary onClick={() => setShowModal(true)}>Learn more</Btn>
            <Btn href={`/projects/${project.slug}`}>Project page</Btn>
            {project.link ? (
              <Btn href={project.link}>Open repo</Btn>
            ) : null}
          </div>
        </FlowLine>
      </motion.div>

      {showModal && (
        <ProjectDetailModal
          project={project}
          index={index}
          total={total}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

function ScrollFlightRing({
  progress,
  compact = false,
}: {
  progress: number;
  compact?: boolean;
}) {
  const p = Math.min(1, Math.max(0, progress));
  const covered = Math.round(p * 100);
  const left = 100 - covered;
  const size = compact ? 42 : 52;
  const stroke = compact ? 2.5 : 3;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * p;

  return (
    <div
      className={`pointer-events-none flex items-center ${compact ? "gap-2" : "gap-3"}`}
      role="progressbar"
      aria-valuenow={covered}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Flight progress ${covered}% covered, ${left}% left`}
    >
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(7, 21, 37, 0.14)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(7, 21, 37, 0.82)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c - dash}`}
            style={{ transition: "stroke-dasharray 120ms linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span
            className={`font-mono font-semibold tabular-nums ${compact ? "text-[10px]" : "text-[11px]"} ${ink.strong}`}
          >
            {covered}%
          </span>
        </div>
      </div>
      <div
        className={`font-mono uppercase ${ink.mute} ${ink.shadow} ${
          compact
            ? "text-[8px] tracking-[0.18em]"
            : "text-[10px] tracking-[0.28em]"
        }`}
      >
        <div>Scroll to fly</div>
        <div className={`mt-1 ${compact ? "tracking-[0.12em]" : "tracking-[0.18em]"} ${ink.soft}`}>
          <span className={ink.strong}>{covered}%</span> covered
          <span className="mx-1.5 opacity-40">·</span>
          <span>{left}% left</span>
        </div>
      </div>
    </div>
  );
}

export default function SectionCopy({ scrollRef }: SectionCopyProps) {
  const t = useScrollProgress(scrollRef);
  const isMobile = useIsMobile();
  const current = activeSection(t);
  const stage = useMemo(() => scrollStage(t), [t]);
  const pIndex = useMemo(() => projectIndexAt(t), [t]);
  const activeProject = FEATURED_PROJECTS[pIndex];
  // Phone: keep copy full-width top — avoid right-side clip under the plane
  const textSide = isMobile ? "left" : sideForSection(current, pIndex);
  const driftX = isMobile ? 0 : stage.uiX * 0.35;
  const driftY = isMobile ? stage.uiY * 0.15 : stage.uiY * 0.35;

  const scrollTo = (progress: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const max = Math.max(1, el.scrollHeight - el.clientHeight);
    el.scrollTo({ top: max * progress, behavior: "smooth" });
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden max-md:z-[35] max-md:overflow-visible">
      <div
        className="absolute inset-0 max-md:overflow-visible"
        style={{
          transform: `translate3d(${driftX}px, ${driftY}px, 0)`,
        }}
      >
        {/* sync = crossfade (no wait lag); no blur filters */}
        <AnimatePresence mode="sync" initial={false}>
          {current === "home" && (
            <SectionFrame
              key="home"
              sectionId="home"
              textSide={textSide}
              enableInnerScroll={isMobile}
            >
              <FlowLine>
                <Eyebrow>Portfolio</Eyebrow>
              </FlowLine>
              <FlowLine>
                <Display as="h1">{profile.name}</Display>
              </FlowLine>
              <FlowLine>
                <Lead>{profile.tagline}</Lead>
              </FlowLine>
              <FlowLine>
                <Meta>
                  {profile.title} · {profile.location}
                </Meta>
              </FlowLine>
              <FlowLine>
                <div
                  className={[
                    "mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3",
                    textSide === "right" ? "sm:justify-end" : "",
                  ].join(" ")}
                >
                  <Btn primary onClick={() => scrollTo(0.16)}>
                    Explore
                  </Btn>
                  <Btn href="/about">About</Btn>
                  <Btn href="/projects">Projects</Btn>
                  <Btn href="/resume.pdf">Resume</Btn>
                </div>
              </FlowLine>
            </SectionFrame>
          )}

          {current === "about" && (
            <SectionFrame
              key="about"
              sectionId="about"
              textSide={textSide}
              enableInnerScroll={isMobile}
            >
              <FlowLine>
                <Eyebrow>About</Eyebrow>
              </FlowLine>
              <FlowLine>
                <Display>{profile.mission}</Display>
              </FlowLine>
              <FlowLine>
                <Body>{profile.education}</Body>
              </FlowLine>
              <FlowLine>
                <ul className="mt-8 max-w-md space-y-5 max-md:mt-4 max-md:space-y-3.5">
                  {experience.slice(0, 3).map((item) => (
                    <li
                      key={item.role + item.period}
                      className={[
                        `${ink.line} pl-4`,
                        textSide === "right"
                          ? "border-r pr-4 pl-0 text-right"
                          : "border-l",
                      ].join(" ")}
                    >
                      <div className={`font-mono text-[1.02rem] font-medium tracking-tight max-md:text-[0.95rem] ${ink.strong}`}>
                        {item.role}
                        {item.org ? (
                          <span className={`font-normal ${ink.mute}`}> · {item.org}</span>
                        ) : null}
                      </div>
                      <Meta>{item.period}</Meta>
                      <p className={`mt-1 text-sm leading-relaxed max-md:text-[0.85rem] max-md:leading-snug ${ink.soft}`}>{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </FlowLine>
              <FlowLine>
                <div className="mt-5 flex flex-wrap gap-2 max-md:mt-3">
                  <Btn href="/about">Full about page</Btn>
                  <Btn href="/blog">Blog</Btn>
                </div>
              </FlowLine>
            </SectionFrame>
          )}

          {current === "skills" && (
            <SectionFrame
              key="skills"
              sectionId="skills"
              textSide={textSide}
              enableInnerScroll={isMobile}
            >
              <FlowLine>
                <Eyebrow>Skills</Eyebrow>
              </FlowLine>
              <FlowLine>
                <Display>Toolkit</Display>
              </FlowLine>
              <FlowLine>
                <Lead>Full-stack, Web3, and data — shipped in production.</Lead>
              </FlowLine>
              <FlowLine>
                <div
                  className={[
                    "mt-5 grid max-w-md grid-cols-1 gap-3.5 max-md:mt-3 max-md:grid-cols-2 max-md:gap-x-3 max-md:gap-y-2.5 sm:mt-7 sm:grid-cols-2 sm:gap-5",
                    textSide === "right" ? "ml-auto" : "",
                  ].join(" ")}
                >
                  {skillCategories.map((cat) => (
                    <div key={cat.name}>
                      <h3
                        className={`font-mono text-[10px] uppercase tracking-[0.28em] max-md:tracking-[0.2em] ${ink.mute}`}
                      >
                        {cat.name}
                      </h3>
                      <ul
                        className={[
                          "mt-2 flex flex-wrap gap-1.5 max-md:mt-1 max-md:gap-1",
                          textSide === "right" ? "justify-end" : "",
                        ].join(" ")}
                      >
                        {cat.skills.map((s) => (
                          <li
                            key={s}
                            className={`px-2 py-0.5 font-mono text-[11px] max-md:px-1.5 max-md:text-[9px] ${ink.chip}`}
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </FlowLine>
            </SectionFrame>
          )}

          {current === "work" && activeProject ? (
            <SectionFrame
              key={`work-${pIndex}`}
              sectionId="work"
              textSide={textSide}
              enableInnerScroll={isMobile}
            >
              <ProjectBody
                project={activeProject}
                index={pIndex}
                total={FEATURED_PROJECTS.length}
                textSide={textSide}
              />
            </SectionFrame>
          ) : null}

          {current === "contact" && (
            <SectionFrame
              key="contact"
              sectionId="contact"
              textSide={textSide}
              enableInnerScroll={isMobile}
            >
              <FlowLine>
                <Eyebrow>Contact</Eyebrow>
              </FlowLine>
              <FlowLine>
                <Display>Let&apos;s build</Display>
              </FlowLine>
              <FlowLine>
                <Lead>
                  Open to full-time roles, freelance, and ambitious cloud experiments.
                </Lead>
              </FlowLine>
              <FlowLine>
                <div
                  className={[
                    "mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3",
                    textSide === "right" ? "sm:justify-end" : "",
                  ].join(" ")}
                >
                  <Btn href={contacts[0]?.href ?? "mailto:"} primary>
                    Email me
                  </Btn>
                  <Btn href="/resume.pdf">Resume</Btn>
                  <Btn href="/blog">Blog</Btn>
                  <Btn href="/references">References</Btn>
                  <Btn href={contacts[1]?.href ?? "#"}>GitHub</Btn>
                  <Btn href={contacts[2]?.href ?? "#"}>LinkedIn</Btn>
                </div>
              </FlowLine>
            </SectionFrame>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed HUD — never follows section side flips */}
      <div
        className={[
          "pointer-events-none absolute z-40 max-w-[calc(100%-5.5rem)] [transform:translateZ(0)]",
          "bottom-7 left-7 max-md:bottom-[max(0.85rem,calc(env(safe-area-inset-bottom)+0.35rem))] max-md:left-[max(0.75rem,env(safe-area-inset-left))]",
          "md:bottom-8 md:left-14",
        ].join(" ")}
      >
        <ScrollFlightRing progress={t} compact={isMobile} />
        {current === "work" && activeProject ? (
          <p
            className={`mt-1.5 truncate font-mono text-[9px] uppercase tracking-[0.2em] sm:mt-2 sm:text-[10px] sm:tracking-[0.24em] ${ink.mute} ${ink.shadow}`}
          >
            {String(pIndex + 1).padStart(2, "0")} · {activeProject.name}
          </p>
        ) : null}
      </div>

      {/* Bottom-right micro-footer — model credit + copyright (desktop only) */}
      <div
        className={[
          "pointer-events-auto absolute z-40 max-md:hidden [transform:translateZ(0)]",
          "bottom-7 right-7 md:bottom-8 md:right-10",
          "flex flex-col items-end gap-0.5",
        ].join(" ")}
      >
        <p className={`font-mono text-[9px] tracking-[0.18em] ${ink.mute} ${ink.shadow}`}>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className={`font-mono text-[8px] tracking-[0.1em] ${ink.mute} ${ink.shadow} opacity-75`}>
          3D model:{" "}
          <a
            href="https://sketchfab.com/3d-models/stylized-ww1-plane-c4edeb0e410f46e8a4db320879f0a1db"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted underline-offset-2 transition-opacity hover:opacity-100"
          >
            Stylized WW1 Plane
          </a>
          {" "}via Sketchfab
        </p>
      </div>
    </div>
  );
}
