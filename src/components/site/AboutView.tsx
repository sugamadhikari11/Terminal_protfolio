"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  contacts,
  experience,
  profile,
  skillCategories,
} from "@/data/portfolio";
import { guiInk as ink } from "@/components/site/guiInk";

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({
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
      initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px", amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease }}
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
      viewport={{ once: true, margin: "-8% 0px", amount: 0.15 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduce ? 0 : 0.08,
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
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease },
  },
};

export default function AboutView() {
  const reduce = useReducedMotion();

  return (
    <main className="mx-auto w-full px-[10%] pb-6 pt-10 md:pt-14">
      {/* Hero card */}
      <Reveal>
        <motion.section
          className={`relative overflow-hidden rounded-3xl border bg-white/45 px-6 py-8 shadow-[0_20px_60px_rgba(7,21,37,0.08)] backdrop-blur-md md:px-9 md:py-10 ${ink.line}`}
          whileHover={reduce ? undefined : { y: -2 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/70 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 left-10 h-36 w-52 rounded-full bg-[#9ec9e8]/35 blur-3xl"
          />

          <p className={`relative mb-3 font-mono text-[10px] uppercase tracking-[0.38em] ${ink.mute}`}>
            About
          </p>
          <h1
            className={`relative font-mono text-[2.15rem] font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl ${ink.strong}`}
          >
            {profile.name}
          </h1>
          <p className={`relative mt-3 font-mono text-sm tracking-wide sm:text-base ${ink.soft}`}>
            {profile.title}
          </p>
          <p className={`relative mt-5 max-w-xl text-[0.98rem] leading-relaxed sm:text-lg ${ink.body}`}>
            {profile.tagline}
          </p>

          <div className="relative mt-8 flex flex-wrap gap-2.5">
            <motion.div whileTap={{ scale: 0.97 }} whileHover={{ y: -1 }}>
              <Link href="/projects" className={`${ink.btnPrimary} rounded-xl`}>
                View projects
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }} whileHover={{ y: -1 }}>
              <Link href="/resume.pdf" className={`${ink.btnGhost} rounded-xl`}>
                Resume
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </Reveal>

      {/* Background */}
      <Reveal className="mt-8" delay={0.05}>
        <section
          className={`rounded-3xl border bg-white/40 px-6 py-7 shadow-[0_12px_40px_rgba(7,21,37,0.06)] backdrop-blur-md md:px-8 ${ink.line}`}
        >
          <p className={`mb-3 font-mono text-[10px] uppercase tracking-[0.32em] ${ink.mute}`}>
            Background
          </p>
          <h2 className={`font-mono text-xl font-semibold leading-snug tracking-tight sm:text-2xl ${ink.strong}`}>
            {profile.mission}
          </h2>
          <p className={`mt-4 leading-relaxed ${ink.body}`}>
            Based in <span className={ink.strong}>{profile.location}</span>. {profile.education}
          </p>
        </section>
      </Reveal>

      {/* Experience */}
      <Reveal className="mt-8" delay={0.04}>
        <section>
          <div className="mb-4 flex items-end justify-between gap-3 px-1">
            <div>
              <p className={`font-mono text-[10px] uppercase tracking-[0.32em] ${ink.mute}`}>
                Experience
              </p>
              <h2 className={`mt-1 font-mono text-2xl font-semibold tracking-tight ${ink.strong}`}>
                Roles
              </h2>
            </div>
            <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${ink.mute}`}>
              {experience.length} entries
            </span>
          </div>

          <Stagger className="space-y-3.5" delay={0.06}>
            {experience.map((item, i) => (
              <motion.article
                key={item.role + item.period}
                variants={itemVariants}
                whileHover={reduce ? undefined : { y: -3, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className={`rounded-2xl border bg-white/50 px-5 py-5 shadow-[0_10px_30px_rgba(7,21,37,0.05)] backdrop-blur-md ${ink.line}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#071525] font-mono text-[10px] text-white`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className={`font-mono text-[1.02rem] font-semibold ${ink.strong}`}>
                      {item.role}
                      {item.org ? (
                        <span className={`font-normal ${ink.mute}`}> · {item.org}</span>
                      ) : null}
                    </h3>
                  </div>
                  <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${ink.mute}`}>
                    {item.period}
                  </p>
                </div>
                <p className={`mt-3 pl-11 text-sm leading-relaxed ${ink.soft}`}>{item.detail}</p>
              </motion.article>
            ))}
          </Stagger>
        </section>
      </Reveal>

      {/* Skills */}
      <Reveal className="mt-10" delay={0.04}>
        <section>
          <div className="mb-4 px-1">
            <p className={`font-mono text-[10px] uppercase tracking-[0.32em] ${ink.mute}`}>
              Skills
            </p>
            <h2 className={`mt-1 font-mono text-2xl font-semibold tracking-tight ${ink.strong}`}>
              Toolkit
            </h2>
          </div>

          <Stagger className="grid gap-3.5 sm:grid-cols-2" delay={0.05}>
            {skillCategories.map((cat) => (
              <motion.div
                key={cat.name}
                variants={itemVariants}
                whileHover={reduce ? undefined : { y: -2 }}
                className={`rounded-2xl border bg-white/45 px-5 py-5 shadow-[0_10px_28px_rgba(7,21,37,0.05)] backdrop-blur-md ${ink.line}`}
              >
                <h3 className={`font-mono text-[10px] uppercase tracking-[0.28em] ${ink.mute}`}>
                  {cat.name}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <motion.li
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      className={`rounded-lg px-2.5 py-1 font-mono text-[11px] ${ink.chip}`}
                    >
                      {skill}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </Stagger>
        </section>
      </Reveal>

      {/* Contact */}
      <Reveal className="mt-10" delay={0.04}>
        <section
          className={`overflow-hidden rounded-3xl border bg-[#071525] px-6 py-8 text-white shadow-[0_18px_50px_rgba(7,21,37,0.18)] md:px-8 ${ink.line}`}
        >
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.32em] text-white/45">
            Contact
          </p>
          <h2 className="font-mono text-2xl font-semibold tracking-tight">Let&apos;s build</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
            Open to full-time roles, freelance work, and collaborations.
          </p>

          <Stagger className="mt-7 grid gap-3 sm:grid-cols-3" delay={0.06}>
            {contacts.map((c) => (
              <motion.a
                key={c.label}
                href={c.href}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:bg-white/10"
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/45">
                  {c.label}
                </p>
                <p className="mt-2 break-all font-mono text-sm text-white/95">{c.value}</p>
              </motion.a>
            ))}
          </Stagger>
        </section>
      </Reveal>
    </main>
  );
}
